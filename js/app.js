// 应用程序主逻辑 - 深色科技风数据大屏
const App = {
    currentPage: 'dataOverview',
    schoolDataTab: 'overview',
    currentRole: 'admin', // admin-教育局管理员, principal-园长, teacher-教师
    selectedSchool: null,  // 选中的园所（园长视角）
    selectedClass: null,   // 选中的班级（教师视角）
    aiAnalysisTab: 'school', // AI分析标签页: school(园长-园所), class(园长-班级), teacherClass(教师-班级), student(教师-学生)
    aiSelectedClass: 1, // AI分析选中的班级ID（园长）
    aiSelectedStudent: 1, // AI分析选中的学生ID（教师）

    pagination: {
        activities: { page: 1, pageSize: 10 },
        books: { page: 1, pageSize: 10 },
        classes: { page: 1, pageSize: 10 },
        teachers: { page: 1, pageSize: 10 },
        students: { page: 1, pageSize: 10 },
        devices: { page: 1, pageSize: 10 },
        users: { page: 1, pageSize: 10 }
    },

    filters: {
        activities: { startTime: '', endTime: '', className: '', teacher: '' },
        books: { type: '', name: '', isbn: '' },
        teachers: { name: '' },
        students: { name: '', className: '' },
        devices: { sn: '' },
        users: { account: '', role: '', status: '' }
    },

    dateRanges: {
        dataOverview: { preset: '7d', startDate: '', endDate: '' },
        schoolOverview: { preset: '7d', startDate: '', endDate: '' }
    },

    init() {
        this.initDateRanges();
        this.updateTime();
        this.bindSidebarEvents();
        this.initRole();
        this.loadPage('dataOverview');
        // 等待DOM渲染完成后更新侧边栏
        requestAnimationFrame(() => {
            this.updateRoleUI();
            this.updateSidebarForRole();
        });
        setInterval(() => this.updateTime(), 1000);
        // 点击其他区域关闭角色选择器
        document.addEventListener('click', (e) => {
            const switcher = document.getElementById('role-switcher');
            const avatar = document.getElementById('user-avatar');
            if (switcher && avatar && !switcher.contains(e.target) && !avatar.contains(e.target)) {
                switcher.classList.add('hidden');
            }
        });
    },

    // 初始化角色
    initRole() {
        this.updateRoleUI();
    },

    // 切换角色选择器显示
    toggleRoleSwitcher() {
        const switcher = document.getElementById('role-switcher');
        if (switcher) {
            switcher.classList.toggle('hidden');
        }
    },

    // 切换角色
    initDateRanges() {
        ['dataOverview', 'schoolOverview'].forEach(context => {
            this.dateRanges[context] = {
                preset: '7d',
                ...this.buildDateRangeByPreset('7d')
            };
        });
    },

    getLatestActivityDate() {
        const activities = MockData.schoolData?.activities || [];
        if (!activities.length) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return today;
        }
        const parsedDates = activities
            .map(item => this.parseActivityDate(item.endTime))
            .filter(date => !Number.isNaN(date.getTime()));
        if (!parsedDates.length) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return today;
        }
        const latest = parsedDates.reduce((max, current) => current > max ? current : max, parsedDates[0]);
        latest.setHours(0, 0, 0, 0);
        return latest;
    },

    parseActivityDate(value) {
        if (!value) return new Date('invalid');
        const normalized = value.includes('T') ? value : value.replace(' ', 'T');
        return new Date(normalized);
    },

    formatDateInput(date) {
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    buildDateRangeByPreset(preset) {
        const end = this.getLatestActivityDate();
        if (Number.isNaN(end.getTime())) {
            return { startDate: '', endDate: '' };
        }
        const start = new Date(end);
        if (preset === '7d') start.setDate(end.getDate() - 6);
        else if (preset === '1m') start.setMonth(end.getMonth() - 1);
        else if (preset === '6m') {
            start.setDate(1);
            start.setMonth(end.getMonth() - 5);
        } else if (preset === '1y') {
            start.setDate(1);
            start.setMonth(end.getMonth() - 11);
        }
        start.setHours(0, 0, 0, 0);
        return {
            startDate: this.formatDateInput(start),
            endDate: this.formatDateInput(end)
        };
    },

    updateDateRange(context, updates = {}) {
        this.dateRanges[context] = { ...this.dateRanges[context], ...updates };
    },

    applyDatePreset(context, preset) {
        this.updateDateRange(context, { preset, ...this.buildDateRangeByPreset(preset) });
        this.rerenderDateRangeContext(context);
    },

    applyCustomDate(context, field, value) {
        const next = { ...this.dateRanges[context], [field]: value, preset: 'custom' };
        if (next.startDate && next.endDate && next.startDate > next.endDate) {
            if (field === 'startDate') next.endDate = value;
            else next.startDate = value;
        }
        this.updateDateRange(context, next);
        this.rerenderDateRangeContext(context);
    },

    rerenderDateRangeContext(context) {
        if (context === 'dataOverview') {
            this.loadPage('dataOverview');
            return;
        }
        if (context === 'schoolOverview') {
            this.renderSchoolTabContent('overview');
        }
    },

    normalizeAiAnalysisTab() {
        if (this.currentRole === 'principal') {
            if (!['school', 'class'].includes(this.aiAnalysisTab)) {
                this.aiAnalysisTab = 'school';
            }
            return;
        }
        if (this.currentRole === 'teacher') {
            if (!['teacherClass', 'student'].includes(this.aiAnalysisTab)) {
                this.aiAnalysisTab = 'teacherClass';
            }
        }
    },

    getFilteredActivitiesByDateRange(context) {
        const range = this.dateRanges[context];
        const start = range?.startDate ? new Date(`${range.startDate}T00:00:00`) : null;
        const end = range?.endDate ? new Date(`${range.endDate}T23:59:59`) : null;
        return (MockData.schoolData?.activities || []).filter(item => {
            const current = this.parseActivityDate(item.endTime);
            if (Number.isNaN(current.getTime())) return false;
            if (start && current < start) return false;
            if (end && current > end) return false;
            return true;
        });
    },

    buildDailySeries(activities, valueGetter) {
        const dailyMap = new Map();
        activities.forEach(item => {
            const day = item.endTime.slice(0, 10);
            dailyMap.set(day, (dailyMap.get(day) || 0) + valueGetter(item));
        });
        const sortedDays = [...dailyMap.keys()].sort();
        return {
            dates: sortedDays.map(day => day.slice(5)),
            values: sortedDays.map(day => dailyMap.get(day))
        };
    },

    getOverviewSeriesGranularity(range) {
        if (!range) return 'day';
        if (['6m', '1y'].includes(range.preset)) return 'month';
        if (['7d', '1m'].includes(range.preset)) return 'day';

        if (range.startDate && range.endDate) {
            const start = new Date(`${range.startDate}T00:00:00`);
            const end = new Date(`${range.endDate}T23:59:59`);
            if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
                const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
                return diffDays > 31 ? 'month' : 'day';
            }
        }

        return 'day';
    },

    buildOverviewActivitySeries(activities, valueGetter) {
        const range = this.dateRanges.dataOverview || {};
        const start = range?.startDate ? new Date(`${range.startDate}T00:00:00`) : null;
        const end = range?.endDate ? new Date(`${range.endDate}T23:59:59`) : null;
        const granularity = this.getOverviewSeriesGranularity(range);
        const bucketMap = new Map();

        activities.forEach(item => {
            const current = this.parseActivityDate(item.endTime);
            if (Number.isNaN(current.getTime())) return;
            const key = granularity === 'month'
                ? `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
                : item.endTime.slice(0, 10);
            bucketMap.set(key, (bucketMap.get(key) || 0) + valueGetter(item));
        });

        if (!start || !end) {
            return {
                dates: [],
                values: [],
                granularity
            };
        }

        const dates = [];
        const values = [];

        if (granularity === 'month') {
            const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
            const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
            while (cursor <= endMonth) {
                const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
                dates.push(key);
                values.push(bucketMap.get(key) || 0);
                cursor.setMonth(cursor.getMonth() + 1);
            }
        } else {
            const cursor = new Date(start);
            cursor.setHours(0, 0, 0, 0);
            const endDate = new Date(end);
            endDate.setHours(0, 0, 0, 0);
            while (cursor <= endDate) {
                const key = this.formatDateInput(cursor);
                dates.push(key.slice(5));
                values.push(bucketMap.get(key) || 0);
                cursor.setDate(cursor.getDate() + 1);
            }
        }

        return { dates, values, granularity };
    },

    buildRanking(map, limit = 10, extraMapper = null) {
        return [...map.entries()]
            .map(([name, count]) => ({ name, count, ...(extraMapper ? extraMapper(name) : {}) }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    },

    getKindergartenActivityRanking() {
        const activities = this.getFilteredActivitiesByDateRange('dataOverview');
        const totalActivities = MockData.schoolData.activities.length || 1;
        const ratio = activities.length / totalActivities;
        return MockData.kindergartens
            .map(kindergarten => {
                const baseCount = MockData.classes
                    .filter(cls => cls.kindergartenId === kindergarten.id)
                    .reduce((sum, cls) => sum + (cls.activityCount || 0), 0);
                const activityCount = this.scaleNumber(baseCount, ratio, activities.length ? 1 : 0);
                return {
                    ...kindergarten,
                    activityCount
                };
            })
            .sort((a, b) => b.activityCount - a.activityCount);
    },

    getAdminClassUsageComparison() {
        const source = MockData.kindergartenClassUsageComparison || [];
        const schools = source.map(item => {
            const kindergarten = MockData.kindergartens.find(entry => entry.id === item.kindergartenId) || {};
            return {
                ...item,
                district: kindergarten.district || '-',
                classCount: kindergarten.classCount || 0
            };
        });
        const schoolCount = schools.length || 1;
        const summary = {
            avgActivityCount: Number((schools.reduce((sum, item) => sum + item.avgActivityCount, 0) / schoolCount).toFixed(1)),
            avgParticipantCount: Number((schools.reduce((sum, item) => sum + item.avgParticipantCount, 0) / schoolCount).toFixed(1))
        };

        return { schools, summary };
    },

    scaleNumber(value, ratio, minimum = 0) {
        return Math.max(minimum, Math.round(value * ratio));
    },

    renderDateFilterBar(context) {
        const state = this.dateRanges[context];
        const presets = [
            { id: '7d', label: '近7天' },
            { id: '1m', label: '近1个月' },
            { id: '6m', label: '近半年' },
            { id: '1y', label: '近一年' }
        ];
        return `
        <div class="bg-slate-700/45 rounded-2xl border border-slate-500/30 p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div class="flex flex-wrap gap-2">
                ${presets.map(item => `
                    <button class="px-4 py-2 rounded-lg text-sm transition-all border ${state.preset === item.id ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-slate-800/40 text-slate-300 border-slate-500/30 hover:border-blue-400/30 hover:text-white'}" onclick="App.applyDatePreset('${context}', '${item.id}')">${item.label}</button>
                `).join('')}
            </div>
            <div class="flex flex-wrap items-end gap-3">
                <div>
                    <label class="block text-xs text-slate-400 mb-1">开始日期</label>
                    <input type="date" value="${state.startDate}" onchange="App.applyCustomDate('${context}', 'startDate', this.value)" class="bg-slate-800/80 border border-slate-600/50 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/40 outline-none">
                </div>
                <div>
                    <label class="block text-xs text-slate-400 mb-1">结束日期</label>
                    <input type="date" value="${state.endDate}" onchange="App.applyCustomDate('${context}', 'endDate', this.value)" class="bg-slate-800/80 border border-slate-600/50 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/40 outline-none">
                </div>
            </div>
        </div>`;
    },

    getDateRangeTitle(context) {
        const range = this.dateRanges[context];
        if (!range) return '';

        const presetMap = {
            '7d': '近7日',
            '1m': '近1个月',
            '6m': '近6个月',
            '1y': '近1年'
        };

        if (range.preset && range.preset !== 'custom' && presetMap[range.preset]) {
            return presetMap[range.preset];
        }

        if (range.startDate && range.endDate) {
            return `${range.startDate} 至 ${range.endDate}`;
        }

        return '';
    },

    switchRole(role) {
        this.currentRole = role;
        MockData.currentRole = role;

        // 根据角色设置默认选中的园所/班级
        if (role === 'principal') {
            this.selectedSchool = MockData.kindergartens[0]; // 默认选中第一个园所
        } else if (role === 'teacher') {
            this.selectedSchool = MockData.kindergartens[0];
            this.selectedClass = MockData.classes[0]; // 默认选中第一个班级
        } else {
            this.selectedSchool = null;
            this.selectedClass = null;
        }

        this.normalizeAiAnalysisTab();

        this.updateRoleUI();
        this.updateSidebarForRole();

        // 关闭选择器
        const switcher = document.getElementById('role-switcher');
        if (switcher) switcher.classList.add('hidden');

        // 重新加载当前页面或跳转到合适的页面
        if (role === 'admin') {
            this.loadPage('dataOverview');
        } else {
            this.loadPage('schoolData');
        }

        const roleNames = { admin: '教育局管理员', principal: '园长', teacher: '教师' };
        this.showToast(`已切换为${roleNames[role]}角色`, 'success');
    },

    // 更新角色UI
    updateRoleUI() {
        const roleText = document.getElementById('current-role-text');
        const roleNames = { admin: '教育局管理员', principal: '园长', teacher: '教师' };
        if (roleText) {
            roleText.textContent = roleNames[this.currentRole];
        }

        // 更新角色选项高亮
        document.querySelectorAll('.role-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.role === this.currentRole);
        });
    },

    // 获取当前角色对应的大数据总览数据
    getOverviewDataForCurrentRole() {
        if (this.currentRole === 'admin') {
            // 教育局管理员：返回全局数据
            return {
                stats: MockData.dataOverviewStats,
                bookTypes: MockData.bookTypes,
                abilityDistribution: MockData.abilityDistribution,
                weeklyActivity: MockData.weeklyActivity,
                teacherRanking: MockData.teacherRanking,
                bookRanking: MockData.bookRanking
            };
        } else if (this.currentRole === 'principal') {
            // 园长：返回本园数据（从园所数据中映射）
            const schoolData = MockData.schoolData.overview;
            return {
                stats: {
                    activityCount: schoolData.activityTotal,
                    activityDuration: schoolData.activityDuration,
                    participantCount: schoolData.studentTotal,
                    readingDuration: schoolData.bookReadDuration
                },
                // 绘本类型占比使用园所分类数据
                bookTypes: schoolData.categoryData.map(cat => ({
                    name: cat.name,
                    value: cat.readCount
                })),
                abilityDistribution: MockData.abilityDistribution, // 能力分布暂时复用全局
                weeklyActivity: MockData.weeklyActivity, // 近七日活动暂时复用全局
                teacherRanking: MockData.teacherRanking, // 教师排名暂时复用全局
                bookRanking: MockData.bookRanking // 绘本排名暂时复用全局
            };
        }
        // 默认返回全局数据
        return {
            stats: MockData.dataOverviewStats,
            bookTypes: MockData.bookTypes,
            abilityDistribution: MockData.abilityDistribution,
            weeklyActivity: MockData.weeklyActivity,
            teacherRanking: MockData.teacherRanking,
            bookRanking: MockData.bookRanking
        };
    },

    // 根据角色更新侧边栏
    getOverviewDataForCurrentRange() {
        const activities = this.getFilteredActivitiesByDateRange('dataOverview');
        const totalActivities = MockData.schoolData.activities.length || 1;
        const ratio = activities.length / totalActivities;
        const totalDuration = activities.length * 0.5;
        const participantCount = activities.reduce((sum, item) => sum + (item.studentCount || 0), 0);
        const weeklyActivity = this.buildOverviewActivitySeries(activities, () => 1);
        const teacherMap = new Map();
        activities.forEach(item => {
            teacherMap.set(item.teacher, (teacherMap.get(item.teacher) || 0) + 1);
        });

        const source = this.getOverviewDataForCurrentRole();
        return {
            stats: {
                activityCount: activities.length,
                activityDuration: totalDuration.toFixed(1),
                participantCount,
                readingDuration: (totalDuration * 0.42).toFixed(1)
            },
            bookTypes: source.bookTypes.map(item => ({
                ...item,
                value: Math.max(1, this.scaleNumber(item.value, ratio, activities.length ? 1 : 0))
            })),
            abilityDistribution: source.abilityDistribution,
            weeklyActivity,
            teacherRanking: this.buildRanking(teacherMap, 10, name => ({
                class: MockData.teacherRanking.find(item => item.name === name)?.class || ''
            })),
            classUsageComparison: this.currentRole === 'admin' ? this.getAdminClassUsageComparison() : null,
            bookRanking: source.bookRanking.map(item => ({
                ...item,
                reads: this.scaleNumber(item.reads, ratio, activities.length ? 1 : 0),
                duration: `${(parseFloat(item.duration) * (ratio || 0)).toFixed(1)}h`
            }))
        };
    },

    getSchoolOverviewDataForCurrentRange() {
        const activities = this.getFilteredActivitiesByDateRange('schoolOverview');
        const base = MockData.schoolData.overview;
        const totalActivities = MockData.schoolData.activities.length || 1;
        const ratio = activities.length / totalActivities;
        const activityDuration = activities.length * 0.5;
        const studentTotal = activities.reduce((sum, item) => sum + (item.studentCount || 0), 0);
        return {
            activityTotal: activities.length,
            activityDuration: activityDuration.toFixed(1),
            bookTotal: base.bookTotal,
            bookReadCount: this.scaleNumber(base.bookReadCount, ratio, activities.length ? 1 : 0),
            bookReadDuration: (parseFloat(base.bookReadDuration) * (ratio || 0)).toFixed(1),
            deviceTotal: base.deviceTotal,
            deviceUseCount: this.scaleNumber(base.deviceUseCount, ratio),
            deviceUseDuration: (parseFloat(base.deviceUseDuration) * (ratio || 0)).toFixed(1),
            classTotal: base.classTotal,
            teacherTotal: base.teacherTotal,
            studentTotal,
            categoryData: base.categoryData.map(item => ({
                ...item,
                readCount: this.scaleNumber(item.readCount, ratio, activities.length ? 1 : 0),
                duration: `${(parseFloat(item.duration) * (ratio || 0)).toFixed(2)}h`
            }))
        };
    },

    getSchoolOverviewBookRecommendations() {
        const books = (MockData.schoolData?.books || []).slice().sort((a, b) => b.readCount - a.readCount);
        const roleReasonMap = {
            principal: '园所整体阅读热度较高，适合纳入近期重点推荐。',
            teacher: '班级活动适配度较高，适合近期课堂共读与互动延展。'
        };
        return books.slice(0, 4).map((book, index) => ({
            ...book,
            highlight: index === 0 ? '优先推荐' : index === 1 ? '高热度' : '可延展',
            reason: roleReasonMap[this.currentRole] || '近期阅读表现较好，建议持续关注。'
        }));
    },

    updateSidebarForRole() {
        // 管理员和园长可以看到大数据总览，教师看不到
        const dataOverviewItem = document.getElementById('nav-dataOverview');
        if (dataOverviewItem) {
            if (this.currentRole === 'teacher') {
                dataOverviewItem.classList.add('hidden-role');
            } else {
                dataOverviewItem.classList.remove('hidden-role');
            }
        }
        // AI分析菜单：园长和教师可以看到，管理员暂时不显示
        const aiAnalysisItem = document.getElementById('nav-aiAnalysis');
        if (aiAnalysisItem) {
            if (this.currentRole === 'admin') {
                aiAnalysisItem.classList.add('hidden-role');
            } else {
                aiAnalysisItem.classList.remove('hidden-role');
            }
        }
    },

    updateTime() {
        const now = new Date();
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${days[now.getDay()]} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        const el = document.getElementById('current-time');
        if (el) el.textContent = timeStr;
    },

    bindSidebarEvents() {
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) this.loadPage(page);
            });
        });
        document.querySelectorAll('.sidebar-group-title').forEach(title => {
            title.addEventListener('click', () => {
                const group = title.dataset.group;
                const groupEl = document.getElementById(`group-${group}`);
                if (groupEl) {
                    groupEl.classList.toggle('hidden');
                    title.querySelector('.group-arrow')?.classList.toggle('rotate-180');
                }
            });
        });
    },

    loadPage(pageName) {
        // 权限检查：只有管理员和园长可以访问大数据总览，教师不能
        if (pageName === 'dataOverview' && this.currentRole === 'teacher') {
            pageName = 'schoolData';
        }
        // 权限检查：AI分析只有园长和教师可以访问
        if (pageName === 'aiAnalysis' && this.currentRole === 'admin') {
            pageName = 'dataOverview';
        }

        this.currentPage = pageName;
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageName);
        });
        const breadcrumbMap = {
            dataOverview: '首页 / 基础设置 / 大数据总览',
            schoolData: '首页 / 基础设置 / 园所数据',
            aiAnalysis: '首页 / 基础设置 / AI分析'
        };
        document.getElementById('breadcrumb').textContent = breadcrumbMap[pageName] || '首页';
        Charts.dispose();
        const container = document.getElementById('page-container');
        switch (pageName) {
            case 'dataOverview': container.innerHTML = this.renderDataOverviewPage(); break;
            case 'schoolData': container.innerHTML = this.renderSchoolDataPage(); break;
            case 'aiAnalysis': container.innerHTML = this.renderAiAnalysisPage(); break;
            default: container.innerHTML = this.renderDataOverviewPage();
        }
        requestAnimationFrame(() => {
            requestAnimationFrame(() => this.initPageContent(pageName));
        });
    },

    initPageContent(pageName) {
        switch (pageName) {
            case 'dataOverview':
                const overviewData = this.getOverviewDataForCurrentRange();
                Charts.initDataOverviewCharts(overviewData);
                this.renderDataOverviewRankings(overviewData.bookRanking);
                this.renderKindergartenActivityRanking();
                break;
            case 'schoolData': this.initSchoolDataPage(); break;
            case 'aiAnalysis': this.initAiAnalysisPage(); break;
        }
    },

    toggleFullscreen() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const colors = { success: 'bg-emerald-500/90', error: 'bg-red-500/90', info: 'bg-blue-500/90', warning: 'bg-amber-500/90' };
        const toast = document.createElement('div');
        toast.className = `${colors[type]} text-white px-4 py-2.5 rounded-lg shadow-lg text-sm animate-slide-in backdrop-blur-sm border border-white/10`;
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => { toast.classList.add('opacity-0', 'transition-opacity'); setTimeout(() => toast.remove(), 300); }, 3000);
    },

    openModal(html) {
        document.getElementById('modal-content').innerHTML = html;
        document.getElementById('modal-overlay').classList.remove('hidden');
    },
    closeModal(e) {
        if (e && e.target !== document.getElementById('modal-overlay')) return;
        document.getElementById('modal-overlay').classList.add('hidden');
    },
    closeModalDirect() {
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    // ============================================================
    // 通用UI组件 - 深色科技风
    // ============================================================

    // 深色卡片容器
    card(content, extraClass = '') {
        return `<div class="bg-slate-600/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-500/35 hover:border-blue-400/30 transition-all duration-300 ${extraClass}">${content}</div>`;
    },

    // 指标卡片
    statCard(label, value, icon, color, growth = '') {
        const colorMap = {
            blue: { bg: 'from-blue-500/15 to-blue-600/8', text: 'text-blue-400', icon: 'text-blue-400', border: 'border-blue-500/25' },
            emerald: { bg: 'from-emerald-500/15 to-emerald-600/8', text: 'text-emerald-400', icon: 'text-emerald-400', border: 'border-emerald-500/25' },
            purple: { bg: 'from-purple-500/15 to-purple-600/8', text: 'text-purple-400', icon: 'text-purple-400', border: 'border-purple-500/25' },
            amber: { bg: 'from-amber-500/15 to-amber-600/8', text: 'text-amber-400', icon: 'text-amber-400', border: 'border-amber-500/25' },
            cyan: { bg: 'from-cyan-500/15 to-cyan-600/8', text: 'text-cyan-400', icon: 'text-cyan-400', border: 'border-cyan-500/25' },
        };
        const c = colorMap[color] || colorMap.blue;
        return `
        <div class="bg-gradient-to-br ${c.bg} backdrop-blur-sm rounded-2xl p-5 border ${c.border} hover:border-opacity-60 transition-all duration-300 group cursor-pointer">
            <div class="flex items-center justify-between mb-3">
                <span class="text-sm text-slate-400">${label}</span>
                <div class="w-10 h-10 rounded-xl bg-slate-500/40 flex items-center justify-center ${c.icon} group-hover:scale-110 transition-transform">${icon}</div>
            </div>
            <div class="text-3xl font-bold text-white tracking-tight">${value}</div>
            ${growth ? `<div class="text-xs ${c.text} mt-1.5 flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>${growth}</div>` : ''}
        </div>`;
    },

    // 小指标块
    miniStat(label, value, color = 'blue') {
        const colorMap = { blue: 'text-blue-400 bg-blue-500/12 border-blue-500/25', emerald: 'text-emerald-400 bg-emerald-500/12 border-emerald-500/25', purple: 'text-purple-400 bg-purple-500/12 border-purple-500/25', amber: 'text-amber-400 bg-amber-500/12 border-amber-500/25', cyan: 'text-cyan-400 bg-cyan-500/12 border-cyan-500/25' };
        const c = colorMap[color] || colorMap.blue;
        return `<div class="${c} rounded-xl p-3 text-center border"><div class="text-xl font-bold">${value}</div><div class="text-xs text-slate-400 mt-1">${label}</div></div>`;
    },

    // 图表标题
    chartTitle(title, colorClass = 'bg-blue-500') {
        return `<h3 class="text-base font-semibold text-white mb-4 flex items-center gap-2"><span class="w-1.5 h-5 ${colorClass} rounded-full"></span>${title}</h3>`;
    },

    renderAdminClassUsageComparison(data) {
        if (!data || !data.schools || data.schools.length === 0) {
            return `
                <div class="space-y-4">
                    <div class="flex items-center justify-between gap-3">
                        ${this.chartTitle('园所班均使用对比', 'bg-cyan-500')}
                        <div class="text-xs text-slate-300 px-3 py-1.5 rounded-full border border-slate-400/20 bg-slate-700/30">区域内各园所班均数据</div>
                    </div>
                    <div class="rounded-2xl border border-dashed border-slate-500/30 bg-slate-800/35 px-4 py-10 text-center text-slate-400">
                        暂无园所班均使用数据
                    </div>
                </div>
            `;
        }

        const schools = data.schools;
        const topActivitySchool = schools.reduce((best, item) => item.avgActivityCount > best.avgActivityCount ? item : best, schools[0]);
        const topParticipantSchool = schools.reduce((best, item) => item.avgParticipantCount > best.avgParticipantCount ? item : best, schools[0]);
        const metricConfigs = [
            { key: 'avgActivityCount', title: '班均活动次数', unit: '次/班', accent: 'sky', avgValue: data.summary.avgActivityCount },
            { key: 'avgParticipantCount', title: '班均参与人次', unit: '人次/班', accent: 'blue', avgValue: data.summary.avgParticipantCount }
        ];
        const accentMap = {
            sky: {
                text: 'text-sky-300',
                badge: 'bg-slate-800/50 text-slate-200 border-slate-500/20',
                bar: 'from-[#38bdf8] via-[#7dd3fc] to-[#60a5fa]',
                barBg: 'bg-slate-700/50',
                dot: 'bg-sky-400',
                percent: 'text-slate-400'
            },
            blue: {
                text: 'text-blue-300',
                badge: 'bg-slate-800/50 text-slate-200 border-slate-500/20',
                bar: 'from-[#60a5fa] via-[#93c5fd] to-[#3b82f6]',
                barBg: 'bg-slate-700/50',
                dot: 'bg-blue-400',
                percent: 'text-slate-400'
            }
        };
        const medalClass = index => {
            if (index === 0) return 'bg-[#1e3a5f]/60 border border-[#3b82f6]/30 text-blue-200';
            if (index === 1) return 'bg-slate-700/40 border border-slate-500/20 text-slate-300';
            if (index === 2) return 'bg-[#0c4a6e]/40 border border-sky-500/20 text-sky-200';
            return 'bg-slate-800/40 border border-slate-600/20 text-slate-400';
        };
        const renderMetricRanking = config => {
            const accent = accentMap[config.accent];
            const ranked = [...schools].sort((a, b) => b[config.key] - a[config.key]);
            const maxValue = ranked[0]?.[config.key] || 1;
            return `
                <div class="rounded-[24px] border border-slate-600/20 bg-gradient-to-b from-slate-900/90 to-slate-800/70 p-5 shadow-xl">
                    <div class="flex items-center justify-between gap-3 mb-4">
                        <div>
                            <div class="text-sm font-semibold text-white">${config.title}</div>
                            <div class="text-xs text-slate-400 mt-0.5">区域平均 ${config.avgValue}${config.unit}</div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full border text-xs ${accent.badge}">${ranked.length} 所园所</span>
                    </div>
                    <div class="space-y-3">
                        ${ranked.map((item, index) => {
                            const percent = Math.max(14, Math.round(item[config.key] / maxValue * 100));
                            return `
                                <div class="rounded-2xl border border-slate-600/15 bg-slate-800/40 px-4 py-3">
                                    <div class="flex items-start justify-between gap-3">
                                        <div class="flex items-start gap-3 min-w-0">
                                            <span class="shrink-0 w-7 h-7 rounded-lg border text-xs font-semibold flex items-center justify-center ${medalClass(index)}">${index + 1}</span>
                                            <div class="min-w-0">
                                                <div class="text-sm font-semibold text-white truncate">${item.name}</div>
                                                <div class="text-xs text-slate-400 truncate">${item.district} · ${item.classCount}个班</div>
                                            </div>
                                        </div>
                                        <div class="text-right shrink-0">
                                            <div class="text-xl font-bold ${accent.text}">${item[config.key]}</div>
                                            <div class="text-[11px] text-slate-500">${config.unit}</div>
                                        </div>
                                    </div>
                                    <div class="mt-3 space-y-2">
                                        <div class="h-1.5 rounded-full ${accent.barBg} overflow-hidden">
                                            <div class="h-full rounded-full bg-gradient-to-r ${accent.bar}" style="width: ${percent}%"></div>
                                        </div>
                                        <div class="flex items-center justify-between text-[11px] ${accent.percent}">
                                            <span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full ${accent.dot}"></span>相对最高值</span>
                                            <span>${percent}%</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        };

        return `
            <div class="space-y-5">
                <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
                    ${this.chartTitle('园所班均使用对比', 'bg-cyan-500')}
                    <div class="text-xs text-slate-300 px-3 py-1.5 rounded-full border border-slate-400/20 bg-slate-700/30 w-fit">区域内各园所班均数据</div>
                </div>
                <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)] gap-5">
                    <div class="rounded-[26px] border border-slate-600/20 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/85 p-5 shadow-xl">
                        <div class="text-xs uppercase tracking-[0.24em] text-sky-200/70">区域概览</div>
                        <div class="mt-2 text-2xl font-semibold text-white leading-tight">区域园所班均使用概览</div>
                        <div class="mt-5 grid grid-cols-2 gap-3">
                            <div class="rounded-2xl border border-slate-600/20 bg-gradient-to-br from-[#0e7490]/20 to-slate-900/40 px-4 py-4">
                                <div class="text-xs text-sky-100/80">区域平均班均活动次数</div>
                                <div class="mt-2 text-3xl font-bold text-white">${data.summary.avgActivityCount}</div>
                                <div class="mt-1 text-xs text-slate-400">区域内平均每班活动次数</div>
                            </div>
                            <div class="rounded-2xl border border-slate-600/20 bg-gradient-to-br from-[#2563eb]/20 to-slate-900/40 px-4 py-4">
                                <div class="text-xs text-blue-100/80">区域平均班均参与人次</div>
                                <div class="mt-2 text-3xl font-bold text-white">${data.summary.avgParticipantCount}</div>
                                <div class="mt-1 text-xs text-slate-400">区域内平均每班参与人次</div>
                            </div>
                        </div>
                        <div class="mt-5 space-y-3">
                            <div class="rounded-2xl border border-slate-600/15 bg-slate-900/50 px-4 py-4">
                                <div class="flex items-center justify-between gap-3">
                                    <div>
                                        <div class="text-xs text-slate-500">班均活动次数最高园所</div>
                                        <div class="mt-1 text-lg font-semibold text-white">${topActivitySchool.name}</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-2xl font-bold text-sky-300">${topActivitySchool.avgActivityCount}</div>
                                        <div class="text-xs text-slate-500">次/班</div>
                                    </div>
                                </div>
                            </div>
                            <div class="rounded-2xl border border-slate-600/15 bg-slate-900/50 px-4 py-4">
                                <div class="flex items-center justify-between gap-3">
                                    <div>
                                        <div class="text-xs text-slate-500">班均参与人次最高园所</div>
                                        <div class="mt-1 text-lg font-semibold text-white">${topParticipantSchool.name}</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-2xl font-bold text-blue-300">${topParticipantSchool.avgParticipantCount}</div>
                                        <div class="text-xs text-slate-500">人次/班</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                        ${metricConfigs.map(renderMetricRanking).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // 筛选器容器
    filterBar(content) {
        return `<div class="flex flex-wrap items-end gap-3 mb-5 bg-slate-700/50 rounded-xl p-4 border border-slate-500/30">${content}</div>`;
    },

    // 筛选器输入框
    filterInput(label, attrs = '') {
        return `<div><label class="block text-xs text-slate-300 mb-1">${label}</label><input type="text" ${attrs} class="bg-slate-600/60 border border-slate-400/35 text-slate-100 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 outline-none placeholder-slate-400 transition-colors"></div>`;
    },

    // 筛选器下拉框
    filterSelect(label, options, attrs = '') {
        return `<div><label class="block text-xs text-slate-300 mb-1">${label}</label><select ${attrs} class="bg-slate-600/60 border border-slate-400/35 text-slate-100 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 outline-none transition-colors">${options}</select></div>`;
    },

    // 按钮
    btnPrimary(text, onclick) {
        return `<button class="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/20" onclick="${onclick}">${text}</button>`;
    },
    btnSecondary(text, onclick) {
        return `<button class="bg-slate-700/60 text-slate-300 px-4 py-1.5 rounded-lg text-sm hover:bg-slate-600/60 transition-colors border border-slate-600/30" onclick="${onclick}">${text}</button>`;
    },
    btnSuccess(text, onclick) {
        return `<button class="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1" onclick="${onclick}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>${text}</button>`;
    },

    // 表格
    tableWrap(headers, rows) {
        return `<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="bg-slate-900/50 text-slate-400 border-b border-slate-700/50">${headers.map(h => `<th class="px-4 py-3 ${h.align || 'text-left'} font-medium text-xs uppercase tracking-wider">${h.label}</th>`).join('')}</tr></thead><tbody class="divide-y divide-slate-700/30">${rows}</tbody></table></div>`;
    },

    // 状态标签
    badge(text, color = 'blue') {
        const colorMap = { blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20', green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', red: 'bg-red-500/15 text-red-400 border-red-500/20', purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20', amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20' };
        const c = colorMap[color] || colorMap.blue;
        return `<span class="px-2 py-0.5 rounded-full text-xs border ${c}">${text}</span>`;
    },

    // ============================================================
    //  页面1：大数据总览
    // ============================================================
    renderDataOverviewPage() {
        // 获取当前角色对应的数据
        const overviewData = this.getOverviewDataForCurrentRange();
        const stats = overviewData.stats;
        const rangeTitle = this.getDateRangeTitle('dataOverview');
        const iconBook = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>';
        const iconClock = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        const iconUsers = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>';
        const iconBolt = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';

        // 根据角色显示不同的标题
        let pageTitle = 'AI绘本阅读室大数据总览';
        let scopeBadge = '';
        if (this.currentRole === 'principal') {
            pageTitle = this.selectedSchool ? `${this.selectedSchool.name} 大数据总览` : '本园大数据总览';
            scopeBadge = `<span class="role-badge principal">🏫 园长视角</span>`;
        } else {
            scopeBadge = `<span class="role-badge admin">👔 全区数据</span>`;
        }

        return `
        <div class="space-y-6 w-full max-w-[1480px] mx-auto">
            <div class="relative overflow-hidden rounded-[28px] border border-cyan-400/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] p-6 lg:p-7 shadow-[0_24px_80px_rgba(2,6,23,0.35)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">${pageTitle}</h2>
                <div class="flex flex-wrap items-center gap-3 lg:justify-end">
                    ${scopeBadge}
                    <div class="text-sm text-slate-500" id="overview-date"></div>
                </div>
            </div>

            ${this.renderDateFilterBar('dataOverview')}

            <!-- 4个核心指标 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                ${this.statCard('绘本活动次数', stats.activityCount, iconBook, 'blue', '较上周增长 15.6%')}
                ${this.statCard('绘本活动时长', stats.activityDuration + 'h', iconClock, 'emerald', '较上周增长 12.3%')}
                ${this.statCard('参与活动人次', stats.participantCount, iconUsers, 'purple', '较上周增长 18.5%')}
                ${this.statCard('绘本阅读时长', stats.readingDuration + 'h', iconBolt, 'amber', '较上周增长 8.7%')}
            </div>

            <!-- 图表第一行 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${this.card(this.chartTitle('幼儿阅读绘本-类型占比', 'bg-blue-500') + '<div id="book-type-chart" class="h-72"></div>')}
                ${this.card(this.chartTitle('幼儿阅读绘本-能力分布', 'bg-emerald-500') + '<div id="ability-distribution-chart" class="h-72"></div>')}
            </div>

            <!-- 图表第二行 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${this.card(this.chartTitle(this.currentRole === 'admin' ? '区域绘本活动次数' : '园所绘本活动次数', 'bg-cyan-500') + '<div id="weekly-activity-chart" class="h-72"></div>')}
                ${this.card(this.chartTitle('绘本活动次数排名前十教师', 'bg-purple-500') + '<div id="teacher-ranking-chart" class="h-72"></div>')}
            </div>

            ${this.currentRole === 'admin' ? this.card(this.renderAdminClassUsageComparison(overviewData.classUsageComparison), 'overflow-hidden') : ''}

            <!-- 绘本排行表格（管理员不可见） -->
            ${this.currentRole !== 'admin' ? this.card(this.chartTitle('阅读次数排名前十绘本', 'bg-indigo-500') + '<div id="book-ranking-table-wrap"></div>') : ''}
        </div>`;
    },

    renderDataOverviewRankings(customBookRanking = null) {
        const range = this.dateRanges.dataOverview;
        const days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        const el = document.getElementById('overview-date');
        if (el) el.textContent = `${range.startDate} 至 ${range.endDate}`;

        const wrap = document.getElementById('book-ranking-table-wrap');
        if (!wrap) return;
        const headers = [
            { label: '排名', align: 'text-center' },
            { label: '绘本名称' },
            { label: '类型' },
            { label: '阅读次数', align: 'text-center' },
            { label: '阅读时长', align: 'text-center' }
        ];
        const bookRanking = customBookRanking || MockData.bookRanking;
        const rows = bookRanking.map((book, i) => `
            <tr class="hover:bg-blue-500/5 transition-colors cursor-pointer">
                <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${i < 3 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400'}">${book.rank}</span></td>
                <td class="px-4 py-3 font-medium text-slate-200">《${book.name}》</td>
                <td class="px-4 py-3">${this.badge(book.type)}</td>
                <td class="px-4 py-3 text-center text-blue-400 font-semibold">${book.reads}</td>
                <td class="px-4 py-3 text-center text-slate-400">${book.duration}</td>
            </tr>
        `).join('');
        wrap.innerHTML = this.tableWrap(headers, rows);
    },

    renderKindergartenActivityRanking() {
        if (this.currentRole !== 'admin') return;

        const pageContainer = document.getElementById('page-container');
        if (!pageContainer) return;

        let wrap = document.getElementById('kindergarten-ranking-wrap');
        if (!wrap) {
            const section = document.createElement('section');
            section.className = 'bg-slate-600/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-500/35 hover:border-blue-400/30 transition-all duration-300 overflow-hidden';
            section.innerHTML = `
                <div class="flex items-center justify-between gap-3 mb-4">
                    ${this.chartTitle('园所活动次数排序', 'bg-cyan-500')}
                    <div class="text-xs text-slate-400 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10">全区园所活动热力对比</div>
                </div>
                <div id="kindergarten-ranking-wrap"></div>
            `;
            pageContainer.appendChild(section);
            wrap = section.querySelector('#kindergarten-ranking-wrap');
        }

        const ranking = this.getKindergartenActivityRanking();
        const maxCount = ranking[0]?.activityCount || 1;
        wrap.innerHTML = `
            <div class="space-y-3">
                ${ranking.map((item, index) => `
                    <div class="grid grid-cols-[56px_minmax(0,1.6fr)_minmax(0,1fr)_120px] items-center gap-3 px-4 py-3 rounded-xl border border-slate-500/20 bg-slate-800/35 hover:border-cyan-400/30 hover:bg-slate-700/35 transition-all">
                        <div class="flex items-center justify-center">
                            <span class="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${index < 3 ? 'bg-amber-500/20 text-amber-300 border border-amber-400/20' : 'bg-slate-700/70 text-slate-300 border border-slate-500/20'}">${index + 1}</span>
                        </div>
                        <div class="min-w-0">
                            <div class="text-sm font-semibold text-white truncate">${item.name}</div>
                            <div class="text-xs text-slate-400 truncate">${item.district} · ${item.classCount} 班 · ${item.teacherCount} 教师 · ${item.studentCount} 幼儿</div>
                        </div>
                        <div class="min-w-0">
                            <div class="h-2 rounded-full bg-slate-700/70 overflow-hidden">
                                <div class="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" style="width: ${Math.max(12, item.activityCount / maxCount * 100)}%"></div>
                            </div>
                            <div class="text-xs text-slate-400 mt-1"></div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-cyan-300">${item.activityCount}</div>
                            <div class="text-xs text-slate-500">活动次数</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // ============================================================
    //  页面2：园所数据（7个标签页）
    // ============================================================
    renderSchoolDataPage() {
        // 基础标签页（园长和教师可见）
        const baseTabs = [
            { id: 'overview', label: '数据概述', icon: '📊' },
            { id: 'activities', label: '绘本活动', icon: '📚' },
            { id: 'books', label: '绘本', icon: '📖' },
            { id: 'classes', label: '班级', icon: '🏫' },
            { id: 'teachers', label: '教师', icon: '👩‍🏫' },
            { id: 'students', label: '幼儿', icon: '👶' }
        ];

        // 教育局管理员：未选学校时只显示全区数据概览和学校筛选，选了学校后显示完整标签
        let tabs;
        if (this.currentRole === 'admin') {
            if (!this.selectedSchool) {
                tabs = [
                    { id: 'overview', label: '全区数据概览', icon: '📊' },
                    { id: 'schools', label: '学校筛选', icon: '🏫' }
                ];
            } else {
                tabs = baseTabs;
            }
        } else {
            tabs = baseTabs;
        }

        // 角色相关标题和选择器
        let titleText;
        let scopeSelector = '';

        if (this.currentRole === 'admin') {
            if (this.selectedSchool) {
                titleText = `${this.selectedSchool.name}数据统计`;
                scopeSelector = `
                    <span class="role-badge admin">🏫 ${this.selectedSchool.name}</span>
                    <button onclick="App.clearSelectedSchool()" class="px-3 py-1.5 rounded-lg bg-slate-600/50 border border-slate-500/30 text-slate-300 text-sm hover:bg-slate-500/50 hover:text-white transition-all flex items-center gap-1.5">
                        <span>←</span> 返回学校筛选
                    </button>
                `;
            } else {
                titleText = '全区园所综合数据统计';
                scopeSelector = `<span class="role-badge admin">👔 全区数据</span>`;
            }
        } else if (this.currentRole === 'principal') {
            titleText = this.selectedSchool ? `${this.selectedSchool.name}数据统计` : '园所数据统计';
            scopeSelector = `<span class="role-badge principal">🏫 ${this.selectedSchool ? this.selectedSchool.name : '本园'}</span>`;
        } else if (this.currentRole === 'teacher') {
            titleText = this.selectedClass ? `${this.selectedClass.name}数据统计` : '班级数据统计';
            scopeSelector = `<span class="role-badge teacher">👩‍🏫 ${this.selectedClass ? this.selectedClass.name : '本班'}</span>`;
        }

        return `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">${titleText}</h2>
                <div class="flex items-center gap-3">
                    ${scopeSelector}
                </div>
            </div>
            <div class="bg-slate-600/50 backdrop-blur-sm rounded-2xl border border-slate-500/35 overflow-hidden">
                <!-- 标签页导航 -->
                <div class="flex justify-center items-center border-b border-slate-500/35 overflow-x-auto bg-slate-700/40">
                    ${tabs.map(tab => `
                        <button class="school-tab flex-1 min-w-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${tab.id === this.schoolDataTab ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/30'}" data-tab="${tab.id}" onclick="App.switchSchoolTab('${tab.id}')">
                            <span class="text-xs">${tab.icon}</span>${tab.label}
                        </button>
                    `).join('')}
                </div>
                <div id="school-tab-content" class="p-5"></div>
            </div>
        </div>`;
    },

    getSchoolTabClass(isActive) {
        return `school-tab px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all flex items-center justify-center gap-1.5 rounded-2xl border ${isActive ? 'text-cyan-200 border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.12)]' : 'text-slate-400 border-slate-500/20 bg-slate-800/30 hover:text-slate-200 hover:border-slate-400/30 hover:bg-slate-700/30'}`;
    },

    enhanceSchoolDataLayout() {
        const root = document.querySelector('#page-container > .space-y-6');
        if (!root) return;

        const header = root.children[0];
        if (header) {
            header.className = 'relative overflow-hidden rounded-[28px] border border-cyan-400/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] p-6 lg:p-7 shadow-[0_24px_80px_rgba(2,6,23,0.35)] flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5';
            if (!header.querySelector('.school-hero-grid')) {
                const grid = document.createElement('div');
                grid.className = 'school-hero-grid absolute inset-0 opacity-20 pointer-events-none';
                grid.style.backgroundImage = 'linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px),linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)';
                grid.style.backgroundSize = '24px 24px';
                header.prepend(grid);
            }
            const title = header.querySelector('h2');
            if (title) {
                title.className = 'text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent';
                const scopeWrap = title.nextElementSibling;
                if (scopeWrap) scopeWrap.classList.add('relative');
            }
        }

        const panel = root.children[1];
        if (panel) {
            panel.className = 'rounded-[28px] border border-slate-500/30 bg-slate-900/35 backdrop-blur-md overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.24)]';
            const nav = panel.children[0];
            if (nav) {
                nav.className = 'flex flex-wrap justify-center items-center gap-2 px-4 pt-4 pb-2 border-b border-slate-500/25 bg-[linear-gradient(180deg,rgba(15,23,42,0.4),rgba(15,23,42,0.08))] overflow-x-auto';
            }
            const content = document.getElementById('school-tab-content');
            if (content) {
                content.className = 'p-5 lg:p-6 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_28%)]';
            }
        }

        document.querySelectorAll('.school-tab').forEach(tab => {
            tab.className = this.getSchoolTabClass(tab.dataset.tab === this.schoolDataTab);
        });
    },

    switchSchoolTab(tabId) {
        this.schoolDataTab = tabId;
        document.querySelectorAll('.school-tab').forEach(tab => {
            const isActive = tab.dataset.tab === tabId;
            tab.className = this.getSchoolTabClass(isActive);
        });
        this.renderSchoolTabContent(tabId);
    },

    initSchoolDataPage() {
        this.enhanceSchoolDataLayout();
        // 教育局管理员：默认显示全区数据概览
        let defaultTab;
        if (this.currentRole === 'admin') {
            defaultTab = this.selectedSchool ? 'overview' : 'overview';
        } else {
            defaultTab = this.schoolDataTab || 'overview';
        }
        this.schoolDataTab = defaultTab;
        this.renderSchoolTabContent(defaultTab);
    },

    renderSchoolTabContent(tabId) {
        const container = document.getElementById('school-tab-content');
        if (!container) return;
        Charts.dispose();
        switch (tabId) {
            case 'schools': container.innerHTML = this.renderSchoolsView(); break;
            case 'overview':
                container.innerHTML = this.renderSchoolOverview();
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => this.initSchoolOverviewCharts());
                });
                break;
            case 'activities': container.innerHTML = this.renderSchoolActivities(); break;
            case 'books': container.innerHTML = this.renderSchoolBooks(); break;
            case 'classes': container.innerHTML = this.renderSchoolClasses(); break;
            case 'teachers': container.innerHTML = this.renderSchoolTeachers(); break;
            case 'students': container.innerHTML = this.renderSchoolStudents(); break;
            case 'devices': container.innerHTML = this.renderSchoolDevices(); break;
        }
    },

    // 学校视图（教育局管理员专属）
    renderSchoolsView() {
        const schools = MockData.kindergartens;
        const usageData = MockData.kindergartenClassUsageComparison;

        return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                ${schools.map(school => {
                    const usage = usageData.find(u => u.kindergartenId === school.id) || {};
                    return `
                    <div class="school-card group relative overflow-hidden rounded-2xl border border-slate-500/30 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-5 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300">
                        <!-- 背景装饰 -->
                        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-2xl"></div>

                        <!-- 学校标识 -->
                        <div class="relative flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center text-2xl shadow-lg">
                                🏫
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">${school.name}</h3>
                                <p class="text-xs text-slate-400">${school.district}</p>
                            </div>
                        </div>

                        <!-- 基础信息 -->
                        <div class="relative grid grid-cols-3 gap-3 mb-4">
                            <div class="bg-slate-700/40 rounded-lg p-3 text-center border border-slate-600/30">
                                <div class="text-2xl font-bold text-cyan-400">${school.classCount}</div>
                                <div class="text-xs text-slate-400 mt-1">班级数</div>
                            </div>
                            <div class="bg-slate-700/40 rounded-lg p-3 text-center border border-slate-600/30">
                                <div class="text-2xl font-bold text-emerald-400">${school.studentCount}</div>
                                <div class="text-xs text-slate-400 mt-1">幼儿数</div>
                            </div>
                            <div class="bg-slate-700/40 rounded-lg p-3 text-center border border-slate-600/30">
                                <div class="text-2xl font-bold text-purple-400">${school.teacherCount}</div>
                                <div class="text-xs text-slate-400 mt-1">教师数</div>
                            </div>
                        </div>

                        <!-- 活动数据 -->
                        <div class="relative bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
                            <div class="text-xs text-slate-400 mb-3 flex items-center gap-2">
                                <span class="text-amber-400">📊</span> 活动统计
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <div class="text-sm text-slate-400">平均活动次数</div>
                                    <div class="text-lg font-semibold text-white">${(usage.avgActivityCount || 0).toFixed(1)}<span class="text-xs text-slate-500 ml-1">次/班</span></div>
                                </div>
                                <div>
                                    <div class="text-sm text-slate-400">平均活动时长</div>
                                    <div class="text-lg font-semibold text-white">${(usage.avgActivityDuration || 0).toFixed(1)}<span class="text-xs text-slate-500 ml-1">h/班</span></div>
                                </div>
                                <div>
                                    <div class="text-sm text-slate-400">设备使用次数</div>
                                    <div class="text-lg font-semibold text-white">${(usage.avgDeviceUseCount || 0).toFixed(1)}<span class="text-xs text-slate-500 ml-1">次/班</span></div>
                                </div>
                                <div>
                                    <div class="text-sm text-slate-400">平均参与人数</div>
                                    <div class="text-lg font-semibold text-white">${(usage.avgParticipantCount || 0).toFixed(1)}<span class="text-xs text-slate-500 ml-1">人/次</span></div>
                                </div>
                            </div>
                        </div>

                        <!-- 操作按钮 -->
                        <div class="relative mt-4 flex justify-end">
                            <button onclick="App.viewSchoolDetail(${school.id})" class="px-4 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-sm font-medium hover:bg-cyan-400/20 hover:border-cyan-400/30 transition-all flex items-center gap-2">
                                <span>查看详情</span>
                                <span class="text-xs">→</span>
                            </button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>`;
    },

    // 查看学校详情
    viewSchoolDetail(schoolId) {
        const school = MockData.kindergartens.find(k => k.id === schoolId);
        if (school) {
            this.selectedSchool = school;
            this.schoolDataTab = 'overview';
            this.loadPage('schoolData');
        }
    },

    // 返回学校筛选（教育局管理员）
    clearSelectedSchool() {
        this.selectedSchool = null;
        this.schoolDataTab = 'schools';
        this.loadPage('schoolData');
    },

    // 园所数据 - 数据概述
    renderSchoolOverview() {
        const d = this.getSchoolOverviewDataForCurrentRange();
        const recommendations = this.getSchoolOverviewBookRecommendations();
        // 教育局管理员显示"全区"，其他角色显示"园所"
        const scopeLabel = this.currentRole === 'admin' && !this.selectedSchool ? '全区' : '园所';
        return `
        <div class="space-y-6">
            ${this.renderDateFilterBar('schoolOverview')}
            <div>
                ${this.chartTitle(scopeLabel + '绘本活动概览', 'bg-blue-500')}
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    ${this.miniStat('绘本活动总次数', d.activityTotal, 'blue')}
                    ${this.miniStat('绘本活动总时长', d.activityDuration + 'h', 'emerald')}
                    ${this.miniStat('绘本阅读总数', d.bookTotal, 'purple')}
                    ${this.miniStat('绘本阅读次数', d.bookReadCount, 'amber')}
                </div>
            </div>
            <div>
                ${this.chartTitle('绘本分类阅读数据', 'bg-emerald-500')}
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    ${d.categoryData.map(cat => `
                        <div class="bg-slate-700/50 rounded-xl p-3 flex items-center justify-between border border-slate-500/30 hover:border-blue-400/30 transition-colors">
                            <div><div class="text-sm font-medium text-slate-200">${cat.name}</div><div class="text-xs text-slate-500 mt-0.5">阅读时长 ${cat.duration}</div></div>
                            <div class="text-lg font-bold text-blue-400">${cat.readCount}<span class="text-xs text-slate-500 ml-1">次</span></div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    ${this.chartTitle(scopeLabel + '设备概况', 'bg-cyan-500')}
                    <div class="grid grid-cols-3 gap-3">
                        ${this.miniStat('设备总数', d.deviceTotal, 'cyan')}
                        ${this.miniStat('使用次数', d.deviceUseCount, 'cyan')}
                        ${this.miniStat('使用时长', d.deviceUseDuration + 'h', 'cyan')}
                    </div>
                </div>
                <div>
                    ${this.chartTitle(scopeLabel + '基础信息', 'bg-amber-500')}
                    <div class="grid grid-cols-3 gap-3">
                        ${this.miniStat('班级总数', d.classTotal, 'amber')}
                        ${this.miniStat('教师总数', d.teacherTotal, 'amber')}
                        ${this.miniStat('幼儿总数', d.studentTotal, 'amber')}
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-slate-700/40 rounded-xl p-4 border border-slate-500/30">
                    <h4 class="text-sm font-medium text-slate-300 mb-2">绘本分类阅读次数占比</h4>
                    <div id="school-category-pie" class="h-64"></div>
                </div>
                <div class="bg-slate-700/40 rounded-xl p-4 border border-slate-500/30">
                    <h4 class="text-sm font-medium text-slate-300 mb-2">各分类阅读时长分布</h4>
                    <div id="school-category-bar" class="h-64"></div>
                </div>
            </div>
            ${this.currentRole !== 'admin' ? this.card(`
                <div class="flex items-center justify-between gap-3 mb-4">
                    ${this.chartTitle('绘本推荐栏', 'bg-rose-500')}
                    <div class="text-xs text-slate-400 px-3 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/10">${this.currentRole === 'principal' ? '园所视角推荐' : '班级视角推荐'}</div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    ${recommendations.map(book => `
                        <div class="rounded-2xl border border-slate-500/25 bg-slate-800/40 p-4 hover:border-rose-400/30 hover:bg-slate-700/40 transition-all">
                            <div class="flex items-start justify-between gap-3 mb-3">
                                <div class="w-11 h-14 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/20 flex items-center justify-center text-lg">📖</div>
                                ${this.badge(book.highlight, book.highlight === '优先推荐' ? 'red' : book.highlight === '高热度' ? 'amber' : 'purple')}
                            </div>
                            <div class="text-white font-semibold leading-6 mb-2">${book.name}</div>
                            <div class="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                ${this.badge(book.type, 'blue')}
                                <span>阅读 ${book.readCount} 次</span>
                            </div>
                            <p class="text-sm text-slate-300 leading-6">${book.reason}</p>
                        </div>
                    `).join('')}
                </div>
            `) : ''}
        </div>`;
    },

    initSchoolOverviewCharts() {
        const d = this.getSchoolOverviewDataForCurrentRange();
        Charts.safeInit(() => Charts.initSchoolCategoryPie(d.categoryData));
        Charts.safeInit(() => Charts.initSchoolCategoryBar(d.categoryData));
    },

    // 园所数据 - 绘本活动
    renderSchoolActivities() {
        const f = this.filters.activities;
        const p = this.pagination.activities;
        let data = MockData.schoolData.activities;
        if (f.className) data = data.filter(a => a.className.includes(f.className));
        if (f.teacher) data = data.filter(a => a.teacher.includes(f.teacher));
        if (f.startTime) data = data.filter(a => a.endTime >= f.startTime);
        if (f.endTime) data = data.filter(a => a.endTime <= f.endTime + ' 23:59:59');
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page - 1) * p.pageSize, p.page * p.pageSize);

        const classOptions = '<option value="">全部</option>' + [...new Set(MockData.schoolData.activities.map(a => a.className))].map(c => `<option value="${c}" ${f.className===c?'selected':''}>${c}</option>`).join('');

        const headers = [
            { label: '序号' }, { label: '活动开始时间' }, { label: '活动结束时间' },
            { label: '教师' }, { label: '参与班级' }, { label: '参与幼儿', align: 'text-center' }, { label: '操作', align: 'text-center' }
        ];
        const rows = pageData.map((a, i) => `
            <tr class="hover:bg-blue-500/5 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 text-slate-300">${a.startTime}</td>
                <td class="px-4 py-3 text-slate-300">${a.endTime}</td>
                <td class="px-4 py-3 text-slate-200">${a.teacher}</td>
                <td class="px-4 py-3 text-slate-200">${a.className}</td>
                <td class="px-4 py-3 text-center text-slate-300">${a.studentCount}人</td>
                <td class="px-4 py-3 text-center"><button class="text-blue-400 hover:text-blue-300 text-sm" onclick="App.viewActivityDetail(${a.id})">查看</button></td>
            </tr>
        `).join('');

        return `
        <div>
            ${this.filterBar(`
                <div><label class="block text-xs text-slate-500 mb-1">活动结束时间（起）</label><input type="date" class="bg-slate-800/80 border border-slate-600/50 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500/40 outline-none" value="${f.startTime}" onchange="App.filters.activities.startTime=this.value"></div>
                <div><label class="block text-xs text-slate-500 mb-1">活动结束时间（止）</label><input type="date" class="bg-slate-800/80 border border-slate-600/50 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500/40 outline-none" value="${f.endTime}" onchange="App.filters.activities.endTime=this.value"></div>
                ${this.filterSelect('参与班级', classOptions, `onchange="App.filters.activities.className=this.value"`)}
                ${this.filterInput('教师', `placeholder="请输入教师姓名" value="${f.teacher}" oninput="App.filters.activities.teacher=this.value"`)}
                ${this.btnPrimary('查询', "App.pagination.activities.page=1;App.renderSchoolTabContent('activities')")}
                ${this.btnSecondary('重置', "App.filters.activities={startTime:'',endTime:'',className:'',teacher:''};App.pagination.activities.page=1;App.renderSchoolTabContent('activities')")}
            `)}
            ${this.tableWrap(headers, rows)}
            ${this.renderPagination(total, p.page, totalPages, 'activities')}
        </div>`;
    },

    // 园所数据 - 绘本
    renderSchoolBooks() {
        const f = this.filters.books;
        const p = this.pagination.books;
        let data = MockData.schoolData.books;
        if (f.type) data = data.filter(b => b.type.includes(f.type));
        if (f.name) data = data.filter(b => b.name.includes(f.name));
        if (f.isbn) data = data.filter(b => b.isbn.includes(f.isbn));
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);

        const typeOptions = '<option value="">全部</option>' + ['日常生活','人际交往','情商品格','国学文化','科普百科','语言学习'].map(t => `<option value="${t}" ${f.type===t?'selected':''}>${t}</option>`).join('');
        const headers = [{ label: '序号' },{ label: '绘本名称' },{ label: 'ISBN号' },{ label: '绘本类型' },{ label: '阅读次数', align: 'text-center' },{ label: '阅读时长', align: 'text-center' },{ label: '操作', align: 'text-center' }];
        const rows = pageData.map((b,i) => `
            <tr class="hover:bg-blue-500/5 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${b.name}</td>
                <td class="px-4 py-3 text-slate-500 text-xs">${b.isbn}</td>
                <td class="px-4 py-3">${this.badge(b.type)}</td>
                <td class="px-4 py-3 text-center text-blue-400 font-semibold">${b.readCount}</td>
                <td class="px-4 py-3 text-center text-slate-400">${b.readDuration}</td>
                <td class="px-4 py-3 text-center"><button class="text-blue-400 hover:text-blue-300 text-sm" onclick="App.viewBookDetail(${b.id})">查看</button></td>
            </tr>`).join('');

        return `<div>
            ${this.filterBar(`
                ${this.filterSelect('绘本类型', typeOptions, `onchange="App.filters.books.type=this.value"`)}
                ${this.filterInput('绘本名称', `placeholder="请输入绘本名称" value="${f.name}" oninput="App.filters.books.name=this.value"`)}
                ${this.filterInput('ISBN号', `placeholder="请输入ISBN号" value="${f.isbn}" oninput="App.filters.books.isbn=this.value"`)}
                ${this.btnPrimary('查询', "App.pagination.books.page=1;App.renderSchoolTabContent('books')")}
                ${this.btnSecondary('重置', "App.filters.books={type:'',name:'',isbn:''};App.pagination.books.page=1;App.renderSchoolTabContent('books')")}
            `)}
            ${this.tableWrap(headers, rows)}
            ${this.renderPagination(total, p.page, totalPages, 'books')}
        </div>`;
    },

    // 园所数据 - 班级
    renderSchoolClasses() {
        const p = this.pagination.classes;
        const data = MockData.classes;
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);
        const headers = [{label:'序号'},{label:'班级'},{label:'教师数量',align:'text-center'},{label:'幼儿数量',align:'text-center'},{label:'活动总次数',align:'text-center'},{label:'活动总时长',align:'text-center'},{label:'设备使用次数',align:'text-center'},{label:'参与总人次',align:'text-center'},{label:'操作',align:'text-center'}];
        const rows = pageData.map((c,i) => `
            <tr class="hover:bg-blue-500/5 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${c.name}</td>
                <td class="px-4 py-3 text-center text-slate-300">${c.teacherCount}</td>
                <td class="px-4 py-3 text-center text-slate-300">${c.studentCount}</td>
                <td class="px-4 py-3 text-center text-blue-400 font-semibold">${c.activityCount}</td>
                <td class="px-4 py-3 text-center text-slate-300">${c.activityDuration}</td>
                <td class="px-4 py-3 text-center text-slate-300">${c.deviceUseCount}</td>
                <td class="px-4 py-3 text-center text-slate-300">${c.participantCount}</td>
                <td class="px-4 py-3 text-center"><button class="text-blue-400 hover:text-blue-300 text-sm" onclick="App.viewClassDetail(${c.id})">查看</button></td>
            </tr>`).join('');
        return `<div>${this.tableWrap(headers, rows)}${this.renderPagination(total, p.page, totalPages, 'classes')}</div>`;
    },

    // 园所数据 - 教师
    renderSchoolTeachers() {
        const f = this.filters.teachers;
        const p = this.pagination.teachers;
        let data = MockData.schoolData.teachers;
        if (f.name) data = data.filter(t => t.name.includes(f.name));
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);
        const headers = [{label:'序号'},{label:'教师姓名'},{label:'绘本活动次数',align:'text-center'},{label:'绘本活动时长',align:'text-center'},{label:'操作',align:'text-center'}];
        const rows = pageData.map((t,i) => `
            <tr class="hover:bg-blue-500/5 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${t.name}</td>
                <td class="px-4 py-3 text-center text-blue-400 font-semibold">${t.activityCount}</td>
                <td class="px-4 py-3 text-center text-slate-300">${t.activityDuration}</td>
                <td class="px-4 py-3 text-center"><button class="text-blue-400 hover:text-blue-300 text-sm" onclick="App.viewTeacherActivities('${t.name}')">查看绘本活动记录</button></td>
            </tr>`).join('');
        return `<div>
            ${this.filterBar(`
                ${this.filterInput('教师姓名', `placeholder="请输入教师姓名" value="${f.name}" oninput="App.filters.teachers.name=this.value"`)}
                ${this.btnPrimary('查询', "App.pagination.teachers.page=1;App.renderSchoolTabContent('teachers')")}
                ${this.btnSecondary('重置', "App.filters.teachers={name:''};App.pagination.teachers.page=1;App.renderSchoolTabContent('teachers')")}
            `)}
            ${this.tableWrap(headers, rows)}
            ${this.renderPagination(total, p.page, totalPages, 'teachers')}
        </div>`;
    },

    // 园所数据 - 幼儿
    renderSchoolStudents() {
        const f = this.filters.students;
        const p = this.pagination.students;
        let data = MockData.students;
        if (f.name) data = data.filter(s => s.name.includes(f.name));
        if (f.className) data = data.filter(s => s.className.includes(f.className));
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);
        const classOptions = '<option value="">全部</option>' + [...new Set(MockData.students.map(s => s.className))].map(c => `<option value="${c}" ${f.className===c?'selected':''}>${c}</option>`).join('');
        const headers = [{label:'序号'},{label:'幼儿姓名'},{label:'幼儿编号'},{label:'所属班级'},{label:'参与活动次数',align:'text-center'},{label:'参与活动时长',align:'text-center'},{label:'绘本阅读总数',align:'text-center'},{label:'操作',align:'text-center'}];
        const rows = pageData.map((s,i) => `
            <tr class="hover:bg-blue-500/5 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${s.name}</td>
                <td class="px-4 py-3 text-slate-500 text-xs">${s.code}</td>
                <td class="px-4 py-3 text-slate-300">${s.className}</td>
                <td class="px-4 py-3 text-center text-blue-400 font-semibold">${s.activityCount}</td>
                <td class="px-4 py-3 text-center text-slate-300">${s.activityDuration}</td>
                <td class="px-4 py-3 text-center text-slate-300">${s.bookCount}</td>
                <td class="px-4 py-3 text-center"><button class="text-blue-400 hover:text-blue-300 text-sm" onclick="App.viewStudentReport(${s.id})">查看阅读报告</button></td>
            </tr>`).join('');
        return `<div>
            ${this.filterBar(`
                ${this.filterInput('幼儿姓名', `placeholder="请输入幼儿姓名" value="${f.name}" oninput="App.filters.students.name=this.value"`)}
                ${this.filterSelect('所属班级', classOptions, `onchange="App.filters.students.className=this.value"`)}
                ${this.btnPrimary('查询', "App.pagination.students.page=1;App.renderSchoolTabContent('students')")}
                ${this.btnSecondary('重置', "App.filters.students={name:'',className:''};App.pagination.students.page=1;App.renderSchoolTabContent('students')")}
            `)}
            ${this.tableWrap(headers, rows)}
            ${this.renderPagination(total, p.page, totalPages, 'students')}
        </div>`;
    },

    // 园所数据 - 设备
    renderSchoolDevices() {
        const f = this.filters.devices;
        const p = this.pagination.devices;
        let data = MockData.devices;
        if (f.sn) data = data.filter(d => d.sn.includes(f.sn));
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);
        const headers = [{label:'序号'},{label:'设备SN号'},{label:'设备编号'},{label:'使用次数',align:'text-center'},{label:'使用时长',align:'text-center'},{label:'最近使用时间',align:'text-center'}];
        const rows = pageData.map((d,i) => `
            <tr class="hover:bg-blue-500/5 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${d.sn}</td>
                <td class="px-4 py-3 text-slate-400">${d.code}</td>
                <td class="px-4 py-3 text-center text-blue-400 font-semibold">${d.useCount}</td>
                <td class="px-4 py-3 text-center text-slate-300">${d.useDuration}</td>
                <td class="px-4 py-3 text-center text-slate-500">${d.lastUseTime}</td>
            </tr>`).join('');
        return `<div>
            ${this.filterBar(`
                ${this.filterInput('设备SN号', `placeholder="请输入设备SN号" value="${f.sn}" oninput="App.filters.devices.sn=this.value"`)}
                ${this.btnPrimary('查询', "App.pagination.devices.page=1;App.renderSchoolTabContent('devices')")}
                ${this.btnSecondary('重置', "App.filters.devices={sn:''};App.pagination.devices.page=1;App.renderSchoolTabContent('devices')")}
            `)}
            ${this.tableWrap(headers, rows)}
            ${this.renderPagination(total, p.page, totalPages, 'devices')}
        </div>`;
    },

    // ============================================================
    //  页面3：用户管理
    // ============================================================
    renderUserManagePage() {
        const f = this.filters.users;
        const p = this.pagination.users;
        let data = MockData.users;
        if (f.account) data = data.filter(u => u.account.includes(f.account));
        if (f.role) data = data.filter(u => u.role === f.role);
        if (f.status) data = data.filter(u => u.status === f.status);
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);

        const roleOptions = '<option value="">全部</option><option value="管理员"'+(f.role==='管理员'?' selected':'')+'>管理员</option><option value="园长"'+(f.role==='园长'?' selected':'')+'>园长</option><option value="教师"'+(f.role==='教师'?' selected':'')+'>教师</option><option value="家长"'+(f.role==='家长'?' selected':'')+'>家长</option>';
        const statusOptions = '<option value="">全部</option><option value="启用"'+(f.status==='启用'?' selected':'')+'>启用</option><option value="停用"'+(f.status==='停用'?' selected':'')+'>停用</option>';

        const roleColor = r => r==='管理员'?'red':r==='园长'?'purple':r==='教师'?'blue':'green';
        const headers = [{label:'序号'},{label:'账号'},{label:'姓名'},{label:'角色'},{label:'手机号'},{label:'状态',align:'text-center'},{label:'创建时间',align:'text-center'},{label:'操作',align:'text-center'}];
        const rows = pageData.map((u,i) => `
            <tr class="hover:bg-blue-500/5 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${u.account}</td>
                <td class="px-4 py-3 text-slate-300">${u.name}</td>
                <td class="px-4 py-3">${this.badge(u.role, roleColor(u.role))}</td>
                <td class="px-4 py-3 text-slate-400">${u.phone}</td>
                <td class="px-4 py-3 text-center">${this.badge(u.status, u.status==='启用'?'green':'red')}</td>
                <td class="px-4 py-3 text-center text-slate-500 text-xs">${u.createTime}</td>
                <td class="px-4 py-3 text-center">
                    <button class="text-blue-400 hover:text-blue-300 text-sm mr-2" onclick="App.editUser(${u.id})">编辑</button>
                    <button class="text-amber-400 hover:text-amber-300 text-sm mr-2" onclick="App.toggleUserStatus(${u.id})">${u.status==='启用'?'停用':'启用'}</button>
                    <button class="text-slate-400 hover:text-slate-300 text-sm" onclick="App.resetPassword(${u.id})">重置密码</button>
                </td>
            </tr>`).join('');

        return `
        <div class="space-y-6">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">用户管理</h2>
            ${this.card(`
                ${this.filterBar(`
                    ${this.filterInput('账号', `placeholder="请输入账号" value="${f.account}" oninput="App.filters.users.account=this.value"`)}
                    ${this.filterSelect('角色', roleOptions, `onchange="App.filters.users.role=this.value"`)}
                    ${this.filterSelect('状态', statusOptions, `onchange="App.filters.users.status=this.value"`)}
                    ${this.btnPrimary('查询', "App.pagination.users.page=1;App.loadPage('userManage')")}
                    ${this.btnSecondary('重置', "App.filters.users={account:'',role:'',status:''};App.pagination.users.page=1;App.loadPage('userManage')")}
                    <div class="flex-1"></div>
                    ${this.btnSuccess('新增用户', "App.showAddUserModal()")}
                `)}
                ${this.tableWrap(headers, rows)}
                ${this.renderPagination(total, p.page, totalPages, 'users', true)}
            `)}
        </div>`;
    },

    // ============================================================
    //  页面4：设备管理
    // ============================================================
    renderDeviceManagePage() {
        const p = this.pagination.devices;
        const data = MockData.devices;
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);
        const onlineCount = data.filter(d => d.status==='在线').length;
        const offlineCount = data.filter(d => d.status==='离线').length;
        const totalUse = data.reduce((s,d) => s+d.useCount, 0);

        const headers = [{label:'序号'},{label:'设备SN号'},{label:'设备编号'},{label:'状态',align:'text-center'},{label:'绑定园所'},{label:'绑定班级'},{label:'使用次数',align:'text-center'},{label:'使用时长',align:'text-center'},{label:'最近使用',align:'text-center'},{label:'操作',align:'text-center'}];
        const rows = pageData.map((d,i) => `
            <tr class="hover:bg-blue-500/5 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${d.sn}</td>
                <td class="px-4 py-3 text-slate-400">${d.code}</td>
                <td class="px-4 py-3 text-center"><span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${d.status==='在线'?'bg-emerald-500/15 text-emerald-400 border-emerald-500/20':'bg-red-500/15 text-red-400 border-red-500/20'}"><span class="w-1.5 h-1.5 rounded-full ${d.status==='在线'?'bg-emerald-400':'bg-red-400'}"></span>${d.status}</span></td>
                <td class="px-4 py-3 text-slate-300">${d.bindSchool}</td>
                <td class="px-4 py-3 text-slate-300">${d.bindClass}</td>
                <td class="px-4 py-3 text-center text-blue-400 font-semibold">${d.useCount}</td>
                <td class="px-4 py-3 text-center text-slate-300">${d.useDuration}</td>
                <td class="px-4 py-3 text-center text-slate-500 text-xs">${d.lastUseTime}</td>
                <td class="px-4 py-3 text-center">
                    <button class="text-blue-400 hover:text-blue-300 text-sm mr-2" onclick="App.editDevice(${d.id})">编辑</button>
                    <button class="text-amber-400 hover:text-amber-300 text-sm" onclick="App.unbindDevice(${d.id})">解绑</button>
                </td>
            </tr>`).join('');

        return `
        <div class="space-y-6">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">设备管理</h2>
            <!-- 设备概览 -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                ${this.miniStat('设备总数', data.length, 'blue')}
                ${this.miniStat('在线设备', onlineCount, 'emerald')}
                ${this.miniStat('离线设备', offlineCount, 'amber')}
                ${this.miniStat('总使用次数', totalUse, 'cyan')}
            </div>
            ${this.card(`
                ${this.filterBar(`
                    ${this.filterInput('设备SN号', 'placeholder="请输入设备SN号" id="device-sn-filter"')}
                    ${this.filterSelect('设备状态', '<option value="">全部</option><option value="在线">在线</option><option value="离线">离线</option>', 'id="device-status-filter"')}
                    ${this.btnPrimary('查询', "App.showToast('查询成功','success')")}
                    ${this.btnSecondary('重置', "App.showToast('已重置','info')")}
                    <div class="flex-1"></div>
                    ${this.btnSuccess('添加设备', "App.showAddDeviceModal()")}
                `)}
                ${this.tableWrap(headers, rows)}
                ${this.renderPagination(total, p.page, totalPages, 'devices', true)}
            `)}
        </div>`;
    },

    // ============================================================
    //  通用分页组件
    // ============================================================
    renderPagination(total, currentPage, totalPages, dataKey, isTopLevel = false) {
        if (totalPages <= 1) return `<div class="mt-4 text-sm text-slate-500">共 ${total} 条记录</div>`;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) pages.push(i);
            else if (pages[pages.length - 1] !== '...') pages.push('...');
        }
        const onclick = isTopLevel
            ? `App.pagination.${dataKey}.page=PAGE;App.loadPage(App.currentPage)`
            : `App.pagination.${dataKey}.page=PAGE;App.renderSchoolTabContent('${dataKey}')`;

        return `
        <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-slate-500">共 ${total} 条记录，第 ${currentPage}/${totalPages} 页</div>
            <div class="flex items-center gap-1">
                <button class="px-3 py-1 rounded text-sm ${currentPage===1?'text-slate-600 cursor-not-allowed':'text-slate-400 hover:bg-slate-700/50 hover:text-white'}" ${currentPage===1?'disabled':''} onclick="${onclick.replace(/PAGE/g, currentPage-1)}">上一页</button>
                ${pages.map(p => p==='...'
                    ? '<span class="px-2 text-slate-600">...</span>'
                    : `<button class="w-8 h-8 rounded text-sm ${p===currentPage?'bg-blue-600 text-white shadow-lg shadow-blue-500/30':'text-slate-400 hover:bg-slate-700/50 hover:text-white'}" onclick="${onclick.replace(/PAGE/g, p)}">${p}</button>`
                ).join('')}
                <button class="px-3 py-1 rounded text-sm ${currentPage===totalPages?'text-slate-600 cursor-not-allowed':'text-slate-400 hover:bg-slate-700/50 hover:text-white'}" ${currentPage===totalPages?'disabled':''} onclick="${onclick.replace(/PAGE/g, currentPage+1)}">下一页</button>
            </div>
        </div>`;
    },

    // ============================================================
    //  详情弹窗（深色模态框）
    // ============================================================
    modalHeader(title) {
        return `<div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-white">${title}</h3><button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`;
    },

    modalInfoItem(label, value) {
        return `<div class="bg-slate-800/60 rounded-lg p-3 border border-slate-700/30"><span class="text-slate-500 text-sm">${label}：</span><span class="text-slate-200 font-medium">${value}</span></div>`;
    },

    viewActivityDetail(id) {
        const a = MockData.schoolData.activities.find(x => x.id === id);
        if (!a) return;
        this.openModal(`<div class="p-6">${this.modalHeader('绘本活动详情')}<div class="grid grid-cols-2 gap-3">${this.modalInfoItem('活动开始时间', a.startTime)}${this.modalInfoItem('活动结束时间', a.endTime)}${this.modalInfoItem('教师', a.teacher)}${this.modalInfoItem('参与班级', a.className)}<div class="col-span-2">${this.modalInfoItem('参与幼儿（'+a.studentCount+'人）', a.students.join('、'))}</div></div></div>`);
    },

    viewBookDetail(id) {
        const b = MockData.schoolData.books.find(x => x.id === id);
        if (!b) return;
        this.openModal(`<div class="p-6">${this.modalHeader('绘本详情')}<div class="flex gap-6"><div class="w-28 h-36 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-4xl border border-blue-500/20">📖</div><div class="flex-1 space-y-3"><div class="text-lg font-bold text-white">${b.name}</div><div class="text-sm text-slate-400">ISBN：${b.isbn}</div><div>${this.badge(b.type)}</div><div class="text-sm"><span class="text-slate-500">阅读次数：</span><span class="text-blue-400 font-bold text-lg">${b.readCount}</span><span class="text-slate-500 ml-1">次</span></div><div class="text-sm text-slate-400">阅读时长：${b.readDuration}</div></div></div></div>`);
    },

    viewClassDetail(id) {
        const cls = MockData.classes.find(c => c.id === id);
        if (!cls) return;
        const students = MockData.students.filter(s => s.classId === id);
        const headers = [{label:'姓名'},{label:'编号'},{label:'活动次数',align:'text-center'},{label:'阅读总数',align:'text-center'}];
        const rows = students.map(s => `<tr class="hover:bg-blue-500/5"><td class="px-3 py-2 text-slate-200">${s.name}</td><td class="px-3 py-2 text-slate-500 text-xs">${s.code}</td><td class="px-3 py-2 text-center text-blue-400">${s.activityCount}</td><td class="px-3 py-2 text-center text-slate-300">${s.bookCount}</td></tr>`).join('');
        this.openModal(`<div class="p-6">${this.modalHeader(cls.name + ' - 班级详情')}<div class="grid grid-cols-4 gap-3 mb-5">${this.miniStat('幼儿数', cls.studentCount, 'blue')}${this.miniStat('活动次数', cls.activityCount, 'emerald')}${this.miniStat('活动时长', cls.activityDuration, 'purple')}${this.miniStat('设备使用', cls.deviceUseCount, 'amber')}</div><h4 class="text-sm font-semibold text-slate-300 mb-3">班级幼儿列表</h4>${this.tableWrap(headers, rows)}${students.length===0?'<div class="text-center text-slate-500 py-6">暂无幼儿数据</div>':''}</div>`);
    },

    viewTeacherActivities(name) {
        const activities = MockData.schoolData.activities.filter(a => a.teacher === name).slice(0, 10);
        const headers = [{label:'开始时间'},{label:'结束时间'},{label:'班级'},{label:'参与人数',align:'text-center'}];
        const rows = activities.map(a => `<tr class="hover:bg-blue-500/5"><td class="px-3 py-2 text-slate-300 text-xs">${a.startTime}</td><td class="px-3 py-2 text-slate-300 text-xs">${a.endTime}</td><td class="px-3 py-2 text-slate-200">${a.className}</td><td class="px-3 py-2 text-center text-blue-400">${a.studentCount}</td></tr>`).join('');
        this.openModal(`<div class="p-6">${this.modalHeader(name + ' - 绘本活动记录')}${this.tableWrap(headers, rows)}${activities.length===0?'<div class="text-center text-slate-500 py-8">暂无活动记录</div>':''}</div>`);
    },

    viewStudentReport(id) {
        const s = MockData.students.find(x => x.id === id);
        if (!s) return;
        this.openModal(`<div class="p-6">${this.modalHeader(s.name + ' - 阅读报告')}<div class="grid grid-cols-2 gap-3 mb-5">${this.miniStat('参与活动次数', s.activityCount, 'blue')}${this.miniStat('参与活动时长', s.activityDuration, 'emerald')}${this.miniStat('绘本阅读总数', s.bookCount, 'purple')}${this.miniStat('所属班级', s.className, 'amber')}</div><div class="bg-slate-800/60 rounded-xl p-4 border border-slate-700/30"><h4 class="text-sm font-semibold text-slate-300 mb-3">阅读能力评估</h4><div class="grid grid-cols-3 gap-3"><div class="text-center"><div class="text-lg font-bold text-blue-400">优秀</div><div class="text-xs text-slate-500">语言表达</div></div><div class="text-center"><div class="text-lg font-bold text-emerald-400">良好</div><div class="text-xs text-slate-500">社交能力</div></div><div class="text-center"><div class="text-lg font-bold text-purple-400">优秀</div><div class="text-xs text-slate-500">想象创造</div></div></div></div></div>`);
    },

    // ============================================================
    //  用户管理操作
    // ============================================================
    showAddUserModal() {
        this.openModal(`<div class="p-6">${this.modalHeader('新增用户')}<div class="space-y-4">
            <div><label class="block text-sm text-slate-400 mb-1">账号 <span class="text-red-400">*</span></label><input type="text" class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none" placeholder="请输入账号"></div>
            <div><label class="block text-sm text-slate-400 mb-1">姓名 <span class="text-red-400">*</span></label><input type="text" class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none" placeholder="请输入姓名"></div>
            <div><label class="block text-sm text-slate-400 mb-1">角色 <span class="text-red-400">*</span></label><select class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none"><option>管理员</option><option>园长</option><option>教师</option><option>家长</option></select></div>
            <div><label class="block text-sm text-slate-400 mb-1">手机号</label><input type="text" class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none" placeholder="请输入手机号"></div>
            <div><label class="block text-sm text-slate-400 mb-1">初始密码 <span class="text-red-400">*</span></label><input type="password" class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none" value="123456"></div>
            <div class="flex justify-end gap-3 pt-2">${this.btnSecondary('取消', "App.closeModalDirect()")}${this.btnPrimary('确认', "App.showToast('用户创建成功','success');App.closeModalDirect()")}</div>
        </div></div>`);
    },

    editUser(id) {
        const u = MockData.users.find(x => x.id === id);
        if (!u) return;
        this.openModal(`<div class="p-6">${this.modalHeader('编辑用户')}<div class="space-y-4">
            <div><label class="block text-sm text-slate-400 mb-1">账号</label><input type="text" class="w-full bg-slate-900/50 border border-slate-700/50 text-slate-500 rounded-lg px-3 py-2 text-sm" value="${u.account}" readonly></div>
            <div><label class="block text-sm text-slate-400 mb-1">姓名</label><input type="text" class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none" value="${u.name}"></div>
            <div><label class="block text-sm text-slate-400 mb-1">角色</label><select class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm"><option ${u.role==='管理员'?'selected':''}>管理员</option><option ${u.role==='园长'?'selected':''}>园长</option><option ${u.role==='教师'?'selected':''}>教师</option><option ${u.role==='家长'?'selected':''}>家长</option></select></div>
            <div><label class="block text-sm text-slate-400 mb-1">手机号</label><input type="text" class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none" value="${u.phone}"></div>
            <div class="flex justify-end gap-3 pt-2">${this.btnSecondary('取消', "App.closeModalDirect()")}${this.btnPrimary('保存', "App.showToast('保存成功','success');App.closeModalDirect()")}</div>
        </div></div>`);
    },

    toggleUserStatus(id) { this.showToast('状态已更新', 'success'); },
    resetPassword(id) { this.showToast('密码已重置为 123456', 'success'); },

    showAddDeviceModal() {
        this.openModal(`<div class="p-6">${this.modalHeader('添加设备')}<div class="space-y-4">
            <div><label class="block text-sm text-slate-400 mb-1">设备SN号 <span class="text-red-400">*</span></label><input type="text" class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none" placeholder="请输入设备SN号"></div>
            <div><label class="block text-sm text-slate-400 mb-1">设备编号</label><input type="text" class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none" placeholder="请输入设备编号"></div>
            <div><label class="block text-sm text-slate-400 mb-1">绑定园所</label><select class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm"><option>阳光幼儿园</option><option>彩虹幼儿园</option><option>花朵幼儿园</option></select></div>
            <div><label class="block text-sm text-slate-400 mb-1">绑定班级</label><select class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm"><option>大一班</option><option>大二班</option><option>中一班</option></select></div>
            <div class="flex justify-end gap-3 pt-2">${this.btnSecondary('取消', "App.closeModalDirect()")}${this.btnPrimary('确认', "App.showToast('设备添加成功','success');App.closeModalDirect()")}</div>
        </div></div>`);
    },

    editDevice(id) {
        const d = MockData.devices.find(x => x.id === id);
        if (!d) return;
        this.openModal(`<div class="p-6">${this.modalHeader('编辑设备')}<div class="space-y-4">
            <div><label class="block text-sm text-slate-400 mb-1">设备SN号</label><input type="text" class="w-full bg-slate-900/50 border border-slate-700/50 text-slate-500 rounded-lg px-3 py-2 text-sm" value="${d.sn}" readonly></div>
            <div><label class="block text-sm text-slate-400 mb-1">设备编号</label><input type="text" class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none" value="${d.code}"></div>
            <div><label class="block text-sm text-slate-400 mb-1">绑定园所</label><select class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm"><option selected>${d.bindSchool}</option></select></div>
            <div><label class="block text-sm text-slate-400 mb-1">绑定班级</label><select class="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-2 text-sm"><option selected>${d.bindClass}</option></select></div>
            <div class="flex justify-end gap-3 pt-2">${this.btnSecondary('取消', "App.closeModalDirect()")}${this.btnPrimary('保存', "App.showToast('保存成功','success');App.closeModalDirect()")}</div>
        </div></div>`);
    },

    unbindDevice(id) { this.showToast('设备已解绑', 'warning'); },

    // ============================================================
    // AI分析页面
    // ============================================================

    // 切换AI分析标签（园长视角）
    switchAiAnalysisTab(tab) {
        this.aiAnalysisTab = tab;
        this.loadPage('aiAnalysis');
    },

    // 园长切换分析班级
    switchAiClass(classId) {
        this.aiSelectedClass = classId;
        this.loadPage('aiAnalysis');
    },

    // 教师切换分析学生
    switchAiStudent(studentId) {
        this.aiSelectedStudent = studentId;
        this.loadPage('aiAnalysis');
    },

    // 渲染AI分析页面
    renderAiAnalysisPage() {
        this.normalizeAiAnalysisTab();
        if (this.currentRole === 'principal') {
            return this.renderPrincipalAiAnalysisPage();
        } else if (this.currentRole === 'teacher') {
            return this.renderTeacherAiAnalysisPage();
        }
        return '';
    },

    // 园长AI分析页面
    renderPrincipalAiAnalysisPage() {
        const school = MockData.kindergartens[0];
        const classes = MockData.classes.filter(c => c.kindergartenId === 1).slice(0, 6);

        return `
            <div class="space-y-6">
                <!-- 页面标题 -->
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-white">AI智能分析</h2>
                        <p class="text-slate-400 text-sm mt-1">${school.name} - 数据深度分析</p>
                    </div>
                </div>

                <!-- 维度切换标签 -->
                <div class="flex gap-2">
                    <button onclick="App.switchAiAnalysisTab('school')"
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-all ${this.aiAnalysisTab === 'school' ? 'bg-blue-500 text-white' : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'}">
                        园所分析
                    </button>
                    <button onclick="App.switchAiAnalysisTab('class')"
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-all ${this.aiAnalysisTab === 'class' ? 'bg-blue-500 text-white' : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'}">
                        班级分析
                    </button>
                </div>

                ${this.aiAnalysisTab === 'school' ? this.renderSchoolAiAnalysis() : this.renderClassAiAnalysis(classes)}
            </div>
        `;
    },

    // 园所AI分析内容
    renderSchoolAiAnalysis() {
        // 使用数据服务计算真实数据
        const schoolData = MockData.schoolData.overview;
        const classes = MockData.classes;
        const students = MockData.students;
        const readingRecords = MockData.readingRecords || [];
        const books = MockData.books || [];

        // 计算能力分布
        const abilityDistribution = DataService.calculateAbilityDistribution(readingRecords, books);

        // 计算类型分布
        const typeDistribution = DataService.calculateTypeDistribution(readingRecords, books);

        // 准备AI分析数据
        const analysisData = DataService.prepareSchoolAnalysisData(schoolData, classes, students, readingRecords, books);

        return `
            <div class="space-y-6">
                <!-- 数据概览 -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    ${this.miniStat('活动总数', analysisData.summary.totalActivities, 'blue')}
                    ${this.miniStat('参与幼儿', `${analysisData.summary.participatingStudents}/${analysisData.summary.totalStudents}`, 'emerald')}
                    ${this.miniStat('阅读时长', `${analysisData.summary.totalDuration}h`, 'purple')}
                    ${this.miniStat('人均时长', `${analysisData.summary.avgDurationPerStudent}分钟`, 'amber')}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- 能力维度分布 -->
                    ${this.card(`
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-cyan-400 text-xl">🎯</span>
                            <h3 class="text-lg font-semibold text-white">能力维度分布</h3>
                        </div>
                        <div id="ai-ability-chart" style="height: 280px;"></div>
                    `)}
                    <!-- 绘本类型分布 -->
                    ${this.card(`
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-purple-400 text-xl">📚</span>
                            <h3 class="text-lg font-semibold text-white">绘本类型分布</h3>
                        </div>
                        <div id="ai-type-chart" style="height: 280px;"></div>
                    `)}
                </div>

                <!-- 班级活动对比 -->
                ${this.card(`
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-amber-400 text-xl">📊</span>
                        <h3 class="text-lg font-semibold text-white">班级活动对比</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b border-slate-500/30">
                                    <th class="text-left py-3 px-4 text-slate-400 font-medium">班级</th>
                                    <th class="text-center py-3 px-4 text-slate-400 font-medium">活动次数</th>
                                    <th class="text-center py-3 px-4 text-slate-400 font-medium">人均时长</th>
                                    <th class="text-center py-3 px-4 text-slate-400 font-medium">参与率</th>
                                    <th class="text-center py-3 px-4 text-slate-400 font-medium">状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${analysisData.classComparison.map(c => `
                                    <tr class="border-b border-slate-500/20 hover:bg-slate-500/10">
                                        <td class="py-3 px-4 text-white font-medium">${c.className}</td>
                                        <td class="py-3 px-4 text-center text-slate-300">${c.activityCount}</td>
                                        <td class="py-3 px-4 text-center text-slate-300">${c.avgDuration}分钟</td>
                                        <td class="py-3 px-4 text-center">
                                            <span class="${c.participationRate >= 80 ? 'text-emerald-400' : c.participationRate >= 50 ? 'text-amber-400' : 'text-red-400'}">${c.participationRate}%</span>
                                        </td>
                                        <td class="py-3 px-4 text-center">
                                            ${c.activityCount === 0 ? '<span class="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">需关注</span>' :
                                              c.participationRate >= 80 ? '<span class="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">良好</span>' :
                                              '<span class="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400">一般</span>'}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `)}

                <!-- AI分析结果 -->
                <div id="ai-analysis-result">
                    ${this.renderAiLoading()}
                </div>
            </div>
        `;
    },

    // AI加载中状态
    renderAiLoading() {
        return `
            ${this.card(`
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-blue-400 text-xl">🤖</span>
                    <h3 class="text-lg font-semibold text-white">AI智能分析</h3>
                </div>
                <div class="flex items-center justify-center py-8">
                    <div class="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mr-3"></div>
                    <span class="text-slate-400">AI正在分析数据...</span>
                </div>
            `)}
        `;
    },

    // 渲染AI分析结果
    renderAiAnalysisResult(result) {
        return `
            ${this.card(`
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-blue-400 text-xl">🤖</span>
                    <h3 class="text-lg font-semibold text-white">AI智能分析</h3>
                </div>

                <!-- 整体评价 -->
                <div class="mb-6 p-4 rounded-xl bg-slate-700/30 border border-slate-500/20">
                    <div class="text-sm text-slate-400 mb-2">📊 整体评价</div>
                    <p class="text-slate-200">${result.overallAssessment}</p>
                </div>

                <!-- 发现的问题 -->
                <div class="mb-6">
                    <div class="text-sm text-slate-400 mb-3">⚠️ 发现的问题</div>
                    <div class="space-y-3">
                        ${result.problems.map((p, i) => `
                            <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm">${i + 1}</span>
                                    <span class="text-white font-medium">${p.title}</span>
                                </div>
                                <p class="text-slate-300 text-sm">${p.description}</p>
                                ${p.dataEvidence ? `<p class="text-slate-500 text-xs mt-2">数据依据：${p.dataEvidence}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 改进建议 -->
                <div>
                    <div class="text-sm text-slate-400 mb-3">💡 改进建议</div>
                    <div class="space-y-3">
                        ${result.suggestions.map((s, i) => `
                            <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">${i + 1}</span>
                                    <span class="text-white font-medium">${s.content}</span>
                                </div>
                                ${s.steps && s.steps.length > 0 ? `
                                    <div class="mt-2 space-y-1">
                                        ${s.steps.map(step => `
                                            <div class="flex items-start gap-2 text-sm">
                                                <span class="text-blue-400 mt-0.5">▸</span>
                                                <span class="text-slate-400">${step}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `)}
        `;
    },

    // 班级AI分析内容
    renderClassAiAnalysis(classes) {
        const selectedClassData = MockData.aiAnalysis.classByPrincipal[this.aiSelectedClass] || MockData.aiAnalysis.classByPrincipal[1];
        const compMatrix = selectedClassData.comparisonMatrix;

        return `
            <div class="space-y-6">
                <!-- 班级选择器 -->
                <div class="flex flex-wrap gap-2">
                    ${classes.map(c => `
                        <button onclick="App.switchAiClass(${c.id})"
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-all ${this.aiSelectedClass === c.id ? 'bg-blue-500 text-white' : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'}">
                            ${c.name}
                        </button>
                    `).join('')}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- 班级对比雷达矩阵 -->
                    ${this.card(`
                        ${this.chartTitle('多维度班级对比')}
                        <div id="ai-class-compare-chart" style="height: 320px;"></div>
                    `)}
                    <!-- 能力进步追踪 -->
                    ${this.card(`
                        ${this.chartTitle('能力进步追踪')}
                        <div id="ai-class-progress-chart" style="height: 320px;"></div>
                    `)}
                    <!-- 学生分层分析 -->
                    ${this.card(`
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-purple-400 text-xl">📊</span>
                            <h3 class="text-lg font-semibold text-white">学生分层分析</h3>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-emerald-400 text-sm font-medium">高活跃组</span>
                                    <span class="text-emerald-400 text-sm">${selectedClassData.studentSegments.high.count}人</span>
                                </div>
                                <div class="w-full bg-slate-600/50 rounded-full h-3">
                                    <div class="h-3 rounded-full bg-emerald-400" style="width: ${selectedClassData.studentSegments.high.percent}%"></div>
                                </div>
                                <p class="text-slate-400 text-xs mt-1">${selectedClassData.studentSegments.high.description}</p>
                            </div>
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-blue-400 text-sm font-medium">中等活跃组</span>
                                    <span class="text-blue-400 text-sm">${selectedClassData.studentSegments.medium.count}人</span>
                                </div>
                                <div class="w-full bg-slate-600/50 rounded-full h-3">
                                    <div class="h-3 rounded-full bg-blue-400" style="width: ${selectedClassData.studentSegments.medium.percent}%"></div>
                                </div>
                                <p class="text-slate-400 text-xs mt-1">${selectedClassData.studentSegments.medium.description}</p>
                            </div>
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-amber-400 text-sm font-medium">待提升组</span>
                                    <span class="text-amber-400 text-sm">${selectedClassData.studentSegments.low.count}人</span>
                                </div>
                                <div class="w-full bg-slate-600/50 rounded-full h-3">
                                    <div class="h-3 rounded-full bg-amber-400" style="width: ${selectedClassData.studentSegments.low.percent}%"></div>
                                </div>
                                <p class="text-slate-400 text-xs mt-1">${selectedClassData.studentSegments.low.description}</p>
                            </div>
                        </div>
                    `)}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- 学生分层列表 -->
                    ${this.card(`
                        ${this.chartTitle('学生分层详情')}
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="text-slate-400 border-b border-slate-500/30">
                                        <th class="text-left py-2 px-2">学生</th>
                                        <th class="text-center py-2 px-2">分层</th>
                                        <th class="text-center py-2 px-2">活动数</th>
                                        <th class="text-center py-2 px-2">参与度</th>
                                        <th class="text-center py-2 px-2">趋势</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${selectedClassData.studentSegments.studentList.map(s => `
                                        <tr class="border-b border-slate-500/20 hover:bg-blue-500/5">
                                            <td class="py-2 px-2 text-white">${s.name}</td>
                                            <td class="py-2 px-2 text-center">
                                                <span class="px-2 py-0.5 rounded-full text-xs ${s.segment === 'high' ? 'bg-emerald-500/20 text-emerald-400' : s.segment === 'medium' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}">
                                                    ${s.segment === 'high' ? '高活跃' : s.segment === 'medium' ? '中等' : '待提升'}
                                                </span>
                                            </td>
                                            <td class="py-2 px-2 text-center text-blue-400">${s.activityCount}</td>
                                            <td class="py-2 px-2 text-center">${s.engagement}%</td>
                                            <td class="py-2 px-2 text-center">
                                                <span class="${s.trend === 'up' ? 'text-emerald-400' : s.trend === 'down' ? 'text-red-400' : 'text-slate-400'}">
                                                    ${s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→'}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `)}
                    <!-- 给教师的建议 -->
                    ${this.card(`
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-blue-400 text-xl">💼</span>
                            <h3 class="text-lg font-semibold text-white">给班级教师的建议</h3>
                        </div>
                        <div class="space-y-3">
                            ${selectedClassData.teacherSuggestions.map((s, i) => `
                                <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-medium">${i + 1}</span>
                                        <span class="text-white font-medium">${s.title}</span>
                                    </div>
                                    <p class="text-slate-300 text-sm">${s.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    `)}
                </div>
            </div>
        `;
    },

    // 教师AI分析页面
    renderTeacherAiAnalysisPage() {
        const cls = this.selectedClass || MockData.classes[0];
        const students = MockData.students.filter(s => s.classId === cls.id);

        return `
            <div class="space-y-6">
                <!-- 页面标题 -->
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-white">AI智能分析</h2>
                        <p class="text-slate-400 text-sm mt-1">${cls.name} - 班级与学生分析</p>
                    </div>
                </div>

                <!-- 维度切换标签 -->
                <div class="flex gap-2">
                    <button onclick="App.switchAiAnalysisTab('teacherClass')"
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-all ${(this.aiAnalysisTab === 'teacherClass' || this.aiAnalysisTab === 'school') ? 'bg-blue-500 text-white' : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'}">
                        班级分析
                    </button>
                    <button onclick="App.switchAiAnalysisTab('student')"
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-all ${this.aiAnalysisTab === 'student' ? 'bg-blue-500 text-white' : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'}">
                        学生分析
                    </button>
                </div>

                ${(this.aiAnalysisTab === 'teacherClass' || this.aiAnalysisTab === 'school') ? this.renderTeacherClassAiAnalysis() : this.renderStudentAiAnalysis(students)}
            </div>
        `;
    },

    // 教师视角班级分析
    renderTeacherClassAiAnalysis() {
        const data = MockData.aiAnalysis.teacherClass;
        const insights = data.lessonInsights;

        return `
            <div class="space-y-6">
                <!-- 班级活动趋势 -->
                ${this.card(`
                    ${this.chartTitle('班级活动趋势')}
                    <div id="ai-quality-chart" style="height: 280px;"></div>
                `)}

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- 最佳时间段 -->
                    ${this.card(`
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-emerald-400 text-xl">⏰</span>
                            <h3 class="text-lg font-semibold text-white">最佳活动时段</h3>
                        </div>
                        <p class="text-slate-400 text-sm mb-4">基于历史活动表现的时段洞察</p>
                        <div class="space-y-3">
                            ${insights.bestTimeSlots.map(t => `
                                <div class="p-3 rounded-xl bg-slate-500/20 border border-slate-500/20">
                                    <div class="text-white font-medium">${t.timeSlot}</div>
                                    <div class="text-slate-400 text-xs">${t.description}</div>
                                </div>
                            `).join('')}
                        </div>
                    `)}
                    <!-- 绘本类型效果 -->
                    ${this.card(`
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-cyan-400 text-xl">📚</span>
                            <h3 class="text-lg font-semibold text-white">绘本类型效果分析</h3>
                        </div>
                        <p class="text-slate-400 text-sm mb-4">不同类型绘本的课堂接受度</p>
                        <div class="space-y-3">
                            ${insights.bookTypeEffectiveness.map(b => `
                                <div class="p-3 rounded-xl bg-slate-500/20 border border-slate-500/20">
                                    <div class="text-white text-sm font-medium mb-1">${b.type}</div>
                                    <p class="text-slate-400 text-xs">${b.suggestion}</p>
                                </div>
                            `).join('')}
                        </div>
                    `)}
                </div>

                <div>
                    <!-- 最佳实践 -->
                    ${this.card(`
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-emerald-400 text-xl">⭐</span>
                            <h3 class="text-lg font-semibold text-white">推荐最佳实践</h3>
                        </div>
                        <div class="space-y-3">
                            ${data.bestPractices.map((p, i) => `
                                <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-medium">${i + 1}</span>
                                        <span class="text-white font-medium">${p.title}</span>
                                    </div>
                                    <p class="text-slate-300 text-sm">${p.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    `)}
                </div>

                <!-- 教学改进建议 -->
                ${this.card(`
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-blue-400 text-xl">📖</span>
                        <h3 class="text-lg font-semibold text-white">教学改进具体建议</h3>
                    </div>
                    <div class="space-y-4">
                        ${data.teachingImprovements.map((item, i) => `
                            <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <div class="flex items-center gap-3 mb-3">
                                    <span class="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-medium">${i + 1}</span>
                                    <div>
                                        <div class="text-white font-medium">${item.area}</div>
                                        <span class="px-2 py-0.5 rounded-full text-xs ${item.urgency === 'high' ? 'bg-red-500/20 text-red-400' : item.urgency === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}">
                                            ${item.urgency === 'high' ? '急需改进' : item.urgency === 'medium' ? '建议改进' : '优化建议'}
                                        </span>
                                    </div>
                                </div>
                                <p class="text-slate-300 text-sm mb-2">${item.currentStatus}</p>
                                <div class="flex items-start gap-2">
                                    <span class="text-blue-400 mt-0.5">→</span>
                                    <span class="text-slate-400 text-sm">${item.suggestion}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `)}
            </div>
        `;
    },

    // 学生AI分析内容
    renderStudentAiAnalysis(students) {
        // 使用真实数据
        const student = students.find(s => s.id === this.aiSelectedStudent) || students[0];
        const cls = this.selectedClass || MockData.classes[0];
        const readingRecords = MockData.readingRecords || [];
        const books = MockData.books || [];

        // 获取该学生的阅读记录
        const studentRecords = readingRecords.filter(r => r.studentId === this.aiSelectedStudent);

        // 计算能力覆盖
        const abilityCoverage = DataService.calculateAbilityDistribution(studentRecords, books, [this.aiSelectedStudent]);

        // 计算偏好类型
        const preferenceType = DataService.calculateTypeDistribution(studentRecords, books, [this.aiSelectedStudent]);

        // 最近阅读
        const recentBooks = studentRecords
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(r => {
                const book = books.find(b => b.id === r.bookId);
                return { ...r, bookName: book ? book.name : '未知', bookType: book ? book.type : '未知' };
            });

        return `
            <div class="space-y-6">
                <!-- 学生选择器 -->
                <div class="flex flex-wrap gap-2">
                    ${students.map(s => `
                        <button onclick="App.switchAiStudent(${s.id})"
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-all ${this.aiSelectedStudent === s.id ? 'bg-blue-500 text-white' : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'}">
                            ${s.name}
                        </button>
                    `).join('')}
                </div>

                <!-- 学生基本信息 -->
                ${this.card(`
                    <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                        <div class="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center text-3xl border border-purple-500/20">
                            👦
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <h3 class="text-xl font-bold text-white">${student.name}</h3>
                                <span class="text-slate-500 text-sm">${student.code || ''}</span>
                            </div>
                            <div class="text-slate-400 text-sm">${cls.name}</div>
                            <div class="mt-2 flex flex-wrap gap-2">
                                <span class="text-slate-400 text-sm">阅读${studentRecords.length}本绘本</span>
                                <span class="text-slate-500">|</span>
                                <span class="text-slate-400 text-sm">总时长${Math.round(studentRecords.reduce((s, r) => s + r.duration, 0) / 60 * 10) / 10}小时</span>
                            </div>
                        </div>
                    </div>
                `)}

                <!-- 能力分布 + 阅读记录 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${this.card(`
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-cyan-400 text-xl">🎯</span>
                            <h3 class="text-lg font-semibold text-white">能力维度发展</h3>
                        </div>
                        <div id="ai-student-ability-chart" style="height: 280px;"></div>
                    `)}
                    ${this.card(`
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-amber-400 text-xl">📚</span>
                            <h3 class="text-lg font-semibold text-white">最近阅读记录</h3>
                        </div>
                        <div class="space-y-3">
                            ${recentBooks.length > 0 ? recentBooks.map(b => `
                                <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-500/20 border border-slate-500/20">
                                    <div class="w-10 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center text-lg border border-amber-500/20">
                                        📖
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-white font-medium">${b.bookName}</div>
                                        <div class="flex items-center gap-2 text-xs text-slate-400">
                                            <span class="px-2 py-0.5 rounded-full bg-slate-500/30">${b.bookType}</span>
                                            <span>${b.date}</span>
                                            <span class="text-emerald-400">${b.engagement || 80}% 投入度</span>
                                        </div>
                                    </div>
                                    <div class="text-slate-400 text-sm">${b.duration}分钟</div>
                                </div>
                            `).join('') : '<div class="text-slate-400 text-center py-4">暂无阅读记录</div>'}
                        </div>
                    `)}
                </div>

                <!-- AI分析结果 -->
                <div id="ai-student-analysis-result">
                    ${this.renderStudentAiLoading()}
                </div>
            </div>
        `;
    },

    // 学生AI加载中状态
    renderStudentAiLoading() {
        return `
            ${this.card(`
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-blue-400 text-xl">🤖</span>
                    <h3 class="text-lg font-semibold text-white">AI智能分析</h3>
                </div>
                <div class="flex items-center justify-center py-8">
                    <div class="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mr-3"></div>
                    <span class="text-slate-400">AI正在生成个性化分析...</span>
                </div>
            `)}
        `;
    },

    // 渲染学生AI分析结果
    renderStudentAiAnalysisResult(result) {
        return `
            ${this.card(`
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-blue-400 text-xl">🤖</span>
                    <h3 class="text-lg font-semibold text-white">AI智能分析</h3>
                </div>

                <!-- 学生画像 -->
                <div class="mb-6 p-4 rounded-xl bg-slate-700/30 border border-slate-500/20">
                    <div class="text-sm text-slate-400 mb-2">👤 学生画像</div>
                    <p class="text-slate-200">${result.portrait}</p>
                </div>

                <!-- 优势与不足 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div class="text-sm text-slate-400 mb-3">✅ 优势能力</div>
                        <div class="space-y-2">
                            ${result.strengths.map(s => `
                                <div class="flex items-center gap-2">
                                    <span class="text-emerald-400">•</span>
                                    <span class="text-slate-200 text-sm">${s}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <div class="text-sm text-slate-400 mb-3">📈 待提升能力</div>
                        <div class="space-y-2">
                            ${result.weaknesses.map(w => `
                                <div class="flex items-center gap-2">
                                    <span class="text-amber-400">•</span>
                                    <span class="text-slate-200 text-sm">${w}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- 短期培养建议 -->
                <div class="mb-6">
                    <div class="text-sm text-slate-400 mb-3">📚 短期培养建议</div>
                    <div class="space-y-3">
                        ${result.suggestions.map((s, i) => `
                            <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">${i + 1}</span>
                                    <span class="text-white font-medium text-sm">${s.content}</span>
                                </div>
                                ${s.recommendedType ? `<span class="text-slate-500 text-xs ml-8">推荐类型：${s.recommendedType}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 家园共育建议 -->
                <div>
                    <div class="text-sm text-slate-400 mb-3">🏠 家园共育建议</div>
                    <div class="space-y-2">
                        ${result.homeCollaboration.map(h => `
                            <div class="flex items-start gap-2 p-3 rounded-lg bg-slate-500/20">
                                <span class="text-cyan-400 mt-0.5">•</span>
                                <span class="text-slate-300 text-sm">${h}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `)}
        `;
    },

    // 加载学生AI分析
    async loadStudentAiAnalysis() {
        const students = MockData.students.filter(s => s.classId === (this.selectedClass?.id || 1));
        const student = students.find(s => s.id === this.aiSelectedStudent) || students[0];
        const readingRecords = MockData.readingRecords || [];
        const books = MockData.books || [];

        // 准备分析数据
        const analysisData = DataService.prepareStudentAnalysisData(student, readingRecords, books, {
            activityLevel: 100,
            durationLevel: 100,
            rank: 1
        });

        // 调用AI服务（使用降级方案）
        const result = await AiService.analyzeStudent(analysisData);

        // 渲染结果
        const container = document.getElementById('ai-student-analysis-result');
        if (container) {
            container.innerHTML = this.renderStudentAiAnalysisResult(result);
        }
    },

    // 初始化AI分析页面图表
    initAiAnalysisPage() {
        if (this.currentRole === 'principal') {
            if (this.aiAnalysisTab === 'school') {
                this.initSchoolAiCharts();
                // 异步调用AI分析
                this.loadSchoolAiAnalysis();
            } else {
                this.initClassAiCharts();
            }
        } else if (this.currentRole === 'teacher') {
            if (this.aiAnalysisTab === 'student') {
                this.initStudentAiCharts();
                // 异步调用AI分析
                this.loadStudentAiAnalysis();
            } else {
                this.initTeacherClassAiCharts();
            }
        }
    },

    // 加载园所AI分析
    async loadSchoolAiAnalysis() {
        const schoolData = MockData.schoolData.overview;
        const classes = MockData.classes;
        const students = MockData.students;
        const readingRecords = MockData.readingRecords || [];
        const books = MockData.books || [];

        // 准备分析数据
        const analysisData = DataService.prepareSchoolAnalysisData(schoolData, classes, students, readingRecords, books);

        // 调用AI服务（使用降级方案）
        const result = await AiService.analyzeSchool(analysisData);

        // 渲染结果
        const container = document.getElementById('ai-analysis-result');
        if (container) {
            container.innerHTML = this.renderAiAnalysisResult(result);
        }
    },

    // 初始化园所分析图表
    initSchoolAiCharts() {
        const readingRecords = MockData.readingRecords || [];
        const books = MockData.books || [];

        // 计算能力分布
        const abilityDistribution = DataService.calculateAbilityDistribution(readingRecords, books);

        // 计算类型分布
        const typeDistribution = DataService.calculateTypeDistribution(readingRecords, books);

        // 能力维度分布图表
        const abilityEl = document.getElementById('ai-ability-chart');
        if (abilityEl && abilityDistribution.length > 0) {
            const chart = echarts.init(abilityEl);
            chart.setOption({
                tooltip: { trigger: 'item', formatter: '{b}: {c}分钟 ({d}%)' },
                legend: { bottom: 0, textStyle: { color: '#94a3b8', fontSize: 11 } },
                color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'],
                series: [{
                    type: 'pie',
                    radius: ['35%', '60%'],
                    center: ['50%', '45%'],
                    itemStyle: { borderRadius: 4, borderColor: 'rgba(120,160,220,0.35)', borderWidth: 2 },
                    label: { show: true, formatter: '{b}\n{d}%', fontSize: 10, color: '#94a3b8' },
                    data: abilityDistribution.map(a => ({ name: a.name, value: a.duration }))
                }]
            });
            Charts.instances.push(chart);
        }

        // 绘本类型分布图表
        const typeEl = document.getElementById('ai-type-chart');
        if (typeEl && typeDistribution.length > 0) {
            const chart = echarts.init(typeEl);
            chart.setOption({
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'value', axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#334155' } } },
                yAxis: { type: 'category', data: typeDistribution.map(t => t.type).reverse(), axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8' } },
                series: [{
                    type: 'bar',
                    data: typeDistribution.map(t => t.duration).reverse(),
                    itemStyle: {
                        borderRadius: [0, 4, 4, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#8b5cf6' },
                            { offset: 1, color: '#a78bfa' }
                        ])
                    },
                    label: { show: true, position: 'right', color: '#94a3b8', fontSize: 11, formatter: '{c}分钟' }
                }]
            });
            Charts.instances.push(chart);
        }
    },

    // 初始化班级分析图表（园长）
    initClassAiCharts() {
        const classData = MockData.aiAnalysis.classByPrincipal[this.aiSelectedClass] || MockData.aiAnalysis.classByPrincipal[1];
        const compMatrix = classData.comparisonMatrix;
        const progress = classData.progressTracking;

        // 班级对比雷达矩阵
        const compareEl = document.getElementById('ai-class-compare-chart');
        if (compareEl) {
            const chart = echarts.init(compareEl);
            chart.setOption({
                tooltip: { trigger: 'axis' },
                legend: { data: compMatrix.classNames, textStyle: { color: '#94a3b8' }, bottom: 0 },
                radar: {
                    indicator: compMatrix.indicators.map(i => ({ name: i.name, max: 100 })),
                    axisLine: { lineStyle: { color: '#475569' } },
                    splitLine: { lineStyle: { color: '#334155' } },
                    splitArea: { areaStyle: { color: ['rgba(51,65,85,0.3)', 'rgba(51,65,85,0.1)'] } },
                    axisName: { color: '#94a3b8' }
                },
                series: [{
                    type: 'radar',
                    data: compMatrix.data
                }]
            });
            Charts.instances.push(chart);
        }

        // 能力进步追踪
        const progressEl = document.getElementById('ai-class-progress-chart');
        if (progressEl) {
            const chart = echarts.init(progressEl);
            chart.setOption({
                tooltip: { trigger: 'axis' },
                legend: { data: progress.labels, textStyle: { color: '#94a3b8' }, bottom: 0 },
                grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
                xAxis: { type: 'category', data: progress.weeks, axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8' } },
                yAxis: { type: 'value', axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#334155' } }, min: 50, max: 100 },
                series: progress.series.map((s, i) => ({
                    type: 'line',
                    name: s.name,
                    data: s.values,
                    smooth: true,
                    lineStyle: { width: 2 },
                    itemStyle: {}
                }))
            });
            Charts.instances.push(chart);
        }
    },

    // 初始化教师班级分析图表
    initTeacherClassAiCharts() {
        const cls = this.selectedClass || MockData.classes[0];
        const activities = this.getFilteredActivitiesByDateRange('dataOverview').filter(a => a.className === cls.name);
        
        // 计算每日活动趋势
        const dailyData = {};
        activities.forEach(a => {
            const day = a.endTime.slice(0, 10);
            dailyData[day] = (dailyData[day] || 0) + 1;
        });
        const dates = Object.keys(dailyData).sort().slice(-7);
        const values = dates.map(d => dailyData[d]);

        // 班级活动趋势图
        const trendEl = document.getElementById('ai-quality-chart');
        if (trendEl) {
            const chart = echarts.init(trendEl);
            chart.setOption({
                tooltip: { trigger: 'axis' },
                grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
                xAxis: { 
                    type: 'category', 
                    data: dates.length > 0 ? dates.map(d => d.slice(5)) : ['暂无数据'],
                    axisLine: { lineStyle: { color: '#475569' } }, 
                    axisLabel: { color: '#94a3b8' } 
                },
                yAxis: { 
                    type: 'value', 
                    axisLine: { lineStyle: { color: '#475569' } }, 
                    axisLabel: { color: '#94a3b8' }, 
                    splitLine: { lineStyle: { color: '#334155' } } 
                },
                series: [{
                    type: 'bar',
                    data: values.length > 0 ? values : [0],
                    itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
                    barWidth: '50%'
                }]
            });
            Charts.instances.push(chart);
        }

    },

    // 初始化学生分析图表
    initStudentAiCharts() {
        const readingRecords = MockData.readingRecords || [];
        const books = MockData.books || [];

        // 计算学生能力分布
        const abilityDistribution = DataService.calculateAbilityDistribution(readingRecords, books, [this.aiSelectedStudent]);

        // 能力维度发展图表
        const abilityEl = document.getElementById('ai-student-ability-chart');
        if (abilityEl && abilityDistribution.length > 0) {
            const chart = echarts.init(abilityEl);
            chart.setOption({
                tooltip: { trigger: 'item', formatter: '{b}: {c}分钟 ({d}%)' },
                legend: { bottom: 0, textStyle: { color: '#94a3b8', fontSize: 11 } },
                color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'],
                series: [{
                    type: 'pie',
                    radius: ['35%', '60%'],
                    center: ['50%', '45%'],
                    itemStyle: { borderRadius: 4, borderColor: 'rgba(120,160,220,0.35)', borderWidth: 2 },
                    label: { show: true, formatter: '{b}\n{d}%', fontSize: 10, color: '#94a3b8' },
                    data: abilityDistribution.map(a => ({ name: a.name, value: a.duration }))
                }]
            });
            Charts.instances.push(chart);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
