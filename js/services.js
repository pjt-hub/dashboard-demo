// 数据计算服务层 - AI分析模块数据处理

const DataService = {
    // ========== 能力分布计算 ==========

    /**
     * 计算能力维度分布
     * @param {Array} readingRecords - 阅读记录
     * @param {Array} books - 绘本库
     * @param {Array} studentIds - 学生ID列表（可选，用于筛选特定学生）
     * @returns {Array} 能力维度分布数组
     */
    calculateAbilityDistribution(readingRecords, books, studentIds = null) {
        const abilityScores = {};
        let totalDuration = 0;

        // 筛选阅读记录
        const filteredRecords = studentIds
            ? readingRecords.filter(r => studentIds.includes(r.studentId))
            : readingRecords;

        filteredRecords.forEach(record => {
            const book = books.find(b => b.id === record.bookId);
            if (book && book.abilityTags) {
                book.abilityTags.forEach(tag => {
                    if (!abilityScores[tag]) {
                        abilityScores[tag] = { duration: 0, count: 0 };
                    }
                    abilityScores[tag].duration += record.duration;
                    abilityScores[tag].count++;
                });
                totalDuration += record.duration;
            }
        });

        // 转换为百分比格式
        return Object.keys(abilityScores).map(name => ({
            name,
            duration: abilityScores[name].duration,
            count: abilityScores[name].count,
            percentage: totalDuration > 0
                ? Math.round(abilityScores[name].duration / totalDuration * 100)
                : 0
        })).sort((a, b) => b.percentage - a.percentage);
    },

    // ========== 学生分层计算 ==========

    /**
     * 基于活跃度对学生分层
     * @param {Array} students - 学生列表
     * @param {Array} readingRecords - 阅读记录
     * @returns {Object} 分层结果
     */
    calculateStudentSegments(students, readingRecords) {
        // 统计每个学生的活动次数
        const studentActivityCounts = {};
        readingRecords.forEach(r => {
            if (!studentActivityCounts[r.studentId]) {
                studentActivityCounts[r.studentId] = { count: 0, totalDuration: 0 };
            }
            studentActivityCounts[r.studentId].count++;
            studentActivityCounts[r.studentId].totalDuration += r.duration;
        });

        // 计算统计数据
        const counts = Object.values(studentActivityCounts).map(s => s.count);
        const mean = counts.length > 0 ? counts.reduce((a, b) => a + b) / counts.length : 0;
        const variance = counts.length > 0
            ? counts.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / counts.length
            : 0;
        const stdDev = Math.sqrt(variance);

        // 分层
        const segments = { high: [], medium: [], low: [] };
        students.forEach(student => {
            const data = studentActivityCounts[student.id] || { count: 0, totalDuration: 0 };

            const studentData = {
                ...student,
                activityCount: data.count,
                totalDuration: data.totalDuration,
                segment: 'medium'
            };

            if (data.count > mean + stdDev) {
                studentData.segment = 'high';
                segments.high.push(studentData);
            } else if (data.count < mean - stdDev) {
                studentData.segment = 'low';
                segments.low.push(studentData);
            } else {
                segments.medium.push(studentData);
            }
        });

        const total = students.length || 1;
        return {
            high: { count: segments.high.length, percent: Math.round(segments.high.length / total * 100), students: segments.high },
            medium: { count: segments.medium.length, percent: Math.round(segments.medium.length / total * 100), students: segments.medium },
            low: { count: segments.low.length, percent: Math.round(segments.low.length / total * 100), students: segments.low }
        };
    },

    /**
     * 计算趋势
     * @param {Array} values - 数值数组
     * @returns {string} up/stable/down
     */
    calculateTrend(values) {
        if (!values || values.length < 2) return 'stable';
        const recent = values.slice(-3);
        const earlier = values.slice(0, -3);
        if (earlier.length === 0) return 'stable';

        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;

        if (recentAvg > earlierAvg * 1.1) return 'up';
        if (recentAvg < earlierAvg * 0.9) return 'down';
        return 'stable';
    },

    // ========== 绘本类型分布计算 ==========

    /**
     * 计算绘本类型分布
     * @param {Array} readingRecords - 阅读记录
     * @param {Array} books - 绘本库
     * @param {Array} studentIds - 学生ID列表（可选）
     * @returns {Array} 类型分布数组
     */
    calculateTypeDistribution(readingRecords, books, studentIds = null) {
        const typeScores = {};
        let totalDuration = 0;

        const filteredRecords = studentIds
            ? readingRecords.filter(r => studentIds.includes(r.studentId))
            : readingRecords;

        filteredRecords.forEach(record => {
            const book = books.find(b => b.id === record.bookId);
            if (book) {
                if (!typeScores[book.type]) {
                    typeScores[book.type] = { duration: 0, count: 0 };
                }
                typeScores[book.type].duration += record.duration;
                typeScores[book.type].count++;
                totalDuration += record.duration;
            }
        });

        return Object.keys(typeScores).map(type => ({
            type,
            duration: typeScores[type].duration,
            count: typeScores[type].count,
            percentage: totalDuration > 0
                ? Math.round(typeScores[type].duration / totalDuration * 100)
                : 0
        })).sort((a, b) => b.percentage - a.percentage);
    },

    // ========== 为AI服务准备数据 ==========

    /**
     * 准备园所分析数据（给大模型）
     * @param {Object} schoolData - 园所数据
     * @param {Array} classes - 班级数据
     * @param {Array} students - 学生数据
     * @param {Array} readingRecords - 阅读记录
     * @param {Array} books - 绘本库
     * @returns {Object} 结构化输入数据
     */
    prepareSchoolAnalysisData(schoolData, classes, students, readingRecords, books) {
        // 计算能力分布
        const abilityDistribution = this.calculateAbilityDistribution(readingRecords, books);

        // 计算类型分布
        const typeDistribution = this.calculateTypeDistribution(readingRecords, books);

        // 计算班级对比
        const classComparison = classes.map(cls => {
            const classStudentIds = students.filter(s => s.classId === cls.id).map(s => s.id);
            const classRecords = readingRecords.filter(r => classStudentIds.includes(r.studentId));
            const totalDuration = classRecords.reduce((sum, r) => sum + r.duration, 0);
            const avgDuration = classRecords.length > 0 ? totalDuration / classStudentIds.length : 0;
            const participationRate = classStudentIds.length > 0
                ? Math.round(new Set(classRecords.map(r => r.studentId)).size / classStudentIds.length * 100)
                : 0;

            return {
                className: cls.name,
                activityCount: classRecords.length,
                avgDuration: Math.round(avgDuration),
                participationRate
            };
        });

        // 时段分布（模拟数据，实际应从活动时间计算）
        const timeDistribution = {
            morning: { count: Math.round(readingRecords.length * 0.55), avgEngagement: 88 },
            afternoon: { count: Math.round(readingRecords.length * 0.45), avgEngagement: 82 }
        };

        return {
            summary: {
                totalActivities: readingRecords.length,
                totalStudents: students.length,
                participatingStudents: new Set(readingRecords.map(r => r.studentId)).size,
                totalDuration: Math.round(readingRecords.reduce((sum, r) => sum + r.duration, 0) / 60 * 10) / 10,
                avgDurationPerStudent: Math.round(readingRecords.reduce((sum, r) => sum + r.duration, 0) / students.length)
            },
            abilityDistribution,
            typeDistribution,
            classComparison,
            timeDistribution,
            weekOverWeek: {
                activityChange: 12.5,
                durationChange: 8.3,
                participationChange: 5.2
            }
        };
    },

    /**
     * 准备学生分析数据（给大模型）
     * @param {Object} student - 学生信息
     * @param {Array} readingRecords - 阅读记录
     * @param {Array} books - 绘本库
     * @param {Object} classStats - 班级统计数据（用于对比）
     * @returns {Object} 结构化输入数据
     */
    prepareStudentAnalysisData(student, readingRecords, books, classStats = null) {
        const studentRecords = readingRecords.filter(r => r.studentId === student.id);

        // 能力覆盖
        const abilityCoverage = this.calculateAbilityDistribution(studentRecords, books);

        // 偏好类型
        const preferenceType = this.calculateTypeDistribution(studentRecords, books);

        // 最近阅读
        const recentBooks = studentRecords
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(r => {
                const book = books.find(b => b.id === r.bookId);
                return {
                    name: book ? book.name : '未知',
                    type: book ? book.type : '未知',
                    duration: r.duration,
                    date: r.date
                };
            });

        // 统计数据
        const totalDuration = studentRecords.reduce((sum, r) => sum + r.duration, 0);

        return {
            student: {
                name: student.name,
                age: student.age || 5,
                className: student.className
            },
            readingSummary: {
                totalBooks: new Set(studentRecords.map(r => r.bookId)).size,
                totalDuration: Math.round(totalDuration / 60 * 10) / 10,
                avgDurationPerBook: studentRecords.length > 0 ? Math.round(totalDuration / studentRecords.length) : 0,
                activityCount: studentRecords.length
            },
            abilityCoverage,
            preferenceType,
            recentBooks,
            comparedToClass: classStats || {
                activityLevel: 100,
                durationLevel: 100,
                rank: 1
            }
        };
    },

    // ========== 趋势计算 ==========

    /**
     * 计算周趋势数据
     * @param {Array} readingRecords - 阅读记录
     * @param {number} weeks - 周数
     * @returns {Array} 周趋势数据
     */
    calculateWeeklyTrend(readingRecords, weeks = 4) {
        const weeklyData = [];
        const now = new Date();

        for (let i = weeks - 1; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - (i + 1) * 7);
            const weekEnd = new Date(now);
            weekEnd.setDate(now.getDate() - i * 7);

            const weekRecords = readingRecords.filter(r => {
                const date = new Date(r.date);
                return date >= weekStart && date < weekEnd;
            });

            weeklyData.push({
                week: `第${weeks - i}周`,
                count: weekRecords.length,
                duration: weekRecords.reduce((sum, r) => sum + r.duration, 0)
            });
        }

        return weeklyData;
    }
};