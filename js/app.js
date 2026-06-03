// 应用程序主逻辑 - 深色科技风数据大屏

// Heroicons / Lucide 24x24 SVG icon 集合,统一替代原 emoji 控件图标
const Icons = {
    _wrap(path, size = 'w-4 h-4') {
        return `<svg class="${size}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
    },
    admin(size)     { return this._wrap('<path stroke-linecap="round" stroke-linejoin="round" d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>', size); },
    school(size)    { return this._wrap('<path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/>', size); },
    teacher(size)   { return this._wrap('<path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>', size); },
    student(size)   { return this._wrap('<path stroke-linecap="round" stroke-linejoin="round" d="M16 14a4 4 0 10-8 0M12 11a3 3 0 100-6 3 3 0 000 6zM6 21h12a2 2 0 002-2v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1a2 2 0 002 2z"/>', size); },
    book(size)      { return this._wrap('<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>', size); },
    chat(size)      { return this._wrap('<path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>', size); },
    chart(size)     { return this._wrap('<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 01-2-2z"/>', size); },
    activity(size)  { return this._wrap('<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>', size); },
    device(size)    { return this._wrap('<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>', size); },
};

// 中文首字母（拼音首字母）工具：用于学校/班级/姓名"yg→阳光、hd→海淀"这类模糊筛选。
// 字典只列学校/地名/班级常用字，不引入完整拼音库，保持文件零依赖。
const PinyinUtil = {
    _map: {
        a: '阿啊',
        b: '班北白百宝本笔贝备',
        c: '彩朝陈春晨长城',
        d: '大东冬德地丁丹朵淀',
        e: '恩二儿',
        f: '方芳风房府福丰飞',
        g: '高港光关广国',
        h: '海花华红虹和河鸿欢华',
        j: '佳家健建江金井京静菊洁君',
        k: '康开',
        l: '丽蓝兰乐林立刘亮龙李',
        m: '美明苗梅麦敏',
        n: '南宁',
        p: '平蒲朴',
        q: '青秋启琪',
        r: '仁日润瑞',
        s: '三山上时实树双思松',
        t: '童天同太通',
        w: '万文五武望王伟',
        x: '西希夏小新星雪喜祥香晓秀霞',
        y: '阳幼育园杨颐燕英艳一娅亚雅',
        z: '中智朱赵子张',
    },
    _cache: null,
    _build() {
        if (this._cache) return this._cache;
        const cache = {};
        Object.keys(this._map).forEach(letter => {
            for (const ch of this._map[letter]) cache[ch] = letter;
        });
        this._cache = cache;
        return cache;
    },
    initial(text) {
        if (!text) return '';
        const dict = this._build();
        let out = '';
        for (const ch of String(text)) {
            if (dict[ch]) {
                out += dict[ch];
            } else if (/[a-z]/i.test(ch)) {
                out += ch.toLowerCase();
            } else if (/\d/.test(ch)) {
                out += ch;
            }
        }
        return out;
    },
    match(text, keyword) {
        const lower = String(text || '').toLowerCase();
        const kw = String(keyword || '').toLowerCase().trim();
        if (!kw) return true;
        if (lower.includes(kw)) return true;
        return this.initial(text).includes(kw);
    },
};

const App = {
    currentPage: 'dataOverview',
    schoolDataTab: 'overview',
    schoolSearchKeyword: '', // 学校搜索关键词
    currentRole: 'admin', // admin-教育局管理员, principal-园长, teacher-教师
    selectedSchool: null,  // 选中的园所（园长视角）
    selectedClass: null,   // 选中的班级（教师视角）
    selectedKindergartensForLine: [], // 园所使用次数趋势选中的园所ID（多选）
    weeklyActivityChartType: 'line', // 区域/园所绘本活动次数图表类型：line | bar
    weeklyActivityChartTypes: ['line', 'bar'], // 多选：可同时显示，最少保留一个
    kindergartenUsageChartType: 'combo', // 园所使用次数趋势：combo（柱+总和折线） | bar | line
    kindergartenUsageChartTypes: ['line', 'bar'], // 多选：可同时显示，最少保留一个

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
        classes: { name: '', teacher: '' },
        teachers: { name: '' },
        students: { name: '', className: '' },
        devices: { sn: '' },
        users: { account: '', role: '', status: '' }
    },

    dateRanges: {
        dataOverview: { preset: '7d', startDate: '', endDate: '' },
        schoolOverview: { preset: '7d', startDate: '', endDate: '' },
        aiOverview: { preset: '7d', startDate: '', endDate: '' }
    },

    init() {
        this.initDateRanges();
        this.loadAiReports();
        this.loadAiStudentReports();
        this.loadAiClassReports();
        this.initTheme();
        this.initSidebarCollapse();
        this.initKindergartenSelection();
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
        // 点击其他区域关闭角色选择器和园所下拉菜单
        document.addEventListener('click', (e) => {
            const switcher = document.getElementById('role-switcher');
            const avatar = document.getElementById('user-avatar');
            if (switcher && avatar && !switcher.contains(e.target) && !avatar.contains(e.target)) {
                switcher.classList.add('hidden');
            }
            // 关闭园所下拉菜单
            const dropdownContainer = document.getElementById('kindergarten-dropdown-container');
            const dropdownMenu = document.getElementById('kindergarten-dropdown-menu');
            if (dropdownMenu && dropdownContainer && !dropdownContainer.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
    },

    // 初始化园所选择
    initKindergartenSelection() {
        const kindergartens = MockData.kindergartens || [];
        this.selectedKindergartensForLine = kindergartens.slice(0, 3).map(k => k.id);
    },

    // 主题（白紫默认 / 深色可选）切换
    initTheme() {
        const saved = localStorage.getItem('uiTheme') || 'warm';
        this.applyTheme(saved);
    },
    applyTheme(theme) {
        const isDark = theme === 'dark';
        document.body.classList.toggle('theme-dark', isDark);
        // 兼容旧类名:warm 即默认,不挂任何类
        document.body.classList.remove('theme-warm');
        const dark = document.getElementById('theme-icon-dark');
        const light = document.getElementById('theme-icon-light');
        if (dark && light) {
            dark.classList.toggle('hidden', !isDark);
            light.classList.toggle('hidden', isDark);
        }
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.title = isDark ? '切换到白紫主题' : '切换到深色主题';
        localStorage.setItem('uiTheme', theme);
    },
    toggleTheme() {
        const next = document.body.classList.contains('theme-dark') ? 'warm' : 'dark';
        this.applyTheme(next);
        // 重新加载当前页面，让图表带新主题重建
        try {
            if (typeof Charts !== 'undefined' && Charts.dispose) Charts.dispose();
        } catch (e) {}
        if (this.currentPage) {
            this.loadPage(this.currentPage);
        }
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
        ['dataOverview', 'schoolOverview', 'aiOverview'].forEach(context => {
            this.dateRanges[context] = {
                preset: '7d',
                ...this.buildDateRangeByPreset('7d', context)
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

    getLatestAiHistoryDate() {
        const history = MockData.aiOverview?.history || [];
        if (!history.length) return this.getLatestActivityDate();
        const parsed = history
            .map(item => this.parseActivityDate(item.time))
            .filter(date => !Number.isNaN(date.getTime()));
        if (!parsed.length) return this.getLatestActivityDate();
        const latest = parsed.reduce((max, cur) => cur > max ? cur : max, parsed[0]);
        latest.setHours(0, 0, 0, 0);
        return latest;
    },

    buildDateRangeByPreset(preset, context = null) {
        const end = (context === 'aiOverview') ? this.getLatestAiHistoryDate() : this.getLatestActivityDate();
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
        this.updateDateRange(context, { preset, ...this.buildDateRangeByPreset(preset, context) });
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
        if (context === 'aiOverview') {
            const filterHost = document.getElementById('ai-date-filter');
            if (filterHost) filterHost.innerHTML = this.renderDateFilterBar('aiOverview');
            this.refreshAiOverviewMetrics();
            // 时间筛选变化时，明细面板的分页回到第 1 页
            if (this._aiMetricPages) {
                this._aiMetricPages = { chats: 1, books: 1, students: 1 };
            }
            // 刷新展开的明细面板
            const wrapper = document.getElementById('ai-metric-panel-wrapper');
            if (wrapper && this._aiActiveMetric) {
                wrapper.innerHTML = this.renderAiMetricPanel(this._aiActiveMetric);
            }
            try { Charts.initAiBookInteractionBar(this.getAiBookInteractionsByRange()); } catch (e) {}
            try { Charts.initAiClassDialogTrend(this.getAiClassDialogTrend()); } catch (e) {}
            return;
        }
        if (context === 'schoolOverview') {
            // 全局时间筛选影响所有子页签：刷新当前 tab 内容并更新顶部时间栏 UI
            const filterHost = document.getElementById('school-date-filter');
            if (filterHost) filterHost.innerHTML = this.renderDateFilterBar('schoolOverview');
            this.updateSchoolOverviewDate();

            // 如果班级详情正在显示（弹窗或子页面），需要联动重新渲染
            const modalOpen = !document.getElementById('modal-overlay')?.classList.contains('hidden')
                && !!document.getElementById('class-book-type-chart');
            const subpageOpen = !!document.getElementById('class-subpage-container');
            if ((modalOpen || subpageOpen) && this._currentClassDetailId != null) {
                Charts.dispose();
                this.viewClassDetail(this._currentClassDetailId, subpageOpen ? 'subpage' : 'modal');
                return;
            }

            // 如果幼儿阅读报告正在显示（弹窗或子页面），也需要联动重新渲染
            const studentModalOpen = !document.getElementById('modal-overlay')?.classList.contains('hidden')
                && !!document.getElementById('student-booktype-trend-chart');
            const studentSubpageOpen = !!document.getElementById('student-subpage-container');
            if ((studentModalOpen || studentSubpageOpen) && this._currentStudentReportId != null) {
                Charts.dispose();
                this.viewStudentReport(this._currentStudentReportId, studentSubpageOpen ? 'subpage' : 'modal');
                return;
            }

            this.renderSchoolTabContent(this.schoolDataTab || 'overview');
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

    // 当前角色对应的学生 ID 集合（用于阅读记录过滤）；返回 null 表示不过滤
    getStudentIdsForCurrentRole() {
        if (this.currentRole === 'admin') return null;
        if (this.currentRole === 'principal') {
            const kgId = this.selectedSchool?.id;
            if (!kgId) return null;
            const classIds = MockData.classes.filter(c => c.kindergartenId === kgId).map(c => c.id);
            return MockData.students.filter(s => classIds.includes(s.classId)).map(s => s.id);
        }
        if (this.currentRole === 'teacher') {
            const cid = this.selectedClass?.id;
            if (cid == null) return null;
            return MockData.students.filter(s => s.classId === cid).map(s => s.id);
        }
        return null;
    },

    // 大数据总览能力分布：以学生 abilityStats 为准，按角色范围取平均；返回 9 个固定维度
    computeAbilityDistributionForOverview() {
        // 9 维定义（颜色固定，跟具体能力绑定）。aliases 兼容现有 mock 的多套键名。
        const dims = [
            { name: '品格养成', color: '#FAAD14', aliases: ['品格养成'] },
            { name: '数学思维', color: '#1677FF', aliases: ['逻辑思维', '科学认知'] },
            { name: '社交力',   color: '#722ED1', aliases: ['社交力', '社交能力'] },
            { name: '口语表达', color: '#EB2F96', aliases: ['语言表达'] },
            { name: '文学欣赏', color: '#13C2C2', aliases: ['文化素养'] },
            { name: '科学认知', color: '#FA8C16', aliases: ['科学认知'] },
            { name: '情绪管理', color: '#2F54EB', aliases: ['情绪管理', '情感认知'] },
            { name: '习惯养成', color: '#52C41A', aliases: ['习惯养成'] },
            { name: '想象力',   color: '#9254DE', aliases: ['想象力', '想象创造'] }
        ];

        const studentIds = this.getStudentIdsForCurrentRole();
        const pool = (MockData.students || []).filter(s => !studentIds || studentIds.includes(s.id));

        const collectFromStudents = dim => {
            const vals = [];
            pool.forEach(s => {
                const stats = s.abilityStats || {};
                for (const key of dim.aliases) {
                    if (typeof stats[key] === 'number') { vals.push(stats[key]); break; }
                }
            });
            return vals;
        };

        // 没有对应 mock 键时的稳定保底（按维度名 hash 到 55–88）
        const fallbackByName = name => {
            let h = 0;
            for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
            return 55 + (h % 34);
        };

        const scored = dims.map(dim => {
            const vals = collectFromStudents(dim);
            const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : fallbackByName(dim.name);
            return { name: dim.name, color: dim.color, value: Math.round(avg) };
        });

        // 沿"左下→右上"对角带散布：大的在左下，小的甩到右上，整体有节奏不规整
        scored.sort((a, b) => b.value - a.value);
        const anchors = [
            { x: 22, y: 70 }, // 1 - 主视觉，左下
            { x: 46, y: 36 }, // 2 - 中上偏左（视觉次中心）
            { x: 70, y: 78 }, // 3 - 右下
            { x: 14, y: 30 }, // 4 - 左上
            { x: 60, y: 58 }, // 5 - 中右
            { x: 36, y: 86 }, // 6 - 下偏左
            { x: 86, y: 40 }, // 7 - 右中
            { x: 32, y: 16 }, // 8 - 顶部偏左
            { x: 90, y: 14 }  // 9 - 右上角，最远最小
        ];
        // 按排名固定直径（最大 ≈ 4× 最小，对比明显）
        const sizes = [108, 88, 74, 62, 52, 44, 38, 32, 26];

        return scored.map((item, idx) => ({
            ...item,
            x: anchors[idx].x,
            y: anchors[idx].y,
            size: sizes[idx]
        }));
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

    isTeacherScope() {
        return this.currentRole === 'teacher' && !!this.selectedClass;
    },

    getTeacherClassName() {
        return this.selectedClass?.name || '';
    },

    // 当前登录用户名（用于 AI 报告"生成者"）。教师->班主任名，园长/管理员->对应角色名
    getCurrentUserName() {
        if (this.currentRole === 'teacher') {
            const cls = this.selectedClass;
            const t = cls && Array.isArray(cls.teachers) ? cls.teachers[0] : null;
            return (t && (t.name || t)) ? `${t.name || t} 老师` : '班主任 老师';
        }
        if (this.currentRole === 'principal') {
            return (this.selectedSchool?.principalName) ? `${this.selectedSchool.principalName} 园长` : '园长';
        }
        return '管理员';
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

    formatActivityDuration(startTime, endTime) {
        if (!startTime || !endTime) return '—';
        const start = new Date(startTime.replace(' ', 'T'));
        const end = new Date(endTime.replace(' ', 'T'));
        const diffMs = end.getTime() - start.getTime();
        if (!Number.isFinite(diffMs) || diffMs <= 0) return '—';
        const totalMinutes = Math.round(diffMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours && minutes) return `${hours}小时${minutes}分钟`;
        if (hours) return `${hours}小时`;
        return `${minutes}分钟`;
    },

    // 园所/区域/班级数据页 - 全局时间筛选辅助
    getSchoolDateRange() {
        return this.dateRanges.schoolOverview || {};
    },

    // 根据当前全局（园所）时间范围长度，映射出兴趣/建议书单展示数量
    getGlobalBookListSize() {
        const r = this.dateRanges.schoolOverview || {};
        if (!r.startDate || !r.endDate) return 5;
        const ms = new Date(`${r.endDate}T23:59:59`) - new Date(`${r.startDate}T00:00:00`);
        const days = Math.max(1, Math.round(ms / 86400000));
        if (days <= 14) return 3;        // ≤2 周 → 3 本
        if (days <= 60) return 5;        // ≤2 个月 → 5 本
        return 8;                        // 否则 → 8 本
    },

    getSchoolRangeRatio() {
        const total = MockData.schoolData?.activities?.length || 0;
        if (!total) return 0;
        const inRange = this.getFilteredActivitiesByDateRange('schoolOverview').length;
        return inRange / total;
    },

    scaleByDateRange(value, { decimals = 0, minimum = 0 } = {}) {
        const ratio = this.getSchoolRangeRatio();
        if (!Number.isFinite(value)) return value;
        if (ratio <= 0) return decimals ? Number(0).toFixed(decimals) : 0;
        const scaled = value * ratio;
        if (decimals) return scaled.toFixed(decimals);
        return Math.max(minimum, Math.round(scaled));
    },

    scaleDurationString(durationStr) {
        if (durationStr == null) return durationStr;
        const text = String(durationStr);
        const match = text.match(/(\d+(?:\.\d+)?)/);
        if (!match) return text;
        const num = parseFloat(match[1]);
        const unit = text.replace(match[1], '').trim();
        const ratio = this.getSchoolRangeRatio();
        const scaled = (num * (ratio <= 0 ? 0 : ratio));
        const decimals = (match[1].split('.')[1] || '').length || 1;
        return `${scaled.toFixed(decimals)}${unit}`;
    },

    filterActivitiesByGlobalRange(list) {
        const range = this.getSchoolDateRange();
        const start = range?.startDate ? new Date(`${range.startDate}T00:00:00`) : null;
        const end = range?.endDate ? new Date(`${range.endDate}T23:59:59`) : null;
        return (list || []).filter(item => {
            const current = this.parseActivityDate(item.endTime);
            if (Number.isNaN(current.getTime())) return false;
            if (start && current < start) return false;
            if (end && current > end) return false;
            return true;
        });
    },

    filterReadingStudentsByGlobalRange(list) {
        if (!Array.isArray(list)) return list;
        const range = this.getSchoolDateRange();
        const start = range?.startDate ? new Date(`${range.startDate}T00:00:00`) : null;
        const end = range?.endDate ? new Date(`${range.endDate}T23:59:59`) : null;
        if (!start && !end) return list;
        // mock 数据时间窗口与全局筛选错位时，按比例随机抽样保留对应比例的记录
        const ratio = this.getSchoolRangeRatio();
        if (ratio <= 0) return [];
        if (ratio >= 1) return list;
        const keep = Math.max(1, Math.round(list.length * ratio));
        return list.slice(0, keep);
    },

    // 阅读报告 - 阅读明细（按全局时间筛选生成该幼儿在范围内的逐次阅读记录）
    getStudentReadingDetail(sOriginal) {
        const range = this.getSchoolDateRange();
        const startMs = range?.startDate ? new Date(`${range.startDate}T00:00:00`).getTime() : null;
        const endMs = range?.endDate ? new Date(`${range.endDate}T23:59:59`).getTime() : null;

        const inRange = (timeStr) => {
            const t = this.parseActivityDate(timeStr).getTime();
            if (Number.isNaN(t)) return false;
            if (startMs !== null && t < startMs) return false;
            if (endMs !== null && t > endMs) return false;
            return true;
        };

        const records = [];

        // 1) 优先取真实的 readingRecords
        const realRecords = (MockData.readingRecords || []).filter(r => r.studentId === sOriginal.id);
        realRecords.forEach(r => {
            const dateStr = `${r.date} 00:00:00`;
            if (startMs !== null && !inRange(dateStr)) return;
            const book = (MockData.schoolData?.books || []).find(b => b.id === r.bookId);
            records.push({
                date: r.date,
                startTime: '',
                endTime: '',
                duration: Number(r.duration) || 0,
                bookName: book?.name || `绘本${r.bookId}`,
                bookType: book?.type || '-',
                completed: true
            });
        });

        // 2) 用班级在筛选范围内的活动合成补充记录（保证有数据可看）
        const targetActs = this.filterActivitiesByGlobalRange(MockData.schoolData?.activities || [])
            .filter(a => a.className === sOriginal.className);
        const bookPool = (MockData.schoolData?.books || []);
        targetActs.forEach((a, idx) => {
            // 每个活动给该幼儿派 1-2 次阅读
            const sessions = ((sOriginal.id + idx) % 3 === 0) ? 2 : 1;
            for (let k = 0; k < sessions; k++) {
                const offsetMin = (idx * 7 + k * 23 + sOriginal.id * 3) % 30;
                const dur = 12 + ((idx + k + sOriginal.id) % 14); // 12-25 分钟
                const start = new Date(this.parseActivityDate(a.startTime).getTime() + offsetMin * 60000);
                const endT = new Date(start.getTime() + dur * 60000);
                const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
                const dateOnly = fmt(start).slice(0, 10);
                // 避免与真实记录同日同绘本重复
                const book = bookPool.length ? bookPool[(sOriginal.id + idx + k) % bookPool.length] : null;
                if (!book) continue;
                if (records.some(r => r.date === dateOnly && r.bookName === book.name)) continue;
                records.push({
                    date: dateOnly,
                    startTime: fmt(start),
                    endTime: fmt(endT),
                    duration: dur,
                    bookName: book.name,
                    bookType: book.type || '-',
                    completed: ((idx + k) % 4) !== 0
                });
            }
        });

        records.sort((a, b) => (a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)));

        // 汇总
        const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
        const totalTimes = records.length;
        const uniqueBooks = new Set(records.map(r => r.bookName));
        const completedBooksSet = new Set(records.filter(r => r.completed).map(r => r.bookName));

        return {
            records,
            summary: {
                duration: totalDuration,
                times: totalTimes,
                books: uniqueBooks.size,
                completed: completedBooksSet.size
            }
        };
    },

    renderStudentMetricTab({ key, label, unit, displayValue, active }) {
        const activeClass = active
            ? 'border-blue-400/60 bg-blue-500/10 ring-1 ring-blue-400/30'
            : 'border-slate-700/50 hover:border-blue-400/30';
        const arrow = active ? '▴' : '▾';
        return `
            <button type="button" class="text-left bg-slate-900/40 rounded-xl border ${activeClass} transition-colors p-4 relative" data-metric-tab="${key}" onclick="App.switchStudentMetricTab('${key}')">
                <div class="text-2xl font-bold text-blue-400 text-center">${displayValue}</div>
                <div class="text-xs text-slate-400 text-center">${unit}</div>
                <div class="text-xs text-slate-500 text-center">${label}</div>
                <span class="absolute top-2 right-3 text-[10px] text-slate-500" data-metric-arrow>${arrow}</span>
            </button>
        `;
    },

    renderStudentMetricPanel({ key, label, records, columns, emptyText, hint }) {
        const tableHeaders = columns.map(c => `<th class="px-3 py-1.5 text-left font-normal text-slate-500">${c.label}</th>`).join('');
        const tableRows = records.length
            ? records.map((r, i) => `
                <tr class="border-b border-slate-700/40 hover:bg-slate-700/20">
                    ${columns.map(c => `<td class="px-3 py-1.5 text-slate-300">${c.render(r, i)}</td>`).join('')}
                </tr>
            `).join('')
            : `<tr><td colspan="${columns.length}" class="px-3 py-8 text-center text-slate-500">${emptyText || '当前时间范围内暂无明细数据'}</td></tr>`;

        const isActive = this._studentMetricTab === key;
        return `
            <div class="student-metric-panel ${isActive ? '' : 'hidden'}" data-metric-panel="${key}">
                <div class="text-[11px] text-slate-400 mb-2">${hint || `${label}的具体阅读明细`}</div>
                <div class="rounded-lg border border-slate-700/50 overflow-hidden">
                    <table class="w-full text-xs">
                        <thead class="bg-slate-800/60">
                            <tr>${tableHeaders}</tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    switchStudentMetricTab(key) {
        // 再次点击同一个则收起
        const next = this._studentMetricTab === key ? null : key;
        this._studentMetricTab = next;
        document.querySelectorAll('[data-metric-tab]').forEach(btn => {
            const active = btn.dataset.metricTab === next;
            btn.classList.toggle('border-blue-400/60', active);
            btn.classList.toggle('bg-blue-500/10', active);
            btn.classList.toggle('ring-1', active);
            btn.classList.toggle('ring-blue-400/30', active);
            btn.classList.toggle('border-slate-700/50', !active);
            btn.classList.toggle('hover:border-blue-400/30', !active);
            const arrow = btn.querySelector('[data-metric-arrow]');
            if (arrow) arrow.textContent = active ? '▴' : '▾';
        });
        document.querySelectorAll('[data-metric-panel]').forEach(panel => {
            panel.classList.toggle('hidden', panel.dataset.metricPanel !== next);
        });
        const wrapper = document.getElementById('student-metric-panel-wrapper');
        if (wrapper) wrapper.classList.toggle('hidden', !next);
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

        // 重置园所数据页的子标签与搜索状态，避免跨角色残留（如 admin 的"学校筛选"搜索栏）
        this.schoolDataTab = 'overview';
        this.schoolSearchKeyword = '';

        this.updateRoleUI();
        this.updateSidebarForRole();

        const switcher = document.getElementById('role-switcher');
        if (switcher) switcher.classList.add('hidden');

        const targetPage = (role === 'teacher' && this.currentPage === 'dataOverview')
            ? 'schoolData'
            : this.currentPage;
        this.loadPage(targetPage);
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
                readingDuration: (totalDuration * 0.42).toFixed(1),
                llmBookCount: Math.max(0, this.scaleNumber(MockData.dataOverviewStats.llmBookCount || 0, ratio, activities.length ? 1 : 0)),
                llmChatCount: Math.max(0, this.scaleNumber(MockData.dataOverviewStats.llmChatCount || 0, ratio, activities.length ? 1 : 0))
            },
            bookTypes: source.bookTypes.map(item => ({
                ...item,
                value: Math.max(1, this.scaleNumber(item.value, ratio, activities.length ? 1 : 0))
            })),
            bookTypeTimeSeries: this.buildBookTypeTimeSeries(),
            abilityDistribution: this.computeAbilityDistributionForOverview(),
            weeklyActivity,
            teacherRanking: this.buildRanking(teacherMap, 10, name => ({
                class: MockData.teacherRanking.find(item => item.name === name)?.class || ''
            })),
            classUsageComparison: this.currentRole === 'admin' ? this.getAdminClassUsageComparison() : null,
            kindergartenUsageSeries: this.currentRole === 'admin' ? this.buildKindergartenUsageSeries() : null,
            classRanking: MockData.classRanking,
            bookRanking: source.bookRanking.map(item => ({
                ...item,
                reads: this.scaleNumber(item.reads, ratio, activities.length ? 1 : 0),
                duration: `${(parseFloat(item.duration) * (ratio || 0)).toFixed(1)}h`
            }))
        };
    },

    getSchoolOverviewDataForCurrentRange() {
        if (this.isTeacherScope()) {
            return this.getTeacherClassOverviewData();
        }
        const activities = this.getFilteredActivitiesByDateRange('schoolOverview');
        const base = MockData.schoolData.overview;
        const totalActivities = MockData.schoolData.activities.length || 1;
        const ratio = activities.length / totalActivities;
        const activityDuration = activities.length * 0.5;
        const studentTotal = activities.reduce((sum, item) => sum + (item.studentCount || 0), 0);
        const llmBookBase = base.llmBookCount != null ? base.llmBookCount : (MockData.dataOverviewStats?.llmBookCount || 0);
        const llmChatBase = base.llmChatCount != null ? base.llmChatCount : (MockData.dataOverviewStats?.llmChatCount || 0);
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
            llmBookCount: this.scaleNumber(llmBookBase, ratio, activities.length ? 1 : 0),
            llmChatCount: this.scaleNumber(llmChatBase, ratio, activities.length ? 1 : 0),
            categoryData: base.categoryData.map(item => ({
                ...item,
                readCount: this.scaleNumber(item.readCount, ratio, activities.length ? 1 : 0),
                duration: `${(parseFloat(item.duration) * (ratio || 0)).toFixed(2)}h`
            }))
        };
    },

    getTeacherClassOverviewData() {
        const cls = this.selectedClass;
        const className = cls.name;
        const activities = this.getFilteredActivitiesByDateRange('schoolOverview')
            .filter(a => a.className === className);
        const stats = cls.bookTypeStats || {};
        const totalReads = Object.values(stats).reduce((a, b) => a + b, 0);
        const allCategories = ['日常生活', '人际交往', '情商品格', '国学文化', '科普百科', '语言学习'];
        const categoryData = allCategories.map(name => {
            const count = stats[name] || 0;
            return {
                name,
                readCount: count,
                duration: `${(count * 0.05).toFixed(2)}h`
            };
        });
        // 若班级自身无 LLM 字段，按班级活动占园所总活动比例推算
        const allActivities = MockData.schoolData?.activities || [];
        const ratio = allActivities.length ? activities.length / allActivities.length : 0;
        const baseLlmBook = MockData.schoolData?.overview?.llmBookCount ?? MockData.dataOverviewStats?.llmBookCount ?? 0;
        const baseLlmChat = MockData.schoolData?.overview?.llmChatCount ?? MockData.dataOverviewStats?.llmChatCount ?? 0;
        const llmBookCount = cls.llmBookCount != null ? cls.llmBookCount : Math.max(0, this.scaleNumber(baseLlmBook, ratio, activities.length ? 1 : 0));
        const llmChatCount = cls.llmChatCount != null ? cls.llmChatCount : Math.max(0, this.scaleNumber(baseLlmChat, ratio, activities.length ? 1 : 0));
        return {
            activityTotal: activities.length,
            activityDuration: (activities.length * 0.5).toFixed(1),
            bookTotal: Object.keys(stats).length,
            bookReadCount: totalReads,
            bookReadDuration: (parseFloat(cls.activityDuration) || 0).toFixed(1),
            deviceTotal: cls.deviceUseCount || 0,
            deviceUseCount: cls.deviceUseCount || 0,
            deviceUseDuration: '—',
            classTotal: 1,
            teacherTotal: cls.teachers?.length || cls.teacherCount || 0,
            studentTotal: cls.studentCount,
            llmBookCount,
            llmChatCount,
            categoryData
        };
    },

    getSchoolOverviewBookRecommendations() {
        const isPrincipal = this.currentRole === 'principal';
        const scope = isPrincipal ? '园所' : '本班';
        const allBooks = (MockData.schoolData?.books || []).slice();
        let scopedBooks = allBooks;
        if (this.isTeacherScope()) {
            const stats = this.selectedClass.bookTypeStats || {};
            scopedBooks = allBooks.filter(b => stats[b.type] != null);
        }
        const findBookMeta = (name) => allBooks.find(x => x.name === name)
            || scopedBooks.find(x => x.name === name)
            || { name, type: '—', readCount: 0 };

        const result = [];
        const used = new Set();
        const push = (book, highlight, reason) => {
            if (!book || used.has(book.name)) return;
            used.add(book.name);
            result.push({ ...book, highlight, reason });
        };

        // 1) 近 1 个月园所阅读次数最多的绘本 —— 高热度
        const topRead = [...scopedBooks].sort((a, b) => b.readCount - a.readCount)[0];
        if (topRead) {
            push(topRead, '高热度',
                `${scope}近 1 个月阅读 ${topRead.readCount} 次，位列榜首，覆盖班级广，建议作为下周共读重点书目。`);
        }

        // 2 / 3) 近 1 个月大模型互动 Top1 / Top2 —— 高互动
        const interactionMap = new Map();
        const records = MockData.studentChatRecords || {};
        Object.values(records).forEach(activities => {
            (activities || []).forEach(act => {
                (act.books || []).forEach(b => {
                    let turns = 0;
                    (b.conversations || []).forEach(c => { turns += (c.turns || []).length; });
                    const cur = interactionMap.get(b.bookName) || { name: b.bookName, type: b.bookType, count: 0 };
                    cur.count += turns;
                    interactionMap.set(b.bookName, cur);
                });
            });
        });
        const interactionRanked = [...interactionMap.values()].sort((a, b) => b.count - a.count);
        let picked = 0;
        for (const item of interactionRanked) {
            if (picked >= 2) break;
            if (used.has(item.name)) continue;
            const meta = findBookMeta(item.name);
            push({ ...meta, name: item.name, type: meta.type || item.type }, '高互动',
                `近 1 个月 AI 共读互动 ${item.count} 轮，孩子们提问活跃，适合扩大共读范围。`);
            picked++;
        }

        // 4) 园所读得最少的类型 —— 该类型中（全部绘本）阅读量最多的一本 —— 可拓展
        const categoryData = this.isTeacherScope()
            ? Object.entries(this.selectedClass.bookTypeStats || {}).map(([name, readCount]) => ({ name, readCount: Number(readCount) || 0 }))
            : (MockData.schoolData?.overview?.categoryData || []);
        if (categoryData.length) {
            const leastType = [...categoryData].sort((a, b) => a.readCount - b.readCount)[0];
            const pick = allBooks
                .filter(b => b.type === leastType.name && !used.has(b.name))
                .sort((a, b) => b.readCount - a.readCount)[0];
            if (pick) {
                push(pick, '可拓展',
                    `${scope}对「${leastType.name}」类型阅读较少（仅 ${leastType.readCount} 次），《${pick.name}》是该类型阅读量最高的一本，可作为类型拓展首选。`);
            }
        }

        // 兜底：若不足 4 本，按阅读量补齐为「可拓展」
        if (result.length < 4) {
            const sortedRead = [...scopedBooks].sort((a, b) => b.readCount - a.readCount);
            for (const b of sortedRead) {
                if (result.length >= 4) break;
                if (used.has(b.name)) continue;
                push(b, '可拓展',
                    `阅读 ${b.readCount} 次，可结合「${b.type}」开展延展活动（手工 / 角色扮演 / 亲子共读）。`);
            }
        }

        return result.slice(0, 4);
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
        // 区域数据页已并入大数据总览：admin 角色隐藏侧边栏入口
        const schoolDataItem = document.getElementById('nav-schoolData');
        if (schoolDataItem) {
            if (this.currentRole === 'admin') {
                schoolDataItem.classList.add('hidden-role');
            } else {
                schoolDataItem.classList.remove('hidden-role');
            }
        }
        // AI总览：园长和教师都可见
        const aiOverviewItem = document.getElementById('nav-aiOverview');
        if (aiOverviewItem) {
            if (this.currentRole === 'principal' || this.currentRole === 'teacher') {
                aiOverviewItem.classList.remove('hidden-role');
            } else {
                aiOverviewItem.classList.add('hidden-role');
            }
        }
        // 教师视角下"园所数据"菜单显示为"班级数据"
        const schoolDataLabel = document.getElementById('nav-schoolData-label');
        if (schoolDataLabel) {
            schoolDataLabel.textContent = this.currentRole === 'teacher' ? '班级数据' : '园所数据';
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
    },

    loadPage(pageName) {
        // 权限检查：只有管理员和园长可以访问大数据总览，教师不能
        if (pageName === 'dataOverview' && this.currentRole === 'teacher') {
            pageName = 'schoolData';
        }
        // 区域数据页已并入大数据总览：admin 未选具体园所时跳回大数据总览
        if (pageName === 'schoolData' && this.currentRole === 'admin' && !this.selectedSchool) {
            pageName = 'dataOverview';
        }
        // 权限检查：AI总览仅园长和教师可见
        if (pageName === 'aiOverview' && this.currentRole !== 'principal' && this.currentRole !== 'teacher') {
            pageName = 'dataOverview';
        }

        // 离开 AI 总览时停止轮询
        if (this.currentPage === 'aiOverview' && pageName !== 'aiOverview') {
            this.teardownAiOverviewPage();
        }

        this.currentPage = pageName;
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageName);
        });
        const breadcrumbMap = {
            dataOverview: '首页 / 大数据总览',
            schoolData: this.currentRole === 'teacher'
                ? '首页 / 班级数据'
                : this.currentRole === 'admin'
                    ? `首页 / 大数据总览 / ${this.selectedSchool ? this.selectedSchool.name : '园所详情'}`
                    : '首页 / 园所数据',
            aiOverview: '首页 / AI总览',
        };
        document.getElementById('breadcrumb').textContent = breadcrumbMap[pageName] || '首页';
        Charts.dispose();
        const container = document.getElementById('page-container');
        // 立刻渲染骨架占位（仅切页时，重渲染同页不重复）
        if (container && this._lastLoadedPage !== pageName) {
            container.innerHTML = `<div class="p-2">${this.skeletonFor('overview')}</div>`;
        }
        this._lastLoadedPage = pageName;
        requestAnimationFrame(() => {
            switch (pageName) {
                case 'dataOverview': container.innerHTML = this.renderDataOverviewPage(); break;
                case 'schoolData': container.innerHTML = this.renderSchoolDataPage(); break;
                case 'aiOverview': container.innerHTML = this.renderAiOverviewPage(); break;
                case 'activityDetail': container.innerHTML = this._activityDetailContent || '<div class="p-6 text-center text-slate-500">加载中...</div>'; break;
                default: container.innerHTML = this.renderDataOverviewPage();
            }
            requestAnimationFrame(() => {
                requestAnimationFrame(() => this.initPageContent(pageName));
            });
        });
    },

    initPageContent(pageName) {
        switch (pageName) {
            case 'dataOverview':
                const overviewData = this.getOverviewDataForCurrentRange();
                Charts.initDataOverviewCharts(overviewData);
                this.renderDataOverviewRankings(overviewData.bookRanking);
                if (this.currentRole === 'admin') {
                    // 园所使用次数趋势（取代原 admin 区域绘本活动次数）
                    requestAnimationFrame(() => {
                        const data = this.buildKindergartenUsageSeries();
                        Charts.safeInit(() => Charts.initKindergartenUsageLine(data, this.kindergartenUsageChartTypes));
                    });
                    // 园所横向对比表
                    const host = document.getElementById('regional-school-compare-host');
                    if (host) host.innerHTML = this.renderRegionalSchoolCompare();
                }
                if (this.currentRole === 'principal') {
                    // 班级横向对比表
                    const classHost = document.getElementById('class-compare-host');
                    if (classHost) classHost.innerHTML = this.renderClassCompare();
                    // 班级开课情况变化（原来在园所数据 - 数据概述）
                    const classActHost = document.getElementById('school-class-activity-host');
                    if (classActHost) {
                        classActHost.innerHTML = this.renderSchoolClassActivityHeader() + '<div id="school-class-activity-chart" class="h-72"></div>';
                        requestAnimationFrame(() => {
                            const data = this.buildSchoolClassUsageSeries();
                            Charts.safeInit(() => Charts.initSchoolClassActivityChart(data, this.schoolClassChart.types));
                        });
                    }
                }
                break;
            case 'schoolData': this.initSchoolDataPage(); break;
            case 'aiOverview': this.initAiOverviewPage(); break;
            case 'activityDetail': break; // 详情页无需初始化
        }
    },

    toggleFullscreen() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    },

    // 收起 / 展开左侧菜单
    initSidebarCollapse() {
        const collapsed = localStorage.getItem('sidebarCollapsed') === '1';
        document.body.classList.toggle('sidebar-collapsed', collapsed);
        this.updateSidebarToggleTitle(collapsed);
    },
    toggleSidebar() {
        const collapsed = document.body.classList.toggle('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0');
        this.updateSidebarToggleTitle(collapsed);
        // 宽度过渡(300ms)结束后触发 resize，让 ECharts 图表自适应新布局
        setTimeout(() => window.dispatchEvent(new Event('resize')), 320);
    },
    updateSidebarToggleTitle(collapsed) {
        const btn = document.getElementById('sidebar-toggle');
        if (btn) btn.title = collapsed ? '展开菜单' : '收起菜单';
    },

    filterBanjunDistrict(district) {
        const overviewData = this.getOverviewDataForCurrentRange();
        if (!overviewData || !overviewData.classUsageComparison) return;
        const chips = document.querySelectorAll('#banjun-district-chips .banjun-chip');
        chips.forEach(chip => {
            const isActive = chip.dataset.district === district;
            chip.classList.toggle('bg-brand-500', isActive);
            chip.classList.toggle('text-white', isActive);
            chip.classList.toggle('border-brand-500', isActive);
            chip.classList.toggle('bg-white/40', !isActive);
            chip.classList.toggle('text-slate-600', !isActive);
            chip.classList.toggle('border-slate-300/40', !isActive);
        });
        const dom = document.getElementById('banjun-scatter-chart');
        if (dom && typeof echarts !== 'undefined') {
            const existing = echarts.getInstanceByDom(dom);
            if (existing) existing.dispose();
        }
        Charts.initBanjunScatter('banjun-scatter-chart', overviewData.classUsageComparison, district);
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

    openModal(html, options = {}) {
        const content = document.getElementById('modal-content');
        const overlay = document.getElementById('modal-overlay');
        if (!content || !overlay) return;
        // 切换弹窗最大宽度（默认 max-w-3xl，可通过 options.size 改为 'wide' / 'xwide'）
        const sizeMap = { default: 'max-w-3xl', wide: 'max-w-4xl', xwide: 'max-w-5xl', xxwide: 'max-w-6xl' };
        const target = sizeMap[options.size] || sizeMap.default;
        Object.values(sizeMap).forEach(c => content.classList.remove(c));
        content.classList.add(target);
        content.innerHTML = html;
        // 焦点管理：记录触发元素，焦点移入弹窗，ESC 关闭
        this._modalReturnFocus = document.activeElement;
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
        // 推迟一帧让浏览器完成布局，再聚焦（兼容动画/transition）
        requestAnimationFrame(() => {
            const firstFocusable = content.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            (firstFocusable || content).focus();
        });
        if (!this._modalKeyHandler) {
            this._modalKeyHandler = (e) => {
                if (e.key === 'Escape' && !document.getElementById('modal-overlay')?.classList.contains('hidden')) {
                    this.closeModalDirect();
                }
            };
            document.addEventListener('keydown', this._modalKeyHandler);
        }
    },
    closeModal(e) {
        if (e && e.target !== document.getElementById('modal-overlay')) return;
        this._closeModalCore();
    },
    closeModalDirect() {
        this._closeModalCore();
    },
    _closeModalCore() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.setAttribute('aria-hidden', 'true');
        }
        this._currentClassDetailId = null;
        this._currentStudentReportId = null;
        this._aiDialogReturnTo = null;
        this._aiDrilldown = null;
        // 焦点归位到触发按钮
        if (this._modalReturnFocus && typeof this._modalReturnFocus.focus === 'function') {
            try { this._modalReturnFocus.focus(); } catch (e) {}
        }
        this._modalReturnFocus = null;
        if (this._modalKeyHandler) {
            document.removeEventListener('keydown', this._modalKeyHandler);
            this._modalKeyHandler = null;
        }
        this._refreshAiOverviewAfterModal();
    },
    _refreshAiOverviewAfterModal() {
        if (this.currentPage !== 'aiOverview') return;
        this.refreshAiMetricPanel();
        const grid = document.getElementById('ai-summary-grid');
        if (grid) grid.innerHTML = this.renderAiSummaryCards(this.getAiOverviewSummary());
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
            ${growth ? `<div class="text-xs ${c.text} mt-1.5 flex items-center gap-1"><svg class="w-3 h-3" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>${growth}</div>` : ''}
        </div>`;
    },

    // 小指标块
    miniStat(label, value, color = 'blue') {
        const colorMap = { blue: 'text-blue-400 bg-blue-500/12 border-blue-500/25', emerald: 'text-emerald-400 bg-emerald-500/12 border-emerald-500/25', purple: 'text-purple-400 bg-purple-500/12 border-purple-500/25', amber: 'text-amber-400 bg-amber-500/12 border-amber-500/25', cyan: 'text-cyan-400 bg-cyan-500/12 border-cyan-500/25' };
        const c = colorMap[color] || colorMap.blue;
        return `<div class="${c} rounded-xl p-3 text-center border"><div class="text-xl font-bold">${value}</div><div class="text-xs text-slate-400 mt-1">${label}</div></div>`;
    },

    // 图表标题（支持右侧小问号气泡，hover 显示统计/数据来源说明）
    chartTitle(title, colorClass = 'bg-blue-500', helpText = '') {
        return `<h3 class="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <span class="w-1.5 h-5 ${colorClass} rounded-full"></span>
            <span class="flex items-center gap-1.5">${title}${this.helpIcon(helpText)}</span>
        </h3>`;
    },

    // 复用：仅返回小问号气泡（用于自定义 header）
    helpIcon(helpText = '') {
        if (!helpText) return '';
        // tooltip 内容用 data-help 而非内联 span：hover 时由 _showHelpTip 用 fixed 定位投影到 body，
        // 避免被卡片 overflow:hidden 或窄列裁剪
        const safe = String(helpText).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        return `<span class="chart-help" tabindex="0" aria-label="规则说明"
            data-help="${safe}"
            onmouseenter="App._showHelpTip(this)"
            onmouseleave="App._hideHelpTip()"
            onfocus="App._showHelpTip(this)"
            onblur="App._hideHelpTip()">
            <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="9"/></svg>
        </span>`;
    },

    // 原始语音播放按钮（mock：用 Web Audio 合成一段时长与提问文本相关的"声纹"，模拟点击播放原始录音）
    _voiceBtnSeq: 0,
    voicePlayButton(text = '', label = '原始录音') {
        const safe = String(text || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const id = `voice-btn-${++this._voiceBtnSeq}`;
        const seconds = Math.max(1.2, Math.min(4.5, ((text || '').length || 1) * 0.18));
        const dur = seconds.toFixed(1);
        return `<button id="${id}" type="button"
            class="voice-play-btn"
            data-q="${safe}"
            data-duration="${dur}"
            onclick="event.stopPropagation();App.playVoiceFromButton('${id}')"
            title="${label} · ${dur}s">
            <svg class="voice-play-icon" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 5v14l11-7z"/></svg>
            <svg class="voice-pause-icon hidden" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5h2v14H9zM13 5h2v14h-2z"/></svg>
            <span class="voice-wave" aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span>
            </span>
            <span class="voice-time">${dur}"</span>
        </button>`;
    },

    _voiceCtx: null,
    _voicePlaying: null, // { id, stop }
    playVoiceFromButton(id) {
        const btn = document.getElementById(id);
        if (!btn) return;
        // 当前正在播的就是它本身 → 停止
        if (this._voicePlaying && this._voicePlaying.id === id) {
            this._voicePlaying.stop();
            return;
        }
        // 当前正在播别的 → 先停，再放新的
        if (this._voicePlaying) {
            try { this._voicePlaying.stop(); } catch (e) {}
        }
        const text = btn.dataset.q || '';
        const duration = parseFloat(btn.dataset.duration || '2.0') || 2.0;
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) {
            this.toast?.('当前浏览器不支持 Web Audio，无法播放');
            return;
        }
        if (!this._voiceCtx) this._voiceCtx = new AudioCtor();
        const ctx = this._voiceCtx;
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;

        // 用文本字符 codepoint 当作"音高种子"，让每条提问声音略不同（模拟童声）
        const base = 320 + ((text.charCodeAt(0) || 0) % 70); // 320~390Hz
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(base, now);
        osc2.frequency.setValueAtTime(base * 1.5, now);

        // 简单做一点起伏，让"录音"不像纯蜂鸣
        const segs = Math.max(3, Math.min(8, Math.round(duration * 2)));
        for (let i = 0; i < segs; i++) {
            const t = now + (i / segs) * duration;
            const f = base * (0.85 + 0.4 * Math.sin(i * 1.7));
            osc1.frequency.linearRampToValueAtTime(f, t);
            osc2.frequency.linearRampToValueAtTime(f * 1.5, t);
        }

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
        gain.gain.linearRampToValueAtTime(0.18, now + duration - 0.1);
        gain.gain.linearRampToValueAtTime(0.0001, now + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration + 0.05);
        osc2.stop(now + duration + 0.05);

        btn.classList.add('is-playing');
        btn.querySelector('.voice-play-icon')?.classList.add('hidden');
        btn.querySelector('.voice-pause-icon')?.classList.remove('hidden');

        const cleanup = () => {
            btn.classList.remove('is-playing');
            btn.querySelector('.voice-play-icon')?.classList.remove('hidden');
            btn.querySelector('.voice-pause-icon')?.classList.add('hidden');
            if (this._voicePlaying && this._voicePlaying.id === id) this._voicePlaying = null;
        };
        const stop = () => {
            try { osc1.stop(); osc2.stop(); } catch (e) {}
            try { gain.disconnect(); } catch (e) {}
            cleanup();
        };
        const timer = setTimeout(cleanup, duration * 1000 + 80);
        this._voicePlaying = { id, stop: () => { clearTimeout(timer); stop(); } };
    },

    _ensureHelpTip() {
        let tip = document.getElementById('global-help-tip');
        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'global-help-tip';
            tip.className = 'global-help-tip';
            document.body.appendChild(tip);
        }
        return tip;
    },

    _showHelpTip(el) {
        if (!el) return;
        const text = el.getAttribute('data-help') || '';
        if (!text) return;
        const tip = this._ensureHelpTip();
        tip.textContent = text;
        tip.style.whiteSpace = 'pre-line';

        // 先显示再测量，再修正位置（避免 0 尺寸）
        tip.classList.add('show');
        const r = el.getBoundingClientRect();
        const tipW = tip.offsetWidth;
        const tipH = tip.offsetHeight;
        const margin = 8;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // 默认在下方居中；超出右边界则右对齐；超出左边界则左对齐
        let left = r.left + r.width / 2 - tipW / 2;
        if (left + tipW + margin > vw) left = vw - tipW - margin;
        if (left < margin) left = margin;

        let top = r.bottom + margin;
        // 下方放不下则放上方
        if (top + tipH + margin > vh) {
            top = r.top - tipH - margin;
            tip.classList.add('above');
        } else {
            tip.classList.remove('above');
        }

        tip.style.left = `${Math.round(left)}px`;
        tip.style.top = `${Math.round(top)}px`;
    },

    _hideHelpTip() {
        const tip = document.getElementById('global-help-tip');
        if (tip) tip.classList.remove('show', 'above');
    },

    renderAdminClassUsageComparison(data) {
        if (!data || !data.schools || data.schools.length === 0) {
            return `
                <div class="space-y-4">
                    <div class="flex items-center justify-between gap-3">
                        ${this.chartTitle('园所班均使用对比', 'bg-cyan-500', '统计范围：当前所选时间范围内全区园所数据。\n口径：每所园所的指标 = 园所总值 / 班级数（即"班均"）。\n指标含义：班均活动次数、班均活动时长、班均设备使用次数、班均参与人数。\n用途：消除园所规模差异后，横向比较各园所的活跃度。')}
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
            const fullRanked = [...schools].sort((a, b) => b[config.key] - a[config.key]);
            const ranked = fullRanked.slice(0, 5);
            const maxValue = fullRanked[0]?.[config.key] || 1;
            return `
                <div class="rounded-[24px] border border-slate-600/20 bg-gradient-to-b from-slate-800/60 to-slate-800/50 p-5 shadow-xl">
                    <div class="flex items-center justify-between gap-3 mb-4">
                        <div>
                            <div class="text-sm font-semibold text-white">${config.title} TOP5</div>
                            <div class="text-xs text-slate-400 mt-0.5">区域平均 ${config.avgValue}${config.unit}</div>
                        </div>
                        <button onclick="App.openSchoolMetricRankingModal('${config.key}')"
                            class="text-[11px] px-2 py-0.5 rounded-md border border-slate-500/30 text-slate-300 hover:text-white hover:border-cyan-400/40 transition-colors"
                            title="弹窗查看全部园所，可按列排序">查看全部 →</button>
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
                    ${this.chartTitle('园所班均使用对比', 'bg-cyan-500', '统计范围：当前所选时间范围内全区园所数据。\n口径：每所园所的指标 = 园所总值 / 班级数（即"班均"）。\n指标含义：班均活动次数、班均活动时长、班均设备使用次数、班均参与人数。\n用途：消除园所规模差异后，横向比较各园所的活跃度。')}
                    <div class="text-xs text-slate-300 px-3 py-1.5 rounded-full border border-slate-400/20 bg-slate-700/30 w-fit">区域内各园所班均数据</div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    <!-- 左侧:区域概览 + 散点气泡图 -->
                    <div class="rounded-[26px] border border-slate-600/20 bg-gradient-to-br from-slate-800/70 via-slate-800/60 to-slate-800/50 p-5 shadow-xl flex flex-col">
                        <div class="text-xs uppercase tracking-[0.24em] text-sky-200/70">区域概览</div>
                        <div class="mt-2 text-2xl font-semibold text-white leading-tight">区域园所班均使用分布</div>
                        <div class="mt-1 text-xs text-slate-400">气泡大小 = 班级数,虚线 = 区域均值,4 象限快速识别园所表现</div>
                        <div class="mt-4 grid grid-cols-2 gap-3">
                            <div class="rounded-2xl border border-slate-600/20 bg-gradient-to-br from-[#0e7490]/15 to-slate-800/30 px-4 py-3">
                                <div class="text-xs text-sky-100/80">区域平均班均活动次数</div>
                                <div class="mt-1 text-2xl font-bold text-white">${data.summary.avgActivityCount}<span class="text-xs text-slate-400 ml-1 font-normal">次/班</span></div>
                            </div>
                            <div class="rounded-2xl border border-slate-600/20 bg-gradient-to-br from-[#2563eb]/15 to-slate-800/30 px-4 py-3">
                                <div class="text-xs text-blue-100/80">区域平均班均参与人次</div>
                                <div class="mt-1 text-2xl font-bold text-white">${data.summary.avgParticipantCount}<span class="text-xs text-slate-400 ml-1 font-normal">人次/班</span></div>
                            </div>
                        </div>
                        <!-- 区域筛选 chips -->
                        <div id="banjun-district-chips" class="mt-4 flex flex-wrap gap-1.5">
                            ${(() => {
                                const districts = ['all', ...Array.from(new Set(schools.map(s => s.district || '未分类')))];
                                return districts.map(d => {
                                    const label = d === 'all' ? `全部 ${schools.length}` : `${d} ${schools.filter(s => (s.district || '未分类') === d).length}`;
                                    const active = d === 'all';
                                    return `<button type="button" class="banjun-chip text-[11px] px-2.5 py-1 rounded-full border transition-colors ${active ? 'bg-brand-500 text-white border-brand-500' : 'bg-white/40 text-slate-600 border-slate-300/40 hover:bg-brand-50'}" data-district="${d}" onclick="App.filterBanjunDistrict('${d.replace(/'/g, "\\'")}')">${label}</button>`;
                                }).join('');
                            })()}
                        </div>
                        <!-- 散点气泡图 -->
                        <div id="banjun-scatter-chart" class="mt-3 flex-1 min-h-[300px]"></div>
                        <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div class="rounded-xl border border-slate-600/15 bg-slate-800/40 px-3 py-2">
                                <div class="text-slate-500">活动次数最高</div>
                                <div class="mt-0.5 font-semibold text-white truncate">${topActivitySchool.name}</div>
                                <div class="text-sky-300 font-bold">${topActivitySchool.avgActivityCount} <span class="text-slate-500 font-normal">次/班</span></div>
                            </div>
                            <div class="rounded-xl border border-slate-600/15 bg-slate-800/40 px-3 py-2">
                                <div class="text-slate-500">参与人次最高</div>
                                <div class="mt-0.5 font-semibold text-white truncate">${topParticipantSchool.name}</div>
                                <div class="text-blue-300 font-bold">${topParticipantSchool.avgParticipantCount} <span class="text-slate-500 font-normal">人次/班</span></div>
                            </div>
                        </div>
                    </div>
                    <!-- 中/右侧:两个排行卡 -->
                    ${metricConfigs.map(renderMetricRanking).join('')}
                </div>
            </div>
        `;
    },

    // —— 园所班均使用对比 · "查看全部"弹窗 ——
    schoolMetricModalState: {
        metric: 'avgActivityCount',
        sort: { key: 'avgActivityCount', dir: 'desc' }
    },
    openSchoolMetricRankingModal(metricKey) {
        this.schoolMetricModalState.metric = metricKey;
        this.schoolMetricModalState.sort = { key: metricKey, dir: 'desc' };
        this.openModal(this.renderSchoolMetricRankingModal(), { size: 'wide' });
    },
    setSchoolMetricRankingSort(key) {
        const s = this.schoolMetricModalState.sort;
        if (s.key === key) {
            s.dir = s.dir === 'asc' ? 'desc' : 'asc';
        } else {
            s.key = key;
            s.dir = 'desc';
        }
        const host = document.getElementById('modal-content');
        if (host) host.innerHTML = this.renderSchoolMetricRankingModal();
    },
    renderSchoolMetricRankingModal() {
        const cmp = this.getAdminClassUsageComparison();
        const schools = (cmp && cmp.schools) || [];
        const summary = (cmp && cmp.summary) || {};
        const state = this.schoolMetricModalState;
        const metricMeta = {
            avgActivityCount:    { title: '班均活动次数',  unit: '次/班',  avg: summary.avgActivityCount },
            avgParticipantCount: { title: '班均参与人次',  unit: '人次/班', avg: summary.avgParticipantCount },
            avgActivityDuration: { title: '班均活动时长',  unit: 'h/班' },
            avgDeviceUseCount:   { title: '班均设备使用次数', unit: '次/班' }
        };
        const meta = metricMeta[state.metric] || metricMeta.avgActivityCount;
        // 表格列（含 4 个排序口径）
        const cols = [
            { key: 'rank', label: '排名', sortable: false, align: 'text-center', width: 'w-16' },
            { key: 'name', label: '园所', sortable: false, align: 'text-left' },
            { key: 'district', label: '区域', sortable: false, align: 'text-center' },
            { key: 'classCount', label: '班级数', sortable: true, align: 'text-center' },
            { key: 'avgActivityCount', label: '班均活动次数', sortable: true, align: 'text-center' },
            { key: 'avgActivityDuration', label: '班均活动时长(h)', sortable: true, align: 'text-center' },
            { key: 'avgParticipantCount', label: '班均参与人次', sortable: true, align: 'text-center' },
            { key: 'avgDeviceUseCount', label: '班均设备使用次数', sortable: true, align: 'text-center' }
        ];
        const sorted = this.sortByKey(schools, state.sort);
        const renderTh = (c) => {
            if (!c.sortable) {
                return `<th class="px-3 py-2.5 ${c.align} ${c.width || ''} text-xs font-medium text-slate-400 uppercase tracking-wider">${c.label}</th>`;
            }
            const isActive = state.sort.key === c.key;
            const arrow = isActive ? (state.sort.dir === 'asc' ? '▲' : '▼') : '↕';
            const focusCls = c.key === state.metric ? 'text-cyan-300' : 'text-slate-400';
            return `<th class="px-3 py-2.5 ${c.align} text-xs font-medium uppercase tracking-wider sortable-th ${isActive ? 'is-sorted' : ''} ${focusCls}"
                onclick="App.setSchoolMetricRankingSort('${c.key}')">${c.label}<span class="sort-arrow">${arrow}</span></th>`;
        };
        const rows = sorted.map((s, i) => `
            <tr class="hover:bg-blue-500/10 transition-colors">
                <td class="px-3 py-2.5 text-center text-slate-500">${i + 1}</td>
                <td class="px-3 py-2.5 font-medium text-slate-200">${s.name}</td>
                <td class="px-3 py-2.5 text-center text-slate-400">${s.district}</td>
                <td class="px-3 py-2.5 text-center text-slate-300 tabular-nums">${s.classCount || 0}</td>
                <td class="px-3 py-2.5 text-center tabular-nums ${state.metric === 'avgActivityCount' ? 'text-cyan-300 font-semibold' : 'text-slate-300'}">${s.avgActivityCount ?? '-'}</td>
                <td class="px-3 py-2.5 text-center tabular-nums ${state.metric === 'avgActivityDuration' ? 'text-cyan-300 font-semibold' : 'text-slate-300'}">${s.avgActivityDuration ?? '-'}</td>
                <td class="px-3 py-2.5 text-center tabular-nums ${state.metric === 'avgParticipantCount' ? 'text-cyan-300 font-semibold' : 'text-slate-300'}">${s.avgParticipantCount ?? '-'}</td>
                <td class="px-3 py-2.5 text-center tabular-nums ${state.metric === 'avgDeviceUseCount' ? 'text-cyan-300 font-semibold' : 'text-slate-300'}">${s.avgDeviceUseCount ?? '-'}</td>
            </tr>`).join('');
        const avgLine = meta.avg != null ? ` · 区域平均 <span class="text-slate-200 font-semibold">${meta.avg}${meta.unit}</span>` : '';
        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-white">园所班均使用对比 · 全部园所</h3>
                        <p class="text-xs text-slate-400 mt-1">默认按"${meta.title}"降序，点击列头切换其他指标排序${avgLine}</p>
                    </div>
                    <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                        <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="overflow-x-auto rounded-xl border border-slate-700/50 max-h-[70vh] overflow-y-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-800/80 border-b border-slate-700/60 sticky top-0 z-10">
                            <tr>${cols.map(renderTh).join('')}</tr>
                        </thead>
                        <tbody class="divide-y divide-slate-700/30">${rows || '<tr><td colspan="8" class="text-center text-slate-500 py-10">暂无数据</td></tr>'}</tbody>
                    </table>
                </div>
            </div>`;
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
        return `<button class="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1" onclick="${onclick}"><svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>${text}</button>`;
    },

    // 表格
    tableWrap(headers, rows, options = {}) {
        const summaryRow = options.summary || '';
        const renderHeader = h => {
            if (h.sortKey && h.sortScope) {
                const state = this.schoolSort?.[h.sortScope];
                const isActive = state && state.key === h.sortKey;
                const arrow = isActive ? (state.dir === 'asc' ? '▲' : '▼') : '↕';
                return `<th class="px-4 py-3 ${h.align || 'text-left'} font-medium text-xs uppercase tracking-wider sortable-th ${isActive ? 'is-sorted' : ''}"
                    onclick="App.toggleSort('${h.sortScope}','${h.sortKey}')">
                    ${h.label}<span class="sort-arrow">${arrow}</span>
                </th>`;
            }
            return `<th class="px-4 py-3 ${h.align || 'text-left'} font-medium text-xs uppercase tracking-wider">${h.label}</th>`;
        };
        return `<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="bg-slate-900/50 text-slate-400 border-b border-slate-700/50">${headers.map(renderHeader).join('')}</tr>${summaryRow}</thead><tbody class="divide-y divide-slate-700/30">${rows}</tbody></table></div>`;
    },

    // —— Skeleton（loading 占位） ——
    // 用法：container.innerHTML = App.skeletonFor('table' | 'overview' | 'chart')
    skeletonLine(width = '100%', height = 12) {
        return `<div class="skeleton-line" style="width:${width};height:${height}px"></div>`;
    },
    skeletonBlock(height = 80, extraClass = '') {
        return `<div class="skeleton-block ${extraClass}" style="height:${height}px"></div>`;
    },
    skeletonFor(type) {
        switch (type) {
            case 'table':
                return `
                    <div class="skeleton-stack" aria-hidden="true">
                        <div class="flex gap-3 mb-4">${this.skeletonBlock(40, 'flex-1')}${this.skeletonBlock(40, 'flex-1')}${this.skeletonBlock(40, 'w-24')}</div>
                        ${this.skeletonBlock(44)}
                        ${Array.from({ length: 8 }).map(() => this.skeletonBlock(40)).join('')}
                    </div>`;
            case 'chart':
                return `<div class="skeleton-block" style="height:288px" aria-hidden="true"></div>`;
            case 'overview':
                return `
                    <div class="skeleton-stack" aria-hidden="true">
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">${Array.from({ length: 4 }).map(() => this.skeletonBlock(80)).join('')}</div>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">${this.skeletonBlock(280)}${this.skeletonBlock(280)}</div>
                    </div>`;
            case 'compare':
                return `
                    <div class="skeleton-stack" aria-hidden="true">
                        ${this.skeletonBlock(280)}
                        <div class="flex gap-3">${this.skeletonBlock(40, 'flex-1')}${this.skeletonBlock(40, 'w-72')}</div>
                        ${Array.from({ length: 6 }).map(() => this.skeletonBlock(40)).join('')}
                    </div>`;
            default:
                return `<div class="skeleton-block" style="height:160px" aria-hidden="true"></div>`;
        }
    },

    // 状态标签
    badge(text, color = 'blue') {
        const colorMap = { blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20', green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', red: 'bg-red-500/15 text-red-400 border-red-500/20', purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20', amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20' };
        const c = colorMap[color] || colorMap.blue;
        return `<span class="px-2 py-0.5 rounded-full text-xs border ${c}">${text}</span>`;
    },

    // —— 区域数据页 admin · 园所横向对比表 ——
    regionalCompareState: {
        sort: { key: 'totalActivity', dir: 'desc' },
        keyword: '',
        district: 'all',
        showAll: false
    },
    regionalCompareSetSort(key) {
        const s = this.regionalCompareState.sort;
        if (s.key === key) {
            s.dir = s.dir === 'asc' ? 'desc' : 'asc';
        } else {
            s.key = key;
            s.dir = 'desc';
        }
        this.refreshRegionalCompare();
    },
    regionalCompareSetKeyword(v) {
        this.regionalCompareState.keyword = v || '';
        this.refreshRegionalCompare();
        // 恢复搜索框焦点与光标（整段重渲会丢焦）
        requestAnimationFrame(() => {
            const input = document.querySelector('#regional-school-compare-host input[type="text"]');
            if (input) {
                input.focus();
                const len = input.value.length;
                try { input.setSelectionRange(len, len); } catch (e) {}
            }
        });
    },
    regionalCompareSetDistrict(d) {
        this.regionalCompareState.district = d || 'all';
        this.refreshRegionalCompare();
    },
    regionalCompareToggleShowAll() {
        this.regionalCompareState.showAll = !this.regionalCompareState.showAll;
        this.refreshRegionalCompare();
    },
    // 园所横向对比刷新：优先刷新大数据总览页的 host，否则回退到园所数据页 compare tab
    refreshRegionalCompare() {
        const host = document.getElementById('regional-school-compare-host');
        if (host) {
            host.innerHTML = this.renderRegionalSchoolCompare();
            return;
        }
        if (this.currentPage === 'schoolData') this.renderSchoolTabContent('compare');
    },
    buildRegionalSchoolRows() {
        const cmp = this.getAdminClassUsageComparison();
        const schools = (cmp && cmp.schools) || [];
        return schools.map(s => {
            const classCount = s.classCount || 0;
            const totalActivity = Math.round((s.avgActivityCount || 0) * classCount);
            const totalDuration = Math.round((s.avgActivityDuration || 0) * classCount * 10) / 10;
            const totalParticipant = Math.round((s.avgParticipantCount || 0) * classCount);
            return {
                id: s.kindergartenId,
                name: s.name,
                district: s.district,
                classCount,
                totalActivity,
                totalDuration,
                totalParticipant,
                avgActivity: s.avgActivityCount || 0,
                avgDeviceUse: s.avgDeviceUseCount || 0
            };
        });
    },
    renderRegionalSchoolCompare() {
        const state = this.regionalCompareState;
        const all = this.buildRegionalSchoolRows();
        let filtered = all.slice();
        if (state.keyword) {
            const kw = state.keyword.trim();
            filtered = filtered.filter(r => PinyinUtil.match(r.name, kw));
        }
        filtered = this.sortByKey(filtered, state.sort);

        // 默认前 5 行；溢出时支持"全部展示/收起"
        const defaultLimit = 5;
        const overflow = filtered.length > defaultLimit;
        const rows = (state.showAll || !overflow) ? filtered : filtered.slice(0, defaultLimit);

        // 求各列最大值（用筛选后的全部）
        const max = (key) => Math.max(1, ...filtered.map(r => r[key] || 0));
        const maxAct = max('totalActivity');
        const maxDur = max('totalDuration');
        const maxPart = max('totalParticipant');
        const maxAvg = max('avgActivity');
        const maxDev = max('avgDeviceUse');

        // 汇总（仍按 filtered 全量）
        const sum = (key) => filtered.reduce((s, r) => s + (r[key] || 0), 0);
        const totalSchools = filtered.length;
        const sumClass = sum('classCount');
        const sumAct = sum('totalActivity');
        const sumDur = Math.round(sum('totalDuration') * 10) / 10;
        const sumPart = sum('totalParticipant');
        const avgOfAvg = totalSchools ? (filtered.reduce((s, r) => s + r.avgActivity, 0) / totalSchools) : 0;
        const avgOfDev = totalSchools ? (filtered.reduce((s, r) => s + r.avgDeviceUse, 0) / totalSchools) : 0;

        const sortState = state.sort;
        const renderTh = (label, key, align = 'text-center') => {
            const isActive = sortState.key === key;
            const arrow = isActive ? (sortState.dir === 'asc' ? '▲' : '▼') : '↕';
            return `<th class="px-3 py-3 ${align} text-xs font-medium uppercase tracking-wider sortable-th ${isActive ? 'is-sorted' : ''}"
                onclick="App.regionalCompareSetSort('${key}')">${label}<span class="sort-arrow">${arrow}</span></th>`;
        };

        const summaryRow = `<tr class="compare-summary-row">
            <td colspan="2" class="text-left"><span class="summary-label">园所数</span><span class="summary-value">${totalSchools}</span></td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumClass}</span></td>
            <td class="text-center"><span class="summary-label">区域均值</span><span class="summary-value">${avgOfAvg.toFixed(1)}</span></td>
            <td class="text-center"><span class="summary-label">区域均值</span><span class="summary-value">${avgOfDev.toFixed(1)}</span></td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumAct}</span></td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumDur}h</span></td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumPart}</span></td>
            <td></td>
        </tr>`;

        const tbody = rows.map((r, i) => `
            <tr class="hover:bg-blue-500/10 transition-colors">
                <td class="px-3 py-3 text-slate-500">${i + 1}</td>
                <td class="px-3 py-3 font-medium text-slate-200">${r.name}</td>
                <td class="px-3 py-3 text-center text-slate-300 tabular-nums">${r.classCount}</td>
                ${this.barCell(r.avgActivity, maxAvg, { format: () => r.avgActivity.toFixed(1) })}
                ${this.barCell(r.avgDeviceUse, maxDev, { format: () => r.avgDeviceUse.toFixed(1) })}
                ${this.barCell(r.totalActivity, maxAct)}
                ${this.barCell(r.totalDuration, maxDur, { format: () => r.totalDuration + 'h' })}
                ${this.barCell(r.totalParticipant, maxPart)}
                <td class="px-3 py-3 text-center"><button onclick="App.viewSchoolDetail(${r.id})" class="text-blue-400 hover:text-blue-300 text-sm">打开详情</button></td>
            </tr>`).join('');

        const empty = filtered.length ? '' : '<tr><td colspan="9" class="text-center text-slate-500 py-10">暂无符合条件的园所</td></tr>';

        const toggleBtn = overflow
            ? `<div class="flex justify-center pt-2">
                <button onclick="App.regionalCompareToggleShowAll()"
                    class="px-4 py-1.5 rounded-lg text-xs border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-colors flex items-center gap-1.5">
                    ${state.showAll
                        ? `<svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>收起<span class="text-slate-400">（共 ${filtered.length} 条）</span>`
                        : `<svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>全部展示<span class="text-slate-400">（剩余 ${filtered.length - defaultLimit} 条）</span>`}
                </button>
            </div>`
            : '';

        return `
            <div class="space-y-5">
                <div class="space-y-4">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        ${this.chartTitle('园所横向对比', 'bg-cyan-500', '统计范围：当前所选时间范围内全区园所数据。\n口径：每行一个园所，对班均活动次数 / 班均设备使用次数 / 活动总次数 / 总时长 / 参与人次做横向对比。\n用法：\n· 列头点击切换排序\n· 默认仅展示前 5 条，点击"全部展示"查看全部\n· 行末"打开详情"进入该园 7 tab 完整下钻')}
                        <div class="flex items-center gap-2">
                            <input type="text" value="${state.keyword.replace(/"/g, '&quot;')}"
                                oninput="App.regionalCompareSetKeyword(this.value)"
                                placeholder="搜索园所（支持拼音首字母）"
                                class="px-3 py-1.5 rounded-lg text-xs border border-slate-500/30 bg-slate-700/40 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 w-72">
                            <button onclick="App.exportRegionalCompare()" class="px-3 py-1.5 rounded-lg text-xs border border-emerald-500/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25 hover:border-emerald-400/60 transition-colors flex items-center gap-1.5" title="导出当前筛选结果为 CSV">
                                <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                导出
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto rounded-xl border border-slate-500/20">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="bg-slate-900/50 text-slate-400 border-b border-slate-700/50">
                                    <th class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">序号</th>
                                    <th class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">园所</th>
                                    ${renderTh('班级数', 'classCount')}
                                    ${renderTh('班均活动次数', 'avgActivity')}
                                    ${renderTh('班均设备使用次数', 'avgDeviceUse')}
                                    ${renderTh('活动总次数', 'totalActivity')}
                                    ${renderTh('活动总时长', 'totalDuration')}
                                    ${renderTh('参与总人次', 'totalParticipant')}
                                    <th class="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider">操作</th>
                                </tr>
                                ${filtered.length ? summaryRow : ''}
                            </thead>
                            <tbody class="divide-y divide-slate-700/30">
                                ${tbody || empty}
                            </tbody>
                        </table>
                    </div>
                    ${toggleBtn}
                </div>
            </div>`;
    },

    // 导出园所横向对比（当前筛选/排序结果）为 CSV
    exportRegionalCompare() {
        const state = this.regionalCompareState;
        let rows = this.buildRegionalSchoolRows();
        if (state.keyword) {
            const kw = state.keyword.trim();
            rows = rows.filter(r => PinyinUtil.match(r.name, kw));
        }
        rows = this.sortByKey(rows, state.sort);

        const headers = ['序号', '园所', '班级数', '班均活动次数', '班均设备使用次数', '活动总次数', '活动总时长(h)', '参与总人次'];
        const csvRows = [headers.join(',')];
        rows.forEach((r, i) => {
            const cells = [
                i + 1,
                `"${(r.name || '').replace(/"/g, '""')}"`,
                r.classCount,
                Number(r.avgActivity || 0).toFixed(1),
                Number(r.avgDeviceUse || 0).toFixed(1),
                r.totalActivity,
                r.totalDuration,
                r.totalParticipant
            ];
            csvRows.push(cells.join(','));
        });

        const ts = new Date();
        const pad = n => String(n).padStart(2, '0');
        const fname = `园所横向对比_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}.csv`;
        // 加 BOM 让 Excel 正确识别 UTF-8
        const blob = new Blob(['﻿' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (typeof this.showToast === 'function') this.showToast(`已导出 ${rows.length} 条记录`, 'success');
    },

    // —— 园长 · 大数据总览 · 班级横向对比表 ——
    classCompareState: {
        sort: { key: 'totalActivity', dir: 'desc' },
        keyword: '',
        grade: 'all',     // all | 大班 | 中班 | 小班
        showAll: false    // false 默认前 5 行，true 全部展示
    },
    classCompareSetSort(key) {
        const s = this.classCompareState.sort;
        if (s.key === key) {
            s.dir = s.dir === 'asc' ? 'desc' : 'asc';
        } else {
            s.key = key;
            s.dir = 'desc';
        }
        const body = document.getElementById('class-compare-tablewrap');
        if (body) body.innerHTML = this.renderClassCompareTableArea();
        else this.refreshClassCompare();
    },
    classCompareSetKeyword(v) {
        this.classCompareState.keyword = v || '';
        // 只刷新表格区域，避免重渲染搜索框导致输入失焦
        const body = document.getElementById('class-compare-tablewrap');
        if (body) {
            body.innerHTML = this.renderClassCompareTableArea();
        } else {
            this.refreshClassCompare();
        }
    },
    classCompareSetGrade(g) {
        this.classCompareState.grade = g || 'all';
        this.refreshClassCompare();
    },
    classCompareToggleShowAll() {
        this.classCompareState.showAll = !this.classCompareState.showAll;
        // 只刷新表格区域，避免整段重渲
        const body = document.getElementById('class-compare-tablewrap');
        if (body) body.innerHTML = this.renderClassCompareTableArea();
        else this.refreshClassCompare();
    },
    refreshClassCompare() {
        const host = document.getElementById('class-compare-host');
        if (host) host.innerHTML = this.renderClassCompare();
    },
    // 从班级名解析班级段：大班 / 中班 / 小班 / 其他
    classGradeOf(name) {
        const n = String(name || '');
        if (n.startsWith('大')) return '大班';
        if (n.startsWith('中')) return '中班';
        if (n.startsWith('小')) return '小班';
        return '其他';
    },
    buildClassCompareRows() {
        const classes = MockData.classes || [];
        // 园长视角默认看本园，按 selectedSchool 过滤；缺省时取全部本园数据
        const kgId = this.selectedSchool?.id;
        const list = kgId ? classes.filter(c => c.kindergartenId === kgId) : classes;
        return list.map(c => {
            const totalActivity = c.activityCount || 0;
            const totalDuration = parseFloat(c.activityDuration) || 0;
            const totalParticipant = c.participantCount || 0;
            const deviceUseCount = c.deviceUseCount || 0;
            const studentCount = c.studentCount || 0;
            return {
                id: c.id,
                name: c.name,
                grade: this.classGradeOf(c.name),
                studentCount,
                teacherCount: c.teacherCount || 0,
                totalActivity,
                totalDuration: Math.round(totalDuration * 10) / 10,
                totalParticipant,
                deviceUseCount
            };
        });
    },
    renderClassCompare() {
        const state = this.classCompareState;
        const all = this.buildClassCompareRows();

        // 段 chips：基于全部数据（不随当前筛选变化）显示数量
        const grades = ['all', '大班', '中班', '小班'];
        const gradeChips = grades.map(g => {
            const isActive = state.grade === g;
            const cnt = g === 'all' ? all.length : all.filter(r => r.grade === g).length;
            const label = g === 'all' ? `全部 ${cnt}` : `${g} ${cnt}`;
            return `<button onclick="App.classCompareSetGrade('${g}')"
                class="px-2.5 py-1 rounded-full text-xs border transition-colors
                    ${isActive
                        ? 'bg-cyan-400/15 text-cyan-200 border-cyan-400/40'
                        : 'bg-slate-700/30 text-slate-400 border-slate-500/25 hover:text-slate-200 hover:border-slate-400/40'}">${label}</button>`;
        }).join('');

        return `
            <div class="space-y-5">
                <div class="space-y-4">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        ${this.chartTitle('班级横向对比', 'bg-cyan-500', '统计范围：当前所选时间范围内本园全部班级数据。\n口径：每行一个班级，对班级人数 / 设备使用次数 / 活动总次数 / 总时长 / 参与人次做横向对比。\n用法：\n· 列头点击切换排序\n· 顶部段筛选可只看大/中/小班\n· 默认仅展示前 5 条，点击"全部展示"查看全部\n· 行末"打开详情"进入该班完整数据')}
                        <div class="flex items-center gap-2">
                            <input type="text" value="${state.keyword.replace(/"/g, '&quot;')}"
                                oninput="App.classCompareSetKeyword(this.value)"
                                placeholder="搜索班级（支持拼音首字母）"
                                class="px-3 py-1.5 rounded-lg text-xs border border-slate-500/30 bg-slate-700/40 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 w-72">
                            <button onclick="App.exportClassCompare()" class="px-3 py-1.5 rounded-lg text-xs border border-emerald-500/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25 hover:border-emerald-400/60 transition-colors flex items-center gap-1.5" title="导出当前筛选结果为 CSV">
                                <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                导出
                            </button>
                        </div>
                    </div>
                    <div id="class-compare-gradechips" class="flex flex-wrap gap-1.5">${gradeChips}</div>
                    <div id="class-compare-tablewrap">${this.renderClassCompareTableArea()}</div>
                </div>
            </div>`;
    },
    // 表格区域（受 关键字/段/排序/展开 影响，单独渲染以便局部刷新、避免搜索框失焦）
    renderClassCompareTableArea() {
        const state = this.classCompareState;
        const all = this.buildClassCompareRows();

        // 1) 段筛选
        let filtered = all.slice();
        if (state.grade !== 'all') filtered = filtered.filter(r => r.grade === state.grade);

        // 2) 搜索
        if (state.keyword) {
            const kw = state.keyword.trim();
            filtered = filtered.filter(r => PinyinUtil.match(r.name, kw));
        }

        // 3) 排序
        filtered = this.sortByKey(filtered, state.sort);

        // 4) "默认前 5 / 全部展示"切换（汇总仍按全部 filtered 计算，更直观）
        const defaultLimit = 5;
        const overflow = filtered.length > defaultLimit;
        const rows = (state.showAll || !overflow) ? filtered : filtered.slice(0, defaultLimit);

        const max = (key) => Math.max(1, ...filtered.map(r => r[key] || 0));
        const maxAct = max('totalActivity');
        const maxDur = max('totalDuration');
        const maxPart = max('totalParticipant');
        const maxDev = max('deviceUseCount');

        const sum = (key) => filtered.reduce((s, r) => s + (r[key] || 0), 0);
        const totalClasses = filtered.length;
        const sumStu = sum('studentCount');
        const sumAct = sum('totalActivity');
        const sumDur = Math.round(sum('totalDuration') * 10) / 10;
        const sumPart = sum('totalParticipant');
        const sumDev = sum('deviceUseCount');

        const sortState = state.sort;
        const renderTh = (label, key, align = 'text-center') => {
            const isActive = sortState.key === key;
            const arrow = isActive ? (sortState.dir === 'asc' ? '▲' : '▼') : '↕';
            return `<th class="px-3 py-3 ${align} text-xs font-medium uppercase tracking-wider sortable-th ${isActive ? 'is-sorted' : ''}"
                onclick="App.classCompareSetSort('${key}')">${label}<span class="sort-arrow">${arrow}</span></th>`;
        };

        const summaryRow = `<tr class="compare-summary-row">
            <td colspan="2" class="text-left"><span class="summary-label">班级数</span><span class="summary-value">${totalClasses}</span></td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumStu}</span></td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumDev}</span></td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumAct}</span></td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumDur}h</span></td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumPart}</span></td>
            <td></td>
        </tr>`;

        const tbody = rows.map((r, i) => `
            <tr class="hover:bg-blue-500/10 transition-colors">
                <td class="px-3 py-3 text-slate-500">${i + 1}</td>
                <td class="px-3 py-3 font-medium text-slate-200">${r.name}</td>
                <td class="px-3 py-3 text-center text-slate-300 tabular-nums">${r.studentCount}</td>
                ${this.barCell(r.deviceUseCount, maxDev)}
                ${this.barCell(r.totalActivity, maxAct)}
                ${this.barCell(r.totalDuration, maxDur, { format: () => r.totalDuration + 'h' })}
                ${this.barCell(r.totalParticipant, maxPart)}
                <td class="px-3 py-3 text-center"><button onclick="App.viewClassDetail(${r.id})" class="text-blue-400 hover:text-blue-300 text-sm">打开详情</button></td>
            </tr>`).join('');

        const empty = filtered.length ? '' : '<tr><td colspan="8" class="text-center text-slate-500 py-10">暂无符合条件的班级</td></tr>';

        // 折叠按钮：仅当有溢出（>5）时显示
        const toggleBtn = overflow
            ? `<div class="flex justify-center pt-2">
                <button onclick="App.classCompareToggleShowAll()"
                    class="px-4 py-1.5 rounded-lg text-xs border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-colors flex items-center gap-1.5">
                    ${state.showAll
                        ? `<svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>收起<span class="text-slate-400">（共 ${filtered.length} 条）</span>`
                        : `<svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>全部展示<span class="text-slate-400">（剩余 ${filtered.length - defaultLimit} 条）</span>`}
                </button>
            </div>`
            : '';

        return `
            <div class="overflow-x-auto rounded-xl border border-slate-500/20">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-900/50 text-slate-400 border-b border-slate-700/50">
                            <th class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">序号</th>
                            <th class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">班级</th>
                            ${renderTh('班级人数', 'studentCount')}
                            ${renderTh('设备使用次数', 'deviceUseCount')}
                            ${renderTh('活动总次数', 'totalActivity')}
                            ${renderTh('活动总时长', 'totalDuration')}
                            ${renderTh('参与总人次', 'totalParticipant')}
                            <th class="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider">操作</th>
                        </tr>
                        ${filtered.length ? summaryRow : ''}
                    </thead>
                    <tbody class="divide-y divide-slate-700/30">
                        ${tbody || empty}
                    </tbody>
                </table>
            </div>
            ${toggleBtn}`;
    },
    exportClassCompare() {
        const state = this.classCompareState;
        let rows = this.buildClassCompareRows();
        if (state.grade !== 'all') rows = rows.filter(r => r.grade === state.grade);
        if (state.keyword) {
            const kw = state.keyword.trim();
            rows = rows.filter(r => PinyinUtil.match(r.name, kw));
        }
        rows = this.sortByKey(rows, state.sort);

        const headers = ['序号', '班级', '班级人数', '设备使用次数', '活动总次数', '活动总时长(h)', '参与总人次'];
        const csvRows = [headers.join(',')];
        rows.forEach((r, i) => {
            csvRows.push([
                i + 1,
                `"${(r.name || '').replace(/"/g, '""')}"`,
                r.studentCount,
                r.deviceUseCount,
                r.totalActivity,
                r.totalDuration,
                r.totalParticipant
            ].join(','));
        });

        const ts = new Date();
        const pad = n => String(n).padStart(2, '0');
        const fname = `班级横向对比_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}.csv`;
        const blob = new Blob(['﻿' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (typeof this.showToast === 'function') this.showToast(`已导出 ${rows.length} 条记录`, 'success');
    },

    // ============================================================
    //  页面1：大数据总览
    // ============================================================
    renderDataOverviewPage() {
        // 获取当前角色对应的数据
        const overviewData = this.getOverviewDataForCurrentRange();
        const stats = overviewData.stats;
        const rangeTitle = this.getDateRangeTitle('dataOverview');
        const iconBook = '<svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>';
        const iconClock = '<svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        const iconUsers = '<svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>';
        const iconBolt = '<svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';

        // 根据角色显示不同的标题
        let pageTitle = '安徽省合肥市蜀山区大数据总览';
        let scopeBadge = '';
        if (this.currentRole === 'principal') {
            pageTitle = this.selectedSchool ? `${this.selectedSchool.name} 大数据总览` : '本园大数据总览';
            scopeBadge = `<span class="role-badge principal inline-flex items-center gap-1">${Icons.school()} 园所数据</span>`;
        } else {
            scopeBadge = `<span class="role-badge admin inline-flex items-center gap-1">${Icons.admin()} 全区数据</span>`;
        }

        return `
        <div class="space-y-6 w-full max-w-[1480px] mx-auto">
            <div class="relative overflow-hidden rounded-[28px] border border-cyan-400/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] p-6 lg:p-7 shadow-[0_24px_80px_rgba(2,6,23,0.35)] flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                <div class="school-hero-grid absolute inset-0 opacity-20 pointer-events-none" style="background-image:linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px),linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px);background-size:24px 24px;"></div>
                <h2 class="relative text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">${pageTitle}</h2>
                <div class="relative flex flex-wrap items-center gap-3 lg:justify-end">
                    ${scopeBadge}
                    <div class="text-sm text-slate-500" id="overview-date"></div>
                </div>
            </div>

            ${this.renderDateFilterBar('dataOverview')}

            <!-- 4个核心指标 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                ${this.statCard('绘本活动次数', stats.activityCount, iconBook, 'blue', '较上一周期增长 15.6%')}
                ${this.statCard('绘本活动时长', stats.activityDuration + 'h', iconClock, 'emerald', '较上一周期增长 12.3%')}
                ${this.statCard('参与活动人次', stats.participantCount, iconUsers, 'purple', '较上一周期增长 18.5%')}
                ${this.statCard('绘本阅读时长', stats.readingDuration + 'h', iconBolt, 'amber', '较上一周期增长 8.7%')}
            </div>

            ${this.currentRole === 'admin' ? '<div id="regional-school-compare-host"></div>' : ''}

            ${this.currentRole === 'principal' ? '<div id="class-compare-host"></div>' : ''}

            ${this.currentRole === 'principal'
                ? `<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    ${this.card('<div id="school-class-activity-host"></div>')}
                    ${this.card('<div class="flex flex-col h-full">' + this.renderWeeklyActivityChartHeader() + '<div class="mt-auto"><div id="weekly-activity-chart" class="h-72"></div></div></div>')}
                  </div>`
                : ''}

            ${this.currentRole === 'admin'
                ? `<div class="grid grid-cols-1 gap-6">
                    ${this.card(this.renderKindergartenUsageChartHeader() + '<div id="kindergarten-usage-chart" class="h-72 mt-3"></div>')}
                  </div>`
                : ''}

            <!-- 图表第一行：园长视角下「类型占比」已删除、「能力分布」已迁移至园所数据页 -->
            ${this.currentRole === 'principal' ? '' : `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${this.card(this.chartTitle('幼儿绘本阅读类型占比', 'bg-blue-500', '统计范围：当前所选时间范围内全部绘本阅读记录。\n口径：按绘本"类型标签"聚合阅读次数后计算占比。\n用途：识别园所/班级近期偏好的内容方向，作为选书与活动设计参考。') + '<div id="book-type-chart" class="h-72"></div>')}
                ${this.card(this.chartTitle('幼儿阅读绘本-能力分布', 'bg-emerald-500', '统计范围：当前所选时间范围内全部阅读记录。\n口径：每本绘本携带 1~多个能力标签（语言/社交/想象/逻辑/情感等），按"次数 × 能力标签"加权累计。\n用途：观察阅读对各能力维度的覆盖均衡度。') + '<div id="ability-distribution-chart" class="h-72"></div>')}
            </div>`}

            ${this.currentRole === 'teacher' ? `
            <!-- 教师图表行 -->
            <div class="grid grid-cols-1 gap-6">
                ${this.card(this.renderWeeklyActivityChartHeader() + '<div id="weekly-activity-chart" class="h-72"></div>')}
            </div>` : ''}

            <!-- 园所班均使用对比已移除 -->

            <!-- 阅读 TOP10 绘本（仅教师端保留；园长端去重，明细去"园所数据-绘本"tab 看） -->
            ${this.currentRole === 'teacher' ? this.card(this.chartTitle('阅读次数排名前十绘本', 'bg-indigo-500', '统计范围：当前所选时间范围内本班的绘本阅读记录。\n口径：按绘本聚合阅读次数，取 Top 10。\n用途：识别本班热门书目。') + '<div id="book-ranking-table-wrap"></div>') : ''}
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
            <tr class="hover:bg-blue-500/10 transition-colors cursor-pointer">
                <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${i < 3 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400'}">${book.rank}</span></td>
                <td class="px-4 py-3 font-medium text-slate-200">《${book.name}》</td>
                <td class="px-4 py-3">${this.badge(book.type)}</td>
                <td class="px-4 py-3 text-center text-blue-400 font-semibold">${book.reads}</td>
                <td class="px-4 py-3 text-center text-slate-400">${book.duration}</td>
            </tr>
        `).join('');
        wrap.innerHTML = this.tableWrap(headers, rows);
    },

    // 区域/园所绘本活动次数图表头部（折线/柱状 多选，最少保留一个）
    renderWeeklyActivityChartHeader() {
        const isAdmin = this.currentRole === 'admin';
        const title = isAdmin ? '区域绘本活动次数' : '园所绘本活动次数';
        const helpText = isAdmin
            ? '统计范围：当前所选时间范围内全区园所的绘本活动。\n口径：按时间分桶（日/月，由所选范围自动决定）累计活动场次。\n用途：观察全区整体活跃趋势，识别周内/月内波动规律。'
            : '统计范围：当前所选时间范围内本园所/本班的绘本活动。\n口径：按时间分桶累计活动场次。\n用途：观察活跃趋势，发现规律性高/低谷。';
        const types = (this.weeklyActivityChartTypes && this.weeklyActivityChartTypes.length)
            ? this.weeklyActivityChartTypes
            : ['line'];
        const tab = (key, label, icon) => {
            const active = types.includes(key);
            const onlyOne = types.length === 1 && active;
            return `
            <button onclick="App.toggleWeeklyActivityChartType('${key}')"
                ${onlyOne ? 'disabled' : ''}
                class="chart-toggle-btn ${active ? 'is-active' : 'is-inactive'} ${onlyOne ? 'is-locked' : ''}"
                title="${onlyOne ? '至少保留一种图形' : (active ? '点击隐藏' + label : '点击显示' + label)}">
                ${icon}<span>${label}</span>
            </button>`;
        };
        const lineIcon = '<svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 17l6-6 4 4 8-8"/></svg>';
        const barIcon = '<svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20V10M10 20V4M16 20v-6M22 20H2"/></svg>';
        return `
            <div class="flex items-center justify-between gap-3 mb-4">
                <h3 class="text-base font-semibold text-white flex items-center gap-2">
                    <span class="w-1.5 h-5 bg-cyan-500 rounded-full"></span>
                    <span class="flex items-center gap-1.5">${title}${this.helpIcon(helpText)}</span>
                </h3>
                <div class="chart-toggle-group">
                    ${tab('line', '折线', lineIcon)}
                    ${tab('bar', '柱状', barIcon)}
                </div>
            </div>`;
    },

    // 切换区域/园所活动次数图表类型（多选，最少保留一个）
    toggleWeeklyActivityChartType(type) {
        if (type !== 'line' && type !== 'bar') return;
        const list = Array.isArray(this.weeklyActivityChartTypes) ? this.weeklyActivityChartTypes.slice() : [];
        const idx = list.indexOf(type);
        if (idx > -1) {
            if (list.length === 1) return; // 至少保留一个
            list.splice(idx, 1);
        } else {
            list.push(type);
        }
        this.weeklyActivityChartTypes = list;
        this.weeklyActivityChartType = list.length === 1 ? list[0] : 'combo';
        this.refreshWeeklyActivityChart();
    },

    // 仅更新 header 按钮态 + 复用同一 ECharts 实例 setOption（不 dispose 不重建 DOM，按钮态与渲染严格一致）
    refreshWeeklyActivityChart() {
        const chartDom = document.getElementById('weekly-activity-chart');
        if (chartDom && chartDom.previousElementSibling) {
            chartDom.previousElementSibling.outerHTML = this.renderWeeklyActivityChartHeader();
        }
        const data = this._lastWeeklyActivityData || MockData.weeklyActivity;
        const updated = Charts.updateWeeklyActivityChart(data, this.weeklyActivityChartTypes);
        if (!updated) {
            // 实例不存在（首次渲染或被销毁）则正常初始化
            Charts.safeInit(() => Charts.initWeeklyActivityBar(data, this.weeklyActivityChartTypes));
        }
    },

    // 兼容老入口：保留 setWeeklyActivityChartType（外部如果还有调用，也走多选逻辑）
    setWeeklyActivityChartType(type) {
        this.weeklyActivityChartTypes = [type];
        this.weeklyActivityChartType = type;
        this.refreshWeeklyActivityChart();
    },

    renderKindergartenUsageChartHeader() {
        const kindergartens = MockData.kindergartens || [];
        const selectedNames = kindergartens.filter(k => this.selectedKindergartensForLine.includes(k.id)).map(k => k.name);
        const types = (this.kindergartenUsageChartTypes && this.kindergartenUsageChartTypes.length)
            ? this.kindergartenUsageChartTypes
            : ['line'];
        const tab = (key, label, icon) => {
            const active = types.includes(key);
            const onlyOne = types.length === 1 && active;
            return `
            <button onclick="App.toggleKindergartenUsageChartType('${key}')"
                ${onlyOne ? 'disabled' : ''}
                class="chart-toggle-btn chart-toggle-btn--purple ${active ? 'is-active' : 'is-inactive'} ${onlyOne ? 'is-locked' : ''}"
                title="${onlyOne ? '至少保留一种图形' : (active ? '点击隐藏' + label : '点击显示' + label)}">
                ${icon}<span>${label}</span>
            </button>`;
        };
        const lineIcon = '<svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 17l6-6 4 4 8-8"/></svg>';
        const barIcon = '<svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20V10M10 20V4M16 20v-6M22 20H2"/></svg>';

        return `
            <div class="space-y-3" id="kindergarten-usage-header">
                <div class="flex items-center justify-between gap-3">
                    <h3 class="text-base font-semibold text-white flex items-center gap-2">
                        <span class="w-1.5 h-5 bg-purple-500 rounded-full"></span>
                        <span class="flex items-center gap-1.5">园所使用次数趋势${this.helpIcon('统计范围：当前所选时间范围内的设备使用记录。\n口径：每个选中园所一组数据，按时间分桶展示。\n图形选择：折线/柱状可以同时展示，也可以点击只保留一种（最少保留一种）。')}</span>
                    </h3>
                    <div class="flex items-center gap-2">
                        <div class="chart-toggle-group">
                            ${tab('line', '折线', lineIcon)}
                            ${tab('bar', '柱状', barIcon)}
                        </div>
                        <div class="text-xs text-slate-400 px-2 py-1 rounded-full border border-slate-500/30 bg-slate-700/30">
                            已选 ${selectedNames.length} 个园所
                        </div>
                    </div>
                </div>
                <div class="relative" id="kindergarten-dropdown-container">
                    <button onclick="event.stopPropagation();App.toggleKindergartenDropdown()" class="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs transition-all border bg-slate-700/40 text-slate-300 border-slate-500/30 hover:border-purple-400/30">
                        <span class="truncate">${selectedNames.length > 0 ? selectedNames.join('、') : '请选择园所'}</span>
                        <svg class="w-4 h-4 transition-transform" width="16" height="16" id="kindergarten-dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div id="kindergarten-dropdown-menu" class="hidden absolute top-full left-0 right-0 mt-1 bg-slate-800/95 border border-slate-500/30 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                        ${kindergartens.map(k => `
                            <div onclick="event.stopPropagation();App.toggleKindergartenForLine(${k.id})" class="flex items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-all hover:bg-purple-500/10 ${this.selectedKindergartensForLine.includes(k.id) ? 'bg-purple-500/15 text-purple-300' : 'text-slate-300'}">
                                <span class="w-4 h-4 rounded border flex items-center justify-center ${this.selectedKindergartensForLine.includes(k.id) ? 'bg-purple-500 border-purple-500' : 'border-slate-500'}">
                                    ${this.selectedKindergartensForLine.includes(k.id) ? '<svg class="w-3 h-3 text-white" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
                                </span>
                                <span class="truncate">${k.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // 切换园所下拉菜单显示
    toggleKindergartenDropdown() {
        const menu = document.getElementById('kindergarten-dropdown-menu');
        const arrow = document.getElementById('kindergarten-dropdown-arrow');
        if (menu) menu.classList.toggle('hidden');
        if (arrow) arrow.classList.toggle('rotate-180');
    },

    // 切换园所使用次数趋势的展示形式（多选：折线/柱状，最少保留一个）
    toggleKindergartenUsageChartType(type) {
        if (!['line', 'bar'].includes(type)) return;
        const list = Array.isArray(this.kindergartenUsageChartTypes) ? this.kindergartenUsageChartTypes.slice() : [];
        const idx = list.indexOf(type);
        if (idx > -1) {
            if (list.length === 1) return;
            list.splice(idx, 1);
        } else {
            list.push(type);
        }
        this.kindergartenUsageChartTypes = list;
        this.refreshKindergartenUsageChart({ headerOnly: true });
    },

    // 兼容老入口
    setKindergartenUsageChartType(type) {
        if (!['line', 'bar'].includes(type)) return;
        this.kindergartenUsageChartTypes = [type];
        this.refreshKindergartenUsageChart({ headerOnly: true });
    },

    // 切换园所选择（无数量限制）
    toggleKindergartenForLine(id) {
        const index = this.selectedKindergartensForLine.indexOf(id);
        if (index > -1) {
            // 已选中则取消（至少保留一个）
            if (this.selectedKindergartensForLine.length > 1) {
                this.selectedKindergartensForLine.splice(index, 1);
            }
        } else {
            // 未选中则添加（无数量限制）
            this.selectedKindergartensForLine.push(id);
        }
        this.refreshKindergartenUsageChart({ headerOnly: true });
    },

    // 刷新园所使用次数趋势图表
    // headerOnly=true：只替换 header（保留 chart 容器/实例），用 setOption 更新 series — 切换按钮/勾选场景
    // 否则全量重建（首次渲染或外部强制刷新）
    refreshKindergartenUsageChart(opts = {}) {
        const headerOnly = opts && opts.headerOnly;
        const wasOpen = !document.getElementById('kindergarten-dropdown-menu')?.classList.contains('hidden');
        const chartDom = document.getElementById('kindergarten-usage-chart');
        const data = this.buildKindergartenUsageSeries();

        if (headerOnly && chartDom) {
            // 头部容器：renderKindergartenUsageChartHeader 顶层是 <div id="kindergarten-usage-header">
            const headerEl = document.getElementById('kindergarten-usage-header');
            if (headerEl) {
                headerEl.outerHTML = this.renderKindergartenUsageChartHeader();
                if (wasOpen) {
                    document.getElementById('kindergarten-dropdown-menu')?.classList.remove('hidden');
                    document.getElementById('kindergarten-dropdown-arrow')?.classList.add('rotate-180');
                }
            }
            const updated = Charts.updateKindergartenUsageChart(data, this.kindergartenUsageChartTypes);
            if (!updated) {
                Charts.safeInit(() => Charts.initKindergartenUsageLine(data, this.kindergartenUsageChartTypes));
            }
            return;
        }

        // 全量重建（兼容首次/异常路径）
        const card = chartDom?.closest('[class*="rounded-2xl"]') || chartDom?.parentElement;
        if (chartDom && typeof echarts !== 'undefined') {
            const existing = echarts.getInstanceByDom(chartDom);
            if (existing && !existing.isDisposed()) {
                existing.dispose();
                Charts.instances = Charts.instances.filter(c => c !== existing);
            }
        }
        if (card) {
            card.innerHTML = this.renderKindergartenUsageChartHeader() + '<div id="kindergarten-usage-chart" class="h-72"></div>';
            if (wasOpen) {
                document.getElementById('kindergarten-dropdown-menu')?.classList.remove('hidden');
                document.getElementById('kindergarten-dropdown-arrow')?.classList.add('rotate-180');
            }
        }
        requestAnimationFrame(() => {
            Charts.safeInit(() => Charts.initKindergartenUsageLine(data, this.kindergartenUsageChartTypes));
        });
    },

    // 构建园所使用次数序列数据
    buildKindergartenUsageSeries() {
        const range = this.dateRanges.dataOverview || {};
        const start = range?.startDate ? new Date(`${range.startDate}T00:00:00`) : null;
        const end = range?.endDate ? new Date(`${range.endDate}T23:59:59`) : null;
        const granularity = this.getOverviewSeriesGranularity(range);

        const kindergartens = MockData.kindergartens || [];
        const selectedKindergartens = kindergartens.filter(k => this.selectedKindergartensForLine.includes(k.id));
        const series = [];

        // 构建时间轴
        const dates = [];
        if (start && end) {
            if (granularity === 'month') {
                const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
                const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
                while (cursor <= endMonth) {
                    dates.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
                    cursor.setMonth(cursor.getMonth() + 1);
                }
            } else {
                const cursor = new Date(start);
                cursor.setHours(0, 0, 0, 0);
                const endDate = new Date(end);
                endDate.setHours(0, 0, 0, 0);
                while (cursor <= endDate) {
                    dates.push(this.formatDateInput(cursor).slice(5));
                    cursor.setDate(cursor.getDate() + 1);
                }
            }
        }

        // 为选中的园所生成使用次数数据
        selectedKindergartens.forEach(kindergarten => {
            const baseCount = kindergarten.activityCount || MockData.classes
                .filter(cls => cls.kindergartenId === kindergarten.id)
                .reduce((sum, cls) => sum + (cls.activityCount || 0), 0) || Math.round(50 + Math.random() * 100);

            const wavePattern = this.generateWavePattern(dates.length);

            const values = dates.map((dateKey, index) => {
                const wave = wavePattern[index];
                if (granularity === 'month') {
                    return Math.round(baseCount / 4 * wave * (1 + (index % 3) * 0.15));
                } else {
                    const dailyBase = baseCount / 30;
                    return Math.round(dailyBase * wave * (1 + Math.random() * 0.3));
                }
            });

            series.push({
                name: kindergarten.name,
                values,
                id: kindergarten.id
            });
        });

        return { dates, series, granularity };
    },

    // 生成波动模式
    generateWavePattern(length) {
        const pattern = [];
        for (let i = 0; i < length; i++) {
            const baseWave = 0.7 + 0.5 * Math.sin(i * 0.5 + Math.random() * 0.3);
            const noise = 0.2 + Math.random() * 0.6;
            const weekendFactor = (i % 7 === 0 || i % 7 === 6) ? 0.6 : 1.0;
            pattern.push(Math.max(0.5, Math.min(1.5, baseWave * noise * weekendFactor)));
        }
        return pattern;
    },

    // 构建绘本类型时间序列数据
    buildBookTypeTimeSeries() {
        const range = this.dateRanges.dataOverview || {};
        const start = range?.startDate ? new Date(`${range.startDate}T00:00:00`) : null;
        const end = range?.endDate ? new Date(`${range.endDate}T23:59:59`) : null;
        const granularity = this.getOverviewSeriesGranularity(range);

        const bookTypes = MockData.bookTypes || [];
        const typeColors = ['#1677FF', '#13C2C2', '#722ED1', '#FAAD14', '#52C41A', '#F5222D'];

        const dates = [];
        if (start && end) {
            if (granularity === 'month') {
                const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
                const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
                while (cursor <= endMonth) {
                    dates.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
                    cursor.setMonth(cursor.getMonth() + 1);
                }
            } else {
                const cursor = new Date(start);
                cursor.setHours(0, 0, 0, 0);
                const endDate = new Date(end);
                endDate.setHours(0, 0, 0, 0);
                while (cursor <= endDate) {
                    dates.push(this.formatDateInput(cursor).slice(5));
                    cursor.setDate(cursor.getDate() + 1);
                }
            }
        }

        const series = bookTypes.map((type, typeIndex) => {
            const baseValue = type.value || 30;
            const wavePattern = this.generateWavePattern(dates.length);

            const values = dates.map((dateKey, index) => {
                const wave = wavePattern[index];
                if (granularity === 'month') {
                    return Math.round(baseValue * wave * (1 + (index % 3) * 0.1));
                } else {
                    const dailyBase = baseValue / (dates.length > 30 ? 30 : 7);
                    return Math.round(dailyBase * wave * (1 + Math.random() * 0.25));
                }
            });

            return {
                name: type.name,
                values,
                color: typeColors[typeIndex % typeColors.length]
            };
        });

        return { dates, series, granularity };
    },

    // ============================================================
    //  页面3：AI总览（园长视角 - 绘本大模型相关数据汇总）
    // ============================================================
    renderAiOverviewPage() {
        const summary = this.getAiOverviewSummary();
        const isTeacher = this.isTeacherScope();
        const teacherClassName = isTeacher ? this.getTeacherClassName() : '';
        const pageTitle = isTeacher ? `${teacherClassName} · AI总览` : 'AI总览';
        const pageSub = isTeacher
            ? `仅展示「${teacherClassName}」的绘本大模型互动数据`
            : '汇总园所内绘本大模型相关数据，洞察孩子的好奇心与互动偏好';
        // 默认展开"班级数据"卡
        if (this._aiActiveMetric == null) this._aiActiveMetric = 'classData';
        return `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">${pageTitle}</h2>
                    <p class="text-xs text-slate-400 mt-1">${pageSub}</p>
                </div>
                <div class="flex items-center gap-3">
                    ${isTeacher ? `<span class="px-3 py-1.5 rounded-full bg-cyan-500/15 text-cyan-300 text-xs border border-cyan-400/30">👩‍🏫 ${teacherClassName}</span>` : ''}
                </div>
            </div>

            <div id="ai-date-filter">${this.renderDateFilterBar('aiOverview')}</div>

            <!-- 4 张并列卡片：班级数据 + 活跃幼儿数 + 互动绘本数 + 累计 AI 对话次数 -->
            <div id="ai-summary-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                ${this.renderAiSummaryCards(summary)}
            </div>
            <div id="ai-metric-panel-wrapper" class="${this._aiActiveMetric ? '' : 'hidden'}">
                ${this._aiActiveMetric ? this.renderAiMetricPanel(this._aiActiveMetric) : ''}
            </div>
        </div>`;
    },

    // 历史列表中的"生成中"占位项（不可点击，生成完成后会被替换为正式记录）
    renderAiGeneratingHistoryItem(icon, name, nameClass, report) {
        const rangeLabel = this.formatAiRangeLabel(report.rangeKey);
        const author = report.author || this.getCurrentUserName();
        return `
            <div class="rounded-xl border border-cyan-400/40 bg-cyan-500/5 p-3 flex items-start justify-between gap-3 cursor-not-allowed opacity-90" title="正在生成中，请稍候…">
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span class="text-sm font-semibold ${nameClass} truncate">${icon} ${name}</span>
                        ${rangeLabel ? `<span class="text-[10px] px-1.5 py-0.5 rounded border border-slate-500/30 text-slate-400">${rangeLabel}</span>` : ''}
                        <span class="text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-300">生成者：${author}</span>
                    </div>
                    <div class="text-xs text-cyan-300 leading-5 flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>
                        正在生成 AI 分析报告，请稍候…
                    </div>
                </div>
                <span class="shrink-0 px-2 py-1 rounded-md text-[10px] text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                    <svg class="w-3 h-3 animate-spin" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V2.5"/></svg>
                    生成中
                </span>
            </div>`;
    },

    // 启动生成时：向历史列表插入一条"生成中"占位，返回其唯一 id
    insertGeneratingReport(kind, key, rangeKey) {
        const store = { book: '_aiBookReports', student: '_aiStudentReports', class: '_aiClassReports' }[kind];
        if (!this[store]) this[store] = {};
        const list = this[store][key] || (this[store][key] = []);
        const id = this.genAiReportId();
        list.unshift({
            id, generating: true, rangeKey,
            author: this.getCurrentUserName(),
            generatedAt: this.formatNowDateTime()
        });
        this._refreshAiHistoryPanel(kind);
        return id;
    },
    _refreshAiHistoryPanel(kind) {
        if (kind === 'book') this.refreshAiBookAnalysisHistory();
        else if (kind === 'student') this.refreshAiStudentAnalysisHistory();
        else if (kind === 'class') this.refreshAiClassAnalysisHistory();
    },
    _aiReportStore(kind) {
        return { book: '_aiBookReports', student: '_aiStudentReports', class: '_aiClassReports' }[kind];
    },
    // 生成完成：把"生成中"占位替换为正式记录（保留占位 id 与列表位置）
    finalizeGeneratingReport(kind, key, placeholderId, report) {
        const store = this._aiReportStore(kind);
        if (!this[store]) this[store] = {};
        const list = this[store][key] || (this[store][key] = []);
        const snap = this.cloneAiReport(report);
        snap.generating = false;
        snap.id = placeholderId || snap.id || this.genAiReportId();
        const idx = list.findIndex(r => r.id === placeholderId);
        if (idx >= 0) list[idx] = snap; else list.unshift(snap);
        this._persistAiReports(kind);
        this._refreshAiHistoryPanel(kind);
    },
    // 生成失败：移除"生成中"占位，避免列表里留下永久 loading 项
    removeGeneratingReport(kind, key, placeholderId) {
        const store = this._aiReportStore(kind);
        const list = (this[store] || {})[key];
        if (!list) return;
        const idx = list.findIndex(r => r.id === placeholderId);
        if (idx >= 0) list.splice(idx, 1);
        this._persistAiReports(kind);
        this._refreshAiHistoryPanel(kind);
    },
    _persistAiReports(kind) {
        if (kind === 'book' && this.persistAiReports) this.persistAiReports();
        else if (kind === 'student' && this.persistAiStudentReports) this.persistAiStudentReports();
        else if (kind === 'class' && this.persistAiClassReports) this.persistAiClassReports();
    },

    // AI 分析栏内联历史列表的搜索关键词
    _aiInlineHistKeyword: { class: '', student: '', book: '' },
    setAiInlineHistKeyword(kind, kw) {
        if (!this._aiInlineHistKeyword) this._aiInlineHistKeyword = { class: '', student: '', book: '' };
        this._aiInlineHistKeyword[kind] = kw;
        if (kind === 'class') this.refreshAiClassAnalysisHistory();
        else if (kind === 'student') this.refreshAiStudentAnalysisHistory();
        else if (kind === 'book') this.refreshAiBookAnalysisHistory();
    },
    _aiInlineHistMatch(kind, name) {
        const kw = ((this._aiInlineHistKeyword || {})[kind] || '').trim().toLowerCase();
        if (!kw) return true;
        const n = String(name || '').toLowerCase();
        if (n.includes(kw)) return true;
        if (window.PinyinUtil && PinyinUtil.match) { try { return PinyinUtil.match(name, kw); } catch (e) {} }
        return false;
    },
    // AI 分析栏标题旁的搜索框（搜索该栏历史报告）
    renderAiInlineHistSearch(kind, ph) {
        const kw = ((this._aiInlineHistKeyword || {})[kind] || '').replace(/"/g, '&quot;');
        return `<div class="relative">
            <input type="text" value="${kw}" placeholder="${ph}"
                oninput="App.setAiInlineHistKeyword('${kind}', this.value)"
                class="w-44 pl-7 pr-2 py-1.5 rounded-lg bg-slate-800/70 border border-slate-600/50 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400/60">
            <svg class="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
        </div>`;
    },

    // 班级 AI 分析历史记录列表（左侧栏中默认展示）
    renderAiClassAnalysisHistoryPanel() {
        const reports = this._aiClassReports || {};
        // 平铺所有班级的历史报告，按生成时间倒序
        const flat = [];
        Object.keys(reports).forEach(cls => {
            const list = reports[cls] || [];
            list.forEach(r => flat.push({ className: cls, report: r }));
        });
        flat.sort((a, b) => {
            const ta = new Date(a.report.generatedAt || 0).getTime();
            const tb = new Date(b.report.generatedAt || 0).getTime();
            return tb - ta;
        });
        // 教师视角只看自己班
        let scoped = flat;
        if (this.isTeacherScope()) {
            const tn = this.getTeacherClassName();
            scoped = flat.filter(x => x.className === tn);
        } else if (this.selectedSchool) {
            const ids = (MockData.classes || []).filter(c => c.kindergartenId === this.selectedSchool.id).map(c => c.name);
            const set = new Set(ids);
            scoped = flat.filter(x => set.has(x.className));
        }
        scoped = scoped.filter(x => this._aiInlineHistMatch('class', x.className));
        if (!scoped.length) {
            return `<div class="rounded-xl border border-dashed border-slate-500/30 bg-slate-800/30 px-4 py-8 text-center text-xs text-slate-500">
                ${((this._aiInlineHistKeyword || {}).class || '').trim() ? '没有匹配的历史报告' : '暂无历史 AI 分析记录，点击右上角"新增 AI 分析"开始第一份报告'}
            </div>`;
        }
        const fmt = ts => {
            if (!ts) return '-';
            try {
                const d = new Date(ts);
                const pad = n => String(n).padStart(2, '0');
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
            } catch (e) { return ts; }
        };
        const items = scoped.slice(0, 10).map(({ className, report }) => {
            if (report.generating) return this.renderAiGeneratingHistoryItem('🏫', className, 'text-amber-200', report);
            const escName = className.replace(/'/g, "\\'");
            const escTs = String(report.id || report.generatedAt || '').replace(/'/g, "\\'");
            const summaryText = report.summary || report.profile || '已生成班级 AI 分析报告';
            const truncated = String(summaryText).slice(0, 60);
            const rangeLabel = this.formatAiRangeLabel(report.rangeKey);
            const author = report.author || this.getCurrentUserName();
            return `
                <div class="rounded-xl border border-slate-600/30 bg-slate-800/40 hover:border-amber-400/40 hover:bg-slate-800/55 transition-colors p-3 flex items-start justify-between gap-3 cursor-pointer"
                    onclick="App.loadHistoricalClassReport('${escName}', '${escTs}')">
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                            <span class="text-sm font-semibold text-amber-200 truncate">🏫 ${className}</span>
                            ${rangeLabel ? `<span class="text-[10px] px-1.5 py-0.5 rounded border border-slate-500/30 text-slate-400">${rangeLabel}</span>` : ''}
                            <span class="text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-300">生成者：${author}</span>
                        </div>
                        <div class="text-xs text-slate-400 leading-5 line-clamp-2">${truncated}${String(summaryText).length > 60 ? '…' : ''}</div>
                        <div class="text-[10px] text-slate-500 mt-1">${report.generatedAt || '-'}</div>
                    </div>
                    <button class="shrink-0 px-2 py-1 rounded-md text-[10px] text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-600/30 hover:border-rose-400/40 transition-colors"
                        onclick="event.stopPropagation();App.deleteAiClassReport('${escName}', '${escTs}')" title="删除">删除</button>
                </div>
            `;
        }).join('');
        return `<div class="space-y-2 max-h-[440px] overflow-y-auto pr-1">${items}</div>`;
    },

    refreshAiClassAnalysisHistory() {
        const host = document.getElementById('ai-class-analysis-history');
        if (host) host.innerHTML = this.renderAiClassAnalysisHistoryPanel();
    },

    // 幼儿 AI 分析历史记录列表（幼儿互动明细下方）
    renderAiStudentAnalysisHistoryPanel() {
        const reports = this._aiStudentReports || {};
        const flat = [];
        Object.keys(reports).forEach(stu => {
            (reports[stu] || []).forEach(r => flat.push({ student: stu, report: r }));
        });
        flat.sort((a, b) => new Date(b.report.generatedAt || 0) - new Date(a.report.generatedAt || 0));
        const flatF = flat.filter(x => this._aiInlineHistMatch('student', x.student));
        if (!flatF.length) {
            return `<div class="rounded-xl border border-dashed border-slate-500/30 bg-slate-800/30 px-4 py-8 text-center text-xs text-slate-500">
                ${((this._aiInlineHistKeyword || {}).student || '').trim() ? '没有匹配的历史报告' : '暂无历史 AI 分析记录，点击右上角"新增 AI 分析"开始第一份报告'}
            </div>`;
        }
        const items = flatF.slice(0, 10).map(({ student, report }) => {
            if (report.generating) return this.renderAiGeneratingHistoryItem('👶', student, 'text-emerald-200', report);
            const escName = student.replace(/'/g, "\\'");
            const escTs = String(report.id || report.generatedAt || '').replace(/'/g, "\\'");
            const summaryText = report.summary || report.profile || '已生成幼儿 AI 分析报告';
            const truncated = String(summaryText).slice(0, 60);
            const rangeLabel = this.formatAiRangeLabel(report.rangeKey);
            const author = report.author || this.getCurrentUserName();
            return `
                <div class="rounded-xl border border-slate-600/30 bg-slate-800/40 hover:border-emerald-400/40 hover:bg-slate-800/55 transition-colors p-3 flex items-start justify-between gap-3 cursor-pointer"
                    onclick="App.loadHistoricalStudentReport('${escName}', '${escTs}')">
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                            <span class="text-sm font-semibold text-emerald-200 truncate">👶 ${student}</span>
                            ${rangeLabel ? `<span class="text-[10px] px-1.5 py-0.5 rounded border border-slate-500/30 text-slate-400">${rangeLabel}</span>` : ''}
                            <span class="text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-300">生成者：${author}</span>
                        </div>
                        <div class="text-xs text-slate-400 leading-5 line-clamp-2">${truncated}${String(summaryText).length > 60 ? '…' : ''}</div>
                        <div class="text-[10px] text-slate-500 mt-1">${report.generatedAt || '-'}</div>
                    </div>
                    <button class="shrink-0 px-2 py-1 rounded-md text-[10px] text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-600/30 hover:border-rose-400/40 transition-colors"
                        onclick="event.stopPropagation();App.deleteAiStudentReport('${escName}', '${escTs}')" title="删除">删除</button>
                </div>`;
        }).join('');
        return `<div class="space-y-2 max-h-[440px] overflow-y-auto pr-1">${items}</div>`;
    },
    refreshAiStudentAnalysisHistory() {
        const host = document.getElementById('ai-student-analysis-history');
        if (host) host.innerHTML = this.renderAiStudentAnalysisHistoryPanel();
    },

    // 绘本 AI 分析历史记录列表（绘本互动明细下方）
    renderAiBookAnalysisHistoryPanel() {
        const reports = this._aiBookReports || {};
        const flat = [];
        Object.keys(reports).forEach(bk => {
            (reports[bk] || []).forEach(r => flat.push({ book: bk, report: r }));
        });
        flat.sort((a, b) => new Date(b.report.generatedAt || 0) - new Date(a.report.generatedAt || 0));
        const flatF = flat.filter(x => this._aiInlineHistMatch('book', x.book));
        if (!flatF.length) {
            return `<div class="rounded-xl border border-dashed border-slate-500/30 bg-slate-800/30 px-4 py-8 text-center text-xs text-slate-500">
                ${((this._aiInlineHistKeyword || {}).book || '').trim() ? '没有匹配的历史报告' : '暂无历史 AI 分析记录，点击右上角"新增 AI 分析"开始第一份报告'}
            </div>`;
        }
        const items = flatF.slice(0, 10).map(({ book, report }) => {
            if (report.generating) return this.renderAiGeneratingHistoryItem('📖', `《${book}》`, 'text-cyan-200', report);
            const escName = book.replace(/'/g, "\\'");
            const escTs = String(report.id || report.generatedAt || '').replace(/'/g, "\\'");
            const summaryText = report.summary || report.profile || '已生成绘本 AI 分析报告';
            const truncated = String(summaryText).slice(0, 60);
            const rangeLabel = this.formatAiRangeLabel(report.rangeKey);
            const author = report.author || this.getCurrentUserName();
            return `
                <div class="rounded-xl border border-slate-600/30 bg-slate-800/40 hover:border-cyan-400/40 hover:bg-slate-800/55 transition-colors p-3 flex items-start justify-between gap-3 cursor-pointer"
                    onclick="App.loadHistoricalReport('${escName}', '${escTs}')">
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                            <span class="text-sm font-semibold text-cyan-200 truncate">📖 《${book}》</span>
                            ${rangeLabel ? `<span class="text-[10px] px-1.5 py-0.5 rounded border border-slate-500/30 text-slate-400">${rangeLabel}</span>` : ''}
                            <span class="text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-300">生成者：${author}</span>
                        </div>
                        <div class="text-xs text-slate-400 leading-5 line-clamp-2">${truncated}${String(summaryText).length > 60 ? '…' : ''}</div>
                        <div class="text-[10px] text-slate-500 mt-1">${report.generatedAt || '-'}</div>
                    </div>
                    <button class="shrink-0 px-2 py-1 rounded-md text-[10px] text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-600/30 hover:border-rose-400/40 transition-colors"
                        onclick="event.stopPropagation();App.deleteAiReport('${escName}', '${escTs}')" title="删除">删除</button>
                </div>`;
        }).join('');
        return `<div class="space-y-2 max-h-[440px] overflow-y-auto pr-1">${items}</div>`;
    },
    refreshAiBookAnalysisHistory() {
        const host = document.getElementById('ai-book-analysis-history');
        if (host) host.innerHTML = this.renderAiBookAnalysisHistoryPanel();
    },

    renderAiSummaryCards(summary) {
        const active = this._aiActiveMetric;
        const isTeacher = this.isTeacherScope();
        const classDataLabel = isTeacher ? '班级 AI 数据' : '园所 AI 数据';
        // 班级数据卡：value 显示该范围下班级数（管理员园所内 / 教师固定 1）
        const classCount = isTeacher ? 1 : ((this.selectedSchool && (MockData.classes || []).filter(c => c.kindergartenId === this.selectedSchool.id).length) || (MockData.classes || []).length);
        const cards = [
            { key: 'classData', label: classDataLabel, value: classCount, unit: isTeacher ? '班' : '班', icon: Icons.school('w-5 h-5'), color: 'from-violet-500/30 to-fuchsia-500/10 border-violet-400/30', accent: 'text-violet-300' },
            { key: 'students', label: '活跃幼儿数', value: summary.activeStudents, unit: '人', icon: Icons.student('w-5 h-5'), color: 'from-emerald-500/30 to-teal-500/10 border-emerald-400/30', accent: 'text-emerald-300' },
            { key: 'books', label: '互动绘本数', value: summary.totalBooks, unit: '本', icon: Icons.book('w-5 h-5'), color: 'from-cyan-500/30 to-blue-500/10 border-cyan-400/30', accent: 'text-cyan-300' },
            { key: 'chats', label: '累计 AI 对话次数', value: summary.totalChats, unit: '次', icon: Icons.chat('w-5 h-5'), color: 'from-amber-500/30 to-orange-500/10 border-amber-400/30', accent: 'text-amber-300' }
        ];
        return cards.map(c => `
            <div onclick="App.toggleAiMetric('${c.key}')" class="rounded-2xl border bg-gradient-to-br ${c.color} p-4 backdrop-blur-sm cursor-pointer transition-all hover:scale-[1.01] ${active === c.key ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white/30' : ''}">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs text-slate-300">${c.label}</span>
                    <span class="${c.accent}">${c.icon}</span>
                </div>
                <div class="flex items-end justify-between">
                    <div class="flex items-baseline gap-1">
                        <span class="text-2xl font-bold ${c.accent}">${c.value}</span>
                        <span class="text-xs text-slate-400">${c.unit}</span>
                    </div>
                    <span class="text-[11px] text-slate-400 flex items-center gap-0.5">
                        ${active === c.key ? '已展开' : '展开'}
                        <svg class="w-3 h-3 transition-transform ${active === c.key ? 'rotate-180' : ''}" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                </div>
            </div>
        `).join('');
    },

    toggleAiMetric(key) {
        // 必须始终保持一个卡片展开：点击当前激活的卡片不折叠
        if (this._aiActiveMetric === key) return;
        this._aiActiveMetric = key;
        if (!this._aiMetricPages) this._aiMetricPages = { chats: 1, books: 1, students: 1 };
        if (this._aiActiveMetric && this._aiActiveMetric !== 'classData') this._aiMetricPages[this._aiActiveMetric] = 1;
        const grid = document.getElementById('ai-summary-grid');
        if (grid) grid.innerHTML = this.renderAiSummaryCards(this.getAiOverviewSummary());
        const wrapper = document.getElementById('ai-metric-panel-wrapper');
        if (wrapper) {
            wrapper.classList.remove('hidden');
            wrapper.innerHTML = this.renderAiMetricPanel(this._aiActiveMetric);
            // 班级数据面板包含 ECharts 图，需要在 DOM 就绪后初始化
            if (this._aiActiveMetric === 'classData') {
                requestAnimationFrame(() => {
                    Charts.safeInit(() => Charts.initAiClassDialogTrend(this.getAiClassDialogTrend()));
                    Charts.safeInit(() => Charts.initAiBookInteractionBar(this.getAiBookInteractionsByRange()));
                });
            }
        }
    },

    setAiMetricPage(key, page) {
        if (!this._aiMetricPages) this._aiMetricPages = { chats: 1, books: 1, students: 1 };
        this._aiMetricPages[key] = page;
        const wrapper = document.getElementById('ai-metric-panel-wrapper');
        if (wrapper) wrapper.innerHTML = this.renderAiMetricPanel(key);
    },

    renderAiMetricPagination(key, total, currentPage, totalPages) {
        if (totalPages <= 1) return `<div class="mt-4 text-sm text-slate-500">共 ${total} 条记录</div>`;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) pages.push(i);
            else if (pages[pages.length - 1] !== '...') pages.push('...');
        }
        const onclick = (p) => `App.setAiMetricPage('${key}', ${p})`;
        return `
        <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-slate-500">共 ${total} 条记录，第 ${currentPage}/${totalPages} 页</div>
            <div class="flex items-center gap-1">
                <button class="px-3 py-1 rounded text-sm ${currentPage===1?'text-slate-600 cursor-not-allowed':'text-slate-400 hover:bg-slate-700/50 hover:text-white'}" ${currentPage===1?'disabled':''} onclick="${onclick(currentPage-1)}">上一页</button>
                ${pages.map(p => p==='...'
                    ? '<span class="px-2 text-slate-600">...</span>'
                    : `<button class="w-8 h-8 rounded text-sm ${p===currentPage?'bg-blue-600 text-white shadow-lg shadow-blue-500/30':'text-slate-400 hover:bg-slate-700/50 hover:text-white'}" onclick="${onclick(p)}">${p}</button>`
                ).join('')}
                <button class="px-3 py-1 rounded text-sm ${currentPage===totalPages?'text-slate-600 cursor-not-allowed':'text-slate-400 hover:bg-slate-700/50 hover:text-white'}" ${currentPage===totalPages?'disabled':''} onclick="${onclick(currentPage+1)}">下一页</button>
            </div>
        </div>`;
    },

    // 明细面板渲染（按类型分发）
    renderAiMetricPanel(key) {
        if (key === 'classData') return this.renderAiClassDataPanel();
        if (key === 'chats') return this.renderAiChatsDetailPanel();
        if (key === 'books') return this.renderAiBooksDetailPanel();
        if (key === 'students') return this.renderAiStudentsDetailPanel();
        return '';
    },

    // 班级数据面板：包含 各班级 AI 对话次数变化 + 绘本互动排行 TOP10 + 班级 AI 分析（历史 + 新增）
    renderAiClassDataPanel() {
        const isTeacher = this.isTeacherScope();
        const teacherClassName = isTeacher ? this.getTeacherClassName() : '';
        const trendTitle = isTeacher ? `${teacherClassName} AI 对话次数变化` : '各班级 AI 对话次数变化';
        const granularity = this.buildAiOverviewTimeline().granularity === 'month' ? '月' : '日';
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div class="bg-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-500/35 p-5">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <span class="w-1.5 h-4 bg-cyan-400 rounded"></span>
                                <h3 class="text-sm font-semibold text-slate-200">${trendTitle}</h3>
                            </div>
                            <span class="text-[11px] text-slate-500">${granularity}</span>
                        </div>
                        <div id="ai-class-dialog-chart" class="h-72"></div>
                    </div>
                    <div class="bg-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-500/35 p-5">
                        <div class="flex items-center gap-2 mb-3">
                            <span class="w-1.5 h-4 bg-emerald-400 rounded"></span>
                            <h3 class="text-sm font-semibold text-slate-200">绘本互动排行 TOP10</h3>
                        </div>
                        <div id="ai-book-interaction-chart" class="h-72"></div>
                    </div>
                </div>
                <div class="bg-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-500/35 p-5">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-4 bg-amber-400 rounded"></span>
                            <h3 class="text-sm font-semibold text-slate-200">班级 AI 分析历史报告</h3>
                        </div>
                        <div class="flex items-center gap-2">
                        ${this.renderAiInlineHistSearch('class', '搜索班级名…')}
                        <button onclick="App.startAiClassAnalysis()" class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-200 text-xs border border-amber-400/40 transition-colors flex items-center gap-1.5" title="新增一次 AI 分析">
                            <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            新增 AI 分析
                        </button>
                        </div>
                    </div>
                    <div id="ai-class-analysis-history">${this.renderAiClassAnalysisHistoryPanel()}</div>
                </div>
            </div>
        `;
    },

    _aiMetricPageSize: 10,

    getAiMetricCurrentPage(key) {
        if (!this._aiMetricPages) this._aiMetricPages = { chats: 1, books: 1, students: 1 };
        return this._aiMetricPages[key] || 1;
    },

    renderAiChatsDetailPanel() {
        // 按「绘本+小朋友+日期」分组：同一次阅读活动，左边合并书名，右边每次对话单独成行
        const history = this.getAiHistoryByRange();
        const grouped = new Map();
        history.forEach(h => {
            const dateStr = (h.time || '').split(' ')[0] || '';
            const key = `${h.book}||${h.student || '匿名'}||${dateStr}`;
            if (!grouped.has(key)) grouped.set(key, { book: h.book, student: h.student || '匿名', className: h.className || '-', date: dateStr, items: [] });
            grouped.get(key).items.push(h);
        });
        // 组内按时间正序
        grouped.forEach(g => g.items.sort((a, b) => a.time.localeCompare(b.time)));
        const groups = [...grouped.values()]
            .map(g => ({
                ...g,
                latestTime: g.items[g.items.length - 1]?.time || '',
                totalTurns: g.items.reduce((s, h) => s + (h.session?.length || 0), 0)
            }))
            .sort((a, b) => b.latestTime.localeCompare(a.latestTime));

        const total = groups.length;
        const pageSize = this._aiMetricPageSize;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        let currentPage = this.getAiMetricCurrentPage('chats');
        if (currentPage > totalPages) { currentPage = totalPages; this._aiMetricPages.chats = currentPage; }
        const list = groups.slice((currentPage - 1) * pageSize, currentPage * pageSize);

        // 每个分组渲染 rowspan 合并的左侧 + 每次对话独占一行的右侧
        const tableRows = list.length ? list.flatMap(g => {
            const escBook = g.book.replace(/'/g, "\\'");
            const escStudent = g.student.replace(/'/g, "\\'");
            const rowCount = g.items.length;
            return g.items.map((item, idx) => {
                const isFirst = idx === 0;
                const scopeBadge = item.scope === 'page'
                    ? '<span class="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-400/30">阅读中</span>'
                    : '<span class="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">阅读后</span>';
                const turns = item.session?.length || 0;
                const firstQ = item.session?.[0]?.q || '';
                const escId = (item.id || '').replace(/'/g, "\\'");
                const bookCell = isFirst
                    ? `<td class="px-3 py-3 align-middle border-r border-slate-700/40 bg-slate-800/30" rowspan="${rowCount}">
                            <div class="flex flex-col gap-1">
                                <span class="text-amber-300 text-sm font-medium">《${g.book}》</span>
                                <span class="text-cyan-300 text-xs">${g.student}</span>
                                <span class="text-slate-400 text-[11px]">${g.className} · ${g.date}</span>
                                <span class="text-blue-400 text-[11px] mt-1">共 ${rowCount} 次对话 · ${g.totalTurns} 轮</span>
                            </div>
                        </td>`
                    : '';
                return `
                <tr class="${isFirst ? 'border-t-2 border-amber-400/20' : ''} border-b border-slate-700/40 hover:bg-slate-700/30">
                    ${bookCell}
                    <td class="px-3 py-2.5 text-center text-xs text-slate-300 whitespace-nowrap">${item.time.split(' ')[1] || item.time}</td>
                    <td class="px-3 py-2.5 text-center">${scopeBadge}</td>
                    <td class="px-3 py-2.5 text-center text-xs text-slate-300">${item.page || '-'}</td>
                    <td class="px-3 py-2.5 text-center text-sm text-blue-400">${turns}</td>
                    <td class="px-3 py-2.5 text-xs text-slate-300 truncate" title="${firstQ}">${firstQ}</td>
                    <td class="px-3 py-2.5 text-center">
                        <button onclick="App.viewAiDialogDetail('${escId}')" class="text-blue-400 hover:text-blue-300 text-xs">查看 ›</button>
                    </td>
                </tr>`;
            });
        }).join('') : `<tr><td colspan="7" class="px-3 py-8 text-center text-slate-500 text-sm">当前时间范围内暂无对话明细</td></tr>`;

        const headers = [
            { label: '绘本 / 学生', align: 'left', width: '22%' },
            { label: '时间', align: 'center', width: '10%' },
            { label: '类型', align: 'center', width: '10%' },
            { label: '页码', align: 'center', width: '8%' },
            { label: '轮次', align: 'center', width: '8%' },
            { label: '首条提问', align: 'left', width: '32%' },
            { label: '操作', align: 'center', width: '10%' }
        ];
        return `
            <div class="bg-slate-700/40 backdrop-blur-sm rounded-2xl border border-amber-400/25 p-4 mt-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-semibold text-amber-300">💬 累计 AI 对话明细</h4>
                    <span class="text-xs text-slate-400">共 ${total} 次阅读活动</span>
                </div>
                <div class="overflow-x-auto rounded-xl border border-slate-700/40">
                    <table class="w-full table-fixed">
                        <thead class="bg-slate-800/60">
                            <tr>${headers.map(h => `<th class="px-3 py-2.5 text-${h.align} text-xs font-medium text-slate-400 whitespace-nowrap" style="width:${h.width}">${h.label}</th>`).join('')}</tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                ${this.renderAiMetricPagination('chats', total, currentPage, totalPages)}
            </div>
        `;
    },

    renderAiBooksDetailPanel() {
        const list = this.getAiHistoryByRange();
        const map = new Map();
        list.forEach(item => {
            if (!item.book) return;
            if (!map.has(item.book)) map.set(item.book, { book: item.book, chatCount: 0, turns: 0, students: new Set(), classes: new Set(), latestTime: '', scopes: { full: 0, page: 0 } });
            const stat = map.get(item.book);
            stat.chatCount += 1;
            stat.turns += item.session?.length || 0;
            if (item.student) stat.students.add(item.student);
            if (item.className) stat.classes.add(item.className);
            if (!stat.latestTime || item.time > stat.latestTime) stat.latestTime = item.time;
            if (item.scope === 'full') stat.scopes.full += 1; else stat.scopes.page += 1;
        });
        const all = [...map.values()].sort((a, b) => b.chatCount - a.chatCount);
        const total = all.length;
        const pageSize = this._aiMetricPageSize;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        let currentPage = this.getAiMetricCurrentPage('books');
        if (currentPage > totalPages) { currentPage = totalPages; this._aiMetricPages.books = currentPage; }
        const rows = all.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        const baseIdx = (currentPage - 1) * pageSize;
        const tableRows = rows.length ? rows.map((r, idx) => {
            const cached = (this._aiBookAnalysis || {})[r.book];
            const history = (this._aiBookReports || {})[r.book] || [];
            const hasReport = history.length > 0 || (cached && cached.done);
            const escBook = r.book.replace(/'/g, "\\'");
            const bookHash = this.hashStr(r.book);
            const histBtn = history.length
                ? `<button onclick="App.openAiBookReportsHistory('${escBook}')" class="px-2 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-600/60 text-slate-200 text-xs border border-slate-500/40 transition-colors whitespace-nowrap" title="查看该绘本的全部历史报告">📚 查看历史报告</button>`
                : '';
            const analysisCell = hasReport
                ? `<div class="flex flex-col items-stretch gap-1"><button onclick="App.openAiBookAnalysis('${escBook}')" class="px-2 py-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-xs border border-violet-400/30 transition-colors whitespace-nowrap">📊 查看最新报告</button>${histBtn}</div>`
                : `<button onclick="App.startAiBookAnalysis('${escBook}')" class="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs border border-amber-400/30 transition-colors whitespace-nowrap">✨ 生成AI分析</button>`;
            return `
            <tr class="border-b border-slate-700/40 hover:bg-slate-700/30">
                <td class="px-3 py-2.5 text-center text-xs text-slate-400 w-12">${baseIdx + idx + 1}</td>
                <td class="px-3 py-2.5 text-left"><span class="text-cyan-300 text-sm">《${r.book}》</span></td>
                <td class="px-3 py-2.5 text-center text-sm text-cyan-400">${r.chatCount}</td>
                <td class="px-3 py-2.5 text-center text-sm text-slate-200">${r.turns}</td>
                <td class="px-3 py-2.5 text-center text-sm text-slate-200">${r.students.size}</td>
                <td class="px-3 py-2.5 text-center text-sm text-slate-200">${r.classes.size}</td>
                <td class="px-3 py-2.5 text-center text-xs text-slate-400">
                    <div class="flex flex-col items-center gap-1">
                        <span class="px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 whitespace-nowrap">阅读中 ${r.scopes.page}</span>
                        <span class="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 whitespace-nowrap">阅读后 ${r.scopes.full}</span>
                    </div>
                </td>
                <td class="px-3 py-2.5 text-center text-xs text-slate-400">${r.latestTime || '-'}</td>
                <td class="px-3 py-2.5 text-center">${analysisCell}</td>
                <td class="px-3 py-2.5 text-center">
                    <button onclick="App.viewAiBookDrilldown('${escBook}')" class="text-cyan-300 hover:text-cyan-200 text-xs whitespace-nowrap">查看互动明细 ›</button>
                </td>
            </tr>`;
        }).join('') : `<tr><td colspan="10" class="px-3 py-8 text-center text-slate-500 text-sm">当前时间范围内暂无绘本互动明细</td></tr>`;
        const headers = [
            { label: '#', align: 'center', width: '4%' },
            { label: '绘本', align: 'left', width: '13%' },
            { label: '对话次数', align: 'center', width: '8%' },
            { label: '累计轮次', align: 'center', width: '8%' },
            { label: '涉及幼儿', align: 'center', width: '8%' },
            { label: '涉及班级', align: 'center', width: '8%' },
            { label: '对话类型分布', align: 'center', width: '14%' },
            { label: '最近互动', align: 'center', width: '10%' },
            { label: 'AI分析', align: 'center', width: '16%' },
            { label: '操作', align: 'center', width: '11%' }
        ];
        return `
            <div class="bg-slate-700/40 backdrop-blur-sm rounded-2xl border border-cyan-400/25 p-4 mt-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-semibold text-cyan-300">📖 绘本互动明细</h4>
                    <span class="text-xs text-slate-400">共 ${total} 本绘本</span>
                </div>
                <div class="overflow-x-auto rounded-xl border border-slate-700/40">
                    <table class="w-full table-fixed">
                        <thead class="bg-slate-800/60">
                            <tr>${headers.map(h => `<th class="px-3 py-2.5 text-${h.align} text-xs font-medium text-slate-400 whitespace-nowrap" style="width:${h.width}">${h.label}</th>`).join('')}</tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                ${this.renderAiMetricPagination('books', total, currentPage, totalPages)}
            </div>
            <div class="bg-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-500/35 p-5 mt-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-1.5 h-4 bg-cyan-400 rounded"></span>
                        <h3 class="text-sm font-semibold text-slate-200">绘本 AI 分析历史报告</h3>
                    </div>
                    <div class="flex items-center gap-2">
                    ${this.renderAiInlineHistSearch('book', '搜索绘本名…')}
                    <button onclick="App.startAiBookAnalysisPick()" class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-200 text-xs border border-cyan-400/40 transition-colors flex items-center gap-1.5" title="新增一次 AI 分析">
                        <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        新增 AI 分析
                    </button>
                    </div>
                </div>
                <div id="ai-book-analysis-history">${this.renderAiBookAnalysisHistoryPanel()}</div>
            </div>
        `;
    },

    renderAiStudentsDetailPanel() {
        const list = this.getAiHistoryByRange();
        const map = new Map();
        list.forEach(item => {
            const key = item.student || '匿名';
            if (!map.has(key)) map.set(key, { student: key, className: item.className || '-', chatCount: 0, turns: 0, books: new Set(), latestTime: '', latestBook: '', scopes: { full: 0, page: 0 } });
            const stat = map.get(key);
            stat.chatCount += 1;
            stat.turns += item.session?.length || 0;
            if (item.book) stat.books.add(item.book);
            if (!stat.latestTime || item.time > stat.latestTime) {
                stat.latestTime = item.time;
                stat.latestBook = item.book || '';
            }
            if (item.scope === 'full') stat.scopes.full += 1; else stat.scopes.page += 1;
        });
        const all = [...map.values()].sort((a, b) => b.chatCount - a.chatCount);
        const total = all.length;
        const pageSize = this._aiMetricPageSize;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        let currentPage = this.getAiMetricCurrentPage('students');
        if (currentPage > totalPages) { currentPage = totalPages; this._aiMetricPages.students = currentPage; }
        const rows = all.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        const baseIdx = (currentPage - 1) * pageSize;
        const tableRows = rows.length ? rows.map((r, idx) => {
            const cached = (this._aiStudentAnalysis || {})[r.student];
            const history = (this._aiStudentReports || {})[r.student] || [];
            const hasReport = history.length > 0 || (cached && cached.done);
            const escStudent = r.student.replace(/'/g, "\\'");
            const studentHash = this.hashStr(r.student);
            const histBtn = history.length
                ? `<button onclick="App.openAiStudentReportsHistory('${escStudent}')" class="px-2 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-600/60 text-slate-200 text-xs border border-slate-500/40 transition-colors whitespace-nowrap" title="查看该幼儿的全部历史报告">📚 查看历史报告</button>`
                : '';
            const analysisCell = hasReport
                ? `<div class="flex flex-col items-stretch gap-1"><button onclick="App.openAiStudentAnalysis('${escStudent}')" class="px-2 py-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-xs border border-violet-400/30 transition-colors whitespace-nowrap">📊 查看最新报告</button>${histBtn}</div>`
                : `<button onclick="App.startAiStudentAnalysis('${escStudent}')" class="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs border border-amber-400/30 transition-colors whitespace-nowrap">✨ 生成AI分析</button>`;
            return `
            <tr class="border-b border-slate-700/40 hover:bg-slate-700/30">
                <td class="px-3 py-2.5 text-center text-xs text-slate-400 w-12">${baseIdx + idx + 1}</td>
                <td class="px-3 py-2.5 text-left text-sm text-slate-200">${r.student}</td>
                <td class="px-3 py-2.5 text-center text-xs text-slate-400">${r.className}</td>
                <td class="px-3 py-2.5 text-center text-sm text-emerald-400">${r.chatCount}</td>
                <td class="px-3 py-2.5 text-center text-sm text-slate-200">${r.turns}</td>
                <td class="px-3 py-2.5 text-center text-sm text-slate-200">${r.books.size}</td>
                <td class="px-3 py-2.5 text-center text-xs text-slate-400">
                    <div class="flex flex-col items-center gap-1">
                        <span class="px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 whitespace-nowrap">阅读中 ${r.scopes.page}</span>
                        <span class="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 whitespace-nowrap">阅读后 ${r.scopes.full}</span>
                    </div>
                </td>
                <td class="px-3 py-2.5 text-center text-xs text-slate-400">${r.latestTime || '-'}</td>
                <td class="px-3 py-2.5 text-left text-xs text-amber-300">${r.latestBook ? `《${r.latestBook}》` : '-'}</td>
                <td class="px-3 py-2.5 text-center">${analysisCell}</td>
                <td class="px-3 py-2.5 text-center">
                    <button onclick="App.viewAiStudentDrilldown('${escStudent}')" class="text-emerald-300 hover:text-emerald-200 text-xs whitespace-nowrap">查看互动明细 ›</button>
                </td>
            </tr>`;
        }).join('') : `<tr><td colspan="11" class="px-3 py-8 text-center text-slate-500 text-sm">当前时间范围内暂无幼儿互动明细</td></tr>`;
        const headers = [
            { label: '#', align: 'center', width: '4%' },
            { label: '幼儿', align: 'left', width: '10%' },
            { label: '班级', align: 'center', width: '8%' },
            { label: '对话次数', align: 'center', width: '7%' },
            { label: '累计轮次', align: 'center', width: '7%' },
            { label: '互动绘本', align: 'center', width: '7%' },
            { label: '对话类型分布', align: 'center', width: '13%' },
            { label: '最近对话', align: 'center', width: '11%' },
            { label: '最近绘本', align: 'left', width: '10%' },
            { label: 'AI分析', align: 'center', width: '15%' },
            { label: '操作', align: 'center', width: '10%' }
        ];
        return `
            <div class="bg-slate-700/40 backdrop-blur-sm rounded-2xl border border-emerald-400/25 p-4 mt-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-semibold text-emerald-300">👶 幼儿互动明细</h4>
                    <span class="text-xs text-slate-400">共 ${total} 位幼儿</span>
                </div>
                <div class="overflow-x-auto rounded-xl border border-slate-700/40">
                    <table class="w-full table-fixed">
                        <thead class="bg-slate-800/60">
                            <tr>${headers.map(h => `<th class="px-3 py-2.5 text-${h.align} text-xs font-medium text-slate-400 whitespace-nowrap" style="width:${h.width}">${h.label}</th>`).join('')}</tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                ${this.renderAiMetricPagination('students', total, currentPage, totalPages)}
            </div>
            <div class="bg-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-500/35 p-5 mt-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-1.5 h-4 bg-emerald-400 rounded"></span>
                        <h3 class="text-sm font-semibold text-slate-200">幼儿 AI 分析历史报告</h3>
                    </div>
                    <div class="flex items-center gap-2">
                    ${this.renderAiInlineHistSearch('student', '搜索幼儿姓名…')}
                    <button onclick="App.startAiStudentAnalysisPick()" class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-200 text-xs border border-emerald-400/40 transition-colors flex items-center gap-1.5" title="新增一次 AI 分析">
                        <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        新增 AI 分析
                    </button>
                    </div>
                </div>
                <div id="ai-student-analysis-history">${this.renderAiStudentAnalysisHistoryPanel()}</div>
            </div>
        `;
    },
    getAiHistoryByRange() {
        const range = this.dateRanges.aiOverview || {};
        const start = range?.startDate ? new Date(`${range.startDate}T00:00:00`).getTime() : null;
        const end = range?.endDate ? new Date(`${range.endDate}T23:59:59`).getTime() : null;
        const teacherClassName = this.isTeacherScope() ? this.getTeacherClassName() : null;
        return (MockData.aiOverview?.history || []).filter(item => {
            // 教师作用域过滤
            if (teacherClassName && item.className !== teacherClassName) return false;
            if (start === null && end === null) return true;
            const t = this.parseActivityDate(item.time).getTime();
            if (Number.isNaN(t)) return true;
            if (start !== null && t < start) return false;
            if (end !== null && t > end) return false;
            return true;
        });
    },

    getAiOverviewSummary() {
        // 教师视角：基于本班的 history 实时聚合
        if (this.isTeacherScope()) {
            const list = this.getAiHistoryByRange();
            const books = new Set();
            const students = new Set();
            let totalTurns = 0;
            list.forEach(h => {
                if (h.book) books.add(h.book);
                if (h.student) students.add(h.student);
                totalTurns += (h.session?.length || 0);
            });
            return {
                totalChats: list.length,
                totalBooks: books.size,
                activeStudents: students.size,
                avgTurnsPerSession: list.length ? (totalTurns / list.length).toFixed(1) : '0.0'
            };
        }
        return MockData.aiOverview?.summary || { totalChats: 0, totalBooks: 0, activeStudents: 0, avgTurnsPerSession: 0 };
    },

    getAiHotQuestionsByRange() {
        // 教师视角：基于本班对话实时统计 TOP10
        if (this.isTeacherScope()) {
            const map = new Map();
            this.getAiHistoryByRange().forEach(h => (h.session || []).forEach(t => {
                if (t.q) map.set(t.q, (map.get(t.q) || 0) + 1);
            }));
            return [...map.entries()].map(([q, count]) => ({ q, count }))
                .sort((a, b) => b.count - a.count).slice(0, 10);
        }
        return (MockData.aiOverview?.hotQuestions || []).slice(0, 10);
    },

    // ===== 绘本明细 → 查看该绘本所有阅读活动的完整对话 =====
    viewAiBookDrilldown(book) {
        this._aiDrilldown = { type: 'book', value: book, studentFilter: null };
        this.openModal(this.renderAiDrilldownModal(), { size: 'xwide' });
    },

    viewAiStudentDrilldown(student) {
        this._aiDrilldown = { type: 'student', value: student, studentFilter: null };
        this.openModal(this.renderAiDrilldownModal(), { size: 'xwide' });
    },

    filterAiDrilldownStudent(student) {
        if (!this._aiDrilldown) return;
        this._aiDrilldown.studentFilter = student || null;
        const host = document.getElementById('modal-content');
        if (host) {
            host.innerHTML = this.renderAiDrilldownModal();
            const input = document.getElementById('ai-drilldown-student-search');
            if (input) {
                input.focus();
                const len = input.value.length;
                input.setSelectionRange(len, len);
            }
        }
    },

    viewAiDrilldownSession(student, date, book) {
        const dd = this._aiDrilldown || {};
        const isBook = dd.type === 'book';
        const bookName = book || (isBook ? dd.value : null);
        const all = this.getAiHistoryByRange()
            .filter(item => {
                if (student !== (item.student || '匿名')) return false;
                if (bookName && item.book !== bookName) return false;
                const dateStr = (item.time || '').split(' ')[0] || '';
                return dateStr === date;
            })
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time));
        if (!all.length) return;

        const firstItem = all[0];
        const displayBook = bookName || firstItem.book;
        const className = firstItem.className || '-';
        const totalTurns = all.reduce((s, h) => s + (h.session?.length || 0), 0);

        const dialogsHtml = all.map(item => {
            const scopeBadge = item.scope === 'page'
                ? '<span class="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-400/30">阅读中</span>'
                : '<span class="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">阅读后</span>';
            const turnsHtml = (item.session || []).map((t, idx) => `
                <div class="mb-3 last:mb-0">
                    <div class="flex items-center gap-2 mb-1.5">
                        <span class="text-xs text-amber-400 font-semibold">第 ${idx + 1} 轮</span>
                        <span class="text-[11px] text-slate-500">${item.page || '-'}</span>
                        ${scopeBadge}
                    </div>
                    <div class="bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-2 mb-1.5">
                        <div class="flex items-center justify-between gap-2 mb-0.5">
                            <div class="text-[11px] text-amber-300">小朋友提问</div>
                            ${this.voicePlayButton(t.q || '')}
                        </div>
                        <div class="text-sm text-amber-100 leading-relaxed">${t.q || ''}</div>
                    </div>
                    <div class="bg-slate-700/40 border border-slate-600/30 rounded-lg px-3 py-2">
                        <div class="text-[11px] text-cyan-300 mb-0.5">AI 回复</div>
                        <div class="text-sm text-slate-200 leading-relaxed">${t.a || ''}</div>
                    </div>
                </div>
            `).join('');
            return `
                <div class="px-4 py-3 border-b border-slate-700/30 last:border-b-0">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs text-slate-400">${item.time}</span>
                        <span class="text-slate-600">|</span>
                        <span class="text-xs text-slate-400">${item.page || '-'}</span>
                        <span class="text-slate-600">|</span>
                        ${scopeBadge}
                        <span class="text-slate-600">|</span>
                        <span class="text-xs text-blue-400">${item.session?.length || 0} 轮</span>
                    </div>
                    ${turnsHtml}
                </div>`;
        }).join('');

        const content = `
            <div class="bg-slate-900 rounded-xl p-6 w-full max-w-4xl mx-auto">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-white">📖 阅读对话明细</h3>
                    <div class="flex items-center">
                        <button onclick="App.returnFromAiDrilldownSession()" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-600/70 text-slate-200 text-sm transition-colors mr-2">
                            <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                            返回
                        </button>
                        <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="bg-slate-700/40 border border-slate-600/30 rounded-xl p-4 mb-5">
                    <div class="grid grid-cols-3 gap-3 text-sm">
                        <div><span class="text-slate-400">绘本：</span><span class="text-amber-300">《${displayBook}》</span></div>
                        <div><span class="text-slate-400">日期：</span><span class="text-slate-200">${date}</span></div>
                        <div><span class="text-slate-400">小朋友：</span><span class="text-cyan-300">${student}</span></div>
                        <div><span class="text-slate-400">班级：</span><span class="text-slate-200">${className}</span></div>
                        <div><span class="text-slate-400">对话次数：</span><span class="text-blue-400">${all.length}</span></div>
                        <div><span class="text-slate-400">累计轮次：</span><span class="text-blue-400">${totalTurns}</span></div>
                    </div>
                </div>
                <div class="max-h-[55vh] overflow-y-auto pr-1">
                    ${dialogsHtml || '<div class="text-center text-slate-500 py-8">暂无对话内容</div>'}
                </div>
            </div>
        `;
        this.openModal(content, { size: 'wide' });
    },

    returnFromAiDrilldownSession() {
        if (this._aiDrilldown) {
            const host = document.getElementById('modal-content');
            if (host) host.innerHTML = this.renderAiDrilldownModal();
            this.openModal(this.renderAiDrilldownModal(), { size: 'xwide' });
        } else {
            this.closeModalDirect();
        }
    },

    renderAiDrilldownModal() {
        const dd = this._aiDrilldown || {};
        const isBook = dd.type === 'book';
        const accent = isBook ? 'text-cyan-300' : 'text-emerald-300';
        const all = this.getAiHistoryByRange()
            .filter(item => isBook ? item.book === dd.value : item.student === dd.value)
            .slice()
            .sort((a, b) => this.parseActivityDate(b.time) - this.parseActivityDate(a.time));

        // 按「学生+日期」分组
        const groups = new Map();
        all.forEach(item => {
            const dateStr = (item.time || '').split(' ')[0] || '';
            const key = `${item.student || '匿名'}||${dateStr}`;
            if (!groups.has(key)) groups.set(key, { student: item.student || '匿名', className: item.className || '-', date: dateStr, book: item.book, items: [] });
            groups.get(key).items.push(item);
        });
        groups.forEach(g => g.items.sort((a, b) => a.time.localeCompare(b.time)));
        const sortedGroups = [...groups.values()]
            .sort((a, b) => b.items[b.items.length - 1].time.localeCompare(a.items[a.items.length - 1].time));

        // 学生筛选（按名称搜索）
        const studentFilterRaw = dd.studentFilter || '';
        const studentFilter = studentFilterRaw.trim();
        const filteredGroups = studentFilter
            ? sortedGroups.filter(g => g.student.includes(studentFilter))
            : sortedGroups;
        const filteredChats = filteredGroups.reduce((s, g) => s + g.items.length, 0);
        const filteredTurns = filteredGroups.reduce((s, g) => s + g.items.reduce((ss, h) => ss + (h.session?.length || 0), 0), 0);

        const filterBar = `
            <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="text-xs text-slate-400">搜索小朋友：</span>
                <div class="relative">
                    <svg class="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input id="ai-drilldown-student-search" type="text" value="${studentFilterRaw.replace(/"/g, '&quot;')}" oninput="App.filterAiDrilldownStudent(this.value)" placeholder="输入小朋友姓名..." class="pl-8 pr-8 py-1.5 bg-slate-700/40 border border-slate-600/40 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 w-56">
                    ${studentFilter ? `<button onclick="App.filterAiDrilldownStudent('')" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white" title="清除"><svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>` : ''}
                </div>
                ${studentFilter ? `<span class="text-xs text-cyan-300">已筛选 "${studentFilter}" · 命中 ${filteredGroups.length} 条</span>` : `<span class="text-xs text-slate-500">共 ${sortedGroups.length} 次阅读活动</span>`}
            </div>`;

        // 表格选择栏
        const headers = isBook
            ? [
                { label: '小朋友', align: 'left', width: '12%' },
                { label: '日期', align: 'center', width: '10%' },
                { label: '班级', align: 'center', width: '9%' },
                { label: '对话次数', align: 'center', width: '8%' },
                { label: '累计轮次', align: 'center', width: '8%' },
                { label: '对话类型分布', align: 'center', width: '17%' },
                { label: '最近时间', align: 'center', width: '12%' },
                { label: '操作', align: 'center', width: '8%' }
            ]
            : [
                { label: '小朋友', align: 'left', width: '11%' },
                { label: '日期', align: 'center', width: '9%' },
                { label: '班级', align: 'center', width: '8%' },
                { label: '绘本', align: 'left', width: '12%' },
                { label: '对话次数', align: 'center', width: '8%' },
                { label: '累计轮次', align: 'center', width: '8%' },
                { label: '对话类型分布', align: 'center', width: '15%' },
                { label: '最近时间', align: 'center', width: '12%' },
                { label: '操作', align: 'center', width: '7%' }
            ];

        const tableRows = filteredGroups.length ? filteredGroups.map(g => {
            const groupTotalTurns = g.items.reduce((s, h) => s + (h.session?.length || 0), 0);
            const scopeCount = g.items.reduce((acc, h) => {
                if (h.scope === 'full') acc.full += 1; else acc.page += 1;
                return acc;
            }, { page: 0, full: 0 });
            const latestTime = g.items[g.items.length - 1]?.time || '';
            const escStudent = g.student.replace(/'/g, "\\'");
            const escDate = g.date.replace(/'/g, "\\'");
            const escBook = g.book.replace(/'/g, "\\'");
            return `
                <tr class="border-b border-slate-700/40 hover:bg-slate-700/30">
                    <td class="px-3 py-2.5 text-left text-xs text-cyan-300">${g.student}</td>
                    <td class="px-3 py-2.5 text-center text-xs text-slate-300">${g.date}</td>
                    <td class="px-3 py-2.5 text-center text-xs text-slate-400">${g.className}</td>
                    ${!isBook ? `<td class="px-3 py-2.5 text-left"><span class="text-amber-300 text-sm">《${g.book}》</span></td>` : ''}
                    <td class="px-3 py-2.5 text-center text-sm text-cyan-400">${g.items.length}</td>
                    <td class="px-3 py-2.5 text-center text-sm text-slate-200">${groupTotalTurns}</td>
                    <td class="px-3 py-2.5 text-center text-xs text-slate-400">
                        <span class="px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 mr-1">阅读中 ${scopeCount.page}</span>
                        <span class="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300">阅读后 ${scopeCount.full}</span>
                    </td>
                    <td class="px-3 py-2.5 text-center text-xs text-slate-400">${latestTime}</td>
                    <td class="px-3 py-2.5 text-center">
                        <button onclick="App.viewAiDrilldownSession('${escStudent}','${escDate}','${escBook}')" class="text-blue-400 hover:text-blue-300 text-xs">查看 ›</button>
                    </td>
                </tr>`;
        }).join('') : `<tr><td colspan="${isBook ? 8 : 9}" class="px-3 py-8 text-center text-slate-500 text-sm">暂无对话明细</td></tr>`;

        const titleText = isBook ? `《${dd.value}》全部对话` : `${dd.value} 的全部对话`;

        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-white"><span class="${accent}">${titleText}</span></h3>
                        <div class="text-xs text-slate-400 mt-1">${studentFilter ? `${studentFilter} · ` : ''}${filteredGroups.length} 次阅读活动 · ${filteredChats} 次对话 · ${filteredTurns} 轮</div>
                    </div>
                    <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                        <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                ${filterBar}
                <div class="overflow-x-auto rounded-xl border border-slate-700/40">
                    <table class="w-full table-fixed">
                        <thead class="bg-slate-800/60">
                            <tr>${headers.map(h => `<th class="px-3 py-2.5 text-${h.align} text-xs font-medium text-slate-400 whitespace-nowrap" style="width:${h.width}">${h.label}</th>`).join('')}</tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    getAiBookInteractionsByRange() {
        if (this.isTeacherScope()) {
            const map = new Map();
            this.getAiHistoryByRange().forEach(h => {
                if (!h.book) return;
                map.set(h.book, (map.get(h.book) || 0) + 1);
            });
            return [...map.entries()].map(([book, count]) => ({ book, count }))
                .sort((a, b) => b.count - a.count).slice(0, 10);
        }
        return (MockData.aiOverview?.bookInteractions || []).slice(0, 10);
    },

    // AI总览 - 时间轴（按 aiOverview 时间筛选，1 个月内日维度，否则月维度）
    buildAiOverviewTimeline() {
        const range = this.dateRanges.aiOverview || {};
        const start = range?.startDate ? new Date(`${range.startDate}T00:00:00`) : null;
        const end = range?.endDate ? new Date(`${range.endDate}T23:59:59`) : null;
        const granularity = this.getOverviewSeriesGranularity(range);
        const dates = [];
        if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
            if (granularity === 'month') {
                const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
                const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
                while (cursor <= endMonth) {
                    dates.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
                    cursor.setMonth(cursor.getMonth() + 1);
                }
            } else {
                const cursor = new Date(start);
                cursor.setHours(0, 0, 0, 0);
                const endDate = new Date(end);
                endDate.setHours(0, 0, 0, 0);
                while (cursor <= endDate) {
                    dates.push(this.formatDateInput(cursor).slice(5));
                    cursor.setDate(cursor.getDate() + 1);
                }
            }
        }
        return { dates, granularity };
    },

    // AI总览 - 各班级 AI 对话次数变化趋势（教师视角仅展示本班 1 条线）
    getAiClassDialogTrend() {
        const { dates, granularity } = this.buildAiOverviewTimeline();
        if (!dates.length) return { dates: [], granularity, series: [] };

        // 教师视角：基于真实 history 聚合本班每日/每月对话次数
        if (this.isTeacherScope()) {
            const cls = this.selectedClass;
            const list = this.getAiHistoryByRange();
            const bucket = new Map(dates.map(d => [d, 0]));
            const keyOf = (timeStr) => {
                const date = this.parseActivityDate(timeStr);
                if (Number.isNaN(date.getTime())) return null;
                if (granularity === 'month') {
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                }
                return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            };
            list.forEach(h => {
                const k = keyOf(h.time);
                if (k != null && bucket.has(k)) bucket.set(k, bucket.get(k) + 1);
            });
            const values = dates.map(d => bucket.get(d) || 0);
            return { dates, granularity, series: [{ name: cls?.name || '本班', values }] };
        }

        // 园长/管理员视角：按园所内多个班级派生伪随机趋势
        const classes = (MockData.classes || [])
            .filter(c => {
                if (!this.selectedSchool) return true;
                return c.kindergartenId === this.selectedSchool.id;
            })
            .slice(0, 6);
        const series = classes.map((cls, clsIdx) => {
            const baseTotal = Math.max(8, Math.round((cls.activityCount || 20) * 0.6));
            const seedBase = (cls.id || 1) * 9 + clsIdx * 13;
            const values = dates.map((_, i) => {
                if (granularity === 'month') {
                    const wave = Math.sin((i + seedBase) * 0.7) * 0.4 + 1;
                    return Math.max(1, Math.round(baseTotal * wave));
                }
                const dailyBase = Math.max(0.4, baseTotal / 30);
                const wave = Math.sin((i + seedBase) * 0.85) * 0.6 + Math.cos((i + clsIdx) * 0.4) * 0.3 + 1;
                return Math.max(0, Math.round(dailyBase * wave));
            });
            return { name: cls.name, values };
        });
        return { dates, granularity, series };
    },

    refreshAiOverviewMetrics() {
        const grid = document.getElementById('ai-summary-grid');
        if (grid) grid.innerHTML = this.renderAiSummaryCards(this.getAiOverviewSummary());
    },

    initAiOverviewPage() {
        Charts.safeInit(() => Charts.initAiHotQuestionsBar(this.getAiHotQuestionsByRange()));
        Charts.safeInit(() => Charts.initAiBookInteractionBar(this.getAiBookInteractionsByRange()));
        Charts.safeInit(() => Charts.initAiClassDialogTrend(this.getAiClassDialogTrend()));
    },

    teardownAiOverviewPage() {
        // AI总览页无后台资源需要清理
    },

    viewAiDialogDetail(id, fromDrilldown = false) {
        const item = (MockData.aiOverview?.history || []).find(x => x.id === id);
        if (!item) return;
        this._aiDialogReturnTo = fromDrilldown && this._aiDrilldown ? 'drilldown' : null;
        const scopeText = item.scope === 'page' ? '阅读中对话' : '阅读后对话';
        const turnsHtml = (item.session || []).map((t, idx) => `
            <div class="mb-4">
                <div class="flex items-start gap-2 mb-2">
                    <span class="text-xs text-amber-400 font-semibold shrink-0">第 ${idx + 1} 轮</span>
                </div>
                <div class="bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-2.5 mb-2">
                    <div class="flex items-center justify-between gap-2 mb-1">
                        <div class="text-[11px] text-amber-300">小朋友提问</div>
                        ${this.voicePlayButton(t.q || '')}
                    </div>
                    <div class="text-sm text-amber-100 leading-relaxed">${t.q || ''}</div>
                </div>
                <div class="bg-slate-700/40 border border-slate-600/30 rounded-lg px-3 py-2.5">
                    <div class="text-[11px] text-cyan-300 mb-1">AI 回复</div>
                    <div class="text-sm text-slate-200 leading-relaxed">${t.a || ''}</div>
                </div>
            </div>
        `).join('');
        const backBtn = this._aiDialogReturnTo === 'drilldown'
            ? `<button onclick="App.returnFromAiDialogDetail()" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-600/70 text-slate-200 text-sm transition-colors mr-2">
                    <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    返回
                </button>`
            : '';
        const content = `
            <div class="bg-slate-900 rounded-xl p-6 max-w-4xl">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-white">AI 对话详情</h3>
                    <div class="flex items-center">
                        ${backBtn}
                        <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="bg-slate-700/40 border border-slate-600/30 rounded-xl p-4 mb-5">
                    <div class="grid grid-cols-3 gap-3 text-sm">
                        <div><span class="text-slate-400">绘本：</span><span class="text-amber-300">《${item.book}》</span></div>
                        <div><span class="text-slate-400">页码：</span><span class="text-slate-200">${item.page || '-'}</span></div>
                        <div><span class="text-slate-400">对话类型：</span><span class="text-slate-200">${scopeText}</span></div>
                        <div><span class="text-slate-400">时间：</span><span class="text-slate-200">${item.time}</span></div>
                        <div><span class="text-slate-400">小朋友：</span><span class="text-slate-200">${item.student || '匿名'}</span></div>
                        <div><span class="text-slate-400">班级：</span><span class="text-slate-200">${item.className || '-'}</span></div>
                    </div>
                </div>
                <div class="max-h-[55vh] overflow-y-auto pr-1">
                    ${turnsHtml || '<div class="text-center text-slate-500 py-8">暂无对话内容</div>'}
                </div>
            </div>
        `;
        this.openModal(content);
    },

    returnFromAiDialogDetail() {
        if (this._aiDrilldown) {
            const host = document.getElementById('modal-content');
            if (host) host.innerHTML = this.renderAiDrilldownModal();
        } else {
            this.closeModalDirect();
        }
        this._aiDialogReturnTo = null;
    },

    // 查看孩子某天读某本绘本的完整对话明细
    viewAiReadingSession(student, date, book) {
        const dd = this._aiDrilldown || {};
        const isBook = dd.type === 'book';
        const bookName = book || (isBook ? dd.value : null);
        const all = this.getAiHistoryByRange()
            .filter(item => {
                if (student !== (item.student || '匿名')) return false;
                if (bookName && item.book !== bookName) return false;
                const dateStr = (item.time || '').split(' ')[0] || '';
                return dateStr === date;
            })
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time));
        if (!all.length) return;

        const firstItem = all[0];
        const displayBook = bookName || firstItem.book;
        const className = firstItem.className || '-';
        const totalTurns = all.reduce((s, h) => s + (h.session?.length || 0), 0);

        const dialogsHtml = all.map(item => {
            const scopeBadge = item.scope === 'page'
                ? '<span class="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-400/30">阅读中</span>'
                : '<span class="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">阅读后</span>';
            const turnsHtml = (item.session || []).map((t, idx) => `
                <div class="mb-3">
                    <div class="flex items-center gap-2 mb-1.5">
                        <span class="text-xs text-amber-400 font-semibold">第 ${idx + 1} 轮</span>
                        <span class="text-[11px] text-slate-500">${item.page || '-'}</span>
                        ${scopeBadge}
                    </div>
                    <div class="bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-2 mb-1.5">
                        <div class="text-[11px] text-amber-300 mb-0.5">小朋友提问</div>
                        <div class="text-sm text-amber-100 leading-relaxed">${t.q || ''}</div>
                    </div>
                    <div class="bg-slate-700/40 border border-slate-600/30 rounded-lg px-3 py-2">
                        <div class="text-[11px] text-cyan-300 mb-0.5">AI 回复</div>
                        <div class="text-sm text-slate-200 leading-relaxed">${t.a || ''}</div>
                    </div>
                </div>
            `).join('');
            return `
                <div class="px-4 py-3 border-b border-slate-700/30 last:border-b-0">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs text-slate-400">${item.time}</span>
                        <span class="text-slate-600">|</span>
                        <span class="text-xs text-slate-400">${item.page || '-'}</span>
                        <span class="text-slate-600">|</span>
                        ${scopeBadge}
                        <span class="text-slate-600">|</span>
                        <span class="text-xs text-blue-400">${item.session?.length || 0} 轮</span>
                    </div>
                    ${turnsHtml}
                </div>`;
        }).join('');

        const content = `
            <div class="bg-slate-900 rounded-xl p-6 w-full max-w-4xl mx-auto">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-white">📖 阅读对话明细</h3>
                    <div class="flex items-center">
                        <button onclick="App.returnFromAiDialogDetail()" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-600/70 text-slate-200 text-sm transition-colors mr-2">
                            <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                            返回
                        </button>
                        <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="bg-slate-700/40 border border-slate-600/30 rounded-xl p-4 mb-5">
                    <div class="grid grid-cols-3 gap-3 text-sm">
                        <div><span class="text-slate-400">绘本：</span><span class="text-amber-300">《${displayBook}》</span></div>
                        <div><span class="text-slate-400">日期：</span><span class="text-slate-200">${date}</span></div>
                        <div><span class="text-slate-400">小朋友：</span><span class="text-cyan-300">${student}</span></div>
                        <div><span class="text-slate-400">班级：</span><span class="text-slate-200">${className}</span></div>
                        <div><span class="text-slate-400">对话次数：</span><span class="text-blue-400">${all.length}</span></div>
                        <div><span class="text-slate-400">累计轮次：</span><span class="text-blue-400">${totalTurns}</span></div>
                    </div>
                </div>
                <div class="max-h-[55vh] overflow-y-auto pr-1">
                    ${dialogsHtml || '<div class="text-center text-slate-500 py-8">暂无对话内容</div>'}
                </div>
            </div>
        `;
        this._aiDialogReturnTo = 'drilldown';
        this.openModal(content);
    },

    // ============================================================
    //  互动绘本 - AI 热点问题分析
    // ============================================================
    _llmConfig: {
        endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        model: 'ep-20250722141707-qzdfz',
        apiKey: '0765c87e-3032-45a2-b0a9-0900d1feb978'
    },

    _aiBookAnalysisRangeOptions: [
        { key: '7d', label: '7天', cnLabel: '近七日', days: 7 },
        { key: '1m', label: '1个月', cnLabel: '近一个月', days: 30 },
        { key: '6m', label: '半年', cnLabel: '近半年', days: 183 },
        { key: '1y', label: '一年', cnLabel: '近一年', days: 365 },
        { key: 'custom', label: '自选时间', cnLabel: '自选时间', days: null }
    ],

    // chip 标题：含义 + 具体时间段，如"近七日（2026年5月5日-2026年5月11日）"
    formatAiRangeChipLabel(rangeKey) {
        const opt = this._aiBookAnalysisRangeOptions.find(o => o.key === rangeKey);
        if (!opt) return rangeKey;
        if (rangeKey === 'custom') {
            const c = this._aiAnalysisCustomRange || {};
            if (!c.startDate || !c.endDate) return opt.cnLabel;
            return `${opt.cnLabel}（${this._toCnDate(c.startDate)}-${this._toCnDate(c.endDate)}）`;
        }
        const { startDate, endDate } = this.getAiAnalysisRangeBounds(rangeKey);
        if (!startDate || !endDate) return opt.cnLabel;
        return `${opt.cnLabel}（${this._toCnDate(startDate)}-${this._toCnDate(endDate)}）`;
    },

    // 计算具体的时间范围（基于最近 AI 历史日期），用于 chip 副标题与 custom 实际取数
    getAiAnalysisRangeBounds(rangeKey) {
        if (rangeKey === 'custom') {
            const c = this._aiAnalysisCustomRange || {};
            return { startDate: c.startDate || null, endDate: c.endDate || null };
        }
        const opt = this._aiBookAnalysisRangeOptions.find(o => o.key === rangeKey);
        if (!opt || opt.days == null) return { startDate: null, endDate: null };
        const latest = this.getLatestAiHistoryDate();
        const end = new Date(latest);
        end.setHours(0, 0, 0, 0);
        const start = new Date(end);
        start.setDate(start.getDate() - opt.days + 1);
        const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return { startDate: fmt(start), endDate: fmt(end) };
    },
    // 把 yyyy-mm-dd 转为 "yyyy年m月d日"
    _toCnDate(isoDate) {
        if (!isoDate) return '';
        const [y, m, d] = isoDate.split('-').map(Number);
        return `${y}年${m}月${d}日`;
    },
    formatAiRangeLabel(rangeKey) {
        const opt = this._aiBookAnalysisRangeOptions.find(o => o.key === rangeKey);
        if (!opt) return rangeKey;
        if (rangeKey === 'custom') {
            const c = this._aiAnalysisCustomRange || {};
            if (!c.startDate || !c.endDate) return `${opt.label}`;
            return `${this._toCnDate(c.startDate)}-${this._toCnDate(c.endDate)}`;
        }
        const { startDate, endDate } = this.getAiAnalysisRangeBounds(rangeKey);
        if (!startDate || !endDate) return opt.label;
        return `${this._toCnDate(startDate)}-${this._toCnDate(endDate)}`;
    },
    // 从一组对话记录中汇总统计：对话次数 / 累计轮次 / 互动绘本 / 涉及幼儿 / 涉及班级 / 对话类型分布
    computeAiDialogueStats(dialogues) {
        const list = dialogues || [];
        const books = new Set();
        const students = new Set();
        const classes = new Set();
        let turns = 0;
        let typeRead = 0;   // scope==='page' 阅读中
        let typeAfter = 0;  // 其它（full）阅读后
        list.forEach(h => {
            turns += (h.session?.length || 0);
            if (h.book) books.add(h.book);
            if (h.student) students.add(h.student);
            if (h.className) classes.add(h.className);
            if (h.scope === 'page') typeRead += 1; else typeAfter += 1;
        });
        return {
            chatCount: list.length,
            turns,
            bookCount: books.size,
            books: [...books],
            studentCount: students.size,
            students: [...students],
            classCount: classes.size,
            classes: [...classes],
            typeRead,
            typeAfter
        };
    },
    // "对话类型分布"的小标签 HTML（阅读中/阅读后）
    renderAiTypeDistribution(stats) {
        const r = stats?.typeRead || 0;
        const a = stats?.typeAfter || 0;
        return `<span class="aih-badges">
            <span class="aih-badge aih-badge--read">阅读中 <b>${r}</b></span>
            <span class="aih-badge aih-badge--after">阅读后 <b>${a}</b></span>
        </span>`;
    },
    // 可用对话样本统计行：与对应明细列表展示范围一致
    // fields 取值：chat/turns/books/students/classes/type
    renderAiSampleStatsRow(dialogues, fields, accentTextClass = 'text-cyan-300') {
        const stats = this.computeAiDialogueStats(dialogues);
        const labelMap = {
            chat: ['对话次数', stats.chatCount],
            turns: ['累计轮次', stats.turns],
            books: ['互动绘本', stats.bookCount],
            students: ['涉及幼儿', stats.studentCount],
            classes: ['涉及班级', stats.classCount],
        };
        const cells = fields.filter(f => f !== 'type').map(f => {
            const [label, val] = labelMap[f];
            return `<div class="bg-slate-800/60 border border-slate-600/30 rounded-lg px-3 py-2">
                <span class="text-slate-500">${label}</span>
                <div class="${accentTextClass} font-semibold">${val}</div>
            </div>`;
        });
        let typeCell = '';
        if (fields.includes('type')) {
            typeCell = `<div class="bg-slate-800/60 border border-slate-600/30 rounded-lg px-3 py-2">
                <span class="text-slate-500">对话类型分布</span>
                <div class="mt-1">${this.renderAiTypeDistribution(stats)}</div>
            </div>`;
        }
        return `<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-5">${cells.join('')}${typeCell}</div>`;
    },
    // 已生成报告头部：范围 + 多维样本统计 + 生成时间（统一新样式）
    renderAiReportHeaderStats(entry, fields, accentTextClass = 'text-cyan-300') {
        const stats = entry.stats || this.computeAiDialogueStats([]);
        const labelMap = {
            chat: ['对话次数', stats.chatCount],
            turns: ['累计轮次', stats.turns],
            books: ['互动绘本', stats.bookCount],
            students: ['涉及幼儿', stats.studentCount],
            classes: ['涉及班级', stats.classCount],
        };
        const rangeCell = `<div class="bg-slate-800/60 border border-slate-600/30 rounded-lg px-3 py-2"><span class="text-slate-500">范围</span><div class="text-slate-200">${entry.roleLabel || '-'} · ${entry.rangeKey ? this.formatAiRangeLabel(entry.rangeKey) : (entry.rangeLabel || '-')}</div></div>`;
        const statCells = fields.filter(f => f !== 'type').map(f => {
            const [label, val] = labelMap[f];
            return `<div class="bg-slate-800/60 border border-slate-600/30 rounded-lg px-3 py-2"><span class="text-slate-500">${label}</span><div class="${accentTextClass} font-semibold">${val}</div></div>`;
        }).join('');
        const typeCell = fields.includes('type')
            ? `<div class="bg-slate-800/60 border border-slate-600/30 rounded-lg px-3 py-2"><span class="text-slate-500">对话类型分布</span><div class="mt-1">${this.renderAiTypeDistribution(stats)}</div></div>`
            : '';
        const timeCell = `<div class="bg-slate-800/60 border border-slate-600/30 rounded-lg px-3 py-2"><span class="text-slate-500">生成时间</span><div class="text-slate-200">${entry.generatedAt || '—'}</div></div>`;
        return `<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-4">${rangeCell}${statCells}${typeCell}${timeCell}</div>`;
    },
    // 自选时间状态（共用）：{ startDate, endDate } yyyy-mm-dd
    _aiAnalysisCustomRange: { startDate: '', endDate: '' },
    setAiAnalysisCustomRange(field, value) {
        if (!this._aiAnalysisCustomRange) this._aiAnalysisCustomRange = { startDate: '', endDate: '' };
        this._aiAnalysisCustomRange[field] = value;
        // 校验跨度不超过一年
        const c = this._aiAnalysisCustomRange;
        if (c.startDate && c.endDate) {
            const s = new Date(`${c.startDate}T00:00:00`).getTime();
            const e = new Date(`${c.endDate}T00:00:00`).getTime();
            if (e < s) {
                this.showToast?.('结束日期不能早于开始日期', 'error');
                this._aiAnalysisCustomRange.endDate = '';
            } else if ((e - s) / 86400000 > 366) {
                this.showToast?.('自选时间跨度不能超过一年', 'error');
                this._aiAnalysisCustomRange.endDate = '';
            }
        }
    },
    // 共用渲染：3 个 AI 分析弹窗的"选择数据时间范围"选择器
    // selectFn 为字符串类似 "App.selectAiBookAnalysisRange"
    renderAiAnalysisRangeChips(rangeKey, selectFnName) {
        const c = this._aiAnalysisCustomRange || { startDate: '', endDate: '' };
        return `
            <div class="mb-4">
                <div class="text-sm text-slate-300 mb-3">选择数据时间范围</div>
                <div class="grid grid-cols-2 gap-3">
                    ${this._aiBookAnalysisRangeOptions.map(opt => {
                        const active = rangeKey === opt.key;
                        const label = this.formatAiRangeChipLabel(opt.key);
                        return `
                            <label class="cursor-pointer">
                                <input type="radio" name="ai-range-${selectFnName}" value="${opt.key}" ${active ? 'checked' : ''} class="hidden peer" onchange="${selectFnName}('${opt.key}')">
                                <div class="px-4 py-3 rounded-xl border transition-all ${active ? 'border-amber-400/60 bg-amber-500/15 text-amber-200' : 'border-slate-600/40 bg-slate-800/40 text-slate-300 hover:border-slate-500/60'}">
                                    <div class="text-sm font-medium">${label}</div>
                                </div>
                            </label>
                        `;
                    }).join('')}
                </div>
                ${rangeKey === 'custom' ? `
                    <div class="mt-3 flex flex-wrap items-center gap-2">
                        <label class="text-xs text-slate-400">开始</label>
                        <input type="date" value="${c.startDate}" max="${c.endDate || ''}" onchange="App.setAiAnalysisCustomRange('startDate', this.value);${selectFnName}('custom')"
                            class="bg-slate-800/60 border border-slate-600/40 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400/50">
                        <label class="text-xs text-slate-400">结束</label>
                        <input type="date" value="${c.endDate}" min="${c.startDate || ''}" onchange="App.setAiAnalysisCustomRange('endDate', this.value);${selectFnName}('custom')"
                            class="bg-slate-800/60 border border-slate-600/40 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400/50">
                        <span class="text-[11px] text-slate-500">跨度不超过一年</span>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // ---------- AI 报告 localStorage 持久化 ----------
    _aiReportsStorageKey: 'aiBookReports',
    _aiReportsMaxPerBook: 50,

    loadAiReports() {
        try {
            const raw = localStorage.getItem(this._aiReportsStorageKey);
            const parsed = raw ? JSON.parse(raw) : {};
            this._aiBookReports = (parsed && typeof parsed === 'object') ? parsed : {};
        } catch (e) {
            this._aiBookReports = {};
        }
        // 用历史首条（最新一份）填充 _aiBookAnalysis，让"已生成"态在刷新后仍可用
        if (!this._aiBookAnalysis) this._aiBookAnalysis = {};
        Object.keys(this._aiBookReports).forEach(book => {
            const list = this._aiBookReports[book];
            if (Array.isArray(list) && list.length) {
                this._aiBookAnalysis[book] = this.cloneAiReport(list[0]);
            }
        });
    },

    persistAiReports() {
        try {
            localStorage.setItem(this._aiReportsStorageKey, JSON.stringify(this._aiBookReports || {}));
        } catch (e) { /* 配额满则忽略 */ }
    },

    saveAiReport(book, report) {
        if (!book || !report) return;
        if (!this._aiBookReports) this._aiBookReports = {};
        const list = this._aiBookReports[book] || [];
        // 拷贝快照，避免后续修改污染历史条目
        const snapshot = JSON.parse(JSON.stringify(report));
        if (!snapshot.id) snapshot.id = this.genAiReportId();
        list.unshift(snapshot);
        if (list.length > this._aiReportsMaxPerBook) list.length = this._aiReportsMaxPerBook;
        this._aiBookReports[book] = list;
        this.persistAiReports();
    },

    // 刷新当前 metric 面板（books 表格里的"📚 N"数字增加时调用）
    refreshAiMetricPanel() {
        if (!this._aiActiveMetric) return;
        const wrapper = document.getElementById('ai-metric-panel-wrapper');
        if (wrapper) wrapper.innerHTML = this.renderAiMetricPanel(this._aiActiveMetric);
    },

    deleteAiReport(book, reportId) {
        const list = (this._aiBookReports || {})[book];
        if (!list) return;
        const idx = list.findIndex(r => (r.id || r.generatedAt) === reportId);
        if (idx < 0) return;
        list.splice(idx, 1);
        if (list.length === 0) {
            delete this._aiBookReports[book];
            if (this._aiBookAnalysis) delete this._aiBookAnalysis[book];
        } else {
            // 若删的是当前展示版本，则回退到最新一份
            this._aiBookAnalysis[book] = this.cloneAiReport(list[0]);
        }
        this.persistAiReports();
        // 刷新历史 popover 与底层表格
        this.refreshAiBookHistoryPopover(book);
        this.refreshAiMetricPanel();
    },

    loadHistoricalReport(book, reportId) {
        const list = (this._aiBookReports || {})[book] || [];
        const found = list.find(r => (r.id || r.generatedAt) === reportId);
        if (!found) return;
        if (!this._aiBookAnalysis) this._aiBookAnalysis = {};
        this._aiBookAnalysis[book] = this.cloneAiReport(found);
        this._aiBookAnalysisCtx = { book, rangeKey: found.rangeKey };
        this.openModal(this.renderAiBookAnalysisModal('done'), { size: 'xwide' });
    },

    // —— AI 历史报告：全局遮罩弹框列表（绘本 / 幼儿 / 班级） ——
    _aiHistFmtTime(ts) {
        if (!ts) return '-';
        return ts; // 生成时报告时间已是 yyyy/M/d H:mm 文本
    },
    _aiHistRangeLabel(r) {
        // 历史条目里有 rangeLabel（旧）或 rangeKey；优先用 formatAiRangeLabel 重算
        if (r.rangeKey) return this.formatAiRangeLabel(r.rangeKey);
        return r.rangeLabel || '-';
    },
    _aiHistStats(r) {
        return r.stats || this.computeAiDialogueStats([]);
    },

    _aiReportsHistoryKeyword: { book: '', student: '', class: '' },
    openAiBookReportsHistory(prefilter) {
        this._aiReportsHistoryKeyword.book = prefilter || '';
        this._aiReportsHistoryPages.book = 1;
        this.openModal(this.renderAiReportsHistoryModal('book'), { size: 'xxwide' });
    },
    openAiStudentReportsHistory(prefilter) {
        this._aiReportsHistoryKeyword.student = prefilter || '';
        this._aiReportsHistoryPages.student = 1;
        this.openModal(this.renderAiReportsHistoryModal('student'), { size: 'xxwide' });
    },
    openAiClassReportsHistory(prefilter) {
        this._aiReportsHistoryKeyword.class = prefilter || '';
        this._aiReportsHistoryPages.class = 1;
        this.openModal(this.renderAiReportsHistoryModal('class'), { size: 'xxwide' });
    },
    setAiReportsHistoryKeyword(kind, kw) {
        if (!this._aiReportsHistoryKeyword) this._aiReportsHistoryKeyword = { book: '', student: '', class: '' };
        this._aiReportsHistoryKeyword[kind] = kw;
        this._aiReportsHistoryPages[kind] = 1;
        // 局部刷新表格 + 分页，保留搜索框焦点
        const wrap = document.getElementById('ai-reports-history-body-wrap');
        if (wrap) wrap.innerHTML = this.renderAiReportsHistoryBody(kind);
    },

    // 收集并按生成时间倒序排列某一类的全部历史报告（带当前角色过滤）
    collectAiReportsFlat(kind) {
        const out = [];
        const teacherClass = this.isTeacherScope() ? this.getTeacherClassName() : null;
        const schoolClassSet = (!teacherClass && this.selectedSchool)
            ? new Set((MockData.classes || []).filter(c => c.kindergartenId === this.selectedSchool.id).map(c => c.name))
            : null;
        const inScopeClass = (className) => {
            if (teacherClass) return className === teacherClass;
            if (schoolClassSet) return className == null || schoolClassSet.has(className);
            return true;
        };
        if (kind === 'book') {
            const reports = this._aiBookReports || {};
            Object.keys(reports).forEach(book => (reports[book] || []).forEach(r => {
                const st = this._aiHistStats(r);
                // 教师视角：仅当该报告涉及的班级包含本班
                if (teacherClass && st.classes && st.classes.length && !st.classes.includes(teacherClass)) return;
                out.push({ kind, key: book, report: r });
            }));
        } else if (kind === 'student') {
            const reports = this._aiStudentReports || {};
            Object.keys(reports).forEach(student => (reports[student] || []).forEach(r => {
                if (!inScopeClass(r.className)) return;
                out.push({ kind, key: student, report: r });
            }));
        } else {
            const reports = this._aiClassReports || {};
            Object.keys(reports).forEach(className => (reports[className] || []).forEach(r => {
                if (!inScopeClass(className)) return;
                out.push({ kind, key: className, report: r });
            }));
        }
        out.sort((a, b) => {
            const ta = new Date(a.report.generatedAt || 0).getTime();
            const tb = new Date(b.report.generatedAt || 0).getTime();
            return tb - ta;
        });
        return out;
    },

    _aiReportsHistoryPages: { book: 1, student: 1, class: 1 },
    setAiReportsHistoryPage(kind, page) {
        if (!this._aiReportsHistoryPages) this._aiReportsHistoryPages = { book: 1, student: 1, class: 1 };
        this._aiReportsHistoryPages[kind] = page;
        this.refreshAiReportsHistoryModal(kind);
    },
    renderAiReportsHistoryBody(kind) {
        let allRows = this.collectAiReportsFlat(kind);

        // 搜索过滤：按对象名（班级/幼儿/绘本名）匹配
        const kw = ((this._aiReportsHistoryKeyword || {})[kind] || '').trim().toLowerCase();
        if (kw) {
            allRows = allRows.filter(item => {
                const name = String(item.key || '').toLowerCase();
                if (name.includes(kw)) return true;
                if (window.PinyinUtil && PinyinUtil.match) { try { return PinyinUtil.match(item.key, kw); } catch (e) {} }
                return false;
            });
        }

        // 分页：每页最多 10 条
        const pageSize = 10;
        if (!this._aiReportsHistoryPages) this._aiReportsHistoryPages = { book: 1, student: 1, class: 1 };
        const totalPages = Math.max(1, Math.ceil(allRows.length / pageSize));
        let curPage = this._aiReportsHistoryPages[kind] || 1;
        if (curPage > totalPages) { curPage = totalPages; this._aiReportsHistoryPages[kind] = curPage; }
        const pageStartIdx = (curPage - 1) * pageSize;
        const rows = allRows.slice(pageStartIdx, pageStartIdx + pageSize);

        // 表头定义（num: 居中数值列）
        let headers;
        if (kind === 'class') {
            headers = [
                { t: '序号' }, { t: '班级' }, { t: '时间范围' },
                { t: '对话次数', num: 1 }, { t: '累计轮次', num: 1 }, { t: '互动绘本', num: 1 },
                { t: '对话类型分布' }, { t: '生成报告时间' }, { t: '生成者' }, { t: '操作', num: 1 }
            ];
        } else if (kind === 'student') {
            headers = [
                { t: '序号' }, { t: '幼儿' }, { t: '班级' }, { t: '时间范围' },
                { t: '对话次数', num: 1 }, { t: '累计轮次', num: 1 }, { t: '互动绘本', num: 1 },
                { t: '对话类型分布' }, { t: '生成报告时间' }, { t: '生成者' }, { t: '操作', num: 1 }
            ];
        } else {
            headers = [
                { t: '序号' }, { t: '绘本' }, { t: '时间范围' },
                { t: '对话次数', num: 1 }, { t: '累计轮次', num: 1 }, { t: '涉及幼儿', num: 1 }, { t: '涉及班级', num: 1 },
                { t: '对话类型分布' }, { t: '生成报告时间' }, { t: '生成者' }, { t: '操作', num: 1 }
            ];
        }

        const body = rows.length ? rows.map((item, i) => {
            const r = item.report;
            const nameCell = kind === 'class'
                ? `<span class="aih-mark">🏫</span>${item.key}`
                : kind === 'student' ? item.key : `<span class="aih-mark">《</span>${item.key}<span class="aih-mark">》</span>`;
            if (r.generating) {
                const spanCols = headers.length - 2;
                return `<tr class="is-generating">
                    <td class="aih-idx">${pageStartIdx + i + 1}</td>
                    <td class="aih-name">${nameCell}</td>
                    <td colspan="${spanCols}">
                        <span class="aih-generating">
                            <svg class="w-3 h-3 animate-spin" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V2.5"/></svg>
                            正在生成 AI 分析报告，请稍候…
                        </span>
                    </td>
                    <td class="aih-ops"><span class="aih-pill">生成中</span></td>
                </tr>`;
            }
            const st = this._aiHistStats(r);
            const ts = String(r.id || r.generatedAt || '').replace(/'/g, "\\'");
            const key = (item.key || '').replace(/'/g, "\\'");
            const rangeLabel = this._aiHistRangeLabel(r);
            const typeDist = this.renderAiTypeDistribution(st);
            const author = r.author || this.getCurrentUserName();
            const authorCell = `<td class="aih-muted">${author}</td>`;
            let viewFn, cells;
            if (kind === 'class') {
                viewFn = `App.loadHistoricalClassReport('${key}', '${ts}')`;
                cells = [
                    `<td class="aih-idx">${pageStartIdx + i + 1}</td>`,
                    `<td class="aih-name">${nameCell}</td>`,
                    `<td>${rangeLabel}</td>`,
                    `<td class="aih-num">${st.chatCount}</td>`,
                    `<td class="aih-num">${st.turns}</td>`,
                    `<td class="aih-num">${st.bookCount}</td>`,
                    `<td>${typeDist}</td>`,
                    `<td class="aih-time">${this._aiHistFmtTime(r.generatedAt)}</td>`,
                    authorCell
                ];
            } else if (kind === 'student') {
                viewFn = `App.loadHistoricalStudentReport('${key}', '${ts}')`;
                cells = [
                    `<td class="aih-idx">${pageStartIdx + i + 1}</td>`,
                    `<td class="aih-name">${nameCell}</td>`,
                    `<td>${r.className || '-'}</td>`,
                    `<td>${rangeLabel}</td>`,
                    `<td class="aih-num">${st.chatCount}</td>`,
                    `<td class="aih-num">${st.turns}</td>`,
                    `<td class="aih-num">${st.bookCount}</td>`,
                    `<td>${typeDist}</td>`,
                    `<td class="aih-time">${this._aiHistFmtTime(r.generatedAt)}</td>`,
                    authorCell
                ];
            } else {
                viewFn = `App.loadHistoricalReport('${key}', '${ts}')`;
                cells = [
                    `<td class="aih-idx">${pageStartIdx + i + 1}</td>`,
                    `<td class="aih-name">${nameCell}</td>`,
                    `<td>${rangeLabel}</td>`,
                    `<td class="aih-num">${st.chatCount}</td>`,
                    `<td class="aih-num">${st.turns}</td>`,
                    `<td class="aih-num">${st.studentCount}</td>`,
                    `<td class="aih-num">${st.classCount}</td>`,
                    `<td>${typeDist}</td>`,
                    `<td class="aih-time">${this._aiHistFmtTime(r.generatedAt)}</td>`,
                    authorCell
                ];
            }
            const delFn = kind === 'class'
                ? `App.deleteAiClassReport('${key}', '${ts}')`
                : kind === 'student'
                    ? `App.deleteAiStudentReport('${key}', '${ts}')`
                    : `App.deleteAiReport('${key}', '${ts}')`;
            const opCell = `<td class="aih-ops">
                <button onclick="${viewFn}" class="aih-btn aih-btn--view">查看</button>
                <button onclick="${delFn};App.refreshAiReportsHistoryModal('${kind}')" class="aih-btn aih-btn--del">删除</button>
            </td>`;
            return `<tr>${cells.join('')}${opCell}</tr>`;
        }).join('') : `<tr><td colspan="${headers.length}"><div class="aih-empty">
                <div class="aih-empty-ico">📄</div>
                <div class="aih-empty-title">${kw ? '没有匹配的报告' : '暂无历史分析报告'}</div>
                <div class="aih-empty-sub">${kw ? '换个关键词试试，或清空搜索查看全部。' : '生成第一份 AI 分析报告后，会在这里归档。'}</div>
            </div></td></tr>`;

        const pager = totalPages > 1 ? `
            <div class="aih-pager">
                <span class="aih-pager-info">共 <b>${allRows.length}</b> 条 · 第 <b>${curPage}</b>/<b>${totalPages}</b> 页</span>
                <div class="aih-pager-btns">
                    <button class="aih-page-btn" ${curPage <= 1 ? 'disabled' : ''} onclick="App.setAiReportsHistoryPage('${kind}', ${curPage - 1})">上一页</button>
                    <button class="aih-page-btn" ${curPage >= totalPages ? 'disabled' : ''} onclick="App.setAiReportsHistoryPage('${kind}', ${curPage + 1})">下一页</button>
                </div>
            </div>` : '';

        return `
            <div id="ai-reports-history-table" class="aih-shell">
                <table class="aih-table">
                    <thead>
                        <tr>${headers.map(h => `<th class="${h.num ? 'is-num' : ''}">${h.t}</th>`).join('')}</tr>
                    </thead>
                    <tbody>${body}</tbody>
                </table>
            </div>
            ${pager}
        `;
    },
    renderAiReportsHistoryModal(kind) {
        const titleMap = { book: '绘本 AI 分析历史报告', student: '幼儿 AI 分析历史报告', class: '班级 AI 分析历史报告' };
        const total = this.collectAiReportsFlat(kind).length;
        return `
            <div class="w-full max-h-[84vh] flex flex-col p-6">
                <div class="aih-head">
                    <div>
                        <h3 class="aih-title">${titleMap[kind]}</h3>
                        <div class="aih-subtitle">共归档 <b>${total}</b> 份报告</div>
                    </div>
                    <button onclick="App.closeModal()" class="aih-close" aria-label="关闭">✕</button>
                </div>
                <div id="ai-reports-history-body-wrap" class="flex-1 min-h-0 overflow-hidden flex flex-col">${this.renderAiReportsHistoryBody(kind)}</div>
            </div>
        `;
    },
    refreshAiReportsHistoryModal(kind) {
        const wrap = document.getElementById('ai-reports-history-body-wrap');
        if (wrap) { wrap.innerHTML = this.renderAiReportsHistoryBody(kind); return; }
        const host = document.getElementById('ai-reports-history-table');
        if (!host) return;
        const modalBody = host.closest('.w-\\[min\\(96vw\\,1100px\\)\\]') || host.parentElement;
        if (modalBody) modalBody.outerHTML = this.renderAiReportsHistoryModal(kind);
    },

    toggleAiBookHistoryPopover(book) {
        const id = `ai-hist-pop-${this.hashStr(book)}`;
        const existing = document.getElementById(id);
        if (existing) { existing.remove(); return; }
        // 关掉其它已展开的 popover
        document.querySelectorAll('[data-ai-hist-pop]').forEach(n => n.remove());
        const trigger = document.querySelector(`[data-ai-hist-trigger="${this.hashStr(book)}"]`);
        if (!trigger) return;
        const pop = document.createElement('div');
        pop.id = id;
        pop.dataset.aiHistPop = '1';
        pop.className = 'aih-pop fixed z-[60] w-80 max-h-96 overflow-y-auto';
        pop.innerHTML = this.renderAiBookHistoryPopover(book);
        document.body.appendChild(pop);
        const rect = trigger.getBoundingClientRect();
        let top = rect.bottom + 6;
        let left = rect.right - 320;
        if (left < 8) left = 8;
        if (top + 384 > window.innerHeight) top = Math.max(8, rect.top - 384 - 6);
        pop.style.top = `${top}px`;
        pop.style.left = `${left}px`;
        // 点击外部关闭
        setTimeout(() => {
            const onDocClick = (e) => {
                if (!pop.contains(e.target) && !trigger.contains(e.target)) {
                    pop.remove();
                    document.removeEventListener('click', onDocClick);
                }
            };
            document.addEventListener('click', onDocClick);
        }, 0);
    },

    refreshAiBookHistoryPopover(book) {
        const id = `ai-hist-pop-${this.hashStr(book)}`;
        const pop = document.getElementById(id);
        if (pop) pop.innerHTML = this.renderAiBookHistoryPopover(book);
    },

    renderAiBookHistoryPopover(book) {
        const list = (this._aiBookReports || {})[book] || [];
        const escBook = book.replace(/'/g, "\\'");
        if (!list.length) {
            return `<div class="aih-pop-empty">暂无历史报告</div>`;
        }
        const items = list.map((r, i) => {
            const rangeLabel = r.rangeLabel || r.rangeKey || '-';
            const dateStr = (r.generatedAt || '-').split(' ')[0] || '-';
            const bookLabel = r.book || escBook;
            const scopeLabel = r.roleLabel || '-';
            const sample = r.sampleCount || 0;
            return `
                <div class="aih-pop-item">
                    <div class="aih-pop-item-main">
                        <div class="aih-pop-item-title">${dateStr} · ${bookLabel}</div>
                        <div class="aih-pop-item-sub">分析维度：${scopeLabel} · ${rangeLabel} · 样本：${sample}</div>
                    </div>
                    <button onclick="App.loadHistoricalReport('${escBook}', '${String(r.id || r.generatedAt || '').replace(/'/g, "\\'")}')" class="aih-btn aih-btn--view">查看</button>
                    <button onclick="App.deleteAiReport('${escBook}', '${String(r.id || r.generatedAt || '').replace(/'/g, "\\'")}')" class="aih-btn aih-btn--del">删除</button>
                </div>
            `;
        }).join('');
        return `
            <div class="aih-pop-head">
                <div class="aih-pop-head-title">历史报告 · ${list.length} 份</div>
                <button onclick="App.toggleAiBookHistoryPopover('${escBook}')" class="aih-close" aria-label="关闭">✕</button>
            </div>
            ${items}
        `;
    },

    hashStr(s) {
        let h = 0;
        for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
        return Math.abs(h).toString(36);
    },

    // 从模型输出中提取 ```json ... ``` 块，解析为 {clusters:[{representative,count,samples}]}
    parseClusterJson(text) {
        if (!text) return null;
        const fence = text.match(/```\s*json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/);
        let raw = fence ? fence[1] : null;
        if (!raw) {
            // 尝试找首个 { 开始的 JSON
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start >= 0 && end > start) raw = text.slice(start, end + 1);
        }
        if (!raw) return null;
        try {
            const obj = JSON.parse(raw.trim());
            if (obj && Array.isArray(obj.clusters)) return obj;
        } catch (e) { /* ignore */ }
        return null;
    },

    // 去除模型回复中的 JSON 代码块，仅保留分析正文（用于展示）
    stripClusterJson(text) {
        if (!text) return '';
        return text.replace(/```\s*json[\s\S]*?```/gi, '').replace(/^```[\s\S]*?```$/m, '').trim();
    },

    startAiBookAnalysis(book) {
        this._aiBookAnalysisCtx = { book, rangeKey: '7d' };
        this.openModal(this.renderAiBookAnalysisRangeModal(), { size: 'wide' });
    },

    selectAiBookAnalysisRange(rangeKey) {
        if (!this._aiBookAnalysisCtx) return;
        this._aiBookAnalysisCtx.rangeKey = rangeKey;
        const host = document.getElementById('modal-content');
        if (host) host.innerHTML = this.renderAiBookAnalysisRangeModal();
    },

    renderAiBookAnalysisRangeModal() {
        const ctx = this._aiBookAnalysisCtx || {};
        const book = ctx.book || '';
        const rangeKey = ctx.rangeKey || '7d';
        const roleLabel = this.isTeacherScope() ? `本班「${this.getTeacherClassName()}」` : '本园';
        const dialogues = this.collectAiBookDialogues(book, rangeKey);
        const sampleCount = dialogues.length;
        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-white">✨ 生成 AI 热点问题分析</h3>
                    <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                        <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="bg-slate-800/60 border border-slate-600/30 rounded-xl p-4 mb-5">
                    <div class="text-xs text-slate-400 mb-1">绘本</div>
                    <div class="text-cyan-300 font-medium">《${book}》</div>
                    <div class="text-xs text-slate-500 mt-2">将提取 <span class="text-amber-300">${roleLabel}</span> 在所选时间范围内关于本书的全部对话发送给大模型进行分析。</div>
                </div>
                ${this.renderAiAnalysisRangeChips(rangeKey, 'App.selectAiBookAnalysisRange')}
                <div class="text-xs text-slate-500 mb-2">当前可用对话样本（与绘本明细展示范围一致）：</div>
                ${this.renderAiSampleStatsRow(dialogues, ['chat', 'turns', 'students', 'classes', 'type'], 'text-cyan-300')}
                <div class="flex items-center justify-end gap-3">
                    <button onclick="App.closeModalDirect()" class="px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/70 text-slate-200 text-sm transition-colors">取消</button>
                    <button onclick="App.confirmAiBookAnalysis()" ${sampleCount === 0 ? 'disabled' : ''} class="px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sampleCount === 0 ? 'cursor-not-allowed' : 'hover:opacity-90'}" style="${sampleCount === 0 ? 'background:#334155;color:#94a3b8;' : 'background:linear-gradient(to right,#f59e0b,#f97316);color:#ffffff;'}">开始分析</button>
                </div>
            </div>
        `;
    },

    // 按时间范围与角色筛选某本绘本的对话
    collectAiBookDialogues(book, rangeKey) {
        const all = MockData.aiOverview?.history || [];
        const teacherClassName = this.isTeacherScope() ? this.getTeacherClassName() : null;
        const bounds = this.getAiAnalysisRangeBounds(rangeKey);
        const startMs = bounds.startDate ? new Date(`${bounds.startDate}T00:00:00`).getTime() : null;
        const endMs = bounds.endDate ? new Date(`${bounds.endDate}T23:59:59`).getTime() : null;
        return all.filter(h => {
            if (h.book !== book) return false;
            if (teacherClassName && h.className !== teacherClassName) return false;
            if (startMs !== null || endMs !== null) {
                const t = this.parseActivityDate(h.time).getTime();
                if (Number.isNaN(t)) return false;
                if (startMs !== null && t < startMs) return false;
                if (endMs !== null && t > endMs) return false;
            }
            return true;
        });
    },

    confirmAiBookAnalysis() {
        const ctx = this._aiBookAnalysisCtx;
        if (!ctx) return;
        this.runAiBookAnalysis(ctx.book, ctx.rangeKey);
    },

    // 重新生成
    regenerateAiBookAnalysis() {
        const cached = (this._aiBookAnalysis || {})[this._aiBookAnalysisCtx?.book];
        const rangeKey = cached?.rangeKey || this._aiBookAnalysisCtx?.rangeKey || '7d';
        const book = this._aiBookAnalysisCtx?.book;
        if (!book) return;
        // 清空缓存以便重新展示流式过程
        if (this._aiBookAnalysis && this._aiBookAnalysis[book]) {
            delete this._aiBookAnalysis[book];
        }
        this.runAiBookAnalysis(book, rangeKey);
    },

    // +新增：返回时间范围选择弹窗，让用户重选时间后再生成新报告
    addAiBookAnalysis() {
        const book = this._aiBookAnalysisCtx?.book;
        if (!book) return;
        this._aiBookAnalysisCtx = { book, rangeKey: '7d' };
        this.openModal(this.renderAiBookAnalysisRangeModal(), { size: 'wide' });
    },

    async runAiBookAnalysis(book, rangeKey) {
        const dialogues = this.collectAiBookDialogues(book, rangeKey);
        // 本地字面量统计 TOP10 作为 fallback（模型聚类失败时使用）
        const qMap = new Map();
        dialogues.forEach(d => (d.session || []).forEach(t => {
            if (t.q) qMap.set(t.q, (qMap.get(t.q) || 0) + 1);
        }));
        const fallbackTop = [...qMap.entries()]
            .map(([q, count]) => ({ q, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const rangeLabel = this.formatAiRangeLabel(rangeKey);
        const roleLabel = this.isTeacherScope() ? `班级「${this.getTeacherClassName()}」` : '园内';

        if (!this._aiBookAnalysis) this._aiBookAnalysis = {};
        this._aiBookAnalysis[book] = {
            book, rangeKey, rangeLabel, roleLabel,
            generatedAt: '',
            author: this.getCurrentUserName(),
            sampleCount: dialogues.length,
            stats: this.computeAiDialogueStats(dialogues),
            topQuestions: fallbackTop,
            clusterMode: 'fallback',
            analysis: '',
            done: false,
            generating: true
        };
        this._aiBookAnalysisCtx = { book, rangeKey };
        const placeholderId = this.insertGeneratingReport('book', book, rangeKey);
        if (this._aiBookAnalysis[book]) this._aiBookAnalysis[book].id = placeholderId;
        this.openModal(this.renderAiBookAnalysisModal(), { size: 'xwide' });

        const allQuestionsText = dialogues
            .flatMap(d => (d.session || []).map(t => t.q).filter(Boolean))
            .slice(0, 200)
            .map((q, i) => `${i + 1}. ${q}`)
            .join('\n');

        const systemPrompt = '你是一个幼儿园教育与儿童心理分析专家，擅长基于幼儿与绘本AI助手的真实对话，洞察孩子的兴趣与认知发展需求。你需要先对提问进行语义聚类（同义不同表的归为一类），再给出教学建议。回复用简体中文。';
        const userPrompt = `以下是${roleLabel}在${rangeLabel}内围绕绘本《${book}》产生的孩子提问数据。共 ${dialogues.length} 次对话。

【全部提问（最多 200 条采样）】
${allQuestionsText || '（无）'}

请严格按以下两段式输出：

第一段：在一个 \`\`\`json ... \`\`\` 代码块中输出 TOP10 语义聚类结果（最多 10 个，按 count 倒序）。结构如下，不要添加多余字段：
\`\`\`json
{
  "clusters": [
    {"representative": "用一句话概括的代表性问题", "count": 12, "samples": ["原始提问1", "原始提问2"]}
  ]
}
\`\`\`
要求：把表述不同但意图相同的问题（如"小兔子为什么爱妈妈"和"兔子为啥喜欢妈妈"）合并到同一类；representative 用通顺自然的一句中文；count 是该类合并后的总数；samples 给 2-4 条原始问句即可。

第二段：紧接 JSON 块后输出 Markdown 分析正文（不要再放进代码块）：
1) 简洁概述孩子最关注的核心主题与情感诉求（3 段内）；
2) 指出孩子表现出的认知发展信号、潜在兴趣点；
3) 给出 3-5 条可立即落地的教学/亲子互动建议；
4) 全文 600-900 字，使用 ## 和 - 分小标题与列表，避免空话套话。`;

        try {
            await this.streamLlmAnalysis({
                book,
                systemPrompt,
                userPrompt,
                onDelta: (delta) => {
                    const entry = this._aiBookAnalysis[book];
                    if (!entry) return;
                    entry.analysis += delta;
                    this.refreshAiBookAnalysisModal('streaming');
                },
                onDone: async (full) => {
                    const entry = this._aiBookAnalysis[book];
                    if (!entry) return;
                    const rawText = full || entry.analysis;
                    // 1) 解析模型聚类
                    const cluster = this.parseClusterJson(rawText);
                    if (cluster && Array.isArray(cluster.clusters) && cluster.clusters.length) {
                        entry.topQuestions = cluster.clusters.slice(0, 10).map(c => ({
                            q: c.representative || (Array.isArray(c.samples) ? c.samples[0] : '') || '',
                            count: Number(c.count) || (Array.isArray(c.samples) ? c.samples.length : 0),
                            samples: Array.isArray(c.samples) ? c.samples.slice(0, 6) : []
                        })).filter(t => t.q);
                        entry.clusterMode = 'model';
                    } else {
                        entry.clusterMode = 'fallback';
                    }
                    // 2) 剥掉 JSON 块作为正文
                    const bodyOnly = this.stripClusterJson(rawText);
                    entry.analysis = bodyOnly || rawText;
                    // 3) 润色（不阻塞）
                    try {
                        const polished = await this.polishAiAnalysis(book, entry.analysis, entry.topQuestions);
                        if (polished) entry.analysis = polished;
                    } catch (e) { /* ignore */ }
                    entry.done = true;
                    entry.generating = false;
                    entry.generatedAt = this.formatNowDateTime();
                    this.refreshAiBookAnalysisModal('done');
                    // 4) 保存历史（替换"生成中"占位）
                    this.finalizeGeneratingReport('book', book, placeholderId, entry);
                    // 5) 刷新底层表格（让"📚 N"数字增加）
                    this.refreshAiMetricPanel();
                },
                onError: (err) => {
                    const entry = this._aiBookAnalysis[book];
                    if (!entry) return;
                    entry.error = String(err?.message || err || '生成失败');
                    entry.generating = false;
                    this.removeGeneratingReport('book', book, placeholderId);
                    this.refreshAiBookAnalysisModal('error');
                }
            });
        } catch (e) {
            const entry = this._aiBookAnalysis[book];
            if (entry) {
                entry.error = String(e?.message || e || '生成失败');
                entry.generating = false;
                this.removeGeneratingReport('book', book, placeholderId);
                this.refreshAiBookAnalysisModal('error');
            }
        }
    },

    formatNowDateTime() {
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${pad(d.getMinutes())}`;
    },
    // 为每份 AI 报告生成唯一 id（显示时间精度只到分钟，不能当唯一键，否则同分钟重新生成会互相覆盖）
    genAiReportId() {
        return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    },
    // 深拷贝一份报告快照，切断与历史列表的引用，避免后续修改污染历史记录
    cloneAiReport(report) {
        if (!report) return report;
        try { return JSON.parse(JSON.stringify(report)); } catch (e) { return { ...report }; }
    },

    async streamLlmAnalysis({ book, systemPrompt, userPrompt, onDelta, onDone, onError }) {
        const cfg = this._llmConfig;
        let res;
        try {
            res = await fetch(cfg.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cfg.apiKey}` },
                body: JSON.stringify({
                    model: cfg.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 1400,
                    stream: true
                })
            });
        } catch (err) {
            if (onError) onError(err);
            return;
        }
        if (!res || !res.ok) {
            if (onError) onError(new Error(`HTTP ${res?.status || '?'}`));
            return;
        }
        const reader = res.body?.getReader();
        if (!reader) {
            const text = await res.text().catch(() => '');
            if (onDone) onDone(text);
            return;
        }
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let fullText = '';
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const raw of lines) {
                const line = raw.trim();
                if (!line || !line.startsWith('data:')) continue;
                const payload = line.slice(5).trim();
                if (payload === '[DONE]') continue;
                try {
                    const json = JSON.parse(payload);
                    const delta = json.choices?.[0]?.delta?.content || '';
                    if (delta) {
                        fullText += delta;
                        if (onDelta) onDelta(delta);
                    }
                } catch (e) { /* 忽略解析失败行 */ }
            }
        }
        if (onDone) onDone(fullText);
    },

    async polishAiAnalysis(book, rawText, topQuestions) {
        if (!rawText) return '';
        const cfg = this._llmConfig;
        const sys = '你是一个专业的儿童教育内容编辑，请把下文整理为结构清晰、措辞简洁、易于幼儿园教师快速阅读的分析报告。保留原意，但请：合并重复、统一小标题、突出关键结论与建议，避免空泛的客套。回复用简体中文，使用 Markdown（标题用 ## ，列表用 - ）。';
        const usr = `以下是关于绘本《${book}》孩子提问分析的草稿，请整理润色。\n\n${rawText}`;
        try {
            const res = await fetch(cfg.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cfg.apiKey}` },
                body: JSON.stringify({
                    model: cfg.model,
                    messages: [
                        { role: 'system', content: sys },
                        { role: 'user', content: usr }
                    ],
                    temperature: 0.4,
                    max_tokens: 1400
                })
            });
            if (!res.ok) return '';
            const data = await res.json();
            return (data?.choices?.[0]?.message?.content || '').trim();
        } catch (e) { return ''; }
    },

    refreshAiBookAnalysisModal(phase) {
        const host = document.getElementById('modal-content');
        if (host) host.innerHTML = this.renderAiBookAnalysisModal(phase);
        // 自动滚到最新输出
        const stream = document.getElementById('ai-analysis-stream');
        if (stream) stream.scrollTop = stream.scrollHeight;
    },

    // markdown 极简渲染（**bold** / ## 标题 / - 列表 / 换行）
    simpleMarkdown(text) {
        if (!text) return '';
        const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const lines = text.split(/\r?\n/);
        let html = '';
        let inUl = false;
        const flushUl = () => { if (inUl) { html += '</ul>'; inUl = false; } };
        lines.forEach(raw => {
            let line = raw;
            const headingMatch = line.match(/^\s*(#{1,6})\s+(.*)$/);
            if (headingMatch) {
                flushUl();
                const level = headingMatch[1].length;
                const txt = escape(headingMatch[2]).replace(/\*\*(.+?)\*\*/g, '<strong class="text-amber-200">$1</strong>');
                const cls = {
                    1: 'text-lg font-bold text-amber-300 mt-4 mb-2',
                    2: 'text-base font-bold text-amber-300 mt-4 mb-2',
                    3: 'text-sm font-semibold text-cyan-300 mt-3 mb-1',
                    4: 'text-sm font-semibold text-cyan-200 mt-3 mb-1',
                    5: 'text-xs font-semibold text-cyan-200 mt-2 mb-1',
                    6: 'text-xs font-semibold text-slate-300 mt-2 mb-1'
                }[level];
                const tag = level <= 2 ? `h${level + 1}` : `h${Math.min(level + 1, 6)}`;
                html += `<${tag} class="${cls}">${txt}</${tag}>`;
            } else if (/^\s*[-*]\s+/.test(line)) {
                if (!inUl) { html += '<ul class="list-disc pl-5 space-y-1 my-2 text-slate-200">'; inUl = true; }
                const content = escape(line.replace(/^\s*[-*]\s+/, ''))
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-amber-200">$1</strong>');
                html += `<li>${content}</li>`;
            } else if (line.trim() === '') {
                flushUl();
                html += '<div class="h-2"></div>';
            } else {
                flushUl();
                const content = escape(line).replace(/\*\*(.+?)\*\*/g, '<strong class="text-amber-200">$1</strong>');
                html += `<p class="text-sm text-slate-200 leading-relaxed">${content}</p>`;
            }
        });
        flushUl();
        return html;
    },

    renderAiBookAnalysisModal(phase) {
        const ctx = this._aiBookAnalysisCtx || {};
        const book = ctx.book || '';
        const entry = (this._aiBookAnalysis || {})[book] || {};
        const top = entry.topQuestions || [];
        const isGenerating = !!entry.generating;
        const hasError = !!entry.error;
        const isDone = !!entry.done;
        const statusBadge = isGenerating
            ? '<span class="px-2 py-0.5 rounded text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>生成中</span>'
            : isDone
                ? `<span class="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">已生成 · ${entry.generatedAt || ''}</span>`
                : hasError
                    ? '<span class="px-2 py-0.5 rounded text-[11px] bg-red-500/20 text-red-300 border border-red-400/30">生成失败</span>'
                    : '';
        const regenBtn = isDone || hasError
            ? `<button onclick="App.regenerateAiBookAnalysis()" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-xs border border-violet-400/30 transition-colors mr-2" title="按当前报告所选时间范围重新生成">
                    <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    重新生成
                </button>
                <button onclick="App.addAiBookAnalysis()" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs border border-amber-400/30 transition-colors mr-2" title="选择新的时间范围生成新报告">
                    <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    新增
                </button>`
            : '';
        const exportBtn = isDone
            ? `<button onclick="App.exportAiReport('book', App._aiBookAnalysisCtx?.book)" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs border border-emerald-400/30 transition-colors mr-2" title="导出报告"><svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>导出</button>`
            : '';
        const errorHtml = hasError
            ? `<div class="bg-red-500/10 border border-red-400/30 rounded-lg p-3 text-sm text-red-300 mb-3">生成失败：${entry.error}。请检查网络或稍后重试。</div>`
            : '';
        const analysisHtml = entry.analysis
            ? this.simpleMarkdown(this.stripClusterJson(entry.analysis))
            : '<div class="text-slate-500 text-sm">正在思考分析中…</div>';
        const clusterTag = entry.clusterMode === 'model'
            ? '<span class="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-400/30">AI 聚类</span>'
            : (entry.clusterMode === 'fallback' && isDone ? '<span class="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-700/40 text-slate-400 border border-slate-600/40">字面统计</span>' : '');
        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <h3 class="text-lg font-bold text-white">📊 《${book}》AI 热点问题分析</h3>
                        ${statusBadge}
                    </div>
                    <div class="flex items-center">
                        ${exportBtn}
                        ${regenBtn}
                        <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                ${this.renderAiReportHeaderStats(entry, ['chat', 'turns', 'students', 'classes', 'type'], 'text-cyan-300')}

                <div class="mb-4">
                    <h4 class="text-sm font-semibold text-amber-300 mb-2 flex items-center">🔥 热门问题 TOP${Math.min(10, top.length)}${clusterTag}</h4>
                    ${top.length ? `
                    <div class="space-y-1.5">
                        ${top.map((t, i) => {
                            const sampleAttr = (t.samples && t.samples.length)
                                ? `title="原始提问示例：\n- ${t.samples.join('\n- ').replace(/"/g, '&quot;')}"`
                                : '';
                            return `
                            <div class="flex items-center gap-2 text-sm" ${sampleAttr}>
                                <span class="shrink-0 w-6 h-6 rounded-full ${i < 3 ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-700/60 text-slate-300'} text-xs flex items-center justify-center">${i + 1}</span>
                                <span class="flex-1 text-slate-200">${t.q}</span>
                                <span class="text-xs text-slate-400">${t.count} 次</span>
                            </div>`;
                        }).join('')}
                    </div>` : '<div class="text-slate-500 text-sm">暂无问题数据</div>'}
                </div>

                <div>
                    <h4 class="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                        🧠 AI 分析
                        ${isGenerating ? '<span class="inline-block w-2 h-3 bg-cyan-300 animate-pulse rounded-sm"></span>' : ''}
                    </h4>
                    ${errorHtml}
                    <div id="ai-analysis-stream" class="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 pr-5 max-h-[50vh] overflow-y-auto whitespace-normal break-words">
                        ${analysisHtml}
                    </div>
                </div>
            </div>
        `;
    },

    // ============================================================
    //  AI 分析报告 - 导出（Markdown / HTML 打印）
    // ============================================================
    exportAiReport(type, key) {
        const entry = this._getAiReportEntry(type, key);
        if (!entry || !entry.done) {
            this.showToast?.('请先生成分析报告', 'warn');
            return;
        }
        const md = this._buildAiReportMarkdown(type, entry);
        this._showExportMenu(type, key, md);
    },

    _getAiReportEntry(type, key) {
        if (type === 'book') return (this._aiBookAnalysis || {})[key];
        if (type === 'student') return (this._aiStudentAnalysis || {})[key];
        if (type === 'class') return (this._aiClassAnalysis || {})[key];
        return null;
    },

    _buildAiReportMarkdown(type, entry) {
        const titleMap = {
            book: `《${entry.book}》AI 热点问题分析`,
            student: `${entry.student} 的 AI 兴趣画像分析`,
            class: `${entry.className} · 班级 AI 画像分析`
        };
        const title = titleMap[type] || 'AI 分析报告';
        const meta = [
            `- **生成时间**：${entry.generatedAt || '-'}`,
            `- **分析范围**：${entry.roleLabel || '-'} · ${entry.rangeLabel || '-'}`,
            `- **对话样本**：${entry.sampleCount || 0} 次`
        ];
        if (type === 'class') meta.push(`- **涉及幼儿/绘本**：${entry.studentCount || 0} 人 · ${entry.bookCount || 0} 本`);
        const top = entry.topQuestions || [];
        const topSection = top.length
            ? top.map((t, i) => `${i + 1}. ${t.q}（${t.count} 次）`).join('\n')
            : '_暂无_';
        const analysis = (entry.analysis || '').trim() || '_暂无_';
        return `# ${title}

${meta.join('\n')}

## 🔥 ${type === 'book' ? '热门问题' : '核心关注主题'} TOP${Math.min(10, top.length)}

${topSection}

## 🧠 AI 分析

${analysis}
`;
    },

    _showExportMenu(type, key, md) {
        const safeName = (type === 'book' ? '绘本-' + (this._aiBookAnalysisCtx?.book || key)
            : type === 'student' ? '幼儿-' + (this._aiStudentAnalysisCtx?.student || key)
            : '班级-' + (this._aiClassAnalysisCtx?.className || key)) + '-AI分析-' + this._stampForFile();
        const content = `
            <div class="bg-white rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-slate-900">📥 导出 AI 分析报告</h3>
                    <button class="text-slate-400 hover:text-slate-700" onclick="App.closeModalDirect()">
                        <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="space-y-3">
                    <button onclick="App._doExportMarkdown(${JSON.stringify(safeName)})" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left">
                        <span class="text-2xl">📝</span>
                        <div class="flex-1">
                            <div class="text-sm font-semibold text-slate-900">下载 Markdown (.md)</div>
                            <div class="text-xs text-slate-500">原始结构，方便二次编辑、归档</div>
                        </div>
                    </button>
                    <button onclick="App._doExportHtmlPrint()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left">
                        <span class="text-2xl">🖨️</span>
                        <div class="flex-1">
                            <div class="text-sm font-semibold text-slate-900">打开网页版（可另存为 PDF）</div>
                            <div class="text-xs text-slate-500">新窗口打开排版好的报告，⌘P / Ctrl+P 即可保存 PDF</div>
                        </div>
                    </button>
                    <button onclick="App._doCopyMarkdown()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left">
                        <span class="text-2xl">📋</span>
                        <div class="flex-1">
                            <div class="text-sm font-semibold text-slate-900">复制 Markdown 到剪贴板</div>
                            <div class="text-xs text-slate-500">粘贴到飞书 / Notion / 微信文档</div>
                        </div>
                    </button>
                </div>
            </div>
        `;
        this._pendingExport = { type, key, md, fileName: safeName };
        this.openModal(content, { size: 'default' });
    },

    _doExportMarkdown(fileName) {
        const pe = this._pendingExport;
        if (!pe) return;
        const blob = new Blob([pe.md], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${fileName}.md`;
        document.body.appendChild(a); a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
        this.showToast?.('Markdown 已下载', 'success');
    },

    _doCopyMarkdown() {
        const pe = this._pendingExport;
        if (!pe) return;
        navigator.clipboard?.writeText(pe.md).then(
            () => this.showToast?.('已复制到剪贴板', 'success'),
            () => this.showToast?.('复制失败，请手动选择', 'error')
        );
    },

    _doExportHtmlPrint() {
        const pe = this._pendingExport;
        if (!pe) return;
        const bodyHtml = this.simpleMarkdown(pe.md);
        const title = pe.fileName;
        const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>${title}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif; color: #1A1B25; max-width: 820px; margin: 40px auto; padding: 0 24px; line-height: 1.75; background: #fff; }
  h1 { font-size: 26px; font-weight: 700; margin: 0 0 16px; padding-bottom: 12px; border-bottom: 2px solid #6366F1; color: #0F1020; }
  h2 { font-size: 20px; font-weight: 700; margin: 32px 0 14px; color: #6D28D9; }
  h3 { font-size: 16px; font-weight: 600; margin: 22px 0 10px; color: #4338CA; }
  h4 { font-size: 15px; font-weight: 600; margin: 18px 0 8px; color: #4338CA; }
  p { margin: 8px 0; color: #2A2C3D; }
  ul { padding-left: 22px; margin: 8px 0; }
  li { margin: 4px 0; color: #2A2C3D; }
  strong { color: #6D28D9; }
  .meta { background: #F7F8FC; border: 1px solid #ECECF2; border-radius: 8px; padding: 12px 16px; margin: 12px 0 20px; }
  .meta li { list-style: none; margin-left: -22px; }
  @media print {
    body { margin: 0; max-width: 100%; }
    h2 { page-break-after: avoid; }
    li { page-break-inside: avoid; }
  }
  .toolbar { position: fixed; top: 16px; right: 16px; display: flex; gap: 8px; }
  .toolbar button { background: #6366F1; color: #fff; border: 0; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; }
  .toolbar button:hover { background: #4F46E5; }
  @media print { .toolbar { display: none; } }
</style></head><body>
<div class="toolbar"><button onclick="window.print()">打印 / 保存为 PDF</button></div>
${bodyHtml}
</body></html>`;
        const w = window.open('', '_blank');
        if (!w) { this.showToast?.('请允许弹出窗口', 'warn'); return; }
        w.document.open();
        w.document.write(html);
        w.document.close();
    },

    _stampForFile() {
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
    },

    // 已生成 → 打开
    openAiBookAnalysis(book) {
        const entry = (this._aiBookAnalysis || {})[book];
        if (!entry) {
            this.startAiBookAnalysis(book);
            return;
        }
        this._aiBookAnalysisCtx = { book, rangeKey: entry.rangeKey };
        this.openModal(this.renderAiBookAnalysisModal('done'), { size: 'xwide' });
    },

    // ============================================================
    //  活跃幼儿 - AI 兴趣画像分析（与互动绘本 AI 分析对应）
    // ============================================================
    _aiStudentReportsStorageKey: 'aiStudentReports',
    _aiStudentReportsMaxPerStudent: 50,

    loadAiStudentReports() {
        try {
            const raw = localStorage.getItem(this._aiStudentReportsStorageKey);
            const parsed = raw ? JSON.parse(raw) : {};
            this._aiStudentReports = (parsed && typeof parsed === 'object') ? parsed : {};
        } catch (e) {
            this._aiStudentReports = {};
        }
        if (!this._aiStudentAnalysis) this._aiStudentAnalysis = {};
        Object.keys(this._aiStudentReports).forEach(student => {
            const list = this._aiStudentReports[student];
            if (Array.isArray(list) && list.length) {
                this._aiStudentAnalysis[student] = this.cloneAiReport(list[0]);
            }
        });
    },

    persistAiStudentReports() {
        try {
            localStorage.setItem(this._aiStudentReportsStorageKey, JSON.stringify(this._aiStudentReports || {}));
        } catch (e) { /* 配额满则忽略 */ }
    },

    saveAiStudentReport(student, report) {
        if (!student || !report) return;
        if (!this._aiStudentReports) this._aiStudentReports = {};
        const list = this._aiStudentReports[student] || [];
        const snapshot = JSON.parse(JSON.stringify(report));
        if (!snapshot.id) snapshot.id = this.genAiReportId();
        list.unshift(snapshot);
        if (list.length > this._aiStudentReportsMaxPerStudent) list.length = this._aiStudentReportsMaxPerStudent;
        this._aiStudentReports[student] = list;
        this.persistAiStudentReports();
    },

    deleteAiStudentReport(student, reportId) {
        const list = (this._aiStudentReports || {})[student];
        if (!list) return;
        const idx = list.findIndex(r => (r.id || r.generatedAt) === reportId);
        if (idx < 0) return;
        list.splice(idx, 1);
        if (list.length === 0) {
            delete this._aiStudentReports[student];
            if (this._aiStudentAnalysis) delete this._aiStudentAnalysis[student];
        } else {
            this._aiStudentAnalysis[student] = this.cloneAiReport(list[0]);
        }
        this.persistAiStudentReports();
        this.refreshAiStudentHistoryPopover(student);
        this.refreshAiMetricPanel();
    },

    loadHistoricalStudentReport(student, reportId) {
        const list = (this._aiStudentReports || {})[student] || [];
        const found = list.find(r => (r.id || r.generatedAt) === reportId);
        if (!found) return;
        if (!this._aiStudentAnalysis) this._aiStudentAnalysis = {};
        this._aiStudentAnalysis[student] = this.cloneAiReport(found);
        this._aiStudentAnalysisCtx = { student, rangeKey: found.rangeKey };
        this.openModal(this.renderAiStudentAnalysisModal('done'), { size: 'xwide' });
    },

    toggleAiStudentHistoryPopover(student) {
        const id = `ai-stu-hist-pop-${this.hashStr(student)}`;
        const existing = document.getElementById(id);
        if (existing) { existing.remove(); return; }
        document.querySelectorAll('[data-ai-stu-hist-pop]').forEach(n => n.remove());
        const trigger = document.querySelector(`[data-ai-stu-hist-trigger="${this.hashStr(student)}"]`);
        if (!trigger) return;
        const pop = document.createElement('div');
        pop.id = id;
        pop.dataset.aiStuHistPop = '1';
        pop.className = 'aih-pop fixed z-[60] w-80 max-h-96 overflow-y-auto';
        pop.innerHTML = this.renderAiStudentHistoryPopover(student);
        document.body.appendChild(pop);
        const rect = trigger.getBoundingClientRect();
        let top = rect.bottom + 6;
        let left = rect.right - 320;
        if (left < 8) left = 8;
        if (top + 384 > window.innerHeight) top = Math.max(8, rect.top - 384 - 6);
        pop.style.top = `${top}px`;
        pop.style.left = `${left}px`;
        setTimeout(() => {
            const onDocClick = (e) => {
                if (!pop.contains(e.target) && !trigger.contains(e.target)) {
                    pop.remove();
                    document.removeEventListener('click', onDocClick);
                }
            };
            document.addEventListener('click', onDocClick);
        }, 0);
    },

    refreshAiStudentHistoryPopover(student) {
        const id = `ai-stu-hist-pop-${this.hashStr(student)}`;
        const pop = document.getElementById(id);
        if (pop) pop.innerHTML = this.renderAiStudentHistoryPopover(student);
    },

    renderAiStudentHistoryPopover(student) {
        const list = (this._aiStudentReports || {})[student] || [];
        const escStudent = student.replace(/'/g, "\\'");
        if (!list.length) {
            return `<div class="text-sm text-slate-400 px-2 py-3 text-center">暂无历史报告</div>`;
        }
        const items = list.map(r => {
            const rangeLabel = r.rangeLabel || r.rangeKey || '-';
            const dateStr = (r.generatedAt || '-').split(' ')[0] || '-';
            const stuLabel = r.student || escStudent;
            const scopeLabel = r.roleLabel || '-';
            const sample = r.sampleCount || 0;
            return `
                <div class="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-700/40 border border-slate-700/40 mb-1.5">
                    <div class="flex-1 min-w-0">
                        <div class="text-xs text-slate-200 truncate">${dateStr} - ${stuLabel}</div>
                        <div class="text-[11px] text-slate-500 mt-0.5">分析维度：${scopeLabel} · ${rangeLabel} · 样本：${sample}</div>
                    </div>
                    <button onclick="App.loadHistoricalStudentReport('${escStudent}', '${String(r.id || r.generatedAt || '').replace(/'/g, "\\'")}')" class="px-2 py-1 rounded text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">查看</button>
                    <button onclick="App.deleteAiStudentReport('${escStudent}', '${String(r.id || r.generatedAt || '').replace(/'/g, "\\'")}')" class="px-2 py-1 rounded text-[11px] bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-400/30">删除</button>
                </div>
            `;
        }).join('');
        return `
            <div class="flex items-center justify-between mb-2 px-1">
                <div class="text-sm font-semibold text-amber-300">📚 历史报告 · ${list.length} 份</div>
                <button onclick="App.toggleAiStudentHistoryPopover('${escStudent}')" class="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            ${items}
        `;
    },

    startAiStudentAnalysis(student) {
        this._aiStudentAnalysisCtx = { student, rangeKey: '7d' };
        this.openModal(this.renderAiStudentAnalysisRangeModal(), { size: 'wide' });
    },

    selectAiStudentAnalysisRange(rangeKey) {
        if (!this._aiStudentAnalysisCtx) return;
        this._aiStudentAnalysisCtx.rangeKey = rangeKey;
        const host = document.getElementById('modal-content');
        if (host) host.innerHTML = this.renderAiStudentAnalysisRangeModal();
    },

    renderAiStudentAnalysisRangeModal() {
        const ctx = this._aiStudentAnalysisCtx || {};
        const student = ctx.student || '';
        const rangeKey = ctx.rangeKey || '7d';
        const dialogues = this.collectAiStudentDialogues(student, rangeKey);
        const sampleCount = dialogues.length;
        const className = (dialogues[0]?.className) || '-';
        const roleLabel = `小朋友「${student}」（${className}）`;
        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-white">✨ 生成 AI 兴趣画像分析</h3>
                    <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                        <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="bg-slate-800/60 border border-slate-600/30 rounded-xl p-4 mb-5">
                    <div class="text-xs text-slate-400 mb-1">小朋友</div>
                    <div class="text-emerald-300 font-medium">${student} · ${className}</div>
                    <div class="text-xs text-slate-500 mt-2">将提取 <span class="text-amber-300">${roleLabel}</span> 在所选时间范围内的全部 AI 对话发送给大模型，生成兴趣画像与教学建议。</div>
                </div>
                ${this.renderAiAnalysisRangeChips(rangeKey, 'App.selectAiStudentAnalysisRange')}
                <div class="text-xs text-slate-500 mb-2">当前可用对话样本（与幼儿明细展示范围一致）：</div>
                ${this.renderAiSampleStatsRow(dialogues, ['chat', 'turns', 'books', 'type'], 'text-emerald-300')}
                <div class="flex items-center justify-end gap-3">
                    <button onclick="App.closeModalDirect()" class="px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/70 text-slate-200 text-sm transition-colors">取消</button>
                    <button onclick="App.confirmAiStudentAnalysis()" ${sampleCount === 0 ? 'disabled' : ''} class="px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sampleCount === 0 ? 'cursor-not-allowed' : 'hover:opacity-90'}" style="${sampleCount === 0 ? 'background:#334155;color:#94a3b8;' : 'background:linear-gradient(to right,#f59e0b,#f97316);color:#ffffff;'}">开始分析</button>
                </div>
            </div>
        `;
    },

    collectAiStudentDialogues(student, rangeKey) {
        const all = MockData.aiOverview?.history || [];
        const teacherClassName = this.isTeacherScope() ? this.getTeacherClassName() : null;
        const bounds = this.getAiAnalysisRangeBounds(rangeKey);
        const startMs = bounds.startDate ? new Date(`${bounds.startDate}T00:00:00`).getTime() : null;
        const endMs = bounds.endDate ? new Date(`${bounds.endDate}T23:59:59`).getTime() : null;
        return all.filter(h => {
            if ((h.student || '匿名') !== student) return false;
            if (teacherClassName && h.className !== teacherClassName) return false;
            if (startMs !== null || endMs !== null) {
                const t = this.parseActivityDate(h.time).getTime();
                if (Number.isNaN(t)) return false;
                if (startMs !== null && t < startMs) return false;
                if (endMs !== null && t > endMs) return false;
            }
            return true;
        });
    },

    confirmAiStudentAnalysis() {
        const ctx = this._aiStudentAnalysisCtx;
        if (!ctx) return;
        this.runAiStudentAnalysis(ctx.student, ctx.rangeKey);
    },

    regenerateAiStudentAnalysis() {
        const cached = (this._aiStudentAnalysis || {})[this._aiStudentAnalysisCtx?.student];
        const rangeKey = cached?.rangeKey || this._aiStudentAnalysisCtx?.rangeKey || '7d';
        const student = this._aiStudentAnalysisCtx?.student;
        if (!student) return;
        if (this._aiStudentAnalysis && this._aiStudentAnalysis[student]) {
            delete this._aiStudentAnalysis[student];
        }
        this.runAiStudentAnalysis(student, rangeKey);
    },

    // +新增：返回时间范围选择弹窗
    addAiStudentAnalysis() {
        const student = this._aiStudentAnalysisCtx?.student;
        if (!student) return;
        this._aiStudentAnalysisCtx = { student, rangeKey: '7d' };
        this.openModal(this.renderAiStudentAnalysisRangeModal(), { size: 'wide' });
    },

    async runAiStudentAnalysis(student, rangeKey) {
        const dialogues = this.collectAiStudentDialogues(student, rangeKey);
        const className = (dialogues[0]?.className) || '-';

        const bookMap = new Map();
        dialogues.forEach(d => {
            if (!d.book) return;
            bookMap.set(d.book, (bookMap.get(d.book) || 0) + 1);
        });
        const fallbackTop = [...bookMap.entries()]
            .map(([q, count]) => ({ q, count, books: [q] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // 提问文本 → 来源绘本 的映射，便于给"核心关注主题"标注绘本来源
        const qBookMap = new Map();
        dialogues.forEach(d => {
            (d.session || []).forEach(t => {
                if (t.q && d.book && !qBookMap.has(t.q)) qBookMap.set(t.q, d.book);
            });
        });
        this._aiStudentQBookMap = qBookMap;

        const rangeLabel = this.formatAiRangeLabel(rangeKey);
        const roleLabel = `小朋友「${student}」（${className}）`;

        if (!this._aiStudentAnalysis) this._aiStudentAnalysis = {};
        this._aiStudentAnalysis[student] = {
            student, className, rangeKey, rangeLabel, roleLabel,
            generatedAt: '',
            author: this.getCurrentUserName(),
            sampleCount: dialogues.length,
            stats: this.computeAiDialogueStats(dialogues),
            topQuestions: fallbackTop,
            clusterMode: 'fallback',
            analysis: '',
            done: false,
            generating: true
        };
        this._aiStudentAnalysisCtx = { student, rangeKey };
        const placeholderId = this.insertGeneratingReport('student', student, rangeKey);
        if (this._aiStudentAnalysis[student]) this._aiStudentAnalysis[student].id = placeholderId;
        this.openModal(this.renderAiStudentAnalysisModal(), { size: 'xwide' });

        const allQuestionsText = dialogues
            .flatMap(d => (d.session || []).map(t => ({ q: t.q, book: d.book })).filter(x => x.q))
            .slice(0, 200)
            .map((x, i) => `${i + 1}. [《${x.book || '未知'}》] ${x.q}`)
            .join('\n');

        const systemPrompt = '你是一个幼儿园教育与儿童心理分析专家，擅长基于幼儿与绘本AI助手的真实对话，洞察单个孩子的兴趣方向、认知阶段与情感发展。你需要先对该孩子的提问做语义聚类（同义不同表归为一类），再给出兴趣画像与教学建议。回复用简体中文。';
        const userPrompt = `以下是${roleLabel}在${rangeLabel}内与绘本 AI 助手的全部提问数据，共 ${dialogues.length} 次对话。

【全部提问（最多 200 条采样，前缀方括号为对应绘本）】
${allQuestionsText || '（无）'}

请严格按以下两段式输出：

第一段：在一个 \`\`\`json ... \`\`\` 代码块中输出该孩子最关注的 TOP10 主题/话题语义聚类（最多 10 个，按 count 倒序）。结构如下，不要添加多余字段：
\`\`\`json
{
  "clusters": [
    {"representative": "用一句话概括的代表性主题/问题", "count": 12, "samples": ["原始提问1", "原始提问2"]}
  ]
}
\`\`\`
要求：把表述不同但意图相同的问题合并为同一类；representative 用通顺自然的一句中文；count 是该类合并后的总数；samples 给 2-4 条原始问句即可。

第二段：紧接 JSON 块后输出 Markdown 兴趣画像分析正文（不要再放进代码块）：
1) 概述这个孩子的核心兴趣方向、思维特点与情感关注（3 段内）；
2) 指出其展现的认知发展信号、潜在优势与需要支持的方向；
3) 给出 3-5 条针对该孩子可立即落地的个性化教学/亲子互动建议；
4) 全文 600-900 字，使用 ## 和 - 分小标题与列表，避免空话套话。`;

        try {
            await this.streamLlmAnalysis({
                book: student,
                systemPrompt,
                userPrompt,
                onDelta: (delta) => {
                    const entry = this._aiStudentAnalysis[student];
                    if (!entry) return;
                    entry.analysis += delta;
                    this.refreshAiStudentAnalysisModal('streaming');
                },
                onDone: async (full) => {
                    const entry = this._aiStudentAnalysis[student];
                    if (!entry) return;
                    const rawText = full || entry.analysis;
                    const cluster = this.parseClusterJson(rawText);
                    if (cluster && Array.isArray(cluster.clusters) && cluster.clusters.length) {
                        const qbm = this._aiStudentQBookMap || new Map();
                        entry.topQuestions = cluster.clusters.slice(0, 10).map(c => {
                            const samples = Array.isArray(c.samples) ? c.samples.slice(0, 6) : [];
                            const books = [...new Set(samples.map(s => qbm.get(s)).filter(Boolean))];
                            return { q: c.representative || samples[0] || '', count: Number(c.count) || samples.length, samples, books };
                        }).filter(t => t.q);
                        entry.clusterMode = 'model';
                    } else {
                        entry.clusterMode = 'fallback';
                    }
                    const bodyOnly = this.stripClusterJson(rawText);
                    entry.analysis = bodyOnly || rawText;
                    try {
                        const polished = await this.polishAiAnalysis(student, entry.analysis, entry.topQuestions);
                        if (polished) entry.analysis = polished;
                    } catch (e) { /* ignore */ }
                    entry.done = true;
                    entry.generating = false;
                    entry.generatedAt = this.formatNowDateTime();
                    this.refreshAiStudentAnalysisModal('done');
                    this.finalizeGeneratingReport('student', student, placeholderId, entry);
                    this.refreshAiMetricPanel();
                },
                onError: (err) => {
                    const entry = this._aiStudentAnalysis[student];
                    if (!entry) return;
                    entry.error = String(err?.message || err || '生成失败');
                    entry.generating = false;
                    this.removeGeneratingReport('student', student, placeholderId);
                    this.refreshAiStudentAnalysisModal('error');
                }
            });
        } catch (e) {
            const entry = this._aiStudentAnalysis[student];
            if (entry) {
                entry.error = String(e?.message || e || '生成失败');
                entry.generating = false;
                this.removeGeneratingReport('student', student, placeholderId);
                this.refreshAiStudentAnalysisModal('error');
            }
        }
    },

    refreshAiStudentAnalysisModal(phase) {
        const host = document.getElementById('modal-content');
        if (host) host.innerHTML = this.renderAiStudentAnalysisModal(phase);
        const stream = document.getElementById('ai-analysis-stream');
        if (stream) stream.scrollTop = stream.scrollHeight;
    },

    renderAiStudentAnalysisModal(phase) {
        const ctx = this._aiStudentAnalysisCtx || {};
        const student = ctx.student || '';
        const entry = (this._aiStudentAnalysis || {})[student] || {};
        const top = entry.topQuestions || [];
        const isGenerating = !!entry.generating;
        const hasError = !!entry.error;
        const isDone = !!entry.done;
        const statusBadge = isGenerating
            ? '<span class="px-2 py-0.5 rounded text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>生成中</span>'
            : isDone
                ? `<span class="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">已生成 · ${entry.generatedAt || ''}</span>`
                : hasError
                    ? '<span class="px-2 py-0.5 rounded text-[11px] bg-red-500/20 text-red-300 border border-red-400/30">生成失败</span>'
                    : '';
        const regenBtn = isDone || hasError
            ? `<button onclick="App.regenerateAiStudentAnalysis()" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-xs border border-violet-400/30 transition-colors mr-2" title="按当前报告所选时间范围重新生成">
                    <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    重新生成
                </button>
                <button onclick="App.addAiStudentAnalysis()" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs border border-amber-400/30 transition-colors mr-2" title="选择新的时间范围生成新报告">
                    <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    新增
                </button>`
            : '';
        const exportBtn = isDone
            ? `<button onclick="App.exportAiReport('student', App._aiStudentAnalysisCtx?.student)" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs border border-emerald-400/30 transition-colors mr-2" title="导出报告"><svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>导出</button>`
            : '';
        const errorHtml = hasError
            ? `<div class="bg-red-500/10 border border-red-400/30 rounded-lg p-3 text-sm text-red-300 mb-3">生成失败：${entry.error}。请检查网络或稍后重试。</div>`
            : '';
        const analysisHtml = entry.analysis
            ? this.simpleMarkdown(this.stripClusterJson(entry.analysis))
            : '<div class="text-slate-500 text-sm">正在思考分析中…</div>';
        const clusterTag = entry.clusterMode === 'model'
            ? '<span class="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-400/30">AI 聚类</span>'
            : (entry.clusterMode === 'fallback' && isDone ? '<span class="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-700/40 text-slate-400 border border-slate-600/40">字面统计</span>' : '');
        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <h3 class="text-lg font-bold text-white">📊 ${student} 的 AI 兴趣画像分析</h3>
                        ${statusBadge}
                    </div>
                    <div class="flex items-center">
                        ${exportBtn}
                        ${regenBtn}
                        <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                ${this.renderAiReportHeaderStats(entry, ['chat', 'turns', 'books', 'type'], 'text-emerald-300')}

                <div class="mb-4">
                    <h4 class="text-sm font-semibold text-amber-300 mb-2 flex items-center">🔥 核心关注主题 TOP${Math.min(10, top.length)}${clusterTag}</h4>
                    ${top.length ? `
                    <div class="space-y-1.5">
                        ${top.map((t, i) => {
                            const sampleAttr = (t.samples && t.samples.length)
                                ? `title="原始提问示例：\n- ${t.samples.join('\n- ').replace(/"/g, '&quot;')}"`
                                : '';
                            return `
                            <div class="flex items-center gap-2 text-sm" ${sampleAttr}>
                                <span class="shrink-0 w-6 h-6 rounded-full ${i < 3 ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-700/60 text-slate-300'} text-xs flex items-center justify-center">${i + 1}</span>
                                <span class="flex-1 text-slate-200">${t.q}${(() => { const bs=(t.books||[]).filter(b=>b && b!==t.q); return bs.length ? ` <span class="text-xs text-violet-300">· ${bs.map(b => `《${b}》`).join("、")}</span>` : ""; })()}</span>
                                <span class="text-xs text-slate-400">${t.count} 次</span>
                            </div>`;
                        }).join('')}
                    </div>` : '<div class="text-slate-500 text-sm">暂无问题数据</div>'}
                </div>

                <div>
                    <h4 class="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                        🧠 AI 分析
                        ${isGenerating ? '<span class="inline-block w-2 h-3 bg-cyan-300 animate-pulse rounded-sm"></span>' : ''}
                    </h4>
                    ${errorHtml}
                    <div id="ai-analysis-stream" class="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 pr-5 max-h-[50vh] overflow-y-auto whitespace-normal break-words">
                        ${analysisHtml}
                    </div>
                </div>
            </div>
        `;
    },

    openAiStudentAnalysis(student) {
        const entry = (this._aiStudentAnalysis || {})[student];
        if (!entry) {
            this.startAiStudentAnalysis(student);
            return;
        }
        this._aiStudentAnalysisCtx = { student, rangeKey: entry.rangeKey };
        this.openModal(this.renderAiStudentAnalysisModal('done'), { size: 'xwide' });
    },

    // ============================================================
    //  班级 AI 分析（AI 总览页面右上角入口）
    // ============================================================
    _aiClassReportsStorageKey: 'aiClassReports',
    _aiClassReportsMaxPerClass: 50,

    loadAiClassReports() {
        try {
            const raw = localStorage.getItem(this._aiClassReportsStorageKey);
            const parsed = raw ? JSON.parse(raw) : {};
            this._aiClassReports = (parsed && typeof parsed === 'object') ? parsed : {};
        } catch (e) {
            this._aiClassReports = {};
        }
        if (!this._aiClassAnalysis) this._aiClassAnalysis = {};
        Object.keys(this._aiClassReports).forEach(cls => {
            const list = this._aiClassReports[cls];
            if (Array.isArray(list) && list.length) {
                this._aiClassAnalysis[cls] = this.cloneAiReport(list[0]);
            }
        });
    },

    persistAiClassReports() {
        try {
            localStorage.setItem(this._aiClassReportsStorageKey, JSON.stringify(this._aiClassReports || {}));
        } catch (e) { /* ignore */ }
    },

    saveAiClassReport(className, report) {
        if (!className || !report) return;
        if (!this._aiClassReports) this._aiClassReports = {};
        const list = this._aiClassReports[className] || [];
        const snapshot = JSON.parse(JSON.stringify(report));
        if (!snapshot.id) snapshot.id = this.genAiReportId();
        list.unshift(snapshot);
        if (list.length > this._aiClassReportsMaxPerClass) list.length = this._aiClassReportsMaxPerClass;
        this._aiClassReports[className] = list;
        this.persistAiClassReports();
        this.refreshAiClassAnalysisHistory();
    },

    deleteAiClassReport(className, reportId) {
        const list = (this._aiClassReports || {})[className];
        if (!list) return;
        const idx = list.findIndex(r => (r.id || r.generatedAt) === reportId);
        if (idx < 0) return;
        list.splice(idx, 1);
        if (list.length === 0) {
            delete this._aiClassReports[className];
            if (this._aiClassAnalysis) delete this._aiClassAnalysis[className];
        } else {
            this._aiClassAnalysis[className] = this.cloneAiReport(list[0]);
        }
        this.persistAiClassReports();
        this.refreshAiClassPickerHistory();
        this.refreshAiClassHistoryPopover(className);
        this.refreshAiClassAnalysisHistory();
    },

    loadHistoricalClassReport(className, reportId) {
        const list = (this._aiClassReports || {})[className] || [];
        const found = list.find(r => (r.id || r.generatedAt) === reportId);
        if (!found) return;
        if (!this._aiClassAnalysis) this._aiClassAnalysis = {};
        this._aiClassAnalysis[className] = this.cloneAiReport(found);
        this._aiClassAnalysisCtx = { className, rangeKey: found.rangeKey };
        this.openModal(this.renderAiClassAnalysisModal('done'), { size: 'xwide' });
    },

    // 入口：右上角按钮调用
    startAiClassAnalysis() {
        if (this.isTeacherScope()) {
            const className = this.getTeacherClassName();
            if (!className) {
                this.showToast?.('未识别到所带班级', 'error');
                return;
            }
            this._aiClassAnalysisCtx = { className, rangeKey: '7d' };
            this.openModal(this.renderAiClassAnalysisRangeModal(), { size: 'wide' });
            return;
        }
        // 园长 / 管理员：先选班级
        this._aiClassAnalysisCtx = { className: '', rangeKey: '7d' };
        this.openModal(this.renderAiClassPickerModal(), { size: 'wide' });
    },

    // 新增 AI 分析选择器的搜索关键词
    _aiPickerKeyword: { class: '', student: '', book: '' },
    _aiPickerMatch(kind, name) {
        const kw = ((this._aiPickerKeyword || {})[kind] || '').trim().toLowerCase();
        if (!kw) return true;
        const n = String(name || '').toLowerCase();
        if (n.includes(kw)) return true;
        if (window.PinyinUtil && PinyinUtil.match) { try { return PinyinUtil.match(name, kw); } catch (e) {} }
        return false;
    },
    setAiPickerKeyword(kind, kw) {
        if (!this._aiPickerKeyword) this._aiPickerKeyword = { class: '', student: '', book: '' };
        this._aiPickerKeyword[kind] = kw;
        const grid = document.getElementById('ai-' + kind + '-picker-grid');
        if (!grid) return;
        if (kind === 'class') grid.innerHTML = this.renderAiClassPickerItems();
        else if (kind === 'student') grid.innerHTML = this.renderAiStudentPickerItems();
        else if (kind === 'book') grid.innerHTML = this.renderAiBookPickerItems();
    },
    // 选择器内搜索框（标题旁）
    renderAiPickerSearch(kind, ph) {
        const kw = ((this._aiPickerKeyword || {})[kind] || '').replace(/"/g, '&quot;');
        return `<div class="relative">
            <input type="text" value="${kw}" placeholder="${ph}"
                oninput="App.setAiPickerKeyword('${kind}', this.value)"
                class="w-48 pl-7 pr-2 py-1.5 rounded-lg bg-slate-800/70 border border-slate-600/50 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400/60">
            <svg class="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
        </div>`;
    },

    getAiClassCandidates() {
        const list = MockData.classes || [];
        return list.filter(c => {
            if (!this.selectedSchool) return true;
            return c.kindergartenId === this.selectedSchool.id;
        });
    },

    renderAiClassPickerItems() {
        const classes = this.getAiClassCandidates().filter(c => this._aiPickerMatch('class', c.name));
        const ctx = this._aiClassAnalysisCtx || {};
        if (!classes.length) {
            const kw = ((this._aiPickerKeyword || {}).class || '').trim();
            return `<div class="text-sm text-slate-500 col-span-2 text-center py-6">${kw ? '没有匹配的班级' : '当前范围内暂无班级'}</div>`;
        }
        return classes.map(c => {
            const list = (this._aiClassReports || {})[c.name] || [];
            const escName = c.name.replace(/'/g, "\\'");
            const histBtn = list.length
                ? `<button data-ai-cls-hist-trigger="${this.hashStr(c.name)}" onclick="event.stopPropagation();App.toggleAiClassHistoryPopover('${escName}')" class="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-400/30" title="查看历史报告">📚 ${list.length}</button>`
                : '';
            const isActive = ctx.className === c.name;
            return `
                <div onclick="App.selectAiClassForAnalysis('${escName}')" class="cursor-pointer text-left px-4 py-3 rounded-xl border transition-all ${isActive ? 'border-amber-400/60 bg-amber-500/15 text-amber-200' : 'border-slate-600/40 bg-slate-800/40 text-slate-200 hover:border-slate-500/60 hover:bg-slate-700/40'}">
                    <div class="flex items-center justify-between">
                        <div class="text-sm font-medium flex items-center">🏫 ${c.name}${histBtn}</div>
                        <div class="text-[11px] text-slate-400">${c.studentCount || 0} 人 · 教师 ${c.teacherName || '-'}</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderAiClassPickerModal() {
        const ctx = this._aiClassAnalysisCtx || {};
        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-5 gap-3">
                    <h3 class="text-lg font-bold text-white">🏫 选择班级进行 AI 分析</h3>
                    <div class="flex items-center gap-2">
                        ${this.renderAiPickerSearch('class', '搜索班级名…')}
                        <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="text-xs text-slate-400 mb-3">将基于该班级在 AI 总览所选时间范围内的全部对话数据，分析班级整体兴趣画像与教学建议。</div>
                <div id="ai-class-picker-grid" class="grid grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    ${this.renderAiClassPickerItems()}
                </div>
                <div class="flex items-center justify-end gap-3 mt-5">
                    <button onclick="App.closeModalDirect()" class="px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/70 text-slate-200 text-sm transition-colors">取消</button>
                    <button onclick="App.confirmAiClassPick()" ${ctx.className ? '' : 'disabled'} class="px-4 py-2 rounded-lg text-sm font-medium transition-colors ${ctx.className ? 'hover:opacity-90' : 'cursor-not-allowed'}" style="${ctx.className ? 'background:linear-gradient(to right,#f59e0b,#f97316);color:#ffffff;' : 'background:#334155;color:#94a3b8;'}">下一步</button>
                </div>
            </div>
        `;
    },

    refreshAiClassPickerHistory() {
        const grid = document.getElementById('ai-class-picker-grid');
        if (grid) {
            const host = document.getElementById('modal-content');
            if (host) host.innerHTML = this.renderAiClassPickerModal();
        }
    },

    selectAiClassForAnalysis(className) {
        if (!this._aiClassAnalysisCtx) this._aiClassAnalysisCtx = { className: '', rangeKey: '7d' };
        this._aiClassAnalysisCtx.className = className;
        const host = document.getElementById('modal-content');
        if (host) host.innerHTML = this.renderAiClassPickerModal();
    },

    confirmAiClassPick() {
        const ctx = this._aiClassAnalysisCtx;
        if (!ctx || !ctx.className) return;
        this.openModal(this.renderAiClassAnalysisRangeModal(), { size: 'wide' });
    },

    // —— 幼儿 AI 分析：先选幼儿，再进入时间范围弹窗 ——
    startAiStudentAnalysisPick() {
        this.openModal(this.renderAiStudentPickerModal(), { size: 'wide' });
    },
    getAiStudentCandidates() {
        const map = new Map();
        this.getAiHistoryByRange().forEach(item => {
            const key = item.student || '匿名';
            if (!map.has(key)) map.set(key, { student: key, className: item.className || '-', chatCount: 0 });
            map.get(key).chatCount += 1;
        });
        return [...map.values()].sort((a, b) => b.chatCount - a.chatCount);
    },
    renderAiStudentPickerItems() {
        const cands = this.getAiStudentCandidates().filter(c => this._aiPickerMatch('student', c.student));
        if (!cands.length) {
            const kw = ((this._aiPickerKeyword || {}).student || '').trim();
            return `<div class="text-sm text-slate-500 col-span-2 text-center py-6">${kw ? '没有匹配的幼儿' : '当前范围内暂无幼儿对话数据'}</div>`;
        }
        return cands.map(c => {
            const escName = c.student.replace(/'/g, "\\'");
            const histLen = ((this._aiStudentReports || {})[c.student] || []).length;
            const histBadge = histLen ? `<span class="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-400/30">📚 ${histLen}</span>` : '';
            return `
                <div onclick="App.closeModalDirect();App.startAiStudentAnalysis('${escName}')" class="cursor-pointer text-left px-4 py-3 rounded-xl border border-slate-600/40 bg-slate-800/40 text-slate-200 hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-all">
                    <div class="flex items-center justify-between">
                        <div class="text-sm font-medium flex items-center">👶 ${c.student}${histBadge}</div>
                        <div class="text-[11px] text-slate-400">${c.className} · ${c.chatCount} 次对话</div>
                    </div>
                </div>`;
        }).join('');
    },
    renderAiStudentPickerModal() {
        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-5 gap-3">
                    <h3 class="text-lg font-bold text-white">👶 选择幼儿进行 AI 分析</h3>
                    <div class="flex items-center gap-2">
                        ${this.renderAiPickerSearch('student', '搜索幼儿姓名…')}
                        <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="text-xs text-slate-400 mb-3">将基于该幼儿在 AI 总览所选时间范围内的全部对话数据，分析兴趣画像与阅读建议。</div>
                <div id="ai-student-picker-grid" class="grid grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    ${this.renderAiStudentPickerItems()}
                </div>
            </div>`;
    },

    // —— 绘本 AI 分析：先选绘本，再进入时间范围弹窗 ——
    startAiBookAnalysisPick() {
        this.openModal(this.renderAiBookPickerModal(), { size: 'wide' });
    },
    getAiBookCandidates() {
        const map = new Map();
        this.getAiHistoryByRange().forEach(item => {
            if (!item.book) return;
            if (!map.has(item.book)) map.set(item.book, { book: item.book, chatCount: 0 });
            map.get(item.book).chatCount += 1;
        });
        return [...map.values()].sort((a, b) => b.chatCount - a.chatCount);
    },
    renderAiBookPickerItems() {
        const cands = this.getAiBookCandidates().filter(c => this._aiPickerMatch('book', c.book));
        if (!cands.length) {
            const kw = ((this._aiPickerKeyword || {}).book || '').trim();
            return `<div class="text-sm text-slate-500 col-span-2 text-center py-6">${kw ? '没有匹配的绘本' : '当前范围内暂无绘本对话数据'}</div>`;
        }
        return cands.map(c => {
            const escName = c.book.replace(/'/g, "\\'");
            const histLen = ((this._aiBookReports || {})[c.book] || []).length;
            const histBadge = histLen ? `<span class="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-400/30">📚 ${histLen}</span>` : '';
            return `
                <div onclick="App.closeModalDirect();App.startAiBookAnalysis('${escName}')" class="cursor-pointer text-left px-4 py-3 rounded-xl border border-slate-600/40 bg-slate-800/40 text-slate-200 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all">
                    <div class="flex items-center justify-between">
                        <div class="text-sm font-medium flex items-center">📖 《${c.book}》${histBadge}</div>
                        <div class="text-[11px] text-slate-400">${c.chatCount} 次对话</div>
                    </div>
                </div>`;
        }).join('');
    },
    renderAiBookPickerModal() {
        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-5 gap-3">
                    <h3 class="text-lg font-bold text-white">📖 选择绘本进行 AI 分析</h3>
                    <div class="flex items-center gap-2">
                        ${this.renderAiPickerSearch('book', '搜索绘本名…')}
                        <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="text-xs text-slate-400 mb-3">将基于该绘本在 AI 总览所选时间范围内的全部对话数据，分析热点问题与延伸建议。</div>
                <div id="ai-book-picker-grid" class="grid grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    ${this.renderAiBookPickerItems()}
                </div>
            </div>`;
    },

    selectAiClassAnalysisRange(rangeKey) {
        if (!this._aiClassAnalysisCtx) return;
        this._aiClassAnalysisCtx.rangeKey = rangeKey;
        const host = document.getElementById('modal-content');
        if (host) host.innerHTML = this.renderAiClassAnalysisRangeModal();
    },

    renderAiClassAnalysisRangeModal() {
        const ctx = this._aiClassAnalysisCtx || {};
        const className = ctx.className || '';
        const rangeKey = ctx.rangeKey || '7d';
        const dialogues = this.collectAiClassDialogues(className, rangeKey);
        const sampleCount = dialogues.length;
        const studentSet = new Set();
        const bookSet = new Set();
        dialogues.forEach(d => { if (d.student) studentSet.add(d.student); if (d.book) bookSet.add(d.book); });
        const history = (this._aiClassReports || {})[className] || [];
        const escName = className.replace(/'/g, "\\'");
        const histBtn = history.length
            ? `<button data-ai-cls-hist-trigger="${this.hashStr(className)}" onclick="App.toggleAiClassHistoryPopover('${escName}')" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/60 text-slate-200 text-xs border border-slate-500/40 transition-colors mr-2" title="查看历史报告">📚 历史 ${history.length}</button>`
            : '';
        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-white">✨ 生成 ${className} 班级 AI 分析</h3>
                    <div class="flex items-center">
                        ${histBtn}
                        <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="bg-slate-800/60 border border-slate-600/30 rounded-xl p-4 mb-5">
                    <div class="text-xs text-slate-400 mb-1">班级</div>
                    <div class="text-amber-300 font-medium">🏫 ${className}</div>
                    <div class="text-xs text-slate-500 mt-2">将提取本班在所选时间范围内的全部 AI 对话数据发送给大模型，生成班级整体兴趣画像、关注热点与教学建议。</div>
                </div>
                ${this.renderAiAnalysisRangeChips(rangeKey, 'App.selectAiClassAnalysisRange')}
                <div class="text-xs text-slate-500 mb-2">当前可用对话样本（与班级明细展示范围一致）：</div>
                ${this.renderAiSampleStatsRow(dialogues, ['chat', 'turns', 'books', 'students', 'type'], 'text-amber-300')}
                <div class="flex items-center justify-end gap-3">
                    <button onclick="App.closeModalDirect()" class="px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/70 text-slate-200 text-sm transition-colors">取消</button>
                    <button onclick="App.confirmAiClassAnalysis()" ${sampleCount === 0 ? 'disabled' : ''} class="px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sampleCount === 0 ? 'cursor-not-allowed' : 'hover:opacity-90'}" style="${sampleCount === 0 ? 'background:#334155;color:#94a3b8;' : 'background:linear-gradient(to right,#f59e0b,#f97316);color:#ffffff;'}">开始分析</button>
                </div>
            </div>
        `;
    },

    collectAiClassDialogues(className, rangeKey) {
        const all = MockData.aiOverview?.history || [];
        const bounds = this.getAiAnalysisRangeBounds(rangeKey);
        const startMs = bounds.startDate ? new Date(`${bounds.startDate}T00:00:00`).getTime() : null;
        const endMs = bounds.endDate ? new Date(`${bounds.endDate}T23:59:59`).getTime() : null;
        return all.filter(h => {
            if (h.className !== className) return false;
            if (startMs !== null || endMs !== null) {
                const t = this.parseActivityDate(h.time).getTime();
                if (Number.isNaN(t)) return false;
                if (startMs !== null && t < startMs) return false;
                if (endMs !== null && t > endMs) return false;
            }
            return true;
        });
    },

    confirmAiClassAnalysis() {
        const ctx = this._aiClassAnalysisCtx;
        if (!ctx || !ctx.className) return;
        this.runAiClassAnalysis(ctx.className, ctx.rangeKey);
    },

    regenerateAiClassAnalysis() {
        const cached = (this._aiClassAnalysis || {})[this._aiClassAnalysisCtx?.className];
        const rangeKey = cached?.rangeKey || this._aiClassAnalysisCtx?.rangeKey || '7d';
        const className = this._aiClassAnalysisCtx?.className;
        if (!className) return;
        if (this._aiClassAnalysis && this._aiClassAnalysis[className]) {
            delete this._aiClassAnalysis[className];
        }
        this.runAiClassAnalysis(className, rangeKey);
    },

    // +新增：返回时间范围选择弹窗
    addAiClassAnalysis() {
        const className = this._aiClassAnalysisCtx?.className;
        if (!className) return;
        this._aiClassAnalysisCtx = { className, rangeKey: '7d' };
        this.openModal(this.renderAiClassAnalysisRangeModal(), { size: 'wide' });
    },

    async runAiClassAnalysis(className, rangeKey) {
        const dialogues = this.collectAiClassDialogues(className, rangeKey);

        const studentSet = new Set();
        const bookCount = new Map();
        dialogues.forEach(d => {
            if (d.student) studentSet.add(d.student);
            if (d.book) bookCount.set(d.book, (bookCount.get(d.book) || 0) + 1);
        });
        const fallbackTop = [...bookCount.entries()]
            .map(([q, count]) => ({ q, count, books: [q] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // 提问文本 → 来源绘本 映射，用于标注班级"核心关注主题"的绘本来源
        const qBookMapC = new Map();
        dialogues.forEach(d => {
            (d.session || []).forEach(t => {
                if (t.q && d.book && !qBookMapC.has(t.q)) qBookMapC.set(t.q, d.book);
            });
        });
        this._aiClassQBookMap = qBookMapC;

        const rangeLabel = this.formatAiRangeLabel(rangeKey);
        const roleLabel = `班级「${className}」`;

        if (!this._aiClassAnalysis) this._aiClassAnalysis = {};
        this._aiClassAnalysis[className] = {
            className, rangeKey, rangeLabel, roleLabel,
            generatedAt: '',
            author: this.getCurrentUserName(),
            sampleCount: dialogues.length,
            studentCount: studentSet.size,
            bookCount: bookCount.size,
            stats: this.computeAiDialogueStats(dialogues),
            topQuestions: fallbackTop,
            clusterMode: 'fallback',
            analysis: '',
            done: false,
            generating: true
        };
        this._aiClassAnalysisCtx = { className, rangeKey };
        // 在历史列表插入"生成中"占位，生成完成前用户点掉弹窗也能看到记录
        const placeholderId = this.insertGeneratingReport('class', className, rangeKey);
        this._aiClassAnalysis[className].id = placeholderId;
        this.openModal(this.renderAiClassAnalysisModal(), { size: 'xwide' });

        const allQuestionsText = dialogues
            .flatMap(d => (d.session || []).map(t => ({ q: t.q, book: d.book, student: d.student })).filter(x => x.q))
            .slice(0, 220)
            .map((x, i) => `${i + 1}. [${x.student || '匿名'} · 《${x.book || '未知'}》] ${x.q}`)
            .join('\n');

        const systemPrompt = '你是一个幼儿园教育与儿童发展研究专家，擅长基于一个班级孩子与绘本AI助手的真实对话，洞察整班孩子的兴趣方向、认知阶段、情感诉求与潜在差异。你需要先对该班级所有孩子的提问做语义聚类（同义不同表归为一类），再给出班级层面的整体画像与教学建议。回复用简体中文。';
        const userPrompt = `以下是${roleLabel}在${rangeLabel}内全部孩子与绘本 AI 助手的提问数据，共 ${dialogues.length} 次对话，涉及 ${studentSet.size} 个孩子、${bookCount.size} 本绘本。

【全部提问（最多 220 条采样，前缀方括号为孩子姓名与对应绘本）】
${allQuestionsText || '（无）'}

请严格按以下两段式输出：

第一段：在一个 \`\`\`json ... \`\`\` 代码块中输出该班级最关注的 TOP10 主题/话题语义聚类（最多 10 个，按 count 倒序）。结构如下，不要添加多余字段：
\`\`\`json
{
  "clusters": [
    {"representative": "用一句话概括的代表性主题/问题", "count": 12, "samples": ["原始提问1", "原始提问2"]}
  ]
}
\`\`\`
要求：把表述不同但意图相同的问题合并为同一类；representative 用通顺自然的一句中文；count 是该类合并后的总数；samples 给 2-4 条原始问句即可。

第二段：紧接 JSON 块后输出 Markdown 班级画像分析正文（不要再放进代码块）：
1) 概述班级整体的核心兴趣方向、思维特点与情感关注（3 段内）；
2) 指出班级整体认知发展信号、共性优势与可能存在的个体差异/需要关注的孩子方向（不点名）；
3) 给出 4-6 条针对该班级可立即落地的集体教学/区角延伸/亲子互动建议；
4) 全文 700-1000 字，使用 ## 和 - 分小标题与列表，避免空话套话。`;

        try {
            await this.streamLlmAnalysis({
                book: className,
                systemPrompt,
                userPrompt,
                onDelta: (delta) => {
                    const entry = this._aiClassAnalysis[className];
                    if (!entry) return;
                    entry.analysis += delta;
                    this.refreshAiClassAnalysisModal('streaming');
                },
                onDone: async (full) => {
                    const entry = this._aiClassAnalysis[className];
                    if (!entry) return;
                    const rawText = full || entry.analysis;
                    const cluster = this.parseClusterJson(rawText);
                    if (cluster && Array.isArray(cluster.clusters) && cluster.clusters.length) {
                        const qbm = this._aiClassQBookMap || new Map();
                        entry.topQuestions = cluster.clusters.slice(0, 10).map(c => {
                            const samples = Array.isArray(c.samples) ? c.samples.slice(0, 6) : [];
                            const books = [...new Set(samples.map(s => qbm.get(s)).filter(Boolean))];
                            return { q: c.representative || samples[0] || '', count: Number(c.count) || samples.length, samples, books };
                        }).filter(t => t.q);
                        entry.clusterMode = 'model';
                    } else {
                        entry.clusterMode = 'fallback';
                    }
                    const bodyOnly = this.stripClusterJson(rawText);
                    entry.analysis = bodyOnly || rawText;
                    try {
                        const polished = await this.polishAiAnalysis(className, entry.analysis, entry.topQuestions);
                        if (polished) entry.analysis = polished;
                    } catch (e) { /* ignore */ }
                    entry.done = true;
                    entry.generating = false;
                    entry.generatedAt = this.formatNowDateTime();
                    this.refreshAiClassAnalysisModal('done');
                    this.finalizeGeneratingReport('class', className, placeholderId, entry);
                },
                onError: (err) => {
                    const entry = this._aiClassAnalysis[className];
                    if (!entry) return;
                    entry.error = String(err?.message || err || '生成失败');
                    entry.generating = false;
                    this.removeGeneratingReport('class', className, placeholderId);
                    this.refreshAiClassAnalysisModal('error');
                }
            });
        } catch (e) {
            const entry = this._aiClassAnalysis[className];
            if (entry) {
                entry.error = String(e?.message || e || '生成失败');
                entry.generating = false;
                this.removeGeneratingReport('class', className, placeholderId);
                this.refreshAiClassAnalysisModal('error');
            }
        }
    },

    refreshAiClassAnalysisModal(phase) {
        const host = document.getElementById('modal-content');
        if (host) host.innerHTML = this.renderAiClassAnalysisModal(phase);
        const stream = document.getElementById('ai-analysis-stream');
        if (stream) stream.scrollTop = stream.scrollHeight;
    },

    renderAiClassAnalysisModal(phase) {
        const ctx = this._aiClassAnalysisCtx || {};
        const className = ctx.className || '';
        const entry = (this._aiClassAnalysis || {})[className] || {};
        const top = entry.topQuestions || [];
        const isGenerating = !!entry.generating;
        const hasError = !!entry.error;
        const isDone = !!entry.done;
        const history = (this._aiClassReports || {})[className] || [];
        const statusBadge = isGenerating
            ? '<span class="px-2 py-0.5 rounded text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>生成中</span>'
            : isDone
                ? `<span class="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">已生成 · ${entry.generatedAt || ''}</span>`
                : hasError
                    ? '<span class="px-2 py-0.5 rounded text-[11px] bg-red-500/20 text-red-300 border border-red-400/30">生成失败</span>'
                    : '';
        const histBtn = history.length
            ? `<button onclick="App.toggleAiClassHistoryPopover('${className.replace(/'/g, "\\'")}')" data-ai-cls-hist-trigger="${this.hashStr(className)}" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/60 text-slate-200 text-xs border border-slate-500/40 transition-colors mr-2" title="查看历史报告">📚 历史 ${history.length}</button>`
            : '';
        const regenBtn = isDone || hasError
            ? `<button onclick="App.regenerateAiClassAnalysis()" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-xs border border-violet-400/30 transition-colors mr-2" title="按当前报告所选时间范围重新生成">
                    <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    重新生成
                </button>
                <button onclick="App.addAiClassAnalysis()" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs border border-amber-400/30 transition-colors mr-2" title="选择新的时间范围生成新报告">
                    <svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    新增
                </button>`
            : '';
        const exportBtn = isDone
            ? `<button onclick="App.exportAiReport('class', App._aiClassAnalysisCtx?.className)" class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs border border-emerald-400/30 transition-colors mr-2" title="导出报告"><svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>导出</button>`
            : '';
        const errorHtml = hasError
            ? `<div class="bg-red-500/10 border border-red-400/30 rounded-lg p-3 text-sm text-red-300 mb-3">生成失败：${entry.error}。请检查网络或稍后重试。</div>`
            : '';
        const analysisHtml = entry.analysis
            ? this.simpleMarkdown(this.stripClusterJson(entry.analysis))
            : '<div class="text-slate-500 text-sm">正在思考分析中…</div>';
        const clusterTag = entry.clusterMode === 'model'
            ? '<span class="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-400/30">AI 聚类</span>'
            : (entry.clusterMode === 'fallback' && isDone ? '<span class="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-700/40 text-slate-400 border border-slate-600/40">字面统计</span>' : '');
        return `
            <div class="bg-slate-900 rounded-xl p-6 w-full">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <h3 class="text-lg font-bold text-white">🏫 ${className} · 班级 AI 画像分析</h3>
                        ${statusBadge}
                    </div>
                    <div class="flex items-center">
                        ${histBtn}
                        ${exportBtn}
                        ${regenBtn}
                        <button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                ${this.renderAiReportHeaderStats(entry, ['chat', 'turns', 'books', 'students', 'type'], 'text-amber-300')}

                <div class="mb-4">
                    <h4 class="text-sm font-semibold text-amber-300 mb-2 flex items-center">🔥 班级核心关注主题 TOP${Math.min(10, top.length)}${clusterTag}</h4>
                    ${top.length ? `
                    <div class="space-y-1.5">
                        ${top.map((t, i) => {
                            const sampleAttr = (t.samples && t.samples.length)
                                ? `title="原始提问示例：\n- ${t.samples.join('\n- ').replace(/"/g, '&quot;')}"`
                                : '';
                            return `
                            <div class="flex items-center gap-2 text-sm" ${sampleAttr}>
                                <span class="shrink-0 w-6 h-6 rounded-full ${i < 3 ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-700/60 text-slate-300'} text-xs flex items-center justify-center">${i + 1}</span>
                                <span class="flex-1 text-slate-200">${t.q}${(() => { const bs=(t.books||[]).filter(b=>b && b!==t.q); return bs.length ? ` <span class="text-xs text-violet-300">· ${bs.map(b => `《${b}》`).join("、")}</span>` : ""; })()}</span>
                                <span class="text-xs text-slate-400">${t.count} 次</span>
                            </div>`;
                        }).join('')}
                    </div>` : '<div class="text-slate-500 text-sm">暂无问题数据</div>'}
                </div>

                <div>
                    <h4 class="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                        🧠 AI 分析
                        ${isGenerating ? '<span class="inline-block w-2 h-3 bg-cyan-300 animate-pulse rounded-sm"></span>' : ''}
                    </h4>
                    ${errorHtml}
                    <div id="ai-analysis-stream" class="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 pr-5 max-h-[50vh] overflow-y-auto whitespace-normal break-words">
                        ${analysisHtml}
                    </div>
                </div>
            </div>
        `;
    },

    toggleAiClassHistoryPopover(className) {
        const id = `ai-cls-hist-pop-${this.hashStr(className)}`;
        const existing = document.getElementById(id);
        if (existing) { existing.remove(); return; }
        document.querySelectorAll('[data-ai-cls-hist-pop]').forEach(n => n.remove());
        const trigger = document.querySelector(`[data-ai-cls-hist-trigger="${this.hashStr(className)}"]`);
        if (!trigger) return;
        const pop = document.createElement('div');
        pop.id = id;
        pop.dataset.aiClsHistPop = '1';
        pop.className = 'aih-pop fixed z-[60] w-80 max-h-96 overflow-y-auto';
        pop.innerHTML = this.renderAiClassHistoryPopover(className);
        document.body.appendChild(pop);
        const rect = trigger.getBoundingClientRect();
        let top = rect.bottom + 6;
        let left = rect.right - 320;
        if (left < 8) left = 8;
        if (top + 384 > window.innerHeight) top = Math.max(8, rect.top - 384 - 6);
        pop.style.top = `${top}px`;
        pop.style.left = `${left}px`;
        setTimeout(() => {
            const onDocClick = (e) => {
                if (!pop.contains(e.target) && !trigger.contains(e.target)) {
                    pop.remove();
                    document.removeEventListener('click', onDocClick);
                }
            };
            document.addEventListener('click', onDocClick);
        }, 0);
    },

    refreshAiClassHistoryPopover(className) {
        const id = `ai-cls-hist-pop-${this.hashStr(className)}`;
        const pop = document.getElementById(id);
        if (pop) pop.innerHTML = this.renderAiClassHistoryPopover(className);
    },

    renderAiClassHistoryPopover(className) {
        const list = (this._aiClassReports || {})[className] || [];
        const escClass = className.replace(/'/g, "\\'");
        if (!list.length) {
            return `<div class="text-sm text-slate-400 px-2 py-3 text-center">暂无历史报告</div>`;
        }
        const items = list.map(r => {
            const rangeLabel = r.rangeLabel || r.rangeKey || '-';
            const dateStr = (r.generatedAt || '-').split(' ')[0] || '-';
            const sample = r.sampleCount || 0;
            return `
                <div class="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-700/40 border border-slate-700/40 mb-1.5">
                    <div class="flex-1 min-w-0">
                        <div class="text-xs text-slate-200 truncate">${dateStr} - ${className}</div>
                        <div class="text-[11px] text-slate-500 mt-0.5">${rangeLabel} · 样本：${sample}</div>
                    </div>
                    <button onclick="App.loadHistoricalClassReport('${escClass}', '${String(r.id || r.generatedAt || '').replace(/'/g, "\\'")}')" class="px-2 py-1 rounded text-[11px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30">查看</button>
                    <button onclick="App.deleteAiClassReport('${escClass}', '${String(r.id || r.generatedAt || '').replace(/'/g, "\\'")}')" class="px-2 py-1 rounded text-[11px] bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-400/30">删除</button>
                </div>
            `;
        }).join('');
        return `
            <div class="flex items-center justify-between mb-2 px-1">
                <div class="text-sm font-semibold text-amber-300">📚 历史报告 · ${list.length} 份</div>
                <button onclick="App.toggleAiClassHistoryPopover('${escClass}')" class="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            ${items}
        `;
    },

    // ============================================================
    //  页面2：园所数据（7个标签页）
    // ============================================================
    renderSchoolDataPage() {
        // 基础标签页（园长和教师可见）
        const baseTabs = [
            { id: 'overview', label: '数据概述', icon: Icons.chart('w-4 h-4') },
            { id: 'activities', label: '绘本活动', icon: Icons.activity('w-4 h-4') },
            { id: 'books', label: '绘本', icon: Icons.book('w-4 h-4') },
            { id: 'classes', label: '班级', icon: Icons.school('w-4 h-4') },
            { id: 'teachers', label: '教师', icon: Icons.teacher('w-4 h-4') },
            { id: 'students', label: '幼儿', icon: Icons.student('w-4 h-4') },
            { id: 'devices', label: '设备', icon: Icons.device('w-4 h-4') }
        ];

        // 教育局管理员：区域数据页已并入大数据总览，schoolData 仅在选中具体园所时使用
        let tabs;
        if (this.currentRole === 'admin') {
            tabs = baseTabs;
        } else if (this.currentRole === 'teacher') {
            // 教师视角：本班数据，去掉设备页（设备由园所统管，无班级维度）
            tabs = baseTabs.filter(t => t.id !== 'devices');
        } else {
            tabs = baseTabs;
        }

        // 角色相关标题和选择器
        let titleText;
        let scopeSelector = '';

        if (this.currentRole === 'admin') {
            titleText = this.selectedSchool ? `${this.selectedSchool.name}数据统计` : '园所数据统计';
            scopeSelector = `
                <span class="role-badge admin inline-flex items-center gap-1">${Icons.school()} ${this.selectedSchool ? this.selectedSchool.name : '园所详情'}</span>
                <button onclick="App.clearSelectedSchool()" class="px-3 py-1.5 rounded-lg bg-slate-600/50 border border-slate-500/30 text-slate-300 text-sm hover:bg-slate-500/50 hover:text-white transition-all flex items-center gap-1.5">
                    <span>←</span> 返回大数据总览
                </button>
            `;
        } else if (this.currentRole === 'principal') {
            titleText = this.selectedSchool ? `${this.selectedSchool.name}数据统计` : '园所数据统计';
            scopeSelector = `<span class="role-badge principal inline-flex items-center gap-1">${Icons.school()} 园所数据</span>`;
        } else if (this.currentRole === 'teacher') {
            titleText = this.selectedClass ? `${this.selectedClass.name}数据统计` : '班级数据统计';
            scopeSelector = `<span class="role-badge teacher inline-flex items-center gap-1">${Icons.teacher()} 班级数据</span>`;
        }

        return `
        <div class="space-y-6">
            <div id="school-data-header" class="flex items-center justify-between">
                <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">${titleText}</h2>
                <div class="flex items-center gap-3">
                    ${scopeSelector}
                    <div class="text-sm text-slate-500" id="school-overview-date"></div>
                </div>
            </div>
            <div id="school-date-filter">
                ${this.renderDateFilterBar('schoolOverview')}
            </div>
            <div id="school-data-panel" class="bg-slate-600/50 backdrop-blur-sm rounded-2xl border border-slate-500/35 overflow-hidden">
                <!-- 标签页导航 -->
                <div class="flex justify-center items-center border-b border-slate-500/35 overflow-x-auto bg-slate-700/40">
                    ${tabs.map(tab => `
                        <button class="school-tab flex-1 min-w-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${tab.id === this.schoolDataTab ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/30'}" data-tab="${tab.id}" onclick="App.switchSchoolTab('${tab.id}')">
                            <span class="flex-shrink-0">${tab.icon}</span>${tab.label}
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

        const header = document.getElementById('school-data-header');
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

        const panel = document.getElementById('school-data-panel');
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

    updateSchoolOverviewDate() {
        const el = document.getElementById('school-overview-date');
        if (!el) return;
        const range = this.dateRanges.schoolOverview || {};
        el.textContent = (range.startDate && range.endDate) ? `${range.startDate} 至 ${range.endDate}` : '';
    },

    switchSchoolTab(tabId) {
        this.schoolDataTab = tabId;
        document.querySelectorAll('.school-tab').forEach(tab => {
            const isActive = tab.dataset.tab === tabId;
            tab.className = this.getSchoolTabClass(isActive);
        });
        // 立刻渲染骨架占位，给用户"加载中"的反馈，下一帧再真正渲染（避免感知卡顿）
        const container = document.getElementById('school-tab-content');
        if (container) {
            const skeletonType = (
                tabId === 'compare' ? 'compare' :
                tabId === 'overview' ? 'overview' :
                tabId === 'schools' ? 'overview' :
                'table'
            );
            container.innerHTML = this.skeletonFor(skeletonType);
        }
        requestAnimationFrame(() => this.renderSchoolTabContent(tabId));
    },

    initSchoolDataPage() {
        this.enhanceSchoolDataLayout();
        this.updateSchoolOverviewDate();
        // 区域数据页已并入大数据总览，所有角色统一用 overview 作为默认 tab
        if (!this.schoolDataTab || this.schoolDataTab === 'compare' || this.schoolDataTab === 'schools') {
            this.schoolDataTab = 'overview';
        }
        // 教师视角不可能停留在 devices 子页签
        if (this.currentRole === 'teacher' && this.schoolDataTab === 'devices') {
            this.schoolDataTab = 'overview';
        }
        this.renderSchoolTabContent(this.schoolDataTab);
        // 同步更新tab高亮状态
        document.querySelectorAll('.school-tab').forEach(tab => {
            tab.className = this.getSchoolTabClass(tab.dataset.tab === this.schoolDataTab);
        });
    },

    renderSchoolTabContent(tabId) {
        const container = document.getElementById('school-tab-content');
        if (!container) return;
        Charts.dispose();
        switch (tabId) {
            case 'schools': container.innerHTML = this.renderSchoolsView(this.schoolSearchKeyword); break;
            case 'compare':
                container.innerHTML = this.renderRegionalSchoolCompare();
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const data = this.buildKindergartenUsageSeries();
                        Charts.safeInit(() => Charts.initKindergartenUsageLine(data, this.kindergartenUsageChartTypes));
                    });
                });
                break;
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
    renderSchoolsView(searchKeyword = '') {
        return `
        <div class="space-y-6">
            <!-- 搜索栏（固定不重新渲染） -->
            <div class="bg-slate-700/40 rounded-xl p-4 border border-slate-500/30">
                <div class="flex items-center gap-4">
                    <div class="flex-1 relative">
                        <input
                            type="text"
                            id="school-search-input"
                            placeholder="搜索学校或区域（支持首字母，如 yg）..."
                            value="${searchKeyword}"
                            class="w-full bg-slate-800/60 border border-slate-500/30 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:bg-slate-800/80 transition-all"
                            oninput="App.handleSchoolSearch(this.value)"
                        />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                    <div id="school-search-stats" class="text-sm text-slate-400">
                        ${this.renderSchoolSearchStats(searchKeyword)}
                    </div>
                    <div id="school-clear-btn">
                        ${searchKeyword ? `<button onclick="App.clearSchoolSearch()" class="px-3 py-2 rounded-lg bg-slate-600/50 border border-slate-500/30 text-slate-300 text-sm hover:bg-slate-500/50 transition-all">清除</button>` : ''}
                    </div>
                </div>
            </div>

            <!-- 搜索结果容器 -->
            <div id="school-search-results">
                ${this.renderSchoolsResults(searchKeyword)}
            </div>
        </div>`;
    },

    // 渲染搜索统计信息
    renderSchoolSearchStats(searchKeyword = '') {
        const allSchools = MockData.kindergartens;
        const keyword = (searchKeyword || '').trim();
        const schools = keyword
            ? allSchools.filter(s => PinyinUtil.match(s.name, keyword) || PinyinUtil.match(s.district, keyword))
            : allSchools;
        const totalCount = allSchools.length;
        const filteredCount = schools.length;

        return keyword
            ? `找到 <span class="text-cyan-400 font-semibold">${filteredCount}</span> / ${totalCount} 所学校`
            : `共 <span class="text-cyan-400 font-semibold">${totalCount}</span> 所学校`;
    },

    // 渲染搜索结果列表
    renderSchoolsResults(searchKeyword = '') {
        const allSchools = MockData.kindergartens;
        const usageData = MockData.kindergartenClassUsageComparison;

        // 模糊搜索过滤（支持中文/英文/首字母拼音 yg→阳光）
        const keyword = (searchKeyword || '').trim();
        const schools = keyword
            ? allSchools.filter(s => PinyinUtil.match(s.name, keyword) || PinyinUtil.match(s.district, keyword))
            : allSchools;

        // 搜索结果为空提示
        if (schools.length === 0) {
            return `
                <div class="bg-slate-700/30 rounded-xl p-8 text-center border border-slate-500/20">
                    <div class="text-slate-400 mb-2">未找到匹配的学校</div>
                    <div class="text-sm text-slate-500">请尝试其他关键词搜索</div>
                </div>`;
        }

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                ${schools.map(school => {
                    const usage = usageData.find(u => u.kindergartenId === school.id) || {};
                    return `
                    <div class="school-card group relative overflow-hidden rounded-2xl border border-slate-500/30 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-5 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300">
                        <!-- 背景装饰 -->
                        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-2xl"></div>

                        <!-- 学校标识 -->
                        <div class="relative flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center text-cyan-300 shadow-lg">
                                ${Icons.school('w-6 h-6')}
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
            </div>`;
    },

    // 查看学校详情：弹窗展示该园所的"数据概述"内容，右上角"打开详情"跳转完整页
    viewSchoolDetail(schoolId) {
        const school = MockData.kindergartens.find(k => k.id === schoolId);
        if (!school) return;

        // 临时把 selectedSchool 切到目标园所，复用现有 renderSchoolOverview 的渲染
        const prevSchool = this.selectedSchool;
        this.selectedSchool = school;
        const overviewHtml = this.renderSchoolOverview();
        this.selectedSchool = prevSchool;

        const html = `
            <div class="p-6 lg:p-8 space-y-5">
                <!-- 头部：学校信息 + 操作 -->
                <div class="flex items-start justify-between gap-3 pb-4 border-b border-slate-500/30">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
                            ${Icons.school('w-6 h-6')}
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white">${school.name}</h3>
                            <p class="text-xs text-slate-400 mt-0.5">${school.district} · 班级 ${school.classCount} · 幼儿 ${school.studentCount} · 教师 ${school.teacherCount}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <button onclick="App.openSchoolPage(${school.id})" class="px-3.5 py-1.5 rounded-lg bg-cyan-400/15 border border-cyan-400/30 text-cyan-200 text-sm font-medium hover:bg-cyan-400/25 transition-all flex items-center gap-1.5" title="进入该学校完整数据页">
                            <span>打开详情</span>
                            <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3h7v7M10 14L21 3M21 14v7H3V3h7"/></svg>
                        </button>
                        <button onclick="App.closeModalDirect()" class="px-2 py-1.5 rounded-lg bg-slate-600/50 border border-slate-500/30 text-slate-300 text-sm hover:bg-slate-500/50 transition-all" title="关闭">✕</button>
                    </div>
                </div>

                <!-- 园所数据概述（与"园所数据页-数据概述"一致） -->
                <div class="school-modal-overview">${overviewHtml}</div>
            </div>`;
        this.openModal(html, { size: 'xxwide' });
    },

    // 弹窗"打开详情"按钮：关闭弹窗并跳到该学校的园所数据页
    openSchoolPage(schoolId) {
        const school = MockData.kindergartens.find(k => k.id === schoolId);
        if (!school) return;
        this.closeModalDirect();
        this.selectedSchool = school;
        this.schoolDataTab = 'overview';
        this.loadPage('schoolData');
    },

    // 返回上一级（教育局管理员从园所详情返回大数据总览，其他角色返回学校筛选）
    clearSelectedSchool() {
        this.selectedSchool = null;
        this.schoolSearchKeyword = '';
        if (this.currentRole === 'admin') {
            // admin 已无单独的学校筛选页，统一回到大数据总览
            this.schoolDataTab = 'overview';
            this.loadPage('dataOverview');
        } else {
            this.schoolDataTab = 'schools';
            this.loadPage('schoolData');
        }
    },

    // 学校搜索处理（只更新结果，不重新渲染输入框）
    handleSchoolSearch(keyword) {
        this.schoolSearchKeyword = keyword;

        // 只更新搜索结果容器
        const resultsContainer = document.getElementById('school-search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = this.renderSchoolsResults(keyword);
        }

        // 只更新统计信息
        const statsContainer = document.getElementById('school-search-stats');
        if (statsContainer) {
            statsContainer.innerHTML = this.renderSchoolSearchStats(keyword);
        }

        // 更新清除按钮显示
        const clearBtnContainer = document.getElementById('school-clear-btn');
        if (clearBtnContainer) {
            clearBtnContainer.innerHTML = keyword
                ? `<button onclick="App.clearSchoolSearch()" class="px-3 py-2 rounded-lg bg-slate-600/50 border border-slate-500/30 text-slate-300 text-sm hover:bg-slate-500/50 transition-all">清除</button>`
                : '';
        }
    },

    // 清除学校搜索
    clearSchoolSearch() {
        this.schoolSearchKeyword = '';

        // 清空输入框
        const input = document.getElementById('school-search-input');
        if (input) {
            input.value = '';
        }

        // 只更新搜索结果容器
        const resultsContainer = document.getElementById('school-search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = this.renderSchoolsResults('');
        }

        // 只更新统计信息
        const statsContainer = document.getElementById('school-search-stats');
        if (statsContainer) {
            statsContainer.innerHTML = this.renderSchoolSearchStats('');
        }

        // 隐藏清除按钮
        const clearBtnContainer = document.getElementById('school-clear-btn');
        if (clearBtnContainer) {
            clearBtnContainer.innerHTML = '';
        }
    },

    // 园所数据 - 数据概述
    // 工具：返回数值在数组中的相对百分位（0-100）。用于 .compare-bar-cell 的 --pct
    barPct(value, max) {
        const v = Number(value) || 0;
        const m = Number(max) || 0;
        if (m <= 0) return 0;
        return Math.max(0, Math.min(100, Math.round(v / m * 100)));
    },
    // 工具：渲染一个带条件格式条的数值单元格
    barCell(value, max, opts = {}) {
        const pct = this.barPct(value, max);
        const cls = ['compare-bar-cell'];
        if (opts.lowThreshold !== undefined && value < opts.lowThreshold) cls.push('is-low');
        if (opts.highThreshold !== undefined && value >= opts.highThreshold) cls.push('is-high');
        if (opts.extraClass) cls.push(opts.extraClass);
        const display = opts.format ? opts.format(value) : value;
        const align = opts.align || 'text-center';
        return `<td class="px-4 py-3 ${align} ${cls.join(' ')}" style="--pct:${pct}">${display}</td>`;
    },
    // 工具：渲染可排序列头
    sortableTh(label, key, sortState, options = {}) {
        const align = options.align || 'text-center';
        const isActive = sortState && sortState.key === key;
        const dir = isActive ? sortState.dir : null;
        const arrow = dir === 'asc' ? '▲' : (dir === 'desc' ? '▼' : '↕');
        const onclick = options.onclick || `App.toggleSort('${options.scope || ''}','${key}')`;
        return `<th class="px-4 py-3 ${align} text-xs font-medium sortable-th ${isActive ? 'is-sorted' : ''}" onclick="${onclick}">
            ${label}<span class="sort-arrow">${arrow}</span>
        </th>`;
    },
    // 工具：园所数据 tab 的排序状态（多 tab 共享）
    schoolSort: {
        classes: { key: 'activityCount', dir: 'desc' },
        teachers: { key: 'activityCount', dir: 'desc' },
        students: { key: 'activityCount', dir: 'desc' },
        books: { key: 'readCount', dir: 'desc' },
        devices: { key: 'useCount', dir: 'desc' }
    },
    toggleSort(scope, key) {
        if (!scope || !this.schoolSort[scope]) return;
        const s = this.schoolSort[scope];
        if (s.key === key) {
            s.dir = s.dir === 'asc' ? 'desc' : 'asc';
        } else {
            s.key = key;
            s.dir = 'desc';
        }
        this.renderSchoolTabContent(scope);
    },
    sortByKey(arr, sortState) {
        if (!sortState || !sortState.key) return arr;
        const k = sortState.key;
        const sign = sortState.dir === 'asc' ? 1 : -1;
        return arr.slice().sort((a, b) => {
            const va = a[k];
            const vb = b[k];
            // 字符串带 'h' 后缀的时长字段：抽数字
            const na = typeof va === 'string' ? parseFloat(va) || 0 : (Number(va) || 0);
            const nb = typeof vb === 'string' ? parseFloat(vb) || 0 : (Number(vb) || 0);
            if (na === nb) return 0;
            return na > nb ? sign : -sign;
        });
    },

    // 园所"关键差异速览"：4 项量化口径
    getSchoolDiffSummary() {
        const ratio = this.getSchoolRangeRatio();
        const scaleCount = v => ratio <= 0 ? 0 : Math.max(0, Math.round((Number(v) || 0) * ratio));
        const classes = (MockData.classes || []).map(c => ({
            ...c,
            activityCount: scaleCount(c.activityCount)
        }));
        const teachers = (MockData.schoolData?.teachers || []).map(t => ({
            ...t,
            activityCount: scaleCount(t.activityCount)
        }));
        const devices = (MockData.devices || []).map(d => ({
            ...d,
            useCount: scaleCount(d.useCount)
        }));

        const classCounts = classes.map(c => c.activityCount);
        const classAvg = classCounts.length ? classCounts.reduce((s, v) => s + v, 0) / classCounts.length : 0;
        const highClasses = classes.filter(c => c.activityCount >= classAvg * 1.2);
        const lowClasses = classes.filter(c => c.activityCount < classAvg * 0.5);
        const sortedClasses = [...classes].sort((a, b) => b.activityCount - a.activityCount);

        const teacherCounts = teachers.map(t => t.activityCount);
        const teacherMax = teacherCounts.length ? Math.max(...teacherCounts) : 0;
        const teacherMin = teacherCounts.length ? Math.min(...teacherCounts) : 0;
        const teacherTop = teachers.find(t => t.activityCount === teacherMax);
        const teacherBottom = teachers.find(t => t.activityCount === teacherMin);

        const deviceCounts = devices.map(d => d.useCount);
        const deviceMax = deviceCounts.length ? Math.max(...deviceCounts) : 0;
        const deviceMin = deviceCounts.length ? Math.min(...deviceCounts) : 0;

        return {
            classCount: classes.length,
            classAvg: Math.round(classAvg * 10) / 10,
            highClassCount: highClasses.length,
            lowClassCount: lowClasses.length,
            topClassName: sortedClasses[0]?.name || '-',
            bottomClassName: sortedClasses[sortedClasses.length - 1]?.name || '-',
            teacherMax,
            teacherMin,
            teacherSpread: teacherMax - teacherMin,
            teacherTopName: teacherTop?.name || '-',
            teacherBottomName: teacherBottom?.name || '-',
            deviceMax,
            deviceMin,
            deviceSpread: deviceMax - deviceMin
        };
    },

    // 园所"班级开课情况变化"图：state + 工具
    schoolClassChart: {
        types: ['line', 'bar']
    },
    selectedClassesForLine: null, // 第一次访问时初始化为活动次数 TOP3 班
    initSelectedClassesForLineIfEmpty() {
        if (this.selectedClassesForLine && this.selectedClassesForLine.length) return;
        const ranked = (MockData.classes || [])
            .slice()
            .sort((a, b) => (b.activityCount || 0) - (a.activityCount || 0))
            .slice(0, 3)
            .map(c => c.name);
        this.selectedClassesForLine = ranked;
    },
    // 按 schoolOverview 时间筛选，把 activities 中 className+date 累加成多 series（每个班一条）
    buildSchoolClassUsageSeries() {
        const range = this.getSchoolDateRange();
        const start = range?.startDate ? new Date(`${range.startDate}T00:00:00`) : null;
        const end = range?.endDate ? new Date(`${range.endDate}T23:59:59`) : null;
        const granularity = this.getOverviewSeriesGranularity(range);

        // 时间轴
        const dates = [];
        if (start && end) {
            if (granularity === 'month') {
                const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
                const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
                while (cursor <= endMonth) {
                    dates.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
                    cursor.setMonth(cursor.getMonth() + 1);
                }
            } else {
                const cursor = new Date(start);
                cursor.setHours(0, 0, 0, 0);
                const endDate = new Date(end);
                endDate.setHours(0, 0, 0, 0);
                while (cursor <= endDate) {
                    dates.push(this.formatDateInput(cursor).slice(5));
                    cursor.setDate(cursor.getDate() + 1);
                }
            }
        }

        this.initSelectedClassesForLineIfEmpty();
        const selected = this.selectedClassesForLine || [];
        const acts = this.filterActivitiesByGlobalRange(MockData.schoolData?.activities || []);
        // 按 className 分组，再按时间桶累加
        const dateKeyOf = (timeStr) => {
            const d = this.parseActivityDate(timeStr);
            if (Number.isNaN(d.getTime())) return null;
            if (granularity === 'month') {
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            }
            return this.formatDateInput(d).slice(5);
        };
        const series = selected.map(name => {
            const buckets = Object.fromEntries(dates.map(d => [d, 0]));
            acts.forEach(a => {
                if (a.className !== name) return;
                const k = dateKeyOf(a.startTime || a.endTime);
                if (k && buckets[k] != null) buckets[k] += 1;
            });
            return { name, values: dates.map(d => buckets[d] || 0) };
        });

        return { dates, series, granularity };
    },
    renderSchoolClassActivityHeader() {
        this.initSelectedClassesForLineIfEmpty();
        const types = this.schoolClassChart.types && this.schoolClassChart.types.length
            ? this.schoolClassChart.types
            : ['line', 'bar'];
        const tab = (key, label, icon) => {
            const active = types.includes(key);
            const onlyOne = types.length === 1 && active;
            return `<button onclick="App.toggleSchoolClassChartType('${key}')"
                ${onlyOne ? 'disabled' : ''}
                class="chart-toggle-btn chart-toggle-btn--purple ${active ? 'is-active' : 'is-inactive'} ${onlyOne ? 'is-locked' : ''}"
                title="${onlyOne ? '至少保留一种图形' : (active ? '点击隐藏' + label : '点击显示' + label)}">
                ${icon}<span>${label}</span>
            </button>`;
        };
        const lineIcon = '<svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 17l6-6 4 4 8-8"/></svg>';
        const barIcon = '<svg class="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20V10M10 20V4M16 20v-6M22 20H2"/></svg>';
        const allClasses = MockData.classes || [];
        const selected = this.selectedClassesForLine || [];
        const selectedNames = allClasses.filter(c => selected.includes(c.name)).map(c => c.name);
        return `
            <div id="school-class-activity-header" class="space-y-3 mb-3">
                <div class="flex items-center justify-between gap-3">
                    ${this.chartTitle('班级绘本活动次数', 'bg-rose-500', '统计范围：当前所选时间范围内本园所有绘本活动记录。\n口径：按"活动次数"统计——每条活动记录算一次，按所选时间粒度（日/月）分桶，按所选班级分组。\n图形：折线/柱状可同时展示，最少保留一种。\n用法：勾选要对比的班级 → 联动顶部时间筛选栏 → 看每个班绘本活动次数随时间的变化与差异。')}
                    <div class="chart-toggle-group">
                        ${tab('line', '折线', lineIcon)}
                        ${tab('bar', '柱状', barIcon)}
                    </div>
                </div>
                <div class="relative" id="school-class-dropdown-container">
                    <button onclick="event.stopPropagation();App.toggleSchoolClassDropdown()" class="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs transition-all border bg-slate-700/40 text-slate-300 border-slate-500/30 hover:border-purple-400/30">
                        <span class="truncate">${selectedNames.length > 0 ? selectedNames.join('、') : '请选择班级'}</span>
                        <svg class="w-4 h-4 transition-transform" width="16" height="16" id="school-class-dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div id="school-class-dropdown-menu" class="hidden absolute top-full left-0 right-0 mt-1 bg-slate-800/95 border border-slate-500/30 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                        ${allClasses.map(c => `
                            <div onclick="event.stopPropagation();App.toggleClassForLine('${c.name.replace(/'/g, "\\'")}')" class="flex items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-all hover:bg-purple-500/10 ${selected.includes(c.name) ? 'bg-purple-500/15 text-purple-300' : 'text-slate-300'}">
                                <span class="w-4 h-4 rounded border flex items-center justify-center ${selected.includes(c.name) ? 'bg-purple-500 border-purple-500' : 'border-slate-500'}">
                                    ${selected.includes(c.name) ? '<svg class="w-3 h-3 text-white" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
                                </span>
                                <span class="truncate">${c.name}${c.teacherName ? ` · ${c.teacherName}` : ''}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
    },
    toggleSchoolClassDropdown() {
        const menu = document.getElementById('school-class-dropdown-menu');
        const arrow = document.getElementById('school-class-dropdown-arrow');
        if (menu) menu.classList.toggle('hidden');
        if (arrow) arrow.classList.toggle('rotate-180');
    },
    toggleClassForLine(name) {
        this.initSelectedClassesForLineIfEmpty();
        const list = this.selectedClassesForLine.slice();
        const idx = list.indexOf(name);
        if (idx > -1) {
            if (list.length > 1) list.splice(idx, 1); // 至少保留一个
        } else {
            list.push(name);
        }
        this.selectedClassesForLine = list;
        this.refreshSchoolClassActivityChart({ headerOnly: true, keepDropdown: true });
    },
    toggleSchoolClassChartType(type) {
        if (type !== 'line' && type !== 'bar') return;
        const list = (this.schoolClassChart.types || []).slice();
        const idx = list.indexOf(type);
        if (idx > -1) {
            if (list.length === 1) return;
            list.splice(idx, 1);
        } else {
            list.push(type);
        }
        this.schoolClassChart.types = list;
        this.refreshSchoolClassActivityChart({ headerOnly: true });
    },
    refreshSchoolClassActivityChart(opts = {}) {
        const wasOpen = !document.getElementById('school-class-dropdown-menu')?.classList.contains('hidden');
        const header = document.getElementById('school-class-activity-header');
        if (header) {
            header.outerHTML = this.renderSchoolClassActivityHeader();
            if (opts.keepDropdown && wasOpen) {
                document.getElementById('school-class-dropdown-menu')?.classList.remove('hidden');
                document.getElementById('school-class-dropdown-arrow')?.classList.add('rotate-180');
            }
        }
        const data = this.buildSchoolClassUsageSeries();
        const updated = Charts.updateSchoolClassActivityChart(data, this.schoolClassChart.types);
        if (!updated) {
            Charts.safeInit(() => Charts.initSchoolClassActivityChart(data, this.schoolClassChart.types));
        }
    },

    renderSchoolDiffSummary() {
        return `
            <div>
                ${this.renderSchoolClassActivityHeader()}
                <div id="school-class-activity-chart" class="h-72"></div>
            </div>`;
    },

    renderSchoolOverview() {
        const d = this.getSchoolOverviewDataForCurrentRange();
        const recommendations = this.getSchoolOverviewBookRecommendations();
        // 教育局管理员显示"全区"，其他角色显示"园所"
        const scopeLabel = this.isTeacherScope()
            ? '本班'
            : (this.currentRole === 'admin' && !this.selectedSchool ? '全区' : '园所');
        // 是否需要 5 KPI 概览：admin（全区合计或单园弹窗）和 teacher（本班概览）保留；
        // principal 视角下与总览页 KPI 重复，删除
        const showKpiOverview = this.currentRole !== 'principal';
        return `
        <div class="space-y-6">
            ${showKpiOverview ? `
            <div>
                ${this.chartTitle(scopeLabel + '绘本活动概览', 'bg-blue-500', '统计范围：当前所选时间范围内 ' + scopeLabel + ' 全部绘本活动。\n指标说明：\n· 绘本活动总次数：发起的绘本活动场次\n· 绘本活动总时长：所有活动累计时长\n· 绘本总数：参与活动覆盖的绘本数（去重）\n· 绘本阅读次数 / 时长：含教师朗读、AI 共读、自由阅读全部触达')}
                <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    ${this.miniStat('绘本活动总次数', d.activityTotal, 'blue')}
                    ${this.miniStat('绘本活动总时长', d.activityDuration + 'h', 'emerald')}
                    ${this.miniStat('绘本总数', d.bookTotal, 'purple')}
                    ${this.miniStat('绘本阅读次数', d.bookReadCount, 'amber')}
                    ${this.miniStat('绘本阅读时长', d.bookReadDuration + 'h', 'cyan')}
                </div>
            </div>` : ''}
            <div>
                ${this.chartTitle(scopeLabel + '大模型使用概况', 'bg-cyan-500', '统计范围：当前所选时间范围内的 AI 共读会话。\n指标说明：\n· 互动绘本数：触发过 AI 互动的不同绘本数（去重）\n· 互动对话数：所有 AI 会话的累计轮数\n用途：观察 AI 共读的覆盖广度与互动密度。')}
                <div class="grid grid-cols-2 gap-3">
                    ${this.miniStat('互动绘本数', d.llmBookCount, 'cyan')}
                    ${this.miniStat('互动对话数', d.llmChatCount, 'purple')}
                </div>
            </div>
            <div>
                ${this.chartTitle('绘本分类阅读数据', 'bg-emerald-500', '统计范围：当前所选时间范围内的全部阅读记录。\n口径：按绘本"类型"分组，统计阅读次数和阅读时长。\n用途：识别孩子近期偏好的内容分类，辅助选书与活动设计。')}
                ${this.currentRole === 'principal' ? `
                <div class="space-y-4">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                        <div class="rounded-xl border border-slate-500/30 bg-slate-700/40 p-3 flex flex-col">
                            <div class="text-xs text-slate-400 mb-1 px-1">类型阅读次数占比</div>
                            <div id="school-category-pie" class="flex-1 min-h-[260px]"></div>
                        </div>
                        <div class="rounded-xl border border-slate-500/30 bg-slate-700/40 p-3 flex flex-col">
                            <div class="text-xs text-slate-400 mb-1 px-1">幼儿阅读绘本-能力分布</div>
                            <div id="school-ability-distribution-chart" class="flex-1 min-h-[260px]"></div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 auto-rows-fr">
                        ${d.categoryData.map(cat => `
                            <div class="bg-slate-700/50 rounded-xl p-3 flex items-center justify-between border border-slate-500/30 hover:border-blue-400/30 transition-colors h-full">
                                <div><div class="text-sm font-medium text-slate-200">${cat.name}</div><div class="text-xs text-slate-500 mt-0.5">阅读时长 ${cat.duration}</div></div>
                                <div class="text-lg font-bold text-blue-400">${cat.readCount}<span class="text-xs text-slate-500 ml-1">次</span></div>
                            </div>
                        `).join('')}
                    </div>
                </div>` : `
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
                    <div class="lg:col-span-2 rounded-xl border border-slate-500/30 bg-slate-700/40 p-3 flex flex-col">
                        <div class="text-xs text-slate-400 mb-1 px-1">类型阅读次数占比</div>
                        <div id="school-category-pie" class="flex-1 min-h-[260px]"></div>
                    </div>
                    <div class="lg:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
                        ${d.categoryData.map(cat => `
                            <div class="bg-slate-700/50 rounded-xl p-3 flex items-center justify-between border border-slate-500/30 hover:border-blue-400/30 transition-colors h-full">
                                <div><div class="text-sm font-medium text-slate-200">${cat.name}</div><div class="text-xs text-slate-500 mt-0.5">阅读时长 ${cat.duration}</div></div>
                                <div class="text-lg font-bold text-blue-400">${cat.readCount}<span class="text-xs text-slate-500 ml-1">次</span></div>
                            </div>
                        `).join('')}
                    </div>
                </div>`}
            </div>
            ${this.currentRole !== 'admin' ? this.renderSchoolFavoriteBoard() : ''}
        </div>`;
    },

    initSchoolOverviewCharts() {
        // 绘本分类阅读饼图（园长 / 教师 / 管理员单园都渲染）
        const overviewData = this.getSchoolOverviewDataForCurrentRange();
        if (overviewData && overviewData.categoryData) {
            Charts.safeInit(() => Charts.initSchoolCategoryPie(overviewData.categoryData));
        }
        // 园长视角：能力分布气泡图（从大数据总览页迁移至此，放在类型占比旁）
        if (this.currentRole === 'principal') {
            Charts.safeInit(() => Charts.initAbilityRadar(this.computeAbilityDistributionForOverview(), 'school-ability-distribution-chart'));
        }
        // principal 视角的"班级开课情况变化"图（admin 单园弹窗 / teacher 不渲染，DOM 不存在自动短路）
        const dom = document.getElementById('school-class-activity-chart');
        if (!dom) return;
        const data = this.buildSchoolClassUsageSeries();
        Charts.safeInit(() => Charts.initSchoolClassActivityChart(data, this.schoolClassChart.types));
    },

    // 园所数据 - 绘本活动
    renderSchoolActivities() {
        const f = this.filters.activities;
        const p = this.pagination.activities;
        const isTeacher = this.isTeacherScope();
        let data = this.filterActivitiesByGlobalRange(MockData.schoolData.activities);
        if (isTeacher) data = data.filter(a => a.className === this.getTeacherClassName());
        if (f.className) data = data.filter(a => a.className.includes(f.className));
        if (f.teacher) data = data.filter(a => PinyinUtil.match(a.teacher, f.teacher));
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page - 1) * p.pageSize, p.page * p.pageSize);

        const classOptions = '<option value="">全部</option>' + [...new Set(MockData.schoolData.activities.map(a => a.className))].map(c => `<option value="${c}" ${f.className===c?'selected':''}>${c}</option>`).join('');

        const headers = [
            { label: '序号' }, { label: '活动开始时间' }, { label: '活动持续时长', align: 'text-center' },
            { label: '教师' }, { label: '参与班级' }, { label: '参与幼儿', align: 'text-center' }, { label: '操作', align: 'text-center' }
        ];
        const rows = pageData.map((a, i) => `
            <tr class="hover:bg-blue-500/10 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 text-slate-300">${a.startTime}</td>
                <td class="px-4 py-3 text-center text-slate-300">${this.formatActivityDuration(a.startTime, a.endTime)}</td>
                <td class="px-4 py-3 text-slate-200">${a.teacher}</td>
                <td class="px-4 py-3 text-slate-200">${a.className}</td>
                <td class="px-4 py-3 text-center text-slate-300">${a.studentCount}人</td>
                <td class="px-4 py-3 text-center"><button class="text-blue-400 hover:text-blue-300 text-sm" onclick="App.viewActivityDetail(${a.id})">查看</button></td>
            </tr>
        `).join('');

        return `
        <div>
            ${this.filterBar(`
                ${isTeacher ? '' : this.filterSelect('参与班级', classOptions, `onchange="App.filters.activities.className=this.value"`)}
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
        const isTeacher = this.isTeacherScope();
        const ratio = this.getSchoolRangeRatio();
        let data = isTeacher ? this.buildTeacherClassBooks() : MockData.schoolData.books;
        // 全局时间筛选：按比例缩放阅读次数与时长
        data = data.map(b => {
            const baseCount = Number(b.readCount) || 0;
            const scaledCount = ratio <= 0 ? 0 : Math.max(0, Math.round(baseCount * ratio));
            const durationMatch = String(b.readDuration || '').match(/([\d.]+)/);
            const durationNum = durationMatch ? parseFloat(durationMatch[1]) : 0;
            const durationUnit = String(b.readDuration || '').replace(durationMatch ? durationMatch[1] : '', '').trim();
            const scaledDuration = ratio <= 0 ? 0 : durationNum * ratio;
            return {
                ...b,
                readCount: scaledCount,
                readDurationNum: scaledDuration,
                readDuration: durationMatch ? `${scaledDuration.toFixed(2)}${durationUnit}` : b.readDuration
            };
        });
        if (f.type) data = data.filter(b => b.type.includes(f.type));
        if (f.name) data = data.filter(b => b.name.includes(f.name));
        if (f.isbn) data = data.filter(b => b.isbn.includes(f.isbn));
        data = this.sortByKey(data, this.schoolSort.books);
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);

        const typeOptions = '<option value="">全部</option>' + ['日常生活','人际交往','情商品格','国学文化','科普百科','语言学习'].map(t => `<option value="${t}" ${f.type===t?'selected':''}>${t}</option>`).join('');
        const maxRead = Math.max(1, ...data.map(b => b.readCount));
        const maxDur = Math.max(1, ...data.map(b => b.readDurationNum || 0));
        const sumRead = data.reduce((s, b) => s + b.readCount, 0);
        const avgRead = data.length ? sumRead / data.length : 0;
        const headers = [
            { label: '序号' },
            { label: '绘本名称' },
            { label: 'ISBN号' },
            { label: '绘本类型' },
            { label: '阅读次数', align: 'text-center', sortKey: 'readCount', sortScope: 'books' },
            { label: '阅读时长', align: 'text-center', sortKey: 'readDurationNum', sortScope: 'books' },
            { label: '操作', align: 'text-center' }
        ];
        const summary = `<tr class="compare-summary-row">
            <td colspan="4" class="text-left">
                <span class="summary-label">绘本数</span><span class="summary-value">${total}</span>
                <span class="summary-label" style="margin-left:16px">书均阅读</span><span class="summary-value">${avgRead.toFixed(1)}</span>
            </td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumRead}</span></td>
            <td class="text-center text-slate-500">—</td>
            <td></td>
        </tr>`;
        const rows = pageData.map((b,i) => `
            <tr class="hover:bg-blue-500/10 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${b.name}</td>
                <td class="px-4 py-3 text-slate-500 text-xs">${b.isbn}</td>
                <td class="px-4 py-3">${this.badge(b.type)}</td>
                ${this.barCell(b.readCount, maxRead)}
                ${this.barCell(b.readDurationNum || 0, maxDur, { format: () => b.readDuration })}
                <td class="px-4 py-3 text-center"><button class="text-blue-400 hover:text-blue-300 text-sm" onclick="App.viewBookDetail(${b.id})">查看</button></td>
            </tr>`).join('');

        const teacherHint = isTeacher ? (() => {
            const stats = this.selectedClass.bookTypeStats || {};
            const totalReads = Object.values(stats).reduce((a,b)=>a+b,0);
            const typeCount = Object.keys(stats).length;
            return `<div class="mb-3 text-xs text-slate-400">本班共阅读 <span class="text-blue-400 font-semibold">${totalReads}</span> 次，覆盖 <span class="text-blue-400 font-semibold">${typeCount}</span> 个绘本类型</div>`;
        })() : '';

        return `<div>
            ${teacherHint}
            ${this.filterBar(`
                ${this.filterSelect('绘本类型', typeOptions, `onchange="App.filters.books.type=this.value"`)}
                ${this.filterInput('绘本名称', `placeholder="请输入绘本名称" value="${f.name}" oninput="App.filters.books.name=this.value"`)}
                ${this.filterInput('ISBN号', `placeholder="请输入ISBN号" value="${f.isbn}" oninput="App.filters.books.isbn=this.value"`)}
                ${this.btnPrimary('查询', "App.pagination.books.page=1;App.renderSchoolTabContent('books')")}
                ${this.btnSecondary('重置', "App.filters.books={type:'',name:'',isbn:''};App.pagination.books.page=1;App.renderSchoolTabContent('books')")}
            `)}
            ${this.tableWrap(headers, rows, { summary })}
            ${this.renderPagination(total, p.page, totalPages, 'books')}
        </div>`;
    },

    buildTeacherClassBooks() {
        const cls = this.selectedClass;
        const stats = cls?.bookTypeStats || {};
        const grouped = {};
        MockData.schoolData.books.forEach(b => {
            if (stats[b.type] != null) {
                (grouped[b.type] = grouped[b.type] || []).push(b);
            }
        });
        const out = [];
        Object.entries(stats).forEach(([type, total]) => {
            const list = (grouped[type] || []).slice(0, 3);
            if (!list.length || total <= 0) return;
            const per = Math.max(1, Math.floor(total / list.length));
            list.forEach((b, i) => {
                const reads = i === 0 ? total - per * (list.length - 1) : per;
                out.push({
                    ...b,
                    readCount: Math.max(0, reads),
                    readDuration: `${(reads * 0.05).toFixed(2)}h`
                });
            });
        });
        return out.sort((a, b) => b.readCount - a.readCount);
    },

    // 园所数据 - 班级
    renderSchoolClasses() {
        const p = this.pagination.classes;
        const f = this.filters.classes;
        const isTeacher = this.isTeacherScope();
        const ratio = this.getSchoolRangeRatio();
        let data = MockData.classes;
        if (isTeacher) data = data.filter(c => c.id === this.selectedClass.id);
        // 班级筛选：班级名 / 教师姓名（支持中文 + 拼音首字母）
        if (!isTeacher) {
            if (f.name) data = data.filter(c => PinyinUtil.match(c.name, f.name));
            if (f.teacher) data = data.filter(c => {
                const teachers = (c.teachers || []).map(t => t.name).concat(c.teacherName || '');
                return teachers.some(name => PinyinUtil.match(name, f.teacher));
            });
        }
        // 全局时间筛选：按比例缩放活动次数/时长/参与人次/设备使用次数
        data = data.map(c => {
            const scaleCount = v => ratio <= 0 ? 0 : Math.max(0, Math.round((Number(v) || 0) * ratio));
            const durationMatch = String(c.activityDuration || '').match(/([\d.]+)/);
            const durationNum = durationMatch ? parseFloat(durationMatch[1]) : 0;
            const durationUnit = String(c.activityDuration || '').replace(durationMatch ? durationMatch[1] : '', '').trim();
            const scaledDuration = ratio <= 0 ? 0 : durationNum * ratio;
            const scaledParticipant = scaleCount(c.participantCount);
            // 累计阅读绘本时长 ≈ 参与人次 × 活动时长 × 0.6（粗略口径：活动中孩子合计阅读绘本时间）
            const cumulativeReadingHours = scaledDuration * scaledParticipant * 0.6;
            return {
                ...c,
                activityCount: scaleCount(c.activityCount),
                activityDurationNum: scaledDuration,
                activityDuration: durationMatch ? `${scaledDuration.toFixed(1)}${durationUnit}` : c.activityDuration,
                deviceUseCount: scaleCount(c.deviceUseCount),
                participantCount: scaledParticipant,
                cumulativeReadingNum: cumulativeReadingHours,
                cumulativeReadingText: `${cumulativeReadingHours.toFixed(1)}h`
            };
        });
        // 排序
        data = this.sortByKey(data, this.schoolSort.classes);
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);

        // 各列最大值：用于条件格式背景条计算百分位
        const maxActivity = Math.max(1, ...data.map(c => c.activityCount));
        const maxDuration = Math.max(1, ...data.map(c => c.activityDurationNum || 0));
        const maxDevice = Math.max(1, ...data.map(c => c.deviceUseCount));
        const maxParticipant = Math.max(1, ...data.map(c => c.participantCount));
        const maxReading = Math.max(1, ...data.map(c => c.cumulativeReadingNum || 0));
        const avgActivity = data.length ? data.reduce((s, c) => s + c.activityCount, 0) / data.length : 0;
        const avgParticipant = data.length ? data.reduce((s, c) => s + c.participantCount, 0) / data.length : 0;
        const sumActivity = data.reduce((s, c) => s + c.activityCount, 0);
        const sumParticipant = data.reduce((s, c) => s + c.participantCount, 0);
        const sumReading = Math.round(data.reduce((s, c) => s + (c.cumulativeReadingNum || 0), 0) * 10) / 10;

        const headers = [
            {label:'序号'},
            {label:'班级'},
            {label:'教师数量', align:'text-center'},
            {label:'幼儿数量', align:'text-center'},
            {label:'活动总次数', align:'text-center', sortKey:'activityCount', sortScope:'classes'},
            {label:'活动总时长', align:'text-center', sortKey:'activityDurationNum', sortScope:'classes'},
            {label:'设备使用次数', align:'text-center', sortKey:'deviceUseCount', sortScope:'classes'},
            {label:'参与总人次', align:'text-center', sortKey:'participantCount', sortScope:'classes'},
            {label:'累计阅读绘本时长', align:'text-center', sortKey:'cumulativeReadingNum', sortScope:'classes'},
            {label:'操作', align:'text-center'}
        ];
        const summary = isTeacher ? '' : `<tr class="compare-summary-row">
            <td colspan="4" class="text-left">
                <span class="summary-label">班级总数</span><span class="summary-value">${total}</span>
                <span class="summary-label" style="margin-left:16px">班均活动</span><span class="summary-value">${avgActivity.toFixed(1)}</span>
                <span class="summary-label" style="margin-left:16px">班均参与</span><span class="summary-value">${avgParticipant.toFixed(1)}</span>
            </td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumActivity}</span></td>
            <td class="text-center text-slate-500">—</td>
            <td class="text-center text-slate-500">—</td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumParticipant}</span></td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumReading}h</span></td>
            <td></td>
        </tr>`;
        const rows = pageData.map((c,i) => {
            const lowAct = c.activityCount < avgActivity * 0.5;
            const highAct = c.activityCount >= avgActivity * 1.2;
            return `
            <tr class="hover:bg-blue-500/10 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${c.name}</td>
                <td class="px-4 py-3 text-center text-slate-300">${c.teacherCount}</td>
                <td class="px-4 py-3 text-center text-slate-300">${c.studentCount}</td>
                ${this.barCell(c.activityCount, maxActivity, { extraClass: highAct ? 'is-high' : (lowAct ? 'is-low' : '') })}
                ${this.barCell(c.activityDurationNum || 0, maxDuration, { format: () => c.activityDuration })}
                ${this.barCell(c.deviceUseCount, maxDevice)}
                ${this.barCell(c.participantCount, maxParticipant)}
                ${this.barCell(c.cumulativeReadingNum || 0, maxReading, { format: () => c.cumulativeReadingText })}
                <td class="px-4 py-3 text-center"><button class="text-blue-400 hover:text-blue-300 text-sm" onclick="App.viewClassDetail(${c.id})">查看</button></td>
            </tr>`;
        }).join('');
        return `<div>
            ${isTeacher ? '' : this.filterBar(`
                ${this.filterInput('班级名称', `placeholder="如 大一班 / dyb" value="${f.name}" oninput="App.filters.classes.name=this.value"`)}
                ${this.filterInput('教师姓名', `placeholder="如 张晓梅 / zxm" value="${f.teacher}" oninput="App.filters.classes.teacher=this.value"`)}
                ${this.btnPrimary('查询', "App.pagination.classes.page=1;App.renderSchoolTabContent('classes')")}
                ${this.btnSecondary('重置', "App.filters.classes={name:'',teacher:''};App.pagination.classes.page=1;App.renderSchoolTabContent('classes')")}
            `)}
            ${this.tableWrap(headers, rows, { summary })}
            ${this.renderPagination(total, p.page, totalPages, 'classes')}
        </div>`;
    },

    // 园所数据 - 教师
    renderSchoolTeachers() {
        const f = this.filters.teachers;
        const p = this.pagination.teachers;
        const isTeacher = this.isTeacherScope();
        const ratio = this.getSchoolRangeRatio();
        let data;
        if (isTeacher) {
            data = (this.selectedClass.teachers || []).map((t, i) => ({ id: i + 1, ...t }));
        } else {
            data = MockData.schoolData.teachers;
            if (f.name) data = data.filter(t => PinyinUtil.match(t.name, f.name));
        }
        // 全局时间筛选：按比例缩放活动次数与时长
        data = data.map(t => {
            const durationMatch = String(t.activityDuration || '').match(/([\d.]+)/);
            const durationNum = durationMatch ? parseFloat(durationMatch[1]) : 0;
            const durationUnit = String(t.activityDuration || '').replace(durationMatch ? durationMatch[1] : '', '').trim();
            const scaledDuration = ratio <= 0 ? 0 : durationNum * ratio;
            return {
                ...t,
                activityCount: ratio <= 0 ? 0 : Math.max(0, Math.round((Number(t.activityCount) || 0) * ratio)),
                activityDurationNum: scaledDuration,
                activityDuration: durationMatch ? `${scaledDuration.toFixed(1)}${durationUnit}` : t.activityDuration
            };
        });
        data = this.sortByKey(data, this.schoolSort.teachers);
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);

        const maxAct = Math.max(1, ...data.map(t => t.activityCount));
        const maxDur = Math.max(1, ...data.map(t => t.activityDurationNum || 0));
        const sumAct = data.reduce((s, t) => s + t.activityCount, 0);
        const avgAct = data.length ? sumAct / data.length : 0;

        const headers = [
            {label:'序号'},
            {label:'教师姓名'},
            {label:'绘本活动次数', align:'text-center', sortKey:'activityCount', sortScope:'teachers'},
            {label:'绘本活动时长', align:'text-center', sortKey:'activityDurationNum', sortScope:'teachers'},
            {label:'操作', align:'text-center'}
        ];
        const summary = isTeacher ? '' : `<tr class="compare-summary-row">
            <td colspan="2" class="text-left">
                <span class="summary-label">教师总数</span><span class="summary-value">${total}</span>
                <span class="summary-label" style="margin-left:16px">人均活动</span><span class="summary-value">${avgAct.toFixed(1)}</span>
            </td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumAct}</span></td>
            <td class="text-center text-slate-500">—</td>
            <td></td>
        </tr>`;
        const rows = pageData.map((t,i) => `
            <tr class="hover:bg-blue-500/10 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${t.name}</td>
                ${this.barCell(t.activityCount, maxAct)}
                ${this.barCell(t.activityDurationNum || 0, maxDur, { format: () => t.activityDuration })}
                <td class="px-4 py-3 text-center"><button class="text-blue-400 hover:text-blue-300 text-sm" onclick="App.viewTeacherActivities('${t.name}')">查看绘本活动记录</button></td>
            </tr>`).join('');
        return `<div>
            ${isTeacher ? '' : this.filterBar(`
                ${this.filterInput('教师姓名', `placeholder="请输入教师姓名" value="${f.name}" oninput="App.filters.teachers.name=this.value"`)}
                ${this.btnPrimary('查询', "App.pagination.teachers.page=1;App.renderSchoolTabContent('teachers')")}
                ${this.btnSecondary('重置', "App.filters.teachers={name:''};App.pagination.teachers.page=1;App.renderSchoolTabContent('teachers')")}
            `)}
            ${this.tableWrap(headers, rows, { summary })}
            ${this.renderPagination(total, p.page, totalPages, 'teachers')}
        </div>`;
    },

    // 园所数据 - 幼儿
    renderSchoolStudents() {
        const f = this.filters.students;
        const p = this.pagination.students;
        const isTeacher = this.isTeacherScope();
        const ratio = this.getSchoolRangeRatio();
        let data = MockData.students;
        if (isTeacher) data = data.filter(s => s.classId === this.selectedClass.id);
        if (f.name) data = data.filter(s => PinyinUtil.match(s.name, f.name));
        if (f.className) data = data.filter(s => s.className.includes(f.className));
        // 全局时间筛选：按比例缩放参与活动次数/时长/绘本总数
        data = data.map(s => {
            const durationMatch = String(s.activityDuration || '').match(/([\d.]+)/);
            const durationNum = durationMatch ? parseFloat(durationMatch[1]) : 0;
            const durationUnit = String(s.activityDuration || '').replace(durationMatch ? durationMatch[1] : '', '').trim();
            const scaledDuration = ratio <= 0 ? 0 : durationNum * ratio;
            const scaleCount = v => ratio <= 0 ? 0 : Math.max(0, Math.round((Number(v) || 0) * ratio));
            return {
                ...s,
                activityCount: scaleCount(s.activityCount),
                activityDurationNum: scaledDuration,
                activityDuration: durationMatch ? `${scaledDuration.toFixed(1)}${durationUnit}` : s.activityDuration,
                bookCount: scaleCount(s.bookCount)
            };
        });
        data = this.sortByKey(data, this.schoolSort.students);
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);
        const classOptions = '<option value="">全部</option>' + [...new Set(MockData.students.map(s => s.className))].map(c => `<option value="${c}" ${f.className===c?'selected':''}>${c}</option>`).join('');

        const maxAct = Math.max(1, ...data.map(s => s.activityCount));
        const maxDur = Math.max(1, ...data.map(s => s.activityDurationNum || 0));
        const maxBook = Math.max(1, ...data.map(s => s.bookCount));
        const sumAct = data.reduce((s, x) => s + x.activityCount, 0);
        const avgAct = data.length ? sumAct / data.length : 0;

        const headers = [
            {label:'序号'},
            {label:'幼儿姓名'},
            {label:'幼儿编号'},
            {label:'所属班级'},
            {label:'参与活动次数', align:'text-center', sortKey:'activityCount', sortScope:'students'},
            {label:'参与活动时长', align:'text-center', sortKey:'activityDurationNum', sortScope:'students'},
            {label:'绘本总数', align:'text-center', sortKey:'bookCount', sortScope:'students'},
            {label:'操作', align:'text-center'}
        ];
        const summary = `<tr class="compare-summary-row">
            <td colspan="4" class="text-left">
                <span class="summary-label">幼儿总数</span><span class="summary-value">${total}</span>
                <span class="summary-label" style="margin-left:16px">人均活动</span><span class="summary-value">${avgAct.toFixed(1)}</span>
            </td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumAct}</span></td>
            <td class="text-center text-slate-500">—</td>
            <td class="text-center text-slate-500">—</td>
            <td></td>
        </tr>`;
        const rows = pageData.map((s,i) => `
            <tr class="hover:bg-blue-500/10 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${s.name}</td>
                <td class="px-4 py-3 text-slate-500 text-xs">${s.code}</td>
                <td class="px-4 py-3 text-slate-300">${s.className}</td>
                ${this.barCell(s.activityCount, maxAct)}
                ${this.barCell(s.activityDurationNum || 0, maxDur, { format: () => s.activityDuration })}
                ${this.barCell(s.bookCount, maxBook)}
                <td class="px-4 py-3 text-center"><button class="text-blue-400 hover:text-blue-300 text-sm" onclick="App.viewStudentReport(${s.id})">查看阅读报告</button></td>
            </tr>`).join('');
        return `<div>
            ${this.filterBar(`
                ${this.filterInput('幼儿姓名', `placeholder="请输入幼儿姓名" value="${f.name}" oninput="App.filters.students.name=this.value"`)}
                ${isTeacher ? '' : this.filterSelect('所属班级', classOptions, `onchange="App.filters.students.className=this.value"`)}
                ${this.btnPrimary('查询', "App.pagination.students.page=1;App.renderSchoolTabContent('students')")}
                ${this.btnSecondary('重置', "App.filters.students={name:'',className:''};App.pagination.students.page=1;App.renderSchoolTabContent('students')")}
            `)}
            ${this.tableWrap(headers, rows, { summary })}
            ${this.renderPagination(total, p.page, totalPages, 'students')}
        </div>`;
    },

    // 园所数据 - 设备
    renderSchoolDevices() {
        const f = this.filters.devices;
        const p = this.pagination.devices;
        const ratio = this.getSchoolRangeRatio();
        let data = MockData.devices;
        if (f.sn) data = data.filter(d => d.sn.includes(f.sn));
        // 全局时间筛选：按比例缩放使用次数与时长
        data = data.map(d => {
            const durationMatch = String(d.useDuration || '').match(/([\d.]+)/);
            const durationNum = durationMatch ? parseFloat(durationMatch[1]) : 0;
            const durationUnit = String(d.useDuration || '').replace(durationMatch ? durationMatch[1] : '', '').trim();
            const scaledDuration = ratio <= 0 ? 0 : durationNum * ratio;
            return {
                ...d,
                useCount: ratio <= 0 ? 0 : Math.max(0, Math.round((Number(d.useCount) || 0) * ratio)),
                useDurationNum: scaledDuration,
                useDuration: durationMatch ? `${scaledDuration.toFixed(1)}${durationUnit}` : d.useDuration
            };
        });
        data = this.sortByKey(data, this.schoolSort.devices);
        const total = data.length;
        const totalPages = Math.ceil(total / p.pageSize);
        const pageData = data.slice((p.page-1)*p.pageSize, p.page*p.pageSize);

        const maxCount = Math.max(1, ...data.map(d => d.useCount));
        const maxDur = Math.max(1, ...data.map(d => d.useDurationNum || 0));
        const sumCount = data.reduce((s, d) => s + d.useCount, 0);
        const avgCount = data.length ? sumCount / data.length : 0;

        const headers = [
            {label:'序号'},
            {label:'设备SN号'},
            {label:'设备编号'},
            {label:'设备使用次数', align:'text-center', sortKey:'useCount', sortScope:'devices'},
            {label:'设备使用时长', align:'text-center', sortKey:'useDurationNum', sortScope:'devices'},
            {label:'最近使用时间', align:'text-center'}
        ];
        const summary = `<tr class="compare-summary-row">
            <td colspan="3" class="text-left">
                <span class="summary-label">设备总数</span><span class="summary-value">${total}</span>
                <span class="summary-label" style="margin-left:16px">台均使用</span><span class="summary-value">${avgCount.toFixed(1)}</span>
            </td>
            <td class="text-center"><span class="summary-label">合计</span><span class="summary-value">${sumCount}</span></td>
            <td class="text-center text-slate-500">—</td>
            <td></td>
        </tr>`;
        const rows = pageData.map((d,i) => `
            <tr class="hover:bg-blue-500/10 transition-colors">
                <td class="px-4 py-3 text-slate-500">${(p.page-1)*p.pageSize+i+1}</td>
                <td class="px-4 py-3 font-medium text-slate-200">${d.sn}</td>
                <td class="px-4 py-3 text-slate-400">${d.code}</td>
                ${this.barCell(d.useCount, maxCount, { format: () => d.useCount + '次' })}
                <td class="px-4 py-3 text-center text-slate-300">${d.useDuration}</td>
                <td class="px-4 py-3 text-center text-slate-500">${d.lastUseTime || '-'}</td>
            </tr>`).join('');
        return `<div>
            ${this.filterBar(`
                ${this.filterInput('设备SN号', `placeholder="请输入" value="${f.sn}" oninput="App.filters.devices.sn=this.value"`)}
                ${this.btnPrimary('查询', "App.pagination.devices.page=1;App.renderSchoolTabContent('devices')")}
                ${this.btnSecondary('重置', "App.filters.devices={sn:''};App.pagination.devices.page=1;App.renderSchoolTabContent('devices')")}
            `)}
            ${this.tableWrap(headers, rows, { summary })}
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
            <tr class="hover:bg-blue-500/10 transition-colors">
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
            <tr class="hover:bg-blue-500/10 transition-colors">
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
        return `<div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-white">${title}</h3><button class="text-slate-400 hover:text-white transition-colors" onclick="App.closeModalDirect()"><svg class="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`;
    },

    modalInfoItem(label, value) {
        return `<div class="bg-slate-800/60 rounded-lg p-3 border border-slate-700/30"><span class="text-slate-500 text-sm">${label}：</span><span class="text-slate-200 font-medium">${value}</span></div>`;
    },

    viewActivityDetail(id, mode = 'modal') {
        const a = MockData.schoolData.activities.find(x => x.id === id);
        if (!a) return;
        
        // 计算活动时长（小时）
        const start = new Date(a.startTime);
        const end = new Date(a.endTime);
        const durationHours = ((end - start) / (1000 * 60 * 60)).toFixed(2);
        
        // 计算幼儿参与占比
        const participatingCount = a.participatingStudents?.length || 0;
        const participationRate = a.studentCount > 0 ? Math.round((participatingCount / a.studentCount) * 100) : 0;
        
        // 生成参与幼儿表格
        const studentHeaders = [{label:'序号', align:'text-center', width:'w-16'}, {label:'姓名'}, {label:'幼儿编号'}, {label:'设备编号'}];
        const studentRows = a.participatingStudents?.length > 0 
            ? a.participatingStudents.map((s, idx) => `
                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td class="px-4 py-3 text-center text-slate-300">${idx + 1}</td>
                    <td class="px-4 py-3 text-slate-200">${s.name}</td>
                    <td class="px-4 py-3 text-slate-400 text-sm">${s.code}</td>
                    <td class="px-4 py-3 text-slate-400 text-sm">${s.deviceId}</td>
                </tr>
            `).join('')
            : `<tr><td colspan="4" class="px-4 py-8 text-center text-slate-500">暂无数据</td></tr>`;
        
        // 生成绘本类型统计
        const bookTypeStats = {};
        a.readBooks?.forEach(b => {
            bookTypeStats[b.type] = (bookTypeStats[b.type] || 0) + 1;
        });
        const bookTypeHtml = Object.entries(bookTypeStats).length > 0
            ? Object.entries(bookTypeStats).map(([type, count]) => `
                <div class="flex items-center justify-between py-1.5 px-2 rounded bg-blue-500/10 border border-blue-500/20">
                    <span class="text-slate-300 text-sm">${type}</span>
                    <span class="text-blue-400 text-sm font-medium">${count}本</span>
                </div>
            `).join('')
            : '<span class="text-slate-500 text-sm">抱歉，没有统计到阅读数据，无法分析类型占比</span>';
        
        // 标题栏按钮
        const headerActions = mode === 'modal' 
            ? `<button onclick="App.viewActivityDetail(${a.id}, 'subpage')" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors flex items-center gap-2 mr-2" title="在当前页面打开">
                <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                打开
            </button>`
            : `<button onclick="App.closeActivitySubpage()" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors flex items-center gap-2 mr-2">
                <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                关闭
            </button>`;
        
        const content = `
            <div class="p-6 max-w-6xl mx-auto">
                <!-- 标题栏 -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white">绘本活动详情</h2>
                    <div class="flex items-center">${headerActions}</div>
                </div>
                
                <!-- 活动信息概览 + 参与幼儿 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <!-- 左侧：活动信息概览 -->
                    <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                        <div class="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50">
                            <h3 class="text-sm font-semibold text-slate-200">活动信息概览</h3>
                        </div>
                        <div class="p-4 space-y-3">
                            <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                <span class="text-slate-400 text-sm">教师：</span>
                                <span class="text-slate-200">${a.teacher}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                <span class="text-slate-400 text-sm">活动时长：</span>
                                <span class="text-slate-200">${durationHours}h</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                <span class="text-slate-400 text-sm">开始-结束时间：</span>
                                <span class="text-slate-200 text-sm">${a.startTime} - ${a.endTime.slice(11, 19)}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                <span class="text-slate-400 text-sm">参与班级：</span>
                                <span class="text-slate-200">${a.className}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                <span class="text-slate-400 text-sm">幼儿参与占比：</span>
                                <span class="text-slate-200">${participatingCount}/${a.studentCount} ${participationRate}%</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                <span class="text-slate-400 text-sm">共计阅读绘本数量：</span>
                                <span class="text-slate-200">${a.readBooks?.length || 0}本</span>
                            </div>
                            <div class="py-2">
                                <span class="text-slate-400 text-sm block mb-2">阅读绘本类型占比：</span>
                                <div class="grid grid-cols-2 gap-2">${bookTypeHtml}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 右侧：参与幼儿 -->
                    <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                        <div class="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50 flex justify-between items-center">
                            <h3 class="text-sm font-semibold text-slate-200">参与幼儿</h3>
                            <span class="text-xs text-slate-400">${participatingCount}人</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-slate-700/20">
                                    <tr>
                                        ${studentHeaders.map(h => `<th class="px-4 py-3 text-left text-xs font-medium text-slate-400 ${h.align || ''} ${h.width || ''}">${h.label}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>${studentRows}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- 推送信息 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden mb-6">
                    <div class="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50">
                        <h3 class="text-sm font-semibold text-slate-200">推送信息</h3>
                    </div>
                    <div class="p-4">
                        <div class="flex items-center gap-2">
                            <span class="text-slate-400 text-sm">推送状态：</span>
                            <span class="${a.pushStatus === '已推送' ? 'text-emerald-400' : 'text-amber-400'}">${a.pushStatus}</span>
                        </div>
                    </div>
                </div>
                
                <!-- 幼儿阅读数据 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                    <div class="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50">
                        <h3 class="text-sm font-semibold text-slate-200">幼儿阅读数据</h3>
                    </div>
                    <div class="p-8 text-center">
                        ${a.hasReadingData 
                            ? '<p class="text-slate-400">阅读数据已记录</p>'
                            : '<p class="text-slate-500">数据为空：因教师在活动过程中没有选择幼儿，所以无法生成幼儿阅读记录。</p>'
                        }
                    </div>
                </div>
            </div>
        `;
        
        if (mode === 'subpage') {
            // 子页面模式：先关闭弹窗，然后在当前标签页内容区域内渲染
            this.closeModal();
            this.openActivitySubpage(content);
        } else {
            // 弹窗模式：使用原有弹窗
            this.openModal(content);
        }
    },
    
    // 打开活动详情子页面（在当前标签页内容区域内）
    openActivitySubpage(html) {
        // 找到当前标签页内容容器
        const tabContent = document.getElementById('school-tab-content');
        if (!tabContent) return;

        // 保存当前 tab 状态
        this._previousSchoolDataTab = this.schoolDataTab;

        // 保存原始内容
        this._originalTabContent = tabContent.innerHTML;

        // 创建子页面容器
        const subpageContainer = document.createElement('div');
        subpageContainer.id = 'activity-subpage-container';
        subpageContainer.className = 'animate-fadeIn';
        subpageContainer.innerHTML = html;
        
        // 清空并插入子页面
        tabContent.innerHTML = '';
        tabContent.appendChild(subpageContainer);
        
        // 隐藏筛选栏（如果存在）
        const filterBar = tabContent.previousElementSibling;
        if (filterBar && filterBar.classList.contains('filter-bar')) {
            filterBar.style.display = 'none';
            this._hiddenFilterBar = filterBar;
        }
    },
    
    // 关闭活动详情子页面
    closeActivitySubpage() {
        const tabContent = document.getElementById('school-tab-content');
        if (!tabContent) return;

        // 恢复筛选栏
        if (this._hiddenFilterBar) {
            this._hiddenFilterBar.style.display = '';
            this._hiddenFilterBar = null;
        }

        // 恢复到之前保存的 tab 状态
        const previousTab = this._previousSchoolDataTab || 'activities';
        this.schoolDataTab = previousTab;
        this.renderSchoolTabContent(previousTab);

        // 同步更新 tab 高亮状态
        document.querySelectorAll('.school-tab').forEach(tab => {
            tab.className = this.getSchoolTabClass(tab.dataset.tab === previousTab);
        });

        // 清理保存的内容
        this._originalTabContent = null;
        this._previousSchoolDataTab = null;
    },

    viewBookDetail(id, mode = 'modal') {
        const original = MockData.schoolData.books.find(x => x.id === id);
        if (!original) return;
        // 按全局时间筛选缩放阅读次数与时长
        const ratio = this.getSchoolRangeRatio();
        const baseCount = Number(original.readCount) || 0;
        const scaledCount = ratio <= 0 ? 0 : Math.max(0, Math.round(baseCount * ratio));
        const durationMatch = String(original.readDuration || '').match(/([\d.]+)/);
        const durationNum = durationMatch ? parseFloat(durationMatch[1]) : 0;
        const durationUnit = String(original.readDuration || '').replace(durationMatch ? durationMatch[1] : '', '').trim();
        const scaledDuration = ratio <= 0 ? 0 : durationNum * ratio;
        const b = {
            ...original,
            readCount: scaledCount,
            readDuration: durationMatch ? `${scaledDuration.toFixed(2)}${durationUnit}` : original.readDuration,
            readingStudents: this.filterReadingStudentsByGlobalRange(original.readingStudents)
        };
        
        // 生成幼儿阅读数据表格
        const studentHeaders = [
            {label: '序号', align: 'text-center', width: 'w-16'},
            {label: '幼儿姓名'},
            {label: '幼儿编号'},
            {label: '所属班级'},
            {label: '阅读开始时间'},
            {label: '阅读结束时间'},
            {label: '阅读时长'},
            {label: '是否读完', align: 'text-center'}
        ];
        
        const studentRows = b.readingStudents?.length > 0
            ? b.readingStudents.map((s, idx) => `
                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td class="px-4 py-3 text-center text-slate-300">${idx + 1}</td>
                    <td class="px-4 py-3 text-slate-200">${s.name}</td>
                    <td class="px-4 py-3 text-slate-400 text-sm">${s.code}</td>
                    <td class="px-4 py-3 text-slate-300">${s.className}</td>
                    <td class="px-4 py-3 text-slate-400 text-sm">${s.startTime}</td>
                    <td class="px-4 py-3 text-slate-400 text-sm">${s.endTime}</td>
                    <td class="px-4 py-3 text-slate-300">${s.duration}</td>
                    <td class="px-4 py-3 text-center">
                        <span class="${s.isCompleted === '已读完' ? 'text-emerald-400' : 'text-amber-400'}">${s.isCompleted}</span>
                    </td>
                </tr>
            `).join('')
            : `<tr><td colspan="8" class="px-4 py-8 text-center text-slate-500">暂无阅读数据</td></tr>`;
        
        // 标题栏按钮
        const headerActions = mode === 'modal'
            ? `<button onclick="App.viewBookDetail(${b.id}, 'subpage')" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors flex items-center gap-2 mr-2" title="在当前页面打开">
                <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                打开
            </button>`
            : `<button onclick="App.closeBookSubpage()" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors flex items-center gap-2 mr-2">
                <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                关闭
            </button>`;
        
        const content = `
            <div class="p-6 max-w-6xl mx-auto">
                <!-- 标题栏 -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white">绘本详情</h2>
                    <div class="flex items-center">${headerActions}</div>
                </div>
                
                <!-- 绘本信息 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden mb-6">
                    <div class="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50">
                        <h3 class="text-sm font-semibold text-slate-200">绘本信息</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-700/20">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">绘本名称</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">ISBN号</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">绘本类型</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">阅读次数</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">阅读时长</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-slate-700/50">
                                    <td class="px-4 py-3 text-slate-200">${b.name}</td>
                                    <td class="px-4 py-3 text-slate-400 text-sm">${b.isbn}</td>
                                    <td class="px-4 py-3 text-slate-300">${b.type}</td>
                                    <td class="px-4 py-3 text-blue-400">${b.readCount}次</td>
                                    <td class="px-4 py-3 text-slate-300">${b.readDuration}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- 幼儿阅读数据 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                    <div class="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50">
                        <h3 class="text-sm font-semibold text-slate-200">幼儿阅读数据</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-700/20">
                                <tr>
                                    ${studentHeaders.map(h => `<th class="px-4 py-3 text-left text-xs font-medium text-slate-400 ${h.align || ''} ${h.width || ''}">${h.label}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>${studentRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        if (mode === 'subpage') {
            // 子页面模式：先关闭弹窗，然后在当前标签页内容区域内渲染
            this.closeModal();
            this.openBookSubpage(content);
        } else {
            // 弹窗模式：使用原有弹窗
            this.openModal(content);
        }
    },
    
    // 打开绘本详情子页面（在当前标签页内容区域内）
    openBookSubpage(html) {
        // 找到当前标签页内容容器
        const tabContent = document.getElementById('school-tab-content');
        if (!tabContent) return;
        
        // 保存原始内容
        this._originalBookTabContent = tabContent.innerHTML;
        
        // 创建子页面容器
        const subpageContainer = document.createElement('div');
        subpageContainer.id = 'book-subpage-container';
        subpageContainer.className = 'animate-fadeIn';
        subpageContainer.innerHTML = html;
        
        // 清空并插入子页面
        tabContent.innerHTML = '';
        tabContent.appendChild(subpageContainer);
        
        // 隐藏筛选栏（如果存在）
        const filterBar = tabContent.previousElementSibling;
        if (filterBar && filterBar.classList.contains('filter-bar')) {
            filterBar.style.display = 'none';
            this._hiddenBookFilterBar = filterBar;
        }
    },
    
    // 关闭绘本详情子页面
    closeBookSubpage() {
        const tabContent = document.getElementById('school-tab-content');
        if (!tabContent) return;
        
        // 恢复筛选栏
        if (this._hiddenBookFilterBar) {
            this._hiddenBookFilterBar.style.display = '';
            this._hiddenBookFilterBar = null;
        }
        
        // 恢复到绘本列表界面
        this.schoolDataTab = 'books';
        this.renderSchoolTabContent('books');
        
        // 清理保存的内容
        this._originalBookTabContent = null;
    },

    // 根据 schoolOverview 时间筛选生成班级报告的时间轴（日/月）
    buildClassReportTimeline() {
        const range = this.dateRanges.schoolOverview || {};
        const start = range?.startDate ? new Date(`${range.startDate}T00:00:00`) : null;
        const end = range?.endDate ? new Date(`${range.endDate}T23:59:59`) : null;
        const granularity = this.getOverviewSeriesGranularity(range);
        const dates = [];
        if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
            if (granularity === 'month') {
                const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
                const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
                while (cursor <= endMonth) {
                    dates.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
                    cursor.setMonth(cursor.getMonth() + 1);
                }
            } else {
                const cursor = new Date(start);
                cursor.setHours(0, 0, 0, 0);
                const endDate = new Date(end);
                endDate.setHours(0, 0, 0, 0);
                while (cursor <= endDate) {
                    dates.push(this.formatDateInput(cursor).slice(5));
                    cursor.setDate(cursor.getDate() + 1);
                }
            }
        }
        return { dates, granularity };
    },

    // 构建班级绘本类型时间序列（各类型按时间分布的阅读本数）
    buildClassBookTypeSeries(cls) {
        const { dates, granularity } = this.buildClassReportTimeline();
        const stats = cls.bookTypeStats || {};
        const types = Object.keys(stats);
        if (!dates.length || !types.length) return { dates, granularity, series: [] };

        const series = types.map((typeName, typeIdx) => {
            const total = stats[typeName] || 0;
            // 基于班级ID+类型做伪随机分布，保证稳定且有差异
            const seedBase = (cls.id || 1) * 7 + typeIdx * 13;
            const weights = dates.map((_, i) => {
                const v = Math.sin((i + seedBase) * 0.6) * 0.5 + Math.cos((i + typeIdx) * 0.35) * 0.3 + 1;
                return Math.max(0.2, v);
            });
            const weightSum = weights.reduce((s, w) => s + w, 0);
            let allocated = 0;
            const values = weights.map((w, i) => {
                if (i === weights.length - 1) return Math.max(0, total - allocated);
                const v = Math.round(total * (w / weightSum));
                allocated += v;
                return v;
            });
            return { name: typeName, values };
        });
        return { dates, granularity, series };
    },

    // 构建班级能力分布时间序列（各能力随时间的得分变化）
    buildClassAbilitySeries(cls) {
        const { dates, granularity } = this.buildClassReportTimeline();
        const stats = cls.abilityStats || {};
        const abilities = Object.keys(stats);
        if (!dates.length || !abilities.length) return { dates, granularity, series: [] };

        const series = abilities.map((name, abilityIdx) => {
            const target = stats[name] || 0;
            const seedBase = (cls.id || 1) * 11 + abilityIdx * 17;
            const n = dates.length;
            // 从 target-8 起步渐进到 target，并叠加小幅波动，最终值收敛到 target
            const startVal = Math.max(0, target - Math.min(10, Math.round(target * 0.12)));
            const values = dates.map((_, i) => {
                const progress = n === 1 ? 1 : i / (n - 1);
                const base = startVal + (target - startVal) * progress;
                const noise = Math.sin((i + seedBase) * 0.7) * 2.5 + Math.cos((i + abilityIdx) * 0.5) * 1.5;
                const v = Math.round(base + (i === n - 1 ? 0 : noise));
                return Math.max(0, Math.min(100, v));
            });
            return { name, values };
        });
        return { dates, granularity, series };
    },

    // 构建幼儿能力分布时间序列（复用班级逻辑，按学生 ID 生成稳定波动）
    buildStudentAbilitySeries(student) {
        const { dates, granularity } = this.buildClassReportTimeline();
        const stats = student.abilityStats || {};
        const abilities = Object.keys(stats);
        if (!dates.length || !abilities.length) return { dates, granularity, series: [] };

        const series = abilities.map((name, abilityIdx) => {
            const target = stats[name] || 0;
            const seedBase = (student.id || 1) * 13 + abilityIdx * 19;
            const n = dates.length;
            const startVal = Math.max(0, target - Math.min(10, Math.round(target * 0.15)));
            const values = dates.map((_, i) => {
                const progress = n === 1 ? 1 : i / (n - 1);
                const base = startVal + (target - startVal) * progress;
                const noise = Math.sin((i + seedBase) * 0.65) * 2.8 + Math.cos((i + abilityIdx) * 0.45) * 1.6;
                const v = Math.round(base + (i === n - 1 ? 0 : noise));
                return Math.max(0, Math.min(100, v));
            });
            return { name, values };
        });
        return { dates, granularity, series };
    },

    // 构建幼儿能力分布气泡图数据（仅取当前 abilityStats 的当前值，散布到 4 象限）
    buildStudentAbilityBubble(student) {
        const stats = (student && student.abilityStats) || {};
        const palette = ['#1677FF', '#13C2C2', '#722ED1', '#FAAD14', '#52C41A', '#F5222D', '#EB2F96', '#FA8C16', '#2F54EB'];
        const entries = Object.entries(stats);
        if (!entries.length) return [];
        const sorted = entries.sort((a, b) => b[1] - a[1]);
        const anchors = [
            { x: 22, y: 70 },
            { x: 46, y: 36 },
            { x: 70, y: 78 },
            { x: 14, y: 30 },
            { x: 60, y: 58 },
            { x: 36, y: 86 },
            { x: 80, y: 26 },
            { x: 50, y: 60 },
            { x: 30, y: 50 }
        ];
        return sorted.map(([name, value], i) => {
            const a = anchors[i % anchors.length];
            return { name, value, x: a.x, y: a.y, color: palette[i % palette.length] };
        });
    },

    // 把班级"类型时间序列"压成饼图（按类型聚合 values 之和）
    renderClassBookTypePieFromSeries(seriesData, domId) {
        const el = document.getElementById(domId);
        if (!el || typeof echarts === 'undefined') return;
        const typeColors = {
            '日常生活': '#1677FF', '人际交往': '#52C41A', '情商品格': '#FAAD14',
            '国学文化': '#722ED1', '科普百科': '#13C2C2', '语言学习': '#EB2F96'
        };
        const data = (seriesData?.series || [])
            .map(s => ({ name: s.name, value: (s.values || []).reduce((a, b) => a + (b || 0), 0), itemStyle: { color: typeColors[s.name] || '#60a5fa' } }))
            .filter(d => d.value > 0)
            .sort((a, b) => b.value - a.value);
        const existing = echarts.getInstanceByDom(el);
        if (existing) existing.dispose();
        const chart = echarts.init(el, (typeof Charts !== 'undefined' && Charts.isWarm && Charts.isWarm()) ? 'warm' : null, { renderer: 'canvas' });
        chart.setOption({
            tooltip: { trigger: 'item', backgroundColor: 'rgba(15,23,42,0.92)', borderColor: 'rgba(148,163,184,0.3)', textStyle: { color: '#e2e8f0', fontSize: 12 }, formatter: '{b}: {c}次 ({d}%)' },
            legend: { bottom: 0, textStyle: { color: '#a0aec0', fontSize: 11 } },
            series: [{
                type: 'pie', radius: ['38%', '62%'], center: ['50%', '46%'],
                avoidLabelOverlap: true,
                itemStyle: { borderRadius: 6, borderColor: 'rgba(120,160,220,0.35)', borderWidth: 2 },
                label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, color: '#a0aec0' },
                emphasis: { label: { fontSize: 13, fontWeight: 'bold', color: '#f1f5f9' }, itemStyle: { shadowBlur: 18, shadowColor: 'rgba(59,130,246,0.3)' } },
                data: data.length ? data : [{ name: '暂无数据', value: 1, itemStyle: { color: '#475569' }, label: { color: '#64748b' } }]
            }]
        });
        const onResize = () => chart.resize();
        window.addEventListener('resize', onResize);
    },

    // 班级能力分布气泡图（同 student 视觉，散布到 4 象限）
    renderClassAbilityBubble(cls, domId) {
        const el = document.getElementById(domId);
        if (!el || typeof echarts === 'undefined') return;
        const stats = (cls && cls.abilityStats) || {};
        const palette = ['#1677FF', '#13C2C2', '#722ED1', '#FAAD14', '#52C41A', '#F5222D', '#EB2F96', '#FA8C16', '#2F54EB'];
        const entries = Object.entries(stats).sort((a, b) => b[1] - a[1]);
        const anchors = [
            { x: 22, y: 70 }, { x: 46, y: 36 }, { x: 70, y: 78 },
            { x: 14, y: 30 }, { x: 60, y: 58 }, { x: 36, y: 86 },
            { x: 80, y: 26 }, { x: 50, y: 60 }, { x: 30, y: 50 }
        ];
        const data = entries.map(([name, value], i) => ({
            name, value, x: anchors[i % anchors.length].x, y: anchors[i % anchors.length].y, color: palette[i % palette.length]
        }));
        const existing = echarts.getInstanceByDom(el);
        if (existing) existing.dispose();
        const chart = echarts.init(el, (typeof Charts !== 'undefined' && Charts.isWarm && Charts.isWarm()) ? 'warm' : null, { renderer: 'canvas' });
        const sizeOf = d => 36 + Math.max(0, Math.min(100, d.value || 0)) / 100 * 48;
        const fontOf = sz => Math.max(10, Math.min(15, Math.round(sz / 7)));
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { show: false },
            xAxis: { show: false, min: 0, max: 100, type: 'value' },
            yAxis: { show: false, min: 0, max: 100, type: 'value', inverse: true },
            grid: { left: 50, right: 50, top: 24, bottom: 24, containLabel: false },
            series: [{
                type: 'scatter',
                data: data.map(d => {
                    const sz = sizeOf(d);
                    const fs = fontOf(sz);
                    return {
                        name: d.name,
                        value: [d.x, d.y, d.value],
                        symbolSize: sz,
                        itemStyle: { color: d.color, shadowBlur: 16, shadowColor: (d.color || '#3b82f6') + '66' },
                        label: { show: true, formatter: d.name, color: '#ffffff', fontSize: fs, fontWeight: 600, position: 'inside', width: Math.max(40, sz - 16), overflow: 'break', lineHeight: fs + 3 }
                    };
                }),
                labelLayout: { hideOverlap: false },
                emphasis: { scale: 1.06, itemStyle: { shadowBlur: 22 } }
            }]
        });
        const onResize = () => chart.resize();
        window.addEventListener('resize', onResize);
    },

    viewClassDetail(id, mode = 'modal') {
        const clsOriginal = MockData.classes.find(c => c.id === id);
        if (!clsOriginal) return;
        // 按全局时间筛选缩放班级派生指标
        const ratio = this.getSchoolRangeRatio();
        const scaleCount = v => ratio <= 0 ? 0 : Math.max(0, Math.round((Number(v) || 0) * ratio));
        const scaleDuration = (text, digits = 1) => {
            const m = String(text || '').match(/([\d.]+)/);
            if (!m) return text;
            const n = parseFloat(m[1]);
            const unit = String(text).replace(m[1], '').trim();
            return `${(ratio <= 0 ? 0 : n * ratio).toFixed(digits)}${unit}`;
        };
        const cls = {
            ...clsOriginal,
            activityCount: scaleCount(clsOriginal.activityCount),
            activityDuration: scaleDuration(clsOriginal.activityDuration),
            deviceUseCount: scaleCount(clsOriginal.deviceUseCount),
            participantCount: scaleCount(clsOriginal.participantCount),
            teachers: (clsOriginal.teachers || []).map(t => ({
                ...t,
                activityCount: scaleCount(t.activityCount),
                activityDuration: scaleDuration(t.activityDuration)
            }))
        };

        // 获取班级学生数据（也按 ratio 缩放）
        const students = MockData.students.filter(s => s.classId === id).map(s => ({
            ...s,
            activityCount: scaleCount(s.activityCount),
            activityDuration: scaleDuration(s.activityDuration),
            bookCount: scaleCount(s.bookCount)
        }));
        
        // 绘本类型与能力分布改为按时间筛选联动的折线图
        const bookTypeSeriesData = this.buildClassBookTypeSeries(clsOriginal);
        const abilitySeriesData = this.buildClassAbilitySeries(clsOriginal);
        const reportRange = this.dateRanges.schoolOverview || {};
        const formatChineseDate = (str) => {
            if (!str) return '';
            const m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (!m) return str;
            return `${parseInt(m[2], 10)}月${parseInt(m[3], 10)}日`;
        };
        const periodLabel = reportRange.startDate && reportRange.endDate
            ? `${formatChineseDate(reportRange.startDate)}-${formatChineseDate(reportRange.endDate)}`
            : '';
        const hasBookTypeData = bookTypeSeriesData.series.length > 0;
        const hasAbilityData = abilitySeriesData.series.length > 0;
        const bookTypeHtml = hasBookTypeData
            ? `<div class="text-xs text-slate-500 mb-2">统计周期：${periodLabel}</div>
               <div id="class-book-type-chart" class="h-64"></div>`
            : '<div class="h-64 flex items-center justify-center"><span class="text-slate-500 text-sm">抱歉，没有统计到阅读数据，无法分析类型占比</span></div>';
        const abilityHtml = hasAbilityData
            ? `<div class="text-xs text-slate-500 mb-2">气泡大小=能力得分</div>
               <div id="class-ability-chart" class="h-64"></div>`
            : '<div class="h-64 flex items-center justify-center"><span class="text-slate-500 text-sm">抱歉，没有统计到阅读数据，无法分析能力分布</span></div>';
        
        // 生成幼儿列表表格
        const studentHeaders = [
            {label: '序号', align: 'text-center', width: 'w-16'},
            {label: '幼儿姓名'},
            {label: '幼儿编号'},
            {label: '阅读次数', align: 'text-center'},
            {label: '阅读时长', align: 'text-center'},
            {label: '阅读绘本', align: 'text-center'},
            {label: '完整读完', align: 'text-center'},
            {label: '操作', align: 'text-center'}
        ];
        
        const studentRows = students.length > 0
            ? students.map((s, idx) => `
                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td class="px-4 py-3 text-center text-slate-300">${idx + 1}</td>
                    <td class="px-4 py-3 text-slate-200">${s.name}</td>
                    <td class="px-4 py-3 text-slate-400 text-sm">${s.code}</td>
                    <td class="px-4 py-3 text-center text-blue-400">${s.activityCount}次</td>
                    <td class="px-4 py-3 text-center text-slate-300">${s.activityDuration}</td>
                    <td class="px-4 py-3 text-center text-slate-300">${s.bookCount}本</td>
                    <td class="px-4 py-3 text-center text-slate-300">${Math.floor(s.bookCount * 0.7)}本</td>
                    <td class="px-4 py-3 text-center">
                        <button onclick="App.viewStudentReport(${s.id})" class="text-blue-400 hover:text-blue-300 text-sm">幼儿阅读报告</button>
                    </td>
                </tr>
            `).join('')
            : `<tr><td colspan="8" class="px-4 py-8 text-center text-slate-500">暂无幼儿数据</td></tr>`;
        
        // 生成教师列表表格
        const teacherHeaders = [
            {label: '序号', align: 'text-center', width: 'w-16'},
            {label: '教师姓名'},
            {label: '绘本活动次数', align: 'text-center'},
            {label: '绘本活动时长', align: 'text-center'},
            {label: '操作', align: 'text-center'}
        ];
        
        const teachers = cls.teachers || [];
        const teacherRows = teachers.length > 0
            ? teachers.map((t, idx) => `
                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td class="px-4 py-3 text-center text-slate-300">${idx + 1}</td>
                    <td class="px-4 py-3 text-slate-200">${t.name}</td>
                    <td class="px-4 py-3 text-center text-blue-400">${t.activityCount}次</td>
                    <td class="px-4 py-3 text-center text-slate-300">${t.activityDuration}</td>
                    <td class="px-4 py-3 text-center">
                        <button onclick="App.viewTeacherActivities('${t.name}')" class="text-blue-400 hover:text-blue-300 text-sm">查看活动</button>
                    </td>
                </tr>
            `).join('')
            : `<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500">暂无教师数据</td></tr>`;
        
        // 标题栏按钮
        const headerActions = mode === 'modal'
            ? `<button onclick="App.viewClassDetail(${cls.id}, 'subpage')" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors flex items-center gap-2 mr-2" title="在当前页面打开">
                <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                打开
            </button>`
            : `<button onclick="App.closeClassSubpage()" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors flex items-center gap-2 mr-2">
                <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                关闭
            </button>`;
        
        const content = `
            <div class="p-6 max-w-6xl mx-auto">
                <!-- 标题栏 -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white">班级详情</h2>
                    <div class="flex items-center">${headerActions}</div>
                </div>
                
                <!-- 班级数据 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden mb-6">
                    <div class="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50">
                        <h3 class="text-sm font-semibold text-slate-200">班级数据</h3>
                    </div>
                    <div class="p-4">
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <!-- 左侧：基本信息 -->
                            <div class="space-y-3 lg:col-span-1">
                                <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                    <span class="text-slate-400 text-sm">班级：</span>
                                    <span class="text-slate-200">${cls.name}</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                    <span class="text-slate-400 text-sm">教师数量：</span>
                                    <span class="text-slate-200">${cls.teacherCount}人</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                    <span class="text-slate-400 text-sm">幼儿数量：</span>
                                    <span class="text-slate-200">${cls.studentCount}人</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                    <span class="text-slate-400 text-sm">绘本活动总次数：</span>
                                    <span class="text-slate-200">${cls.activityCount}次</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700/30">
                                    <span class="text-slate-400 text-sm">绘本活动总时长：</span>
                                    <span class="text-slate-200">${cls.activityDuration}</span>
                                </div>
                                <div class="flex justify-between items-center py-2">
                                    <span class="text-slate-400 text-sm">孩子参与总人次：</span>
                                    <span class="text-slate-200">${cls.participantCount}次</span>
                                </div>
                            </div>

                            <!-- 中间：阅读绘本类型占比 -->
                            <div class="lg:col-span-1">
                                <h4 class="text-sm font-semibold text-slate-300 mb-3">阅读绘本类型占比：</h4>
                                ${bookTypeHtml}
                            </div>

                            <!-- 右侧：班级能力分布 -->
                            <div class="lg:col-span-1">
                                <h4 class="text-sm font-semibold text-slate-300 mb-3">班级能力分布：</h4>
                                ${abilityHtml}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 幼儿列表 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden mb-6">
                    <div class="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50 flex justify-between items-center">
                        <h3 class="text-sm font-semibold text-slate-200">幼儿列表</h3>
                        <span class="text-xs text-slate-400">${students.length}人</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-700/20">
                                <tr>
                                    ${studentHeaders.map(h => `<th class="px-4 py-3 text-left text-xs font-medium text-slate-400 ${h.align || ''} ${h.width || ''}">${h.label}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>${studentRows}</tbody>
                        </table>
                    </div>
                </div>
                
                <!-- 教师列表 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                    <div class="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50 flex justify-between items-center">
                        <h3 class="text-sm font-semibold text-slate-200">教师列表</h3>
                        <span class="text-xs text-slate-400">${teachers.length}人</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-700/20">
                                <tr>
                                    ${teacherHeaders.map(h => `<th class="px-4 py-3 text-left text-xs font-medium text-slate-400 ${h.align || ''} ${h.width || ''}">${h.label}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>${teacherRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        // 子页面模式：在"园所数据"页落到 school-tab-content，
        // 在大数据总览等页面落到 page-container，实现整页跳转
        if (mode === 'subpage') {
            this.closeModal();
            this.openClassSubpage(content);
            mode = 'subpage';
        } else {
            // 弹窗模式：使用原有弹窗
            this.openModal(content);
            mode = 'modal';
        }

        // 记录当前查看的班级ID（在 closeModal 之后设置，避免被清理）
        this._currentClassDetailId = id;
        this._currentClassDetailMode = mode;

        // 初始化班级报告内的两个图（绘本类型占比饼图 / 班级能力分布气泡图）
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (hasBookTypeData) {
                    this.renderClassBookTypePieFromSeries(bookTypeSeriesData, 'class-book-type-chart');
                }
                if (hasAbilityData) {
                    this.renderClassAbilityBubble(clsOriginal, 'class-ability-chart');
                }
            });
        });
    },
    
    // 打开班级详情子页面（在当前标签页内容区域内）
    openClassSubpage(html) {
        // 优先用"园所数据"页的 tab 容器；大数据总览等页面则落到 page-container（整页跳转）
        const tabContent = document.getElementById('school-tab-content') || document.getElementById('page-container');
        if (!tabContent) return;
        this._classSubpageHostId = tabContent.id;

        // 已存在子页面：仅替换内部内容，避免覆盖原始 tab 内容备份
        const existing = document.getElementById('class-subpage-container');
        if (existing) {
            existing.innerHTML = html;
            return;
        }

        // 保存当前 tab 状态 + 当前页面，便于返回
        this._previousSchoolDataTab = this.schoolDataTab;
        this._classSubpageReturnPage = this.currentPage;

        // 保存原始内容
        this._originalClassTabContent = tabContent.innerHTML;

        // 创建子页面容器
        const subpageContainer = document.createElement('div');
        subpageContainer.id = 'class-subpage-container';
        subpageContainer.className = 'animate-fadeIn';
        subpageContainer.innerHTML = html;
        
        // 清空并插入子页面
        tabContent.innerHTML = '';
        tabContent.appendChild(subpageContainer);
        
        // 隐藏筛选栏（如果存在）
        const filterBar = tabContent.previousElementSibling;
        if (filterBar && filterBar.classList.contains('filter-bar')) {
            filterBar.style.display = 'none';
            this._hiddenClassFilterBar = filterBar;
        }
    },
    
    // 关闭班级详情子页面
    closeClassSubpage() {
        // 大数据总览等页面：宿主是 page-container，直接重新加载原页面即可返回
        if (this._classSubpageHostId === 'page-container') {
            const back = this._classSubpageReturnPage || 'dataOverview';
            this._originalClassTabContent = null;
            this._classSubpageHostId = null;
            this._classSubpageReturnPage = null;
            this._currentClassDetailId = null;
            this.loadPage(back);
            return;
        }

        const tabContent = document.getElementById('school-tab-content');
        if (!tabContent) return;

        // 恢复筛选栏
        if (this._hiddenClassFilterBar) {
            this._hiddenClassFilterBar.style.display = '';
            this._hiddenClassFilterBar = null;
        }

        // 恢复到之前保存的 tab 状态
        const previousTab = this._previousSchoolDataTab || 'classes';
        this.schoolDataTab = previousTab;
        this.renderSchoolTabContent(previousTab);

        // 同步更新 tab 高亮状态
        document.querySelectorAll('.school-tab').forEach(tab => {
            tab.className = this.getSchoolTabClass(tab.dataset.tab === previousTab);
        });

        // 清理保存的内容
        this._originalClassTabContent = null;
        this._previousSchoolDataTab = null;
        this._currentClassDetailId = null;
    },

    viewTeacherActivities(name, mode = 'modal') {
        const teacherClassName = this.isTeacherScope() ? this.getTeacherClassName() : null;
        const activities = this.filterActivitiesByGlobalRange(MockData.schoolData.activities).filter(a => {
            if (a.teacher !== name) return false;
            if (teacherClassName && a.className !== teacherClassName) return false;
            return true;
        });
        
        // 生成活动记录表格
        const activityHeaders = [
            {label: '序号', align: 'text-center', width: 'w-16'},
            {label: '活动开始时间'},
            {label: '活动结束时间'},
            {label: '参与班级'},
            {label: '参与幼儿', align: 'text-center'},
            {label: '操作', align: 'text-center'}
        ];
        
        const activityRows = activities.length > 0
            ? activities.map((a, idx) => `
                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td class="px-4 py-3 text-center text-slate-300">${idx + 1}</td>
                    <td class="px-4 py-3 text-slate-300 text-sm">${a.startTime}</td>
                    <td class="px-4 py-3 text-slate-300 text-sm">${a.endTime}</td>
                    <td class="px-4 py-3 text-slate-200">${a.className}</td>
                    <td class="px-4 py-3 text-center text-blue-400">${a.participatingStudents?.length || 0}人</td>
                    <td class="px-4 py-3 text-center">
                        <button onclick="App.viewActivityDetail(${a.id})" class="text-blue-400 hover:text-blue-300 text-sm">查看</button>
                    </td>
                </tr>
            `).join('')
            : `<tr><td colspan="6" class="px-4 py-8 text-center text-slate-500">暂无活动记录</td></tr>`;
        
        // 标题栏按钮
        const headerActions = mode === 'modal'
            ? `<button onclick="App.viewTeacherActivities('${name}', 'subpage')" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors flex items-center gap-2 mr-2" title="在当前页面打开">
                <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                打开
            </button>`
            : `<button onclick="App.closeTeacherSubpage()" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors flex items-center gap-2 mr-2">
                <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                关闭
            </button>`;
        
        const content = `
            <div class="p-6 max-w-6xl mx-auto">
                <!-- 标题栏 -->
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl font-bold text-white">教师详情</h2>
                        <p class="text-slate-400 text-sm mt-1">教师：${name}</p>
                    </div>
                    <div class="flex items-center">${headerActions}</div>
                </div>
                
                <!-- 绘本活动记录 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                    <div class="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50">
                        <h3 class="text-sm font-semibold text-slate-200">绘本活动记录</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-700/20">
                                <tr>
                                    ${activityHeaders.map(h => `<th class="px-4 py-3 text-left text-xs font-medium text-slate-400 ${h.align || ''} ${h.width || ''}">${h.label}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>${activityRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        if (mode === 'subpage') {
            // 子页面模式：先关闭弹窗，然后在当前标签页内容区域内渲染
            this.closeModal();
            this.openTeacherSubpage(content);
        } else {
            // 弹窗模式：使用原有弹窗
            this.openModal(content);
        }
    },
    
    // 打开教师详情子页面（在当前标签页内容区域内）
    openTeacherSubpage(html) {
        // 找到当前标签页内容容器
        const tabContent = document.getElementById('school-tab-content');
        if (!tabContent) return;

        // 保存当前 tab 状态
        this._previousSchoolDataTab = this.schoolDataTab;

        // 保存原始内容
        this._originalTeacherTabContent = tabContent.innerHTML;

        // 创建子页面容器
        const subpageContainer = document.createElement('div');
        subpageContainer.id = 'teacher-subpage-container';
        subpageContainer.className = 'animate-fadeIn';
        subpageContainer.innerHTML = html;
        
        // 清空并插入子页面
        tabContent.innerHTML = '';
        tabContent.appendChild(subpageContainer);
        
        // 隐藏筛选栏（如果存在）
        const filterBar = tabContent.previousElementSibling;
        if (filterBar && filterBar.classList.contains('filter-bar')) {
            filterBar.style.display = 'none';
            this._hiddenTeacherFilterBar = filterBar;
        }
    },
    
    // 关闭教师详情子页面
    closeTeacherSubpage() {
        const tabContent = document.getElementById('school-tab-content');
        if (!tabContent) return;

        // 恢复筛选栏
        if (this._hiddenTeacherFilterBar) {
            this._hiddenTeacherFilterBar.style.display = '';
            this._hiddenTeacherFilterBar = null;
        }

        // 恢复到之前保存的 tab 状态
        const previousTab = this._previousSchoolDataTab || 'teachers';
        this.schoolDataTab = previousTab;
        this.renderSchoolTabContent(previousTab);

        // 同步更新 tab 高亮状态
        document.querySelectorAll('.school-tab').forEach(tab => {
            tab.className = this.getSchoolTabClass(tab.dataset.tab === previousTab);
        });

        // 清理保存的内容
        this._originalTeacherTabContent = null;
        this._previousSchoolDataTab = null;
    },

    viewStudentReport(id, mode = 'modal') {
        const sOriginal = MockData.students.find(x => x.id === id);
        if (!sOriginal) return;
        // 阅读明细：按全局时间筛选生成该幼儿在范围内的逐次阅读记录
        const detail = this.getStudentReadingDetail(sOriginal);
        const s = {
            ...sOriginal,
            readDurationMinutes: detail.summary.duration,
            readTimes: detail.summary.times,
            bookCount: detail.summary.books,
            completedBooks: detail.summary.completed,
            activityCount: detail.summary.times
        };
        
        // 生成阅读类型饼图数据HTML
        const bookTypeStats = s.bookTypeStats || {};
        const bookTypeHtml = Object.entries(bookTypeStats).length > 0
            ? Object.entries(bookTypeStats).map(([type, count]) => `
                <div class="flex items-center gap-2 mb-2">
                    <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span class="text-slate-300 text-sm">${type}: ${count}本</span>
                </div>
            `).join('')
            : '<span class="text-slate-500 text-sm">暂无阅读类型数据</span>';
        
        // 能力分布改为气泡图（基于当前 abilityStats）
        const abilityBubbleData = this.buildStudentAbilityBubble(sOriginal);
        const hasAbilityTrend = abilityBubbleData.length > 0;
        const studentReportRange = this.dateRanges.schoolOverview || {};
        const formatChineseDate = (str) => {
            if (!str) return '';
            const m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (!m) return str;
            return `${parseInt(m[2], 10)}月${parseInt(m[3], 10)}日`;
        };
        const studentPeriodLabel = studentReportRange.startDate && studentReportRange.endDate
            ? `${formatChineseDate(studentReportRange.startDate)}-${formatChineseDate(studentReportRange.endDate)}`
            : '';
        
        // 生成爱读榜HTML（绘本封面卡片）
        const favoriteCoverPalette = [
            'from-rose-500/35 to-amber-500/25 border-rose-400/30',
            'from-sky-500/35 to-cyan-400/25 border-sky-400/30',
            'from-emerald-500/35 to-teal-400/25 border-emerald-400/30',
            'from-blue-500/35 to-cyan-400/25 border-blue-400/30',
            'from-orange-500/35 to-yellow-400/25 border-orange-400/30',
            'from-blue-500/35 to-sky-400/25 border-blue-400/30'
        ];
        const favoriteBooksHtml = s.favoriteBooks?.length > 0
            ? s.favoriteBooks.map((book, idx) => {
                const palette = favoriteCoverPalette[idx % favoriteCoverPalette.length];
                const matched = (MockData.schoolData?.books || []).find(b => b.name === book);
                const typeBadge = matched?.type
                    ? `<div class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/35 backdrop-blur text-[10px] text-white/90">${matched.type}</div>`
                    : '';
                const rankBadge = idx < 3
                    ? `<div class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-400/90 text-slate-900 text-[11px] font-bold flex items-center justify-center shadow-lg">${idx + 1}</div>`
                    : `<div class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-700/80 text-slate-200 text-[11px] font-bold flex items-center justify-center">${idx + 1}</div>`;
                return `
                    <div class="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 hover:border-blue-400/30 transition-colors flex flex-col">
                        <div class="relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br ${palette} border flex items-center justify-center p-3 shadow-inner">
                            ${rankBadge}
                            ${typeBadge}
                            <div class="text-center">
                                <div class="text-white text-sm font-semibold leading-snug drop-shadow [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">《${book}》</div>
                            </div>
                            <div class="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                        </div>
                        <div class="flex items-center justify-between mt-2">
                            <span class="text-xs text-slate-300 truncate" title="《${book}》">《${book}》</span>
                            <span class="text-xs text-blue-400 shrink-0 ml-2">${3 - idx}次</span>
                        </div>
                    </div>
                `;
            }).join('')
            : '<div class="col-span-3 text-center text-slate-500 text-sm py-6">暂无数据</div>';

        // 兴趣/建议书单：联动顶部全局时间筛选（不再有独立切换器）
        const interestBooksHtml = this.renderStudentInterestBooks(s);
        const recommendBooksHtml = this.renderStudentRecommendBooks(s);

        // 标题栏按钮
        const headerActions = mode === 'modal'
            ? `<button onclick="App.viewStudentReport(${s.id}, 'subpage')" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors flex items-center gap-2 mr-2" title="在当前页面打开">
                <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                打开
            </button>`
            : `<button onclick="App.closeStudentSubpage()" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors flex items-center gap-2 mr-2">
                <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                关闭
            </button>`;
        
        const content = `
            <div class="p-6 max-w-6xl mx-auto">
                <!-- 标题栏 -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white">查看阅读报告</h2>
                    <div class="flex items-center">${headerActions}</div>
                </div>
                
                <!-- 幼儿基本信息 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 mb-6">
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <span class="text-slate-400 text-sm">幼儿：</span>
                            <span class="text-slate-200">${s.name}</span>
                        </div>
                        <div>
                            <span class="text-slate-400 text-sm">幼儿编号：</span>
                            <span class="text-slate-200">${s.code}</span>
                        </div>
                        <div>
                            <span class="text-slate-400 text-sm">所属班级：</span>
                            <span class="text-slate-200">${s.className}</span>
                        </div>
                    </div>
                </div>
                
                <!-- 阅读统计 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-semibold text-slate-200">阅读统计</h3>
                        ${(() => {
                            const dailyMap = new Map();
                            detail.records.forEach(r => {
                                if (!r.date) return;
                                const cur = dailyMap.get(r.date) || { duration: 0, books: new Set() };
                                cur.duration += Number(r.duration) || 0;
                                if (r.bookName) cur.books.add(r.bookName);
                                dailyMap.set(r.date, cur);
                            });
                            if (!dailyMap.size) {
                                return '<span class="text-[11px] text-slate-500">当前时间范围内暂无阅读记录</span>';
                            }
                            let bestDate = null;
                            let bestStat = null;
                            dailyMap.forEach((stat, date) => {
                                if (!bestStat || stat.duration > bestStat.duration) {
                                    bestStat = stat;
                                    bestDate = date;
                                }
                            });
                            const m = parseInt(bestDate.slice(5, 7), 10);
                            const d = parseInt(bestDate.slice(8, 10), 10);
                            return `<span class="text-[11px] text-amber-300">${m}月${d}日阅读了${bestStat.duration}分钟${bestStat.books.size}本书，是最勤奋的一天！</span>`;
                        })()}
                    </div>
                    ${(() => {
                        // 每次进入报告默认收起
                        this._studentMetricTab = null;
                        const activeKey = this._studentMetricTab;
                        const tabs = [
                            { key: 'duration', label: '阅读时长', unit: '分钟', displayValue: s.readDurationMinutes },
                            { key: 'times', label: '阅读次数', unit: '次', displayValue: s.readTimes },
                            { key: 'books', label: '阅读绘本', unit: '本', displayValue: s.bookCount },
                            { key: 'completed', label: '完整读完', unit: '本', displayValue: s.completedBooks }
                        ];
                        const tabsHtml = tabs.map(t => this.renderStudentMetricTab({ ...t, active: t.key === activeKey })).join('');

                        // 各 tab 对应的明细数据与列
                        const booksAggregated = (() => {
                            const map = new Map();
                            detail.records.forEach(r => {
                                if (!map.has(r.bookName)) {
                                    map.set(r.bookName, { bookName: r.bookName, bookType: r.bookType, times: 0, duration: 0, lastDate: r.date });
                                }
                                const item = map.get(r.bookName);
                                item.times += 1;
                                item.duration += r.duration;
                                if (r.date > item.lastDate) item.lastDate = r.date;
                            });
                            return [...map.values()].sort((a, b) => b.times - a.times);
                        })();
                        const completedAggregated = (() => {
                            const map = new Map();
                            detail.records.filter(r => r.completed).forEach(r => {
                                if (!map.has(r.bookName)) {
                                    map.set(r.bookName, { bookName: r.bookName, bookType: r.bookType, date: r.date, duration: r.duration, times: 1 });
                                } else {
                                    const item = map.get(r.bookName);
                                    item.times += 1;
                                    if (r.date > item.date) { item.date = r.date; item.duration = r.duration; }
                                }
                            });
                            return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
                        })();

                        const panels = [
                            this.renderStudentMetricPanel({
                                key: 'duration', label: '阅读时长',
                                hint: `共 ${s.readDurationMinutes} 分钟，由以下 ${detail.records.length} 次阅读组成：`,
                                records: detail.records,
                                columns: [
                                    { label: '日期', render: r => r.date },
                                    { label: '开始时间', render: r => r.startTime ? r.startTime.slice(11, 16) : '-' },
                                    { label: '结束时间', render: r => r.endTime ? r.endTime.slice(11, 16) : '-' },
                                    { label: '绘本', render: r => r.bookName },
                                    { label: '类型', render: r => r.bookType },
                                    { label: '时长', render: r => `<span class="text-blue-300 font-semibold">${r.duration}分钟</span>` }
                                ]
                            }),
                            this.renderStudentMetricPanel({
                                key: 'times', label: '阅读次数',
                                hint: `共 ${s.readTimes} 次阅读：`,
                                records: detail.records,
                                columns: [
                                    { label: '序号', render: (_r, i) => i + 1 },
                                    { label: '日期', render: r => r.date },
                                    { label: '开始时间', render: r => r.startTime ? r.startTime.slice(11, 16) : '-' },
                                    { label: '绘本', render: r => r.bookName },
                                    { label: '类型', render: r => r.bookType },
                                    { label: '时长', render: r => `${r.duration}分钟` },
                                    { label: '完整读完', render: r => r.completed ? '<span class="text-emerald-400">是</span>' : '<span class="text-amber-400">否</span>' }
                                ]
                            }),
                            this.renderStudentMetricPanel({
                                key: 'books', label: '阅读绘本',
                                hint: `共阅读 ${s.bookCount} 本绘本：`,
                                records: booksAggregated,
                                columns: [
                                    { label: '绘本', render: r => r.bookName },
                                    { label: '类型', render: r => r.bookType },
                                    { label: '阅读次数', render: r => `${r.times}次` },
                                    { label: '累计时长', render: r => `${r.duration}分钟` },
                                    { label: '最近阅读', render: r => r.lastDate }
                                ]
                            }),
                            this.renderStudentMetricPanel({
                                key: 'completed', label: '完整读完',
                                hint: `共完整读完 ${s.completedBooks} 本：`,
                                records: completedAggregated,
                                emptyText: '当前时间范围内暂无完整读完记录',
                                columns: [
                                    { label: '绘本', render: r => r.bookName },
                                    { label: '类型', render: r => r.bookType },
                                    { label: '阅读次数', render: r => `${r.times}次` },
                                    { label: '完整读完日期', render: r => r.date },
                                    { label: '最近时长', render: r => `${r.duration}分钟` }
                                ]
                            })
                        ].join('');

                        return `
                            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">${tabsHtml}</div>
                            <div id="student-metric-panel-wrapper" class="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 mt-4 ${activeKey ? '' : 'hidden'}">${panels}</div>
                        `;
                    })()}
                </div>
                
                <!-- 阅读类型和能力分布 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <!-- 阅读类型 -->
                    <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-semibold text-slate-200">阅读类型</h3>
                            <span class="text-[11px] text-slate-500">按筛选周期占比</span>
                        </div>
                        <div class="text-xs text-amber-400 mb-3">${s.name}最喜爱的绘本类型是"${Object.keys(bookTypeStats)[0] || '日常生活'}"</div>
                        <div id="student-booktype-trend-chart" class="w-full" style="min-height:260px;height:260px"></div>
                    </div>

                    <!-- 能力分布 -->
                    <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-semibold text-slate-200">能力分布</h3>
                            <span class="text-[11px] text-slate-500">气泡大小=能力得分</span>
                        </div>
                        ${hasAbilityTrend
                            ? '<div id="student-ability-chart" class="w-full" style="min-height:260px;height:260px"></div>'
                            : '<div class="flex items-center justify-center min-h-[150px]"><span class="text-slate-500 text-sm">暂无能力分布数据</span></div>'}
                    </div>
                </div>
                
                <!-- 爱读榜 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 mb-6">
                    <h3 class="text-sm font-semibold text-slate-200 mb-4">爱读榜</h3>
                    <div class="grid grid-cols-3 gap-4">
                        ${favoriteBooksHtml}
                    </div>
                </div>
                
                <!-- 兴趣书单 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-semibold text-slate-200">兴趣书单</h3>
                    </div>
                    <p class="text-xs text-slate-400 mb-4">基于 <span class="text-amber-400">${s.name}</span> 的阅读数据分析，发现她/他很喜欢以下类型的书单</p>
                    <div id="student-interest-books-${s.id}">${interestBooksHtml}</div>
                </div>

                <!-- 建议书单 -->
                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-semibold text-slate-200">建议书单</h3>
                    </div>
                    <p class="text-xs text-slate-400 mb-4">基于 <span class="text-amber-400">${s.name}</span> 在该年龄段中，接下来应更多关注以下类型书籍</p>
                    <div id="student-recommend-books-${s.id}">${recommendBooksHtml}</div>
                </div>
            </div>
        `;
        
        if (mode === 'subpage') {
            // 子页面模式：先关闭弹窗，然后在当前标签页内容区域内渲染
            this.closeModal();
            this.openStudentSubpage(content);
        } else {
            // 弹窗模式：使用原有弹窗
            this.openModal(content);
        }

        // 渲染完成后初始化阅读类型饼图与能力分布气泡图
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.renderStudentBookTypeTrendChart(detail.records);
                if (hasAbilityTrend) {
                    this.renderStudentAbilityBubble(abilityBubbleData);
                }
            });
        });

        // 记录当前查看的幼儿报告ID，以便时间筛选联动重新渲染
        this._currentStudentReportId = id;
        this._currentStudentReportMode = mode;
    },

    renderStudentBookTypeTrendChart(records) {
        const el = document.getElementById('student-booktype-trend-chart');
        if (!el || typeof echarts === 'undefined') return;

        // 按类型聚合阅读次数（取当前已筛选 records）
        const typeColors = {
            '日常生活': '#60a5fa',
            '人际交往': '#34d399',
            '情商品格': '#f59e0b',
            '国学文化': '#a78bfa',
            '科普百科': '#22d3ee',
            '语言学习': '#f472b6'
        };
        const counts = new Map();
        (records || []).forEach(r => {
            if (!r.bookType) return;
            counts.set(r.bookType, (counts.get(r.bookType) || 0) + 1);
        });
        const data = [...counts.entries()]
            .map(([name, value]) => ({ name, value, itemStyle: { color: typeColors[name] || '#60a5fa' } }))
            .sort((a, b) => b.value - a.value);

        if (this._studentBookTypeChart) {
            this._studentBookTypeChart.dispose();
            this._studentBookTypeChart = null;
        }
        const chart = echarts.init(el, (typeof Charts !== 'undefined' && Charts.isWarm && Charts.isWarm()) ? 'warm' : null, { renderer: 'canvas' });
        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(15,23,42,0.92)',
                borderColor: 'rgba(148,163,184,0.3)',
                textStyle: { color: '#e2e8f0', fontSize: 12 },
                formatter: '{b}: {c}次 ({d}%)'
            },
            legend: { bottom: 0, textStyle: { color: '#a0aec0', fontSize: 11 } },
            series: [{
                type: 'pie',
                radius: ['38%', '62%'],
                center: ['50%', '46%'],
                avoidLabelOverlap: true,
                itemStyle: { borderRadius: 6, borderColor: 'rgba(120,160,220,0.35)', borderWidth: 2 },
                label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, color: '#a0aec0' },
                emphasis: { label: { fontSize: 13, fontWeight: 'bold', color: '#f1f5f9' }, itemStyle: { shadowBlur: 18, shadowColor: 'rgba(59,130,246,0.3)' } },
                data: data.length ? data : [{ name: '暂无数据', value: 1, itemStyle: { color: '#475569' }, label: { color: '#64748b' } }]
            }]
        };
        chart.setOption(option);
        this._studentBookTypeChart = chart;

        // 弹窗模式下容器从 hidden→flex 切换时，初次布局可能偏小，延迟再 resize 一次
        const safeResize = () => {
            if (!document.body.contains(el)) return;
            chart.resize();
        };
        requestAnimationFrame(() => requestAnimationFrame(safeResize));
        setTimeout(safeResize, 60);
        setTimeout(safeResize, 200);
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => chart.resize());
            ro.observe(el);
            this._studentBookTypeChartRO = ro;
        }
        const onResize = () => chart.resize();
        window.addEventListener('resize', onResize);
        this._studentBookTypeChartWinHandler = onResize;
    },

    renderStudentAbilityBubble(data) {
        const el = document.getElementById('student-ability-chart');
        if (!el || typeof echarts === 'undefined') return;
        if (this._studentAbilityChart) {
            this._studentAbilityChart.dispose();
            this._studentAbilityChart = null;
        }
        const chart = echarts.init(el, (typeof Charts !== 'undefined' && Charts.isWarm && Charts.isWarm()) ? 'warm' : null, { renderer: 'canvas' });
        const sizeOf = d => 36 + Math.max(0, Math.min(100, d.value || 0)) / 100 * 48;
        const fontOf = sz => Math.max(10, Math.min(15, Math.round(sz / 7)));
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { show: false },
            xAxis: { show: false, min: 0, max: 100, type: 'value' },
            yAxis: { show: false, min: 0, max: 100, type: 'value', inverse: true },
            grid: { left: 50, right: 50, top: 24, bottom: 24, containLabel: false },
            series: [{
                type: 'scatter',
                data: data.map(d => {
                    const sz = sizeOf(d);
                    const fs = fontOf(sz);
                    return {
                        name: d.name,
                        value: [d.x, d.y, d.value],
                        symbolSize: sz,
                        itemStyle: { color: d.color, shadowBlur: 16, shadowColor: (d.color || '#3b82f6') + '66' },
                        label: {
                            show: true,
                            formatter: d.name,
                            color: '#ffffff',
                            fontSize: fs,
                            fontWeight: 600,
                            position: 'inside',
                            width: Math.max(40, sz - 16),
                            overflow: 'break',
                            lineHeight: fs + 3
                        }
                    };
                }),
                labelLayout: { hideOverlap: false },
                emphasis: { scale: 1.06, itemStyle: { shadowBlur: 22 } }
            }]
        });
        this._studentAbilityChart = chart;
        const safeResize = () => { if (document.body.contains(el)) chart.resize(); };
        requestAnimationFrame(() => requestAnimationFrame(safeResize));
        const onResize = () => chart.resize();
        window.addEventListener('resize', onResize);
        this._studentAbilityChartWinHandler = onResize;
    },

    // 兴趣/建议书单时间快筛器（7天 / 1个月 / 半年）
    renderBookListRangeSwitcher(studentId, kind, active) {
        const items = [
            { key: '7d', label: '7天' },
            { key: '1m', label: '1个月' },
            { key: '6m', label: '半年' }
        ];
        return `
            <div class="inline-flex items-center bg-slate-900/60 border border-slate-700/60 rounded-lg p-0.5 text-xs">
                ${items.map(it => `
                    <button type="button"
                        onclick="App.setStudentBookListRange(${studentId}, '${kind}', '${it.key}')"
                        class="px-3 py-1 rounded-md transition-colors ${active === it.key ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-slate-200'}">
                        ${it.label}
                    </button>
                `).join('')}
            </div>
        `;
    },

    setStudentBookListRange(studentId, kind, rangeKey) {
        if (!this._studentBookListRanges) this._studentBookListRanges = {};
        if (!this._studentBookListRanges[studentId]) this._studentBookListRanges[studentId] = { interest: '7d', recommend: '7d' };
        this._studentBookListRanges[studentId][kind] = rangeKey;

        const detail = MockData.getStudentDetail ? MockData.getStudentDetail(studentId) : null;
        const student = (MockData.students || []).find(x => x.id === studentId)
            || (detail && detail.student)
            || { id: studentId };

        const containerId = kind === 'interest' ? `student-interest-books-${studentId}` : `student-recommend-books-${studentId}`;
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = kind === 'interest'
                ? this.renderStudentInterestBooks(student)
                : this.renderStudentRecommendBooks(student);
        }

        // 同步切换器选中样式
        const switcherWrapper = container ? container.parentElement.querySelector('.inline-flex') : null;
        if (switcherWrapper) {
            switcherWrapper.outerHTML = this.renderBookListRangeSwitcher(studentId, kind, rangeKey);
        }
    },

    // 周期映射：返回展示数量
    _bookListSizeOf(rangeKey) {
        if (rangeKey === '6m') return 8;
        if (rangeKey === '1m') return 5;
        return 3;
    },

    // 绘本封面占位符（先用占位图，后续替换为真实封面）
    // 根据书名生成稳定的渐变色，避免每次渲染颜色跳动
    _bookCoverGradient(name) {
        const palettes = [
            ['#69b1ff', '#1677ff'], ['#60a5fa', '#2563eb'], ['#34d399', '#059669'],
            ['#fbbf24', '#d97706'], ['#f472b6', '#db2777'], ['#22d3ee', '#0891b2'],
            ['#f87171', '#dc2626'], ['#5cdbd3', '#13c2c2']
        ];
        let h = 0;
        for (let i = 0; i < String(name).length; i++) h = (h * 31 + String(name).charCodeAt(i)) >>> 0;
        return palettes[h % palettes.length];
    },
    // 单个绘本封面占位（含书名），size: 'sm' | 'md'
    renderBookCover(name, size = 'md') {
        const [c1, c2] = this._bookCoverGradient(name);
        const dims = size === 'sm' ? 'w-16 h-20' : 'w-full aspect-[3/4]';
        const fontSz = size === 'sm' ? 'text-[10px]' : 'text-xs';
        return `
            <div class="${dims} rounded-lg overflow-hidden shrink-0 relative shadow-sm border border-white/10"
                 style="background:linear-gradient(135deg, ${c1}, ${c2});" title="《${name}》">
                <div class="absolute inset-0 flex items-center justify-center p-2 text-center">
                    <span class="text-white ${fontSz} font-medium leading-snug line-clamp-3 drop-shadow">${name}</span>
                </div>
                <div class="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white/25 rounded-r"></div>
            </div>`;
    },
    // 书单封面网格：传入书名数组，渲染成封面 + 书名
    // 封面固定大小，flex + justify-around 均匀分散(不贴左/不挤中)；卡片偏窄以便 8 本也能同行
    renderBookCoverGrid(books, accent = 'text-blue-300') {
        if (!books || !books.length) return '';
        return `<div class="flex flex-wrap justify-around gap-y-5">
            ${books.map(name => `
                <div class="flex flex-col items-center gap-1.5 w-[84px] mx-1">
                    ${this.renderBookCover(name, 'md')}
                    <span class="${accent} text-[11px] text-center leading-tight line-clamp-2 w-full">《${name}》</span>
                </div>
            `).join('')}
        </div>`;
    },

    // 兴趣书单：基于 s.interestBooks 与该幼儿喜爱类型，在书库内补足到目标数量
    renderStudentInterestBooks(s) {
        const size = this.getGlobalBookListSize();
        const base = Array.isArray(s.interestBooks) ? [...s.interestBooks] : [];
        const favoriteType = (s.bookTypeStats && Object.keys(s.bookTypeStats)[0]) || null;
        const allBooks = (MockData.schoolData?.books || []).map(b => b.name);
        const sameTypeBooks = favoriteType
            ? (MockData.schoolData?.books || []).filter(b => b.type === favoriteType).map(b => b.name)
            : [];

        const list = [...base];
        const fillOrder = [...sameTypeBooks, ...allBooks];
        for (const name of fillOrder) {
            if (list.length >= size) break;
            if (!list.includes(name)) list.push(name);
        }
        const final = list.slice(0, size);
        if (!final.length) {
            return `<span class="text-slate-500 text-sm">基于${s.name || ''}的阅读数据分析，发现她/他很喜欢以下类型的书单</span>`;
        }
        return this.renderBookCoverGrid(final, 'text-blue-300');
    },

    // 建议书单：基于 s.recommendBooks，按维度补足
    renderStudentRecommendBooks(s) {
        const size = this.getGlobalBookListSize();
        const base = Array.isArray(s.recommendBooks) ? [...s.recommendBooks] : [];
        const readNames = new Set(Array.isArray(s.favoriteBooks) ? s.favoriteBooks : []);
        const allBooks = (MockData.schoolData?.books || []).map(b => b.name);
        const unread = allBooks.filter(n => !readNames.has(n));
        const list = [...base];
        for (const name of unread) {
            if (list.length >= size) break;
            if (!list.includes(name)) list.push(name);
        }
        for (const name of allBooks) {
            if (list.length >= size) break;
            if (!list.includes(name)) list.push(name);
        }
        const final = list.slice(0, size);
        if (!final.length) {
            return `<span class="text-slate-500 text-sm">基于${s.name || ''}在该年龄段中，接下来应更多关注以下类型书籍</span>`;
        }
        return this.renderBookCoverGrid(final, 'text-emerald-300');
    },

    // —— 班级爱读榜：班级兴趣书单 / 班级建议书单（规则与幼儿一致） ——
    _classBookListRanges: {},
    _ensureClassBookListRange(classId) {
        if (!this._classBookListRanges) this._classBookListRanges = {};
        if (!this._classBookListRanges[classId]) {
            this._classBookListRanges[classId] = { interest: '7d', recommend: '7d' };
        }
        return this._classBookListRanges[classId];
    },
    renderClassBookListRangeSwitcher(classId, kind, active) {
        const items = [
            { key: '7d', label: '7天' },
            { key: '1m', label: '1个月' },
            { key: '6m', label: '半年' }
        ];
        return `
            <div class="inline-flex items-center bg-slate-900/60 border border-slate-700/60 rounded-lg p-0.5 text-xs">
                ${items.map(it => `
                    <button type="button"
                        onclick="App.setClassBookListRange(${classId}, '${kind}', '${it.key}')"
                        class="px-3 py-1 rounded-md transition-colors ${active === it.key ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-slate-200'}">
                        ${it.label}
                    </button>
                `).join('')}
            </div>
        `;
    },
    setClassBookListRange(classId, kind, rangeKey) {
        const r = this._ensureClassBookListRange(classId);
        r[kind] = rangeKey;
        const cls = (MockData.classes || []).find(c => c.id === classId) || { id: classId };
        const containerId = kind === 'interest' ? `class-interest-books-${classId}` : `class-recommend-books-${classId}`;
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = kind === 'interest'
                ? this.renderClassInterestBooks(cls)
                : this.renderClassRecommendBooks(cls);
        }
        const switcherWrapper = container ? container.parentElement.querySelector('.inline-flex') : null;
        if (switcherWrapper) {
            switcherWrapper.outerHTML = this.renderClassBookListRangeSwitcher(classId, kind, rangeKey);
        }
    },
    // 班级兴趣书单：取班级 bookTypeStats 中权重最高的类型，在书库内挑出该类型的书；不足时按全库补足
    renderClassInterestBooks(cls) {
        const size = this.getGlobalBookListSize();
        const stats = cls.bookTypeStats || {};
        const topType = Object.entries(stats).sort((a, b) => b[1] - a[1]).map(([k]) => k)[0] || null;
        const allBooks = (MockData.schoolData?.books || []).map(b => b.name);
        const sameTypeBooks = topType
            ? (MockData.schoolData?.books || []).filter(b => b.type === topType).map(b => b.name)
            : [];
        const list = [];
        for (const name of [...sameTypeBooks, ...allBooks]) {
            if (list.length >= size) break;
            if (!list.includes(name)) list.push(name);
        }
        const final = list.slice(0, size);
        if (!final.length) {
            return `<span class="text-slate-500 text-sm">基于${cls.name || ''}的阅读数据分析，发现该班很喜欢以下类型的书单</span>`;
        }
        return this.renderBookCoverGrid(final, 'text-blue-300');
    },
    // 班级建议书单：以"班级未充分覆盖的类型"优先（bookTypeStats 中读得最少的类型），书库挑出对应书籍
    renderClassRecommendBooks(cls) {
        const size = this.getGlobalBookListSize();
        const stats = cls.bookTypeStats || {};
        const allBooks = (MockData.schoolData?.books || []).map(b => b.name);
        const allBookObjs = (MockData.schoolData?.books || []);
        const types = Object.keys(stats);
        const leastType = types.length ? types.sort((a, b) => stats[a] - stats[b])[0] : null;
        const sameTypeBooks = leastType
            ? allBookObjs.filter(b => b.type === leastType).map(b => b.name)
            : [];
        const list = [];
        for (const name of [...sameTypeBooks, ...allBooks]) {
            if (list.length >= size) break;
            if (!list.includes(name)) list.push(name);
        }
        const final = list.slice(0, size);
        if (!final.length) {
            return `<span class="text-slate-500 text-sm">基于${cls.name || ''}的阅读数据，可拓展以下类型的书籍</span>`;
        }
        return this.renderBookCoverGrid(final, 'text-emerald-300');
    },
    // 班级累计阅读绘本 Top3（按全局时间筛选；活动 records 里聚合 bookName）
    buildClassFavoriteTop3(cls) {
        if (!cls || cls.id == null) return [];
        const range = this.getSchoolDateRange();
        const startMs = range?.startDate ? new Date(`${range.startDate}T00:00:00`).getTime() : null;
        const endMs = range?.endDate ? new Date(`${range.endDate}T23:59:59`).getTime() : null;
        const inRange = ts => (startMs == null || ts >= startMs) && (endMs == null || ts <= endMs);

        // 聚合该班级时间窗内的活动 -> 绘本计数
        const acts = (MockData.schoolData?.activities || []).filter(a => a.classId === cls.id || a.className === cls.name);
        const counts = new Map();
        const types = new Map();
        acts.forEach(a => {
            const ts = a.date ? new Date(`${a.date}T00:00:00`).getTime() : null;
            if (ts != null && !inRange(ts)) return;
            const bookName = a.bookName || a.book || null;
            if (!bookName) return;
            counts.set(bookName, (counts.get(bookName) || 0) + 1);
            if (a.bookType) types.set(bookName, a.bookType);
        });

        let entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
        // 兜底：没有活动数据时，从该班 bookTypeStats 中权重最高的类型挑前 3 本作展示
        if (!entries.length) {
            const topType = Object.entries(cls.bookTypeStats || {}).sort((a, b) => b[1] - a[1]).map(([k]) => k)[0];
            const seedBooks = topType
                ? (MockData.schoolData?.books || []).filter(b => b.type === topType).slice(0, 3).map(b => ({ name: b.name, count: 0, type: b.type }))
                : (MockData.schoolData?.books || []).slice(0, 3).map(b => ({ name: b.name, count: 0, type: b.type }));
            return seedBooks;
        }
        return entries.slice(0, 3).map(([name, count]) => ({ name, count, type: types.get(name) || '' }));
    },
    renderClassFavoriteTop3(cls) {
        const top3 = this.buildClassFavoriteTop3(cls);
        if (!top3.length) {
            return `<div class="text-sm text-slate-500">暂无累计阅读数据</div>`;
        }
        const medal = ['#fbbf24', '#94a3b8', '#d48806'];
        return `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${top3.map((b, i) => `
                <div class="rounded-2xl border border-slate-500/25 bg-slate-800/40 p-4 flex items-center gap-3">
                    <div class="relative shrink-0">
                        ${this.renderBookCover(b.name, 'sm')}
                        <div class="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs shadow" style="background:${medal[i] || '#475569'}">${i + 1}</div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="text-sm font-semibold text-white truncate">《${b.name}》</div>
                        <div class="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            ${b.type ? this.badge(b.type, 'blue') : ''}
                            <span>累计阅读 ${b.count} 次</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>`;
    },
    // 渲染整个"班级爱读榜"模块（卡片形式，单独的"爱读榜 Top3"）
    renderClassFavoriteBoard(cls) {
        if (!cls || cls.id == null) return '';
        return this.card(`
            <div class="flex items-center justify-between gap-3 mb-4">
                ${this.chartTitle('班级爱读榜', 'bg-rose-500', '统计范围：当前所选时间范围内本班全部活动记录。\n口径：按绘本聚合阅读次数，取累计阅读次数前 3 本。\n用途：识别本班最受欢迎的绘本。')}
                <div class="text-xs text-slate-400 px-3 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/10">${cls.name || ''} · 累计 Top3</div>
            </div>
            ${this.renderClassFavoriteTop3(cls)}
        `);
    },

    // 渲染"班级兴趣书单"独立模块
    renderClassInterestBoard(cls) {
        if (!cls || cls.id == null) return '';
        const topType = Object.entries(cls.bookTypeStats || {}).sort((a, b) => b[1] - a[1]).map(([k]) => k)[0] || '日常生活';
        return this.card(`
            <div class="flex items-center justify-between gap-3 mb-3">
                ${this.chartTitle('班级兴趣书单', 'bg-blue-500', '统计范围：跟随顶部时间筛选。\n口径：基于班级最近偏好的类型推荐对应类型绘本。\n数量：根据所选时间范围长度自动调整。')}
            </div>
            <p class="text-xs text-slate-400 mb-4">基于 <span class="text-amber-400">${cls.name || ''}</span> 的阅读数据分析，该班很喜欢"${topType}"类型的书</p>
            <div id="class-interest-books-${cls.id}">${this.renderClassInterestBooks(cls)}</div>
        `);
    },

    // 渲染"班级建议书单"独立模块
    renderClassRecommendBoard(cls) {
        if (!cls || cls.id == null) return '';
        return this.card(`
            <div class="flex items-center justify-between gap-3 mb-3">
                ${this.chartTitle('班级建议书单', 'bg-emerald-500', '统计范围：跟随顶部时间筛选。\n口径：基于班级近期较少阅读的类型，从书库挑选可拓展的绘本。\n数量：根据所选时间范围长度自动调整。')}
            </div>
            <p class="text-xs text-slate-400 mb-4">基于 <span class="text-amber-400">${cls.name || ''}</span> 在该年龄段中，接下来应更多关注以下类型书籍</p>
            <div id="class-recommend-books-${cls.id}">${this.renderClassRecommendBooks(cls)}</div>
        `);
    },

    // 渲染整组"班级爱读榜 + 班级兴趣书单 + 班级建议书单"三个独立模块（园长视角带班级选择器；教师视角直接锁定本班）
    _selectedFavoriteClassId: null,

    // —— 园所级聚合：合并多个班级的 bookTypeStats ——
    getAggregatedBookTypeStats(classes) {
        const merged = {};
        (classes || []).forEach(c => {
            Object.entries(c.bookTypeStats || {}).forEach(([k, v]) => {
                merged[k] = (merged[k] || 0) + v;
            });
        });
        return merged;
    },
    // 园所级爱读榜：聚合所有班级在时间窗内的活动 → 绘本计数 Top3
    buildSchoolFavoriteTop3(classes) {
        const range = this.getSchoolDateRange();
        const startMs = range?.startDate ? new Date(`${range.startDate}T00:00:00`).getTime() : null;
        const endMs = range?.endDate ? new Date(`${range.endDate}T23:59:59`).getTime() : null;
        const inRange = ts => (startMs == null || ts >= startMs) && (endMs == null || ts <= endMs);
        const ids = new Set((classes || []).map(c => c.id));
        const names = new Set((classes || []).map(c => c.name));
        const acts = (MockData.schoolData?.activities || []).filter(a => ids.has(a.classId) || names.has(a.className));
        const counts = new Map();
        const types = new Map();
        acts.forEach(a => {
            const ts = a.date ? new Date(`${a.date}T00:00:00`).getTime() : null;
            if (ts != null && !inRange(ts)) return;
            const bookName = a.bookName || a.book || null;
            if (!bookName) return;
            counts.set(bookName, (counts.get(bookName) || 0) + 1);
            if (a.bookType) types.set(bookName, a.bookType);
        });
        let entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
        if (!entries.length) {
            const merged = this.getAggregatedBookTypeStats(classes);
            const topType = Object.entries(merged).sort((a, b) => b[1] - a[1]).map(([k]) => k)[0];
            const seed = topType
                ? (MockData.schoolData?.books || []).filter(b => b.type === topType).slice(0, 3).map(b => ({ name: b.name, count: 0, type: b.type }))
                : (MockData.schoolData?.books || []).slice(0, 3).map(b => ({ name: b.name, count: 0, type: b.type }));
            return seed;
        }
        return entries.slice(0, 3).map(([name, count]) => ({ name, count, type: types.get(name) || '' }));
    },
    // 园所级三个榜单（合成一个代表全园的虚拟 cls 复用书单渲染）
    renderSchoolLevelBoards(classes, schoolName) {
        const merged = this.getAggregatedBookTypeStats(classes);
        const schoolCls = { id: 'school', name: schoolName || '本园', bookTypeStats: merged };
        const top3 = this.buildSchoolFavoriteTop3(classes);
        const medal = ['#fbbf24', '#94a3b8', '#d48806'];
        const favHtml = top3.length
            ? `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">${top3.map((b, i) => `
                <div class="rounded-2xl border border-slate-500/25 bg-slate-800/40 p-4 flex items-center gap-3">
                    <div class="relative shrink-0">
                        ${this.renderBookCover(b.name, 'sm')}
                        <div class="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs shadow" style="background:${medal[i] || '#475569'}">${i + 1}</div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="text-sm font-semibold text-white truncate">《${b.name}》</div>
                        <div class="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            ${b.type ? this.badge(b.type, 'blue') : ''}
                            <span>累计阅读 ${b.count} 次</span>
                        </div>
                    </div>
                </div>`).join('')}</div>`
            : `<div class="text-sm text-slate-500">暂无累计阅读数据</div>`;
        const topType = Object.entries(merged).sort((a, b) => b[1] - a[1]).map(([k]) => k)[0] || '日常生活';
        return `
            ${this.card(`
                <div class="flex items-center justify-between gap-3 mb-4">
                    ${this.chartTitle('园所爱读榜', 'bg-rose-500', '统计范围：当前所选时间范围内全园全部活动记录。\n口径：按绘本聚合阅读次数，取累计阅读次数前 3 本。\n用途：识别全园最受欢迎的绘本。')}
                    <div class="text-xs text-slate-400 px-3 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/10">${schoolName || '本园'} · 累计 Top3</div>
                </div>
                ${favHtml}
            `)}
            ${this.card(`
                <div class="flex items-center justify-between gap-3 mb-3">
                    ${this.chartTitle('园所兴趣书单', 'bg-blue-500', '统计范围：跟随顶部时间筛选。\n口径：基于全园最近偏好的类型推荐对应类型绘本。\n数量：根据所选时间范围长度自动调整。')}
                </div>
                <p class="text-xs text-slate-400 mb-4">基于 <span class="text-amber-400">${schoolName || '本园'}</span> 的阅读数据分析，全园很喜欢"${topType}"类型的书</p>
                <div id="class-interest-books-school">${this.renderClassInterestBooks(schoolCls)}</div>
            `)}
            ${this.card(`
                <div class="flex items-center justify-between gap-3 mb-3">
                    ${this.chartTitle('园所建议书单', 'bg-emerald-500', '统计范围：跟随顶部时间筛选。\n口径：基于全园近期较少阅读的类型，从书库挑选可拓展的绘本。\n数量：根据所选时间范围长度自动调整。')}
                </div>
                <p class="text-xs text-slate-400 mb-4">基于 <span class="text-amber-400">${schoolName || '本园'}</span> 的整体阅读情况，接下来应更多关注以下类型书籍</p>
                <div id="class-recommend-books-school">${this.renderClassRecommendBooks(schoolCls)}</div>
            `)}
        `;
    },

    renderSchoolFavoriteBoard() {
        // 选择班级范围：admin 单园弹窗看选定园所；principal 看本园；teacher 看本班
        let classes = (MockData.classes || []).slice();
        if (this.currentRole === 'teacher') {
            const teacherClassId = this.selectedClass ? this.selectedClass.id : null;
            if (teacherClassId) classes = classes.filter(c => c.id === teacherClassId);
        } else if (this.selectedSchool) {
            classes = classes.filter(c => c.kindergartenId === this.selectedSchool.id);
        }
        if (!classes.length) return '';

        // 当前选中的班级；若失效或未选，默认第一项
        let activeId = this._selectedFavoriteClassId;
        if (!classes.some(c => c.id === activeId)) {
            activeId = classes[0].id;
            this._selectedFavoriteClassId = activeId;
        }
        const activeCls = classes.find(c => c.id === activeId) || classes[0];

        // 园长 / 单园视角：榜单为"园所级"聚合（不再按班级切换）
        if (this.currentRole !== 'teacher') {
            const schoolName = this.selectedSchool ? this.selectedSchool.name : '本园';
            return `<div id="class-favorite-board-host" class="space-y-6">
                ${this.renderSchoolLevelBoards(classes, schoolName)}
            </div>`;
        }

        const showSelector = this.currentRole !== 'teacher' && classes.length > 1;
        const selectorBar = showSelector
            ? `<div class="flex items-center justify-end gap-2">
                <span class="text-xs text-slate-400">选择班级</span>
                <select onchange="App.setSchoolFavoriteClass(parseInt(this.value, 10))"
                    class="bg-slate-800/60 border border-slate-600/40 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-rose-400/50">
                    ${classes.map(c => `<option value="${c.id}" ${c.id === activeId ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
            </div>`
            : '';

        return `<div id="class-favorite-board-host" class="space-y-6">
            ${selectorBar}
            ${this.renderClassFavoriteBoard(activeCls)}
            ${this.renderClassInterestBoard(activeCls)}
            ${this.renderClassRecommendBoard(activeCls)}
        </div>`;
    },
    setSchoolFavoriteClass(classId) {
        this._selectedFavoriteClassId = classId;
        const cls = (MockData.classes || []).find(c => c.id === classId);
        if (!cls) return;
        const host = document.getElementById('class-favorite-board-host');
        if (!host) return;
        // 重新渲染整个 host（保留选择器，只刷新三个卡片）
        host.outerHTML = this.renderSchoolFavoriteBoard();
    },

    // 打开学生详情子页面（在当前标签页内容区域内）
    openStudentSubpage(html) {
        // 找到当前标签页内容容器
        const tabContent = document.getElementById('school-tab-content');
        if (!tabContent) return;
        
        // 保存原始内容
        this._originalStudentTabContent = tabContent.innerHTML;
        
        // 创建子页面容器
        const subpageContainer = document.createElement('div');
        subpageContainer.id = 'student-subpage-container';
        subpageContainer.className = 'animate-fadeIn';
        subpageContainer.innerHTML = html;
        
        // 清空并插入子页面
        tabContent.innerHTML = '';
        tabContent.appendChild(subpageContainer);
        
        // 隐藏筛选栏（如果存在）
        const filterBar = tabContent.previousElementSibling;
        if (filterBar && filterBar.classList.contains('filter-bar')) {
            filterBar.style.display = 'none';
            this._hiddenStudentFilterBar = filterBar;
        }
    },
    
    // 关闭学生详情子页面
    closeStudentSubpage() {
        const tabContent = document.getElementById('school-tab-content');
        if (!tabContent) return;
        
        // 恢复筛选栏
        if (this._hiddenStudentFilterBar) {
            this._hiddenStudentFilterBar.style.display = '';
            this._hiddenStudentFilterBar = null;
        }
        
        // 恢复到幼儿列表界面
        this.schoolDataTab = 'students';
        this.renderSchoolTabContent('students');
        
        // 清理保存的内容
        this._originalStudentTabContent = null;
        this._currentStudentReportId = null;
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
    //  移动端支持
    // ============================================================

    // 检测是否为移动设备
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    },

    // ============================================================
    //  手机端 AI 报告查看（班级 / 幼儿）
    // ============================================================
    renderMobileAiClassReportPanel(className) {
        if (!this._aiClassReports) this.loadAiClassReports?.();
        const list = (this._aiClassReports || {})[className] || [];
        if (!list.length) {
            return `
                <div class="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold text-gray-900">🧠 班级 AI 画像报告</h3>
                        <span class="text-xs text-gray-400">暂无</span>
                    </div>
                    <div class="text-sm text-gray-500 mt-2">该班级暂无已生成的 AI 分析报告</div>
                </div>
            `;
        }
        const latest = list[0];
        const dateStr = (latest.generatedAt || '').split(' ')[0] || '-';
        const escName = className.replace(/'/g, "\\'");
        return `
            <div class="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-base font-semibold text-gray-900">🧠 班级 AI 画像报告</h3>
                    <span class="px-2 py-0.5 rounded-full text-[11px] bg-indigo-50 text-indigo-600 border border-indigo-200">${list.length} 份</span>
                </div>
                <div class="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-3 mb-3">
                    <div class="text-xs text-gray-500 mb-1">最新报告 · ${dateStr}</div>
                    <div class="text-sm text-gray-800">${latest.rangeLabel || '-'} · ${latest.sampleCount || 0} 次对话样本</div>
                </div>
                <div class="flex gap-2">
                    <button onclick="App.openMobileAiReport('class', '${escName}', '${(latest.generatedAt || '').replace(/'/g, "\\'")}')" class="flex-1 px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium">查看最新</button>
                    <button onclick="App.openMobileAiReportList('class', '${escName}')" class="flex-1 px-3 py-2 rounded-lg bg-white border border-indigo-300 text-indigo-600 text-sm font-medium">历史 (${list.length})</button>
                </div>
            </div>
        `;
    },

    renderMobileAiStudentReportPanel(studentName) {
        if (!this._aiStudentReports) this.loadAiStudentReports?.();
        const list = (this._aiStudentReports || {})[studentName] || [];
        if (!list.length) {
            return `
                <div class="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold text-gray-900">🧠 AI 兴趣画像报告</h3>
                        <span class="text-xs text-gray-400">暂无</span>
                    </div>
                    <div class="text-sm text-gray-500 mt-2">该幼儿暂无已生成的 AI 分析报告</div>
                </div>
            `;
        }
        const latest = list[0];
        const dateStr = (latest.generatedAt || '').split(' ')[0] || '-';
        const escName = studentName.replace(/'/g, "\\'");
        return `
            <div class="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-base font-semibold text-gray-900">🧠 AI 兴趣画像报告</h3>
                    <span class="px-2 py-0.5 rounded-full text-[11px] bg-indigo-50 text-indigo-600 border border-indigo-200">${list.length} 份</span>
                </div>
                <div class="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-3 mb-3">
                    <div class="text-xs text-gray-500 mb-1">最新报告 · ${dateStr}</div>
                    <div class="text-sm text-gray-800">${latest.rangeLabel || '-'} · ${latest.sampleCount || 0} 次对话样本</div>
                </div>
                <div class="flex gap-2">
                    <button onclick="App.openMobileAiReport('student', '${escName}', '${(latest.generatedAt || '').replace(/'/g, "\\'")}')" class="flex-1 px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium">查看最新</button>
                    <button onclick="App.openMobileAiReportList('student', '${escName}')" class="flex-1 px-3 py-2 rounded-lg bg-white border border-indigo-300 text-indigo-600 text-sm font-medium">历史 (${list.length})</button>
                </div>
            </div>
        `;
    },

    _mobileAiList: function(type, key) {
        const store = type === 'class' ? (this._aiClassReports || {}) : (this._aiStudentReports || {});
        return store[key] || [];
    },

    openMobileAiReportList(type, key) {
        const list = this._mobileAiList(type, key);
        const titleName = key;
        const escKey = key.replace(/'/g, "\\'");
        const items = list.map(r => {
            const dateStr = (r.generatedAt || '').split(' ')[0] || '-';
            return `
                <div onclick="App.openMobileAiReport('${type}', '${escKey}', '${String(r.id || r.generatedAt || '').replace(/'/g, "\\'")}')" class="flex items-center justify-between px-4 py-3 border-b border-gray-100 active:bg-gray-50">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900">${dateStr}</div>
                        <div class="text-xs text-gray-500 mt-0.5">${r.rangeLabel || '-'} · ${r.sampleCount || 0} 次对话</div>
                    </div>
                    <svg class="w-4 h-4 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
            `;
        }).join('');
        const html = `
            <div class="min-h-screen bg-gray-50">
                <div class="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                    <button onclick="window.history.back()" class="p-2 -ml-2">
                        <svg class="w-6 h-6 text-gray-700" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <h1 class="text-lg font-semibold text-gray-900 flex-1">${type === 'class' ? '班级' : '幼儿'} AI 报告 · ${titleName}</h1>
                </div>
                <div class="bg-white mt-3 mx-3 rounded-xl border border-gray-200 overflow-hidden">
                    ${items || '<div class="px-4 py-8 text-center text-sm text-gray-400">暂无报告</div>'}
                </div>
            </div>
        `;
        this._renderMobileOverlay(html);
    },

    openMobileAiReport(type, key, reportId) {
        const list = this._mobileAiList(type, key);
        const r = list.find(x => (x.id || x.generatedAt) === reportId) || list[0];
        if (!r) return;
        const titleMap = {
            class: `${r.className || key} · 班级 AI 画像`,
            student: `${r.student || key} · AI 兴趣画像`
        };
        const top = (r.topQuestions || []).map((t, i) => `
            <div class="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                <span class="shrink-0 w-6 h-6 rounded-full ${i < 3 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'} text-xs flex items-center justify-center font-medium">${i + 1}</span>
                <span class="flex-1 text-sm text-gray-800">${t.q}</span>
                <span class="text-xs text-gray-400">${t.count} 次</span>
            </div>
        `).join('');
        const analysisHtml = this.simpleMarkdown(this.stripClusterJson(r.analysis || ''));
        const html = `
            <div class="min-h-screen bg-gray-50 pb-8">
                <div class="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                    <button onclick="window.history.back()" class="p-2 -ml-2">
                        <svg class="w-6 h-6 text-gray-700" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <h1 class="text-base font-semibold text-gray-900 flex-1 truncate">${titleMap[type] || 'AI 报告'}</h1>
                </div>
                <div class="px-4 pt-4">
                    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-3">
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div><span class="text-gray-500">生成时间</span><div class="text-gray-900 font-medium">${r.generatedAt || '-'}</div></div>
                            <div><span class="text-gray-500">范围</span><div class="text-gray-900 font-medium">${r.rangeLabel || '-'}</div></div>
                            <div><span class="text-gray-500">对话样本</span><div class="text-indigo-600 font-semibold">${r.sampleCount || 0} 次</div></div>
                            ${type === 'class' ? `<div><span class="text-gray-500">幼儿/绘本</span><div class="text-gray-900 font-medium">${r.studentCount || 0} 人 · ${r.bookCount || 0} 本</div></div>` : ''}
                        </div>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-3">
                        <h3 class="text-sm font-semibold text-gray-900 mb-2">🔥 ${type === 'class' ? '核心关注主题' : '核心关注主题'} TOP${Math.min(10, (r.topQuestions || []).length)}</h3>
                        ${top || '<div class="text-sm text-gray-400 py-2">暂无</div>'}
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 class="text-sm font-semibold text-gray-900 mb-2">🧠 AI 分析</h3>
                        <div class="mobile-ai-md text-sm leading-relaxed text-gray-800">${analysisHtml || '<div class="text-gray-400">暂无</div>'}</div>
                    </div>
                </div>
            </div>
        `;
        this._renderMobileOverlay(html);
    },

    _renderMobileOverlay(html) {
        let host = document.getElementById('mobile-overlay');
        if (!host) {
            host = document.createElement('div');
            host.id = 'mobile-overlay';
            host.style.cssText = 'position:fixed;inset:0;z-index:200;background:#fff;overflow-y:auto;-webkit-overflow-scrolling:touch;';
            document.body.appendChild(host);
            // 拦截返回
            history.pushState({ mobileOverlay: 1 }, '');
            window.addEventListener('popstate', this._mobileOverlayPopstate = () => {
                if (host && host.parentNode) host.parentNode.removeChild(host);
                window.removeEventListener('popstate', this._mobileOverlayPopstate);
            });
        }
        host.innerHTML = html;
        host.scrollTop = 0;
    },

    // 渲染移动端班级阅读报告（图3）
    renderMobileClassReport(classId, timeRange = '7d') {
        const cls = MockData.classes.find(c => c.id === classId);
        if (!cls) return;

        // 保存当前时间范围
        if (!this._mobileTimeRanges) this._mobileTimeRanges = {};
        this._mobileTimeRanges[`class_${classId}`] = timeRange;

        const students = MockData.students.filter(s => s.classId === classId);

        // 计算班级统计数据
        const totalActivityCount = students.reduce((sum, s) => sum + (s.activityCount || 0), 0);
        const totalDuration = students.reduce((sum, s) => {
            const duration = s.activityDuration || '0小时';
            const hours = parseFloat(duration);
            return sum + (isNaN(hours) ? 0 : hours);
        }, 0);
        const avgParticipants = students.length > 0 ? Math.round(students.length * 0.95) : 0;

        // 获取绘本类型趋势数据（折线图）
        const bookTypeTrendData = this.getClassBookTypeTrend(classId, timeRange);
        const bookTypeColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

        // 获取班级能力分布趋势数据（折线图）
        const abilityTrendData = this.getClassAbilityTrend(classId, timeRange);
        const abilityColors = {
            '社交': '#FF6B6B',
            '创造': '#4ECDC4',
            '科学': '#45B7D1',
            '语言': '#FFA07A',
            '艺术': '#98D8C8',
            '运动': '#F7DC6F',
            '逻辑': '#BB8FCE',
            '自然': '#85C1E2',
            '音乐': '#F06292'
        };

        // 时间范围标签
        const timeRangeLabels = {
            '7d': '近7天',
            '30d': '近30天',
            '90d': '近90天',
            'all': '全部'
        };

        const content = `
            <div class="min-h-screen bg-white">
                <!-- 头部 -->
                <div class="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <button onclick="window.history.back()" class="p-2 -ml-2">
                        <svg class="w-6 h-6 text-gray-700" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <h1 class="text-lg font-semibold text-gray-900">绘本阅读报告</h1>
                    <button class="p-2 -mr-2">
                        <svg class="w-6 h-6 text-gray-700" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                        </svg>
                    </button>
                </div>

                <!-- 班级名称 -->
                <div class="px-4 py-6 text-center">
                    <div class="inline-block px-6 py-2 bg-blue-50 border border-blue-200 rounded-full">
                        <span class="text-blue-600 font-medium">${cls.name}</span>
                    </div>
                </div>

                <!-- 时间筛选栏 -->
                <div class="px-4 pb-4">
                    <div class="bg-gray-50 rounded-xl p-3">
                        <div class="grid grid-cols-4 gap-2">
                            ${Object.entries(timeRangeLabels).map(([key, label]) => `
                                <button onclick="App.renderMobileClassReport(${classId}, '${key}')"
                                        class="px-3 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === key ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                    ${label}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- 统计卡片 -->
                <div class="px-4 pb-4">
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-blue-50 rounded-xl p-4 text-center">
                            <div class="text-xs text-blue-600 mb-1">绘本活动总次数</div>
                            <div class="text-2xl font-bold text-blue-600">${totalActivityCount}次</div>
                        </div>
                        <div class="bg-green-50 rounded-xl p-4 text-center">
                            <div class="text-xs text-green-600 mb-1">绘本活动总时长</div>
                            <div class="text-2xl font-bold text-green-600">${totalDuration.toFixed(1)}小时</div>
                        </div>
                        <div class="bg-purple-50 rounded-xl p-4 text-center">
                            <div class="text-xs text-purple-600 mb-1">班本数据总人次</div>
                            <div class="text-2xl font-bold text-purple-600">${avgParticipants}人</div>
                        </div>
                    </div>
                </div>

                <!-- 阅读绘本类型占比 -->
                <div class="px-4 pb-6">
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 class="text-base font-semibold text-gray-900 mb-3">阅读绘本类型占比</h3>
                        <div id="mobile-class-book-type-chart" style="height: 280px;"></div>
                        <div class="mt-4 grid grid-cols-2 gap-2">
                            ${bookTypeTrendData.types.map((type, idx) => `
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full" style="background-color: ${bookTypeColors[idx % bookTypeColors.length]}"></span>
                                    <span class="text-sm text-gray-600">${type}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mt-4 text-center text-xs text-amber-500">
                            ${timeRangeLabels[timeRange]}阅读最多的类型是"${bookTypeTrendData.types[0] || ''}"，建议多样化！
                        </div>
                    </div>
                </div>

                <!-- 班级能力分布 -->
                <div class="px-4 pb-6">
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 class="text-base font-semibold text-gray-900 mb-3">班级能力分布</h3>
                        <div id="mobile-class-ability-chart" style="height: 280px;"></div>
                        <div class="mt-4 grid grid-cols-3 gap-2">
                            ${abilityTrendData.abilities.map((ability, idx) => {
                                const palette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F06292'];
                                const color = palette[idx % palette.length];
                                return `
                                    <div class="flex items-center gap-2">
                                        <span class="w-3 h-3 rounded-full" style="background-color: ${color}"></span>
                                        <span class="text-sm text-gray-600">${ability}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <!-- 幼儿列表 -->
                <div class="px-4 pb-6">
                    ${this.renderMobileAiClassReportPanel(cls.name)}
                    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <h3 class="text-base font-semibold text-gray-900">幼儿列表（${students.length}人）</h3>
                        </div>
                        <div class="divide-y divide-gray-200">
                            ${students.map(s => `
                                <div class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100"
                                     onclick="App.renderMobileStudentReport(${s.id})">
                                    <div class="flex items-center gap-3 flex-1">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                                            ${s.name.charAt(0)}
                                        </div>
                                        <div class="flex-1">
                                            <div class="text-sm font-medium text-gray-900">${s.name}</div>
                                            <div class="text-xs text-gray-500">${s.code}</div>
                                        </div>
                                    </div>
                                    <button class="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600">
                                        查看报告
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.innerHTML = content;

        // 渲染折线图
        requestAnimationFrame(() => {
            // 渲染绘本类型折线图
            const chartDom = document.getElementById('mobile-class-book-type-chart');
            if (chartDom && bookTypeTrendData.dates.length > 0) {
                const chart = echarts.init(chartDom, (typeof Charts !== "undefined" && Charts.isWarm && Charts.isWarm()) ? "warm" : null);
                chart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross' }
                    },
                    legend: {
                        data: bookTypeTrendData.types,
                        bottom: 0,
                        textStyle: { fontSize: 10 }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '15%',
                        top: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: bookTypeTrendData.dates,
                        axisLabel: { fontSize: 10 }
                    },
                    yAxis: {
                        type: 'value',
                        name: '阅读次数',
                        nameTextStyle: { fontSize: 10 },
                        axisLabel: { fontSize: 10 }
                    },
                    series: bookTypeTrendData.types.map((type, idx) => ({
                        name: type,
                        type: 'line',
                        smooth: true,
                        data: bookTypeTrendData.series[type],
                        itemStyle: { color: bookTypeColors[idx % bookTypeColors.length] },
                        lineStyle: { width: 2 },
                        symbol: 'circle',
                        symbolSize: 6
                    }))
                });
            }

            // 渲染能力分布折线图
            const abilityChartDom = document.getElementById('mobile-class-ability-chart');
            if (abilityChartDom && abilityTrendData.dates.length > 0) {
                const abilityChart = echarts.init(abilityChartDom, (typeof Charts !== "undefined" && Charts.isWarm && Charts.isWarm()) ? "warm" : null);
                const abilityPalette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F06292'];
                abilityChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross' }
                    },
                    legend: {
                        data: abilityTrendData.abilities,
                        bottom: 0,
                        textStyle: { fontSize: 10 }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '15%',
                        top: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: abilityTrendData.dates,
                        axisLabel: { fontSize: 10 }
                    },
                    yAxis: {
                        type: 'value',
                        name: '能力值',
                        nameTextStyle: { fontSize: 10 },
                        axisLabel: { fontSize: 10 }
                    },
                    series: abilityTrendData.abilities.map((ability, idx) => {
                        const color = abilityPalette[idx % abilityPalette.length];
                        return {
                            name: ability,
                            type: 'line',
                            smooth: true,
                            data: abilityTrendData.series[ability],
                            itemStyle: { color },
                            lineStyle: { width: 2, color },
                            symbol: 'circle',
                            symbolSize: 6
                        };
                    })
                });
            }
        });
    },

    // 切换移动端时间筛选器
    toggleMobileTimeFilter(type, id) {
        const filterIdMap = {
            'class': 'mobile-class-time-filter',
            'class-ability': 'mobile-class-ability-time-filter',
            'student': 'mobile-student-time-filter'
        };
        const filterId = filterIdMap[type];
        const filterEl = document.getElementById(filterId);
        if (filterEl) {
            filterEl.classList.toggle('hidden');
        }
    },

    // 渲染移动端学生阅读报告（图2）
    renderMobileStudentReport(studentId, timeRange = '7d') {
        const sOriginal = MockData.students.find(s => s.id === studentId);
        if (!sOriginal) return;

        // 保存当前时间范围
        if (!this._mobileTimeRanges) this._mobileTimeRanges = {};
        this._mobileTimeRanges[`student_${studentId}`] = timeRange;

        const detail = this.getStudentReadingDetail(sOriginal);
        const s = {
            ...sOriginal,
            readDurationMinutes: detail.summary.duration,
            readTimes: detail.summary.times,
            bookCount: detail.summary.books,
            completedBooks: detail.summary.completed
        };

        // 获取阅读类型趋势数据（折线图）
        const bookTypeTrendData = this.getStudentBookTypeTrend(studentId, timeRange);
        const bookTypeColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

        // 获取能力分布趋势数据（折线图）
        const abilityTrendData = this.getStudentAbilityTrend(studentId, timeRange);
        const abilityColors = {
            '社交': '#FF6B6B',
            '创造': '#4ECDC4',
            '科学': '#45B7D1',
            '语言': '#FFA07A',
            '艺术': '#98D8C8',
            '运动': '#F7DC6F',
            '逻辑': '#BB8FCE',
            '自然': '#85C1E2',
            '音乐': '#F06292'
        };

        // 爱读榜数据
        const favoriteBooks = s.favoriteBooks || [];

        // 获取兴趣书单和建议书单
        const interestBooks = this.getStudentInterestBooks(studentId, timeRange);
        const recommendBooks = this.getStudentRecommendBooks(studentId, timeRange);

        // 时间范围标签
        const timeRangeLabels = {
            '7d': '近7天',
            '30d': '近30天',
            '90d': '近90天',
            'all': '全部'
        };

        const content = `
            <div class="min-h-screen bg-white">
                <!-- 头部 -->
                <div class="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <button onclick="App.renderMobileClassReport(${s.classId})" class="p-2 -ml-2">
                        <svg class="w-6 h-6 text-gray-700" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <h1 class="text-lg font-semibold text-gray-900">绘本阅读报告</h1>
                    <button class="p-2 -mr-2">
                        <svg class="w-6 h-6 text-gray-700" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                        </svg>
                    </button>
                </div>

                <!-- 学生信息 -->
                <div class="px-4 py-6 text-center">
                    <div class="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                            <span class="text-2xl">👦</span>
                        </div>
                    </div>
                    <h2 class="text-lg font-semibold text-gray-900 mb-1">${s.name}（编号${s.code.slice(-2)}）的阅读报告</h2>
                </div>

                <!-- 时间筛选栏 -->
                <div class="px-4 pb-4">
                    <div class="bg-gray-50 rounded-xl p-3">
                        <div class="grid grid-cols-4 gap-2">
                            ${Object.entries(timeRangeLabels).map(([key, label]) => `
                                <button onclick="App.renderMobileStudentReport(${studentId}, '${key}')"
                                        class="px-3 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === key ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                    ${label}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- 阅读统计 -->
                <div class="px-4 pb-4">
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 class="text-sm font-semibold text-gray-900 mb-3">阅读统计</h3>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="bg-blue-50 rounded-lg p-3 text-center">
                                <div class="text-xs text-blue-600 mb-1">阅读时长</div>
                                <div class="text-xl font-bold text-blue-600">${s.readDurationMinutes}分钟</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-3 text-center">
                                <div class="text-xs text-green-600 mb-1">阅读次数</div>
                                <div class="text-xl font-bold text-green-600">${s.readTimes}次</div>
                            </div>
                            <div class="bg-purple-50 rounded-lg p-3 text-center">
                                <div class="text-xs text-purple-600 mb-1">阅读绘本</div>
                                <div class="text-xl font-bold text-purple-600">${s.bookCount}本</div>
                            </div>
                            <div class="bg-pink-50 rounded-lg p-3 text-center">
                                <div class="text-xs text-pink-600 mb-1">完整读完</div>
                                <div class="text-xl font-bold text-pink-600">${s.completedBooks}本</div>
                            </div>
                        </div>
                        <div class="mt-3 text-center text-xs text-amber-500">
                            ${timeRangeLabels[timeRange]}共${s.readTimes}次阅读，建议每周阅读3次！
                        </div>
                    </div>
                </div>

                <!-- 阅读类型 -->
                <div class="px-4 pb-4">
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 class="text-sm font-semibold text-gray-900 mb-3">阅读类型</h3>
                        <div id="mobile-student-book-type-chart" style="height: 240px;"></div>
                        <div class="mt-3 grid grid-cols-2 gap-2">
                            ${bookTypeTrendData.types.map((type, idx) => `
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full" style="background-color: ${bookTypeColors[idx % bookTypeColors.length]}"></span>
                                    <span class="text-xs text-gray-600">${type}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- 能力分布 -->
                <div class="px-4 pb-4">
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 class="text-sm font-semibold text-gray-900 mb-3">能力分布</h3>
                        <div id="mobile-student-ability-chart" style="height: 240px;"></div>
                        <div class="mt-3 grid grid-cols-3 gap-2">
                            ${abilityTrendData.abilities.map((ability, idx) => {
                                const palette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F06292'];
                                const color = palette[idx % palette.length];
                                return `
                                    <div class="flex items-center gap-2">
                                        <span class="w-3 h-3 rounded-full" style="background-color: ${color}"></span>
                                        <span class="text-xs text-gray-600">${ability}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <!-- 爱读榜 -->
                <div class="px-4 pb-4">
                    ${this.renderMobileAiStudentReportPanel(sOriginal.name)}
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 class="text-sm font-semibold text-gray-900 mb-3">爱读榜</h3>
                        <div class="space-y-2">
                            ${favoriteBooks.slice(0, 4).map((book, idx) => `
                                <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                    <div class="text-lg">${['🌸', '🌺', '🌻', '🌼'][idx]}</div>
                                    <div class="flex-1 text-sm text-gray-700">${book}</div>
                                    <div class="text-xs text-gray-500">${4 - idx}次</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- 兴趣书单 -->
                <div class="px-4 pb-4">
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 class="text-sm font-semibold text-gray-900 mb-2">兴趣书单</h3>
                        <p class="text-xs text-gray-500 mb-3">基于 <span class="text-amber-500">${s.name}</span> 的阅读数据分析，发现TA很喜欢以下类型的书单</p>
                        <div class="space-y-2">
                            ${interestBooks.map((book, idx) => `
                                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                                    <div class="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">${idx + 1}</div>
                                    <div class="flex-1">
                                        <div class="text-sm font-medium text-gray-900">${book.name}</div>
                                        <div class="text-xs text-gray-500">${book.type}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- 建议书单 -->
                <div class="px-4 pb-6">
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 class="text-sm font-semibold text-gray-900 mb-2">建议书单</h3>
                        <p class="text-xs text-gray-500 mb-3">根据 <span class="text-amber-500">${s.name}</span> 的阅读偏好，推荐以下绘本</p>
                        <div class="space-y-2">
                            ${recommendBooks.map((book, idx) => `
                                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100">
                                    <div class="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">${idx + 1}</div>
                                    <div class="flex-1">
                                        <div class="text-sm font-medium text-gray-900">${book.name}</div>
                                        <div class="text-xs text-gray-500">${book.type}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- AI对话记录 -->
                <div class="px-4 pb-6">
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 class="text-sm font-semibold text-gray-900 mb-1">AI对话记录</h3>
                        <p class="text-xs text-gray-500 mb-3">查看 <span class="text-amber-500">${s.name}</span> 在绘本阅读中的 AI 对话详情</p>
                        ${(() => {
                            const chatRecords = App.getStudentChatRecords(studentId, timeRange);
                            if (!chatRecords.length) {
                                return '<div class="text-center py-6 text-gray-400 text-xs">暂无对话记录</div>';
                            }
                            let totalConvs = 0, totalTurns = 0;
                            chatRecords.forEach(a => a.books.forEach(b => b.conversations.forEach(c => {
                                totalConvs++;
                                totalTurns += c.turns.length;
                            })));
                            return `
                                <div class="flex gap-3 mb-3">
                                    <div class="flex-1 bg-indigo-50 rounded-lg p-2 text-center">
                                        <div class="text-lg font-bold text-indigo-600">${chatRecords.length}</div>
                                        <div class="text-xs text-indigo-400">绘本活动</div>
                                    </div>
                                    <div class="flex-1 bg-purple-50 rounded-lg p-2 text-center">
                                        <div class="text-lg font-bold text-purple-600">${totalConvs}</div>
                                        <div class="text-xs text-purple-400">对话次数</div>
                                    </div>
                                    <div class="flex-1 bg-pink-50 rounded-lg p-2 text-center">
                                        <div class="text-lg font-bold text-pink-600">${totalTurns}</div>
                                        <div class="text-xs text-pink-400">对话轮次</div>
                                    </div>
                                </div>
                                <div class="space-y-3">
                                    ${chatRecords.map((activity) => {
                                        const actConvs = activity.books.reduce((s, b) => s + b.conversations.length, 0);
                                        const actTurns = activity.books.reduce((s, b) => s + b.conversations.reduce((s2, c) => s2 + c.turns.length, 0), 0);
                                        return `
                                            <div class="border border-gray-100 rounded-lg overflow-hidden">
                                                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 cursor-pointer flex items-center justify-between" onclick="App.toggleChatBooks(this)">
                                                    <div class="flex items-center gap-2">
                                                        <span class="chat-arrow inline-block transition-transform text-gray-400" style="font-size:10px;transform:rotate(90deg)">&#9654;</span>
                                                        <span class="text-xs font-semibold text-indigo-700">${activity.activityLabel}</span>
                                                        <span class="text-xs text-gray-400">${activity.date}</span>
                                                    </div>
                                                    <div class="flex gap-2 text-xs text-gray-400">
                                                        <span>${activity.books.length}本绘本</span>
                                                        <span>${actConvs}次对话</span>
                                                        <span>${actTurns}轮</span>
                                                    </div>
                                                </div>
                                                <div class="chat-books-content" style="display:block">
                                                    ${activity.books.map((book) => {
                                                        const bookConvs = book.conversations.length;
                                                        const bookTurns = book.conversations.reduce((s, c) => s + c.turns.length, 0);
                                                        return `
                                                            <div class="border-t border-gray-50">
                                                                <div class="px-3 py-2 bg-gray-50/50">
                                                                    <div class="flex items-center justify-between">
                                                                        <div class="flex items-center gap-2">
                                                                            <span class="text-base">&#128214;</span>
                                                                            <span class="text-xs font-medium text-gray-800">${book.bookName}</span>
                                                                            <span class="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">${book.bookType}</span>
                                                                        </div>
                                                                        <div class="text-xs text-gray-400">${bookConvs}次对话 · ${bookTurns}轮</div>
                                                                    </div>
                                                                </div>
                                                                ${book.conversations.map((conv) => `
                                                                    <div class="border-t border-gray-50">
                                                                        <div class="px-3 py-2 cursor-pointer flex items-center gap-2 hover:bg-gray-50" onclick="App.toggleChatConv(this)">
                                                                            <span class="chat-arrow inline-block transition-transform text-gray-400" style="font-size:9px;transform:rotate(90deg)">&#9654;</span>
                                                                            <span class="text-xs font-medium text-gray-600">第${conv.convIndex}次对话</span>
                                                                            <span class="text-xs text-gray-400">${conv.page}</span>
                                                                            <span class="text-xs text-gray-300">${conv.time}</span>
                                                                            <span class="text-xs text-gray-300 ml-auto">${conv.turns.length}轮</span>
                                                                        </div>
                                                                        <div class="chat-conv-turns" style="display:block">
                                                                            ${conv.turns.map((turn, tIdx) => `
                                                                                <div class="px-3 pb-2">
                                                                                    <div class="flex gap-2 mb-1">
                                                                                        <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">${tIdx + 1}</span>
                                                                                        <div class="flex-1 bg-amber-50 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 leading-relaxed">${turn.q}</div>
                                                                                    </div>
                                                                                    <div class="flex gap-2">
                                                                                        <span class="shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">AI</span>
                                                                                        <div class="flex-1 bg-indigo-50 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 leading-relaxed">${turn.a}</div>
                                                                                    </div>
                                                                                </div>
                                                                            `).join('')}
                                                                        </div>
                                                                    </div>
                                                                `).join('')}
                                                            </div>
                                                        `;
                                                    }).join('')}
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            `;
                        })()}
                    </div>
                </div>
            </div>
        `;

        document.body.innerHTML = content;

        // 渲染折线图
        requestAnimationFrame(() => {
            // 渲染阅读类型折线图
            const chartDom = document.getElementById('mobile-student-book-type-chart');
            if (chartDom && bookTypeTrendData.dates.length > 0) {
                const chart = echarts.init(chartDom, (typeof Charts !== "undefined" && Charts.isWarm && Charts.isWarm()) ? "warm" : null);
                chart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross' }
                    },
                    legend: {
                        data: bookTypeTrendData.types,
                        bottom: 0,
                        textStyle: { fontSize: 10 }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '15%',
                        top: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: bookTypeTrendData.dates,
                        axisLabel: { fontSize: 10 }
                    },
                    yAxis: {
                        type: 'value',
                        name: '阅读次数',
                        nameTextStyle: { fontSize: 10 },
                        axisLabel: { fontSize: 10 }
                    },
                    series: bookTypeTrendData.types.map((type, idx) => ({
                        name: type,
                        type: 'line',
                        smooth: true,
                        data: bookTypeTrendData.series[type],
                        itemStyle: { color: bookTypeColors[idx % bookTypeColors.length] },
                        lineStyle: { width: 2 },
                        symbol: 'circle',
                        symbolSize: 6
                    }))
                });
            }

            // 渲染能力分布折线图
            const abilityChartDom = document.getElementById('mobile-student-ability-chart');
            if (abilityChartDom && abilityTrendData.dates.length > 0) {
                const abilityChart = echarts.init(abilityChartDom, (typeof Charts !== "undefined" && Charts.isWarm && Charts.isWarm()) ? "warm" : null);
                const abilityPalette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F06292'];
                abilityChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross' }
                    },
                    legend: {
                        data: abilityTrendData.abilities,
                        bottom: 0,
                        textStyle: { fontSize: 10 }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '15%',
                        top: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: abilityTrendData.dates,
                        axisLabel: { fontSize: 10 }
                    },
                    yAxis: {
                        type: 'value',
                        name: '能力值',
                        nameTextStyle: { fontSize: 10 },
                        axisLabel: { fontSize: 10 }
                    },
                    series: abilityTrendData.abilities.map((ability, idx) => {
                        const color = abilityPalette[idx % abilityPalette.length];
                        return {
                            name: ability,
                            type: 'line',
                            smooth: true,
                            data: abilityTrendData.series[ability],
                            itemStyle: { color },
                            lineStyle: { width: 2, color },
                            symbol: 'circle',
                            symbolSize: 6
                        };
                    })
                });
            }
        });
    },

    // 获取班级绘本类型数据
    getClassBookTypeData(classId) {
        const students = MockData.students.filter(s => s.classId === classId);
        const typeCount = {};

        students.forEach(s => {
            const stats = s.bookTypeStats || {};
            Object.entries(stats).forEach(([type, count]) => {
                typeCount[type] = (typeCount[type] || 0) + count;
            });
        });

        return Object.entries(typeCount)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    },

    // 获取班级能力分布数据
    getClassAbilityData(classId) {
        const students = MockData.students.filter(s => s.classId === classId);
        const abilitySum = {};

        students.forEach(s => {
            const stats = s.abilityStats || {};
            Object.entries(stats).forEach(([ability, value]) => {
                abilitySum[ability] = (abilitySum[ability] || 0) + value;
            });
        });

        const total = Object.values(abilitySum).reduce((sum, val) => sum + val, 0);

        return Object.entries(abilitySum)
            .map(([name, sum]) => ({
                name,
                value: total > 0 ? Math.round((sum / total) * 100) : 0
            }))
            .sort((a, b) => b.value - a.value);
    },

    // 获取班级绘本类型趋势数据（折线图）
    getClassBookTypeTrend(classId, timeRange) {
        const students = MockData.students.filter(s => s.classId === classId);

        // 根据时间范围生成日期数组
        const dates = this.generateDateRange(timeRange);

        // 收集所有类型
        const allTypes = new Set();
        students.forEach(s => {
            const stats = s.bookTypeStats || {};
            Object.keys(stats).forEach(type => allTypes.add(type));
        });

        const types = Array.from(allTypes).sort();

        // 为每个类型生成趋势数据
        const series = {};
        types.forEach(type => {
            series[type] = dates.map(() => {
                // 模拟趋势数据：基础值 + 随机波动
                const baseValue = Math.floor(Math.random() * 15) + 5;
                const fluctuation = Math.floor(Math.random() * 8) - 4;
                return Math.max(0, baseValue + fluctuation);
            });
        });

        return { dates, types, series };
    },

    // 获取班级能力分布趋势数据（折线图）
    getClassAbilityTrend(classId, timeRange) {
        const students = MockData.students.filter(s => s.classId === classId);

        // 根据时间范围生成日期数组
        const dates = this.generateDateRange(timeRange);

        // 收集所有能力
        const allAbilities = new Set();
        students.forEach(s => {
            const stats = s.abilityStats || {};
            Object.keys(stats).forEach(ability => allAbilities.add(ability));
        });

        const abilities = Array.from(allAbilities).sort();

        // 为每个能力生成趋势数据
        const series = {};
        abilities.forEach(ability => {
            series[ability] = dates.map(() => {
                // 模拟趋势数据：基础值 + 随机波动
                const baseValue = Math.floor(Math.random() * 30) + 40;
                const fluctuation = Math.floor(Math.random() * 15) - 7;
                return Math.max(20, Math.min(100, baseValue + fluctuation));
            });
        });

        return { dates, abilities, series };
    },

    // 获取学生绘本类型趋势数据（折线图）
    getStudentBookTypeTrend(studentId, timeRange) {
        const student = MockData.students.find(s => s.id === studentId);
        if (!student) return { dates: [], types: [], series: {} };

        // 根据时间范围生成日期数组
        const dates = this.generateDateRange(timeRange);

        // 获取学生的阅读类型
        const bookTypeStats = student.bookTypeStats || {};
        const types = Object.keys(bookTypeStats).sort();

        // 为每个类型生成趋势数据
        const series = {};
        types.forEach(type => {
            series[type] = dates.map(() => {
                // 模拟趋势数据：基础值 + 随机波动
                const baseValue = Math.floor(Math.random() * 8) + 2;
                const fluctuation = Math.floor(Math.random() * 5) - 2;
                return Math.max(0, baseValue + fluctuation);
            });
        });

        return { dates, types, series };
    },

    // 获取学生能力分布趋势数据（折线图）
    getStudentAbilityTrend(studentId, timeRange) {
        const student = MockData.students.find(s => s.id === studentId);
        if (!student) return { dates: [], abilities: [], series: {} };

        // 根据时间范围生成日期数组
        const dates = this.generateDateRange(timeRange);

        // 获取学生的能力
        const abilityStats = student.abilityStats || {};
        const abilities = Object.keys(abilityStats).sort();

        // 为每个能力生成趋势数据
        const series = {};
        abilities.forEach(ability => {
            series[ability] = dates.map(() => {
                // 模拟趋势数据：基础值 + 随机波动
                const baseValue = Math.floor(Math.random() * 30) + 40;
                const fluctuation = Math.floor(Math.random() * 15) - 7;
                return Math.max(20, Math.min(100, baseValue + fluctuation));
            });
        });

        return { dates, abilities, series };
    },

    // 获取学生兴趣书单
    getStudentInterestBooks(studentId, timeRange) {
        const bookPool = [
            { name: '小熊维尼', type: '童话故事' },
            { name: '好饿的毛毛虫', type: '科普绘本' },
            { name: '猜猜我有多爱你', type: '情感绘本' },
            { name: '爷爷一定有办法', type: '生活故事' },
            { name: '逃家小兔', type: '情感绘本' },
            { name: '花婆婆', type: '人生哲理' },
            { name: '我爸爸', type: '家庭绘本' },
            { name: '我妈妈', type: '家庭绘本' },
            { name: '大卫不可以', type: '行为习惯' },
            { name: '鳄鱼怕怕牙医怕怕', type: '生活故事' }
        ];

        let count = 3; // 默认7天推荐3本
        if (timeRange === '30d') count = 5;
        else if (timeRange === '90d' || timeRange === 'all') count = 7;

        // 随机选择书籍
        const shuffled = [...bookPool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    },

    // 获取学生建议书单
    getStudentRecommendBooks(studentId, timeRange) {
        const bookPool = [
            { name: '月亮的味道', type: '想象力绘本' },
            { name: '彩虹色的花', type: '友谊绘本' },
            { name: '活了100万次的猫', type: '生命教育' },
            { name: '母鸡萝丝去散步', type: '幽默绘本' },
            { name: '小蓝和小黄', type: '友谊绘本' },
            { name: '要是你给老鼠吃饼干', type: '因果关系' },
            { name: '小黑鱼', type: '勇气绘本' },
            { name: '小房子', type: '环保绘本' },
            { name: '石头汤', type: '分享绘本' },
            { name: '爱心树', type: '情感绘本' }
        ];

        let count = 3; // 默认7天推荐3本
        if (timeRange === '30d') count = 5;
        else if (timeRange === '90d' || timeRange === 'all') count = 7;

        // 随机选择书籍
        const shuffled = [...bookPool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    },

    // 生成日期范围
    generateDateRange(timeRange) {
        const dates = [];
        let days = 7;

        switch(timeRange) {
            case '7d': days = 7; break;
            case '30d': days = 30; break;
            case '90d': days = 90; break;
            case 'all': days = 90; break;
        }

        const today = new Date();

        // 根据天数决定日期格式和间隔
        if (days <= 7) {
            // 7天：显示每天
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
            }
        } else if (days <= 30) {
            // 30天：每3天一个点
            for (let i = days - 1; i >= 0; i -= 3) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
            }
        } else {
            // 90天：每7天一个点
            for (let i = days - 1; i >= 0; i -= 7) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
            }
        }

        return dates;
    },

    // 获取学生AI对话记录
    getStudentChatRecords(studentId, timeRange = '7d') {
        const allRecords = MockData.studentChatRecords[studentId] || [];
        if (!allRecords.length) return [];

        // 按时间范围过滤
        const now = new Date();
        let cutoff = null;
        switch(timeRange) {
            case '7d': cutoff = new Date(now.getTime() - 7 * 86400000); break;
            case '30d': cutoff = new Date(now.getTime() - 30 * 86400000); break;
            case '90d': cutoff = new Date(now.getTime() - 90 * 86400000); break;
            case 'all': cutoff = null; break;
        }

        const filtered = cutoff
            ? allRecords.filter(a => new Date(a.date) >= cutoff)
            : allRecords;

        // 按日期降序排列
        return filtered.sort((a, b) => b.date.localeCompare(a.date));
    },

    // 切换对话记录展开/折叠
    toggleChatConv(el) {
        const turnsEl = el.nextElementSibling;
        const arrowEl = el.querySelector('.chat-arrow');
        if (turnsEl.style.display === 'none') {
            turnsEl.style.display = 'block';
            arrowEl.style.transform = 'rotate(90deg)';
        } else {
            turnsEl.style.display = 'none';
            arrowEl.style.transform = 'rotate(0deg)';
        }
    },

    // 切换活动下绘本列表展开/折叠
    toggleChatBooks(el) {
        const booksEl = el.nextElementSibling;
        const arrowEl = el.querySelector('.chat-arrow');
        if (booksEl.style.display === 'none') {
            booksEl.style.display = 'block';
            arrowEl.style.transform = 'rotate(90deg)';
        } else {
            booksEl.style.display = 'none';
            arrowEl.style.transform = 'rotate(0deg)';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
