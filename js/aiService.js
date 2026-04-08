// AI服务层 - 大模型调用与降级方案

const AiService = {
    // API配置
    config: {
        apiKey: '',  // 从配置读取，可由用户设置
        apiEndpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-sonnet-4-6',
        enabled: false  // 默认使用降级方案
    },

    // ========== Prompt模板 ==========

    /**
     * 构建园所分析Prompt
     */
    buildSchoolPrompt(data) {
        return `你是一位资深的幼儿园教育专家，专门负责分析绘本阅读数据并给出专业建议。

## 分析背景
你是【阳光幼儿园】的教育顾问，需要分析本周的绘本阅读活动数据。

## 本周数据概况
- 活动总数：${data.summary.totalActivities}次
- 参与幼儿：${data.summary.participatingStudents}/${data.summary.totalStudents}人（${Math.round(data.summary.participatingStudents / data.summary.totalStudents * 100)}%）
- 总阅读时长：${data.summary.totalDuration}小时
- 人均阅读时长：${data.summary.avgDurationPerStudent}分钟

## 能力维度分布
| 能力维度 | 阅读时长(分钟) | 占比 |
|----------|---------------|------|
${data.abilityDistribution.map(a => `| ${a.name} | ${a.duration} | ${a.percentage}% |`).join('\n')}

## 绘本类型分布
| 类型 | 阅读次数 | 占比 |
|------|---------|------|
${data.typeDistribution.map(t => `| ${t.type} | ${t.count} | ${t.percentage}% |`).join('\n')}

## 班级活动对比
| 班级 | 活动次数 | 人均时长(分钟) | 参与率 |
|------|---------|---------------|--------|
${data.classComparison.map(c => `| ${c.className} | ${c.activityCount} | ${c.avgDuration} | ${c.participationRate}% |`).join('\n')}

## 环比变化
- 活动次数：${data.weekOverWeek.activityChange > 0 ? '+' : ''}${data.weekOverWeek.activityChange}%
- 阅读时长：${data.weekOverWeek.durationChange > 0 ? '+' : ''}${data.weekOverWeek.durationChange}%

## 请完成以下分析任务：

### 1. 整体评价（2-3句话）
基于以上数据，评价本周园所绘本阅读活动的整体情况。

### 2. 发现的问题（列出2-3个）
识别数据中存在的问题或异常，每个问题说明：
- 问题是什么
- 数据依据
- 可能的影响

### 3. 改进建议（列出2-3条）
针对发现的问题，给出具体可行的建议：
- 建议内容
- 实施步骤
- 预期效果

请用专业但易懂的语言回答，适合园长阅读。`;
    },

    /**
     * 构建学生分析Prompt
     */
    buildStudentPrompt(data) {
        return `你是一位资深的幼儿教育专家，擅长分析幼儿的阅读行为并制定个性化培养方案。

## 学生基本信息
姓名：${data.student.name}
年龄：${data.student.age}岁
班级：${data.student.className}

## 阅读概况
- 阅读绘本：${data.readingSummary.totalBooks}本
- 总时长：${data.readingSummary.totalDuration}小时
- 参与活动：${data.readingSummary.activityCount}次
- 平均投入度：${data.readingSummary.avgEngagement}%

## 能力维度发展
| 能力维度 | 阅读时长(分钟) | 占比 | 趋势 |
|----------|---------------|------|------|
${data.abilityCoverage.map(a => `| ${a.name} | ${a.duration} | ${a.percentage}% | ${a.trend || '稳定'} |`).join('\n')}

## 阅读偏好
| 类型 | 阅读次数 | 平均投入度 |
|------|---------|-----------|
${data.preferenceType.map(p => `| ${p.type} | ${p.count} | ${p.avgEngagement || 80}% |`).join('\n')}

## 最近阅读记录
${data.recentBooks.map(b => `- 《${b.name}》(${b.type}) ${b.duration}分钟 投入度${b.engagement}%`).join('\n')}

## 与班级对比
- 活跃度：班级平均的${data.comparedToClass.activityLevel}%
- 时长：班级平均的${data.comparedToClass.durationLevel}%
- 排名：班级第${data.comparedToClass.rank}名

## 请完成以下分析任务：

### 1. 学生画像（100字以内）
描述该学生的阅读特点和学习风格。

### 2. 优势与不足
- 优势能力：列出2个，说明依据
- 待提升能力：列出1-2个，说明原因

### 3. 短期培养建议（1-2周）
给出3条具体可操作的建议，每条包含：
- 建议内容
- 推荐绘本类型
- 预期效果

### 4. 家园共育建议
给家长2条配合建议，简单易执行。

请用亲切专业的语气回答，适合教师和家长阅读。`;
    },

    // ========== API调用 ==========

    /**
     * 调用大模型API
     */
    async callApi(prompt) {
        if (!this.config.enabled || !this.config.apiKey) {
            throw new Error('AI服务未配置或未启用');
        }

        try {
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: this.config.model,
                    max_tokens: 2048,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!response.ok) {
                throw new Error(`API调用失败: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('AI API调用失败:', error);
            throw error;
        }
    },

    /**
     * 分析园所数据
     */
    async analyzeSchool(data) {
        const prompt = this.buildSchoolPrompt(data);

        try {
            const response = await this.callApi(prompt);
            return this.parseSchoolResponse(response);
        } catch (error) {
            // 降级到规则引擎
            console.log('使用规则引擎降级方案');
            return this.RuleEngine.generateSchoolAnalysis(data);
        }
    },

    /**
     * 分析学生数据
     */
    async analyzeStudent(data) {
        const prompt = this.buildStudentPrompt(data);

        try {
            const response = await this.callApi(prompt);
            return this.parseStudentResponse(response);
        } catch (error) {
            // 降级到规则引擎
            console.log('使用规则引擎降级方案');
            return this.RuleEngine.generateStudentAnalysis(data);
        }
    },

    // ========== 响应解析 ==========

    parseSchoolResponse(response) {
        const content = response.content?.[0]?.text || '';

        return {
            overallAssessment: this.extractSection(content, '整体评价'),
            problems: this.extractProblemList(content),
            suggestions: this.extractSuggestionList(content),
            rawContent: content
        };
    },

    parseStudentResponse(response) {
        const content = response.content?.[0]?.text || '';

        return {
            portrait: this.extractSection(content, '学生画像'),
            strengths: this.extractStrengths(content),
            weaknesses: this.extractWeaknesses(content),
            suggestions: this.extractSuggestionList(content),
            homeCollaboration: this.extractHomeCollaboration(content),
            rawContent: content
        };
    },

    extractSection(content, sectionTitle) {
        const patterns = [
            new RegExp(`###?\\s*\\d*\\.?\\s*${sectionTitle}[\\s\\S]*?(?=###|##|$)`, 'i'),
            new RegExp(`\\*\\*${sectionTitle}\\*\\*[\\s\\S]*?(?=\\*\\*|##|$)`, 'i')
        ];

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                return match[0]
                    .replace(new RegExp(`###?\\s*\\d*\\.?\\s*${sectionTitle}`, 'i'), '')
                    .replace(new RegExp(`\\*\\*${sectionTitle}\\*\\*`, 'i'), '')
                    .trim();
            }
        }
        return '';
    },

    extractProblemList(content) {
        const problems = [];
        const problemSection = this.extractSection(content, '发现的问题');

        if (problemSection) {
            const lines = problemSection.split('\n').filter(l => l.trim());
            let currentProblem = null;

            lines.forEach(line => {
                if (/^\d+\.|^[•\-]/.test(line.trim())) {
                    if (currentProblem) problems.push(currentProblem);
                    currentProblem = { title: line.replace(/^[\d\.\-•\s]+/, ''), description: '' };
                } else if (currentProblem) {
                    currentProblem.description += line + ' ';
                }
            });
            if (currentProblem) problems.push(currentProblem);
        }

        return problems.length > 0 ? problems : [{ title: '暂无明显问题', description: '本周活动数据表现正常' }];
    },

    extractSuggestionList(content) {
        const suggestions = [];
        const suggestionSection = this.extractSection(content, '改进建议') ||
            this.extractSection(content, '短期培养建议');

        if (suggestionSection) {
            const lines = suggestionSection.split('\n').filter(l => l.trim());
            let currentSuggestion = null;

            lines.forEach(line => {
                if (/^\d+\.|^[•\-]/.test(line.trim())) {
                    if (currentSuggestion) suggestions.push(currentSuggestion);
                    currentSuggestion = { content: line.replace(/^[\d\.\-•\s]+/, ''), steps: [] };
                } else if (currentSuggestion) {
                    currentSuggestion.content += ' ' + line;
                }
            });
            if (currentSuggestion) suggestions.push(currentSuggestion);
        }

        return suggestions.length > 0 ? suggestions : [{ content: '继续保持当前活动节奏' }];
    },

    extractStrengths(content) {
        const strengths = [];
        const section = this.extractSection(content, '优势');

        if (section) {
            const lines = section.split('\n').filter(l => l.trim() && /^[\d\.\-•]/.test(l.trim()));
            lines.forEach(line => {
                strengths.push(line.replace(/^[\d\.\-•\s]+/, '').trim());
            });
        }

        return strengths.length > 0 ? strengths : ['阅读积极性高'];
    },

    extractWeaknesses(content) {
        const weaknesses = [];
        const section = this.extractSection(content, '不足') || this.extractSection(content, '待提升');

        if (section) {
            const lines = section.split('\n').filter(l => l.trim() && /^[\d\.\-•]/.test(l.trim()));
            lines.forEach(line => {
                weaknesses.push(line.replace(/^[\d\.\-•\s]+/, '').trim());
            });
        }

        return weaknesses.length > 0 ? weaknesses : ['可继续拓展阅读广度'];
    },

    extractHomeCollaboration(content) {
        const suggestions = [];
        const section = this.extractSection(content, '家园共育');

        if (section) {
            const lines = section.split('\n').filter(l => l.trim() && /^[\d\.\-•]/.test(l.trim()));
            lines.forEach(line => {
                suggestions.push(line.replace(/^[\d\.\-•\s]+/, '').trim());
            });
        }

        return suggestions.length > 0 ? suggestions : ['建议家长每天陪同阅读15分钟'];
    },

    // ========== 规则引擎（降级方案） ==========
    RuleEngine: {
        /**
         * 园所分析规则引擎
         */
        generateSchoolAnalysis(data) {
            const problems = [];
            const suggestions = [];

            // 规则1：检测零活动班级
            const zeroActivityClasses = data.classComparison.filter(c => c.activityCount === 0);
            if (zeroActivityClasses.length > 0) {
                problems.push({
                    title: '存在零活动班级',
                    description: `${zeroActivityClasses.map(c => c.className).join('、')}本周无阅读活动记录。`,
                    dataEvidence: `涉及${zeroActivityClasses.length}个班级`
                });
                suggestions.push({
                    content: '立即跟进零活动班级',
                    steps: ['与班主任沟通了解原因', '检查设备是否正常', '制定恢复计划']
                });
            }

            // 规则2：检测低参与率班级
            const lowParticipationClasses = data.classComparison.filter(c => c.participationRate < 70 && c.participationRate > 0);
            if (lowParticipationClasses.length > 0) {
                problems.push({
                    title: '部分班级参与率偏低',
                    description: `${lowParticipationClasses.map(c => c.className).join('、')}参与率低于70%。`,
                    dataEvidence: `平均参与率${Math.round(lowParticipationClasses.reduce((s, c) => s + c.participationRate, 0) / lowParticipationClasses.length)}%`
                });
                suggestions.push({
                    content: '提升低参与班级的活动频次',
                    steps: ['分析低参与原因', '优化活动时间安排', '增加趣味性绘本']
                });
            }

            // 规则3：检测能力维度不平衡
            const lowAbility = data.abilityDistribution.find(a => a.percentage < 12);
            if (lowAbility) {
                problems.push({
                    title: `${lowAbility.name}维度发展不足`,
                    description: `该能力维度阅读占比仅${lowAbility.percentage}%，低于平均水平。`,
                    dataEvidence: `建议增加${lowAbility.name}类绘本`
                });
                suggestions.push({
                    content: `加强${lowAbility.name}能力培养`,
                    steps: [`增加${lowAbility.name}类绘本采购`, `开展${lowAbility.name}主题活动周`, '教师培训相关引导方法']
                });
            }

            // 规则4：类型多样性检查
            const lowType = data.typeDistribution.find(t => t.percentage < 10);
            if (lowType) {
                suggestions.push({
                    content: `丰富${lowType.type}类型绘本`,
                    steps: ['评估当前绘本库存', '采购补充相关类型', '设计专题阅读活动']
                });
            }

            // 生成整体评价
            const overallAssessment = this.generateOverallAssessment(data, problems);

            return {
                overallAssessment,
                problems: problems.length > 0 ? problems : [{ title: '暂无明显问题', description: '本周各项数据表现正常，请继续保持' }],
                suggestions: suggestions.length > 0 ? suggestions : [{ content: '继续保持当前活动节奏', steps: ['定期检查设备状态', '更新绘本库存', '保持家校沟通'] }]
            };
        },

        generateOverallAssessment(data, problems) {
            const participationRate = Math.round(data.summary.participatingStudents / data.summary.totalStudents * 100);
            let assessment = `本周共开展${data.summary.totalActivities}次阅读活动，参与幼儿${data.summary.participatingStudents}人（${participationRate}%），总阅读时长${data.summary.totalDuration}小时。`;

            if (problems.length === 0) {
                assessment += '各项指标表现良好，活动开展有序，继续保持当前节奏。';
            } else {
                assessment += `发现${problems.length}个需关注的问题，建议及时处理。`;
            }

            return assessment;
        },

        /**
         * 学生分析规则引擎
         */
        generateStudentAnalysis(data) {
            // 识别优势能力
            const strengths = data.abilityCoverage
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 2)
                .map(a => `${a.name}（阅读占比${a.percentage}%）`);

            // 识别待提升能力
            const weaknesses = data.abilityCoverage
                .sort((a, b) => a.percentage - b.percentage)
                .slice(-2)
                .filter(a => a.percentage < 15)
                .map(a => `${a.name}（阅读占比${a.percentage}%）`);

            // 生成学生画像
            const portrait = this.generatePortrait(data, strengths);

            // 生成培养建议
            const suggestions = this.generateSuggestions(data, weaknesses);

            // 生成家园共育建议
            const homeCollaboration = this.generateHomeCollaboration(data);

            return {
                portrait,
                strengths,
                weaknesses: weaknesses.length > 0 ? weaknesses : ['整体发展均衡'],
                suggestions,
                homeCollaboration
            };
        },

        generatePortrait(data, strengths) {
            const engagement = data.readingSummary.avgEngagement;
            const activityLevel = data.comparedToClass.activityLevel;

            let style = '';
            if (engagement > 85) {
                style = '阅读投入度高，专注力强，';
            } else if (engagement > 70) {
                style = '阅读态度积极，参与度良好，';
            } else {
                style = '阅读兴趣有待激发，';
            }

            if (activityLevel > 110) {
                style += '是班级的阅读活跃分子。';
            } else if (activityLevel > 90) {
                style += '阅读表现处于班级中上水平。';
            } else {
                style += '需要更多鼓励和引导。';
            }

            return `${data.student.name}同学${style}在${strengths[0] || '语言表达'}方面表现突出。`;
        },

        generateSuggestions(data, weaknesses) {
            const suggestions = [];

            // 基于偏好类型推荐
            const topType = data.preferenceType[0];
            if (topType) {
                suggestions.push({
                    content: `继续提供${topType.type}类绘本`,
                    recommendedType: topType.type,
                    expectedEffect: '巩固阅读兴趣'
                });
            }

            // 基于弱项推荐
            if (weaknesses.length > 0) {
                const weakAbility = weaknesses[0].split('（')[0];
                suggestions.push({
                    content: `加强${weakAbility}能力培养`,
                    recommendedType: this.getAbilityBookType(weakAbility),
                    expectedEffect: '均衡能力发展'
                });
            }

            // 基于投入度推荐
            if (data.readingSummary.avgEngagement < 75) {
                suggestions.push({
                    content: '增加互动式阅读活动',
                    recommendedType: '人际交往',
                    expectedEffect: '提升阅读兴趣'
                });
            }

            return suggestions.length > 0 ? suggestions : [{ content: '保持当前阅读节奏', recommendedType: '多元化', expectedEffect: '持续发展' }];
        },

        generateHomeCollaboration(data) {
            const suggestions = [];

            suggestions.push('建议每天固定15-20分钟亲子阅读时间');
            suggestions.push('阅读后与孩子讨论故事情节，培养表达能力');

            if (data.readingSummary.avgEngagement < 80) {
                suggestions.push('可尝试角色扮演等互动方式提升阅读兴趣');
            }

            return suggestions;
        },

        getAbilityBookType(ability) {
            const mapping = {
                '语言表达': '情商品格',
                '社交能力': '人际交往',
                '情感认知': '情商品格',
                '想象创造': '日常生活',
                '逻辑思维': '科普百科',
                '文化素养': '国学文化'
            };
            return mapping[ability] || '日常生活';
        }
    }
};