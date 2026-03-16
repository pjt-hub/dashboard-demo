// 园所综合数据统计模块
const SchoolData = {
    currentTab: 'sdOverview',
    activityPage: 1,
    activityPageSize: 10,
    bookPage: 1,
    bookPageSize: 10,
    studentPage: 1,
    studentPageSize: 10,
    filters: {
        activity: { dateEnd: '', className: '', teacher: '' },
        book: { name: '', type: '' },
        student: { name: '', className: '' }
    },

    init() {
        this.bindTabEvents();
        this.renderTab('sdOverview');
    },

    bindTabEvents() {
        document.querySelectorAll('.sd-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.sd-tab-btn').forEach(b => {
                    b.classList.remove('active-sd-tab', 'bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
                    b.classList.add('text-slate-400', 'border-transparent');
                });
                e.target.classList.add('active-sd-tab', 'bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
                e.target.classList.remove('text-slate-400', 'border-transparent');
                const tab = e.target.dataset.sdTab;
                this.currentTab = tab;
                this.renderTab(tab);
            });
        });
    },

    renderTab(tab) {
        const container = document.getElementById('sd-tab-content');
        if (!container) return;
        Charts.dispose();
        switch(tab) {
            case 'sdOverview': this.renderOverview(container); break;
            case 'sdActivity': this.renderActivity(container); break;
            case 'sdBooks': this.renderBooks(container); break;
            case 'sdDevice': this.renderDevice(container); break;
            case 'sdClass': this.renderClass(container); break;
            case 'sdTeacher': this.renderTeacher(container); break;
            case 'sdStudent': this.renderStudent(container); break;
        }
    },

    // ========== 数据概述 ==========
    renderOverview(container) {
        const d = MockData.schoolData.overview;
        container.innerHTML = `
            <section class="mb-6">
                <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span class="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full"></span>
                    园所绘本活动概况
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 metric-card">
                        <div class="text-sm text-slate-400 mb-1">绘本活动总次数</div>
                        <div class="text-3xl font-bold text-blue-400">${d.activityTotal}<span class="text-sm text-slate-400 ml-1">次</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 metric-card">
                        <div class="text-sm text-slate-400 mb-1">绘本活动总时长</div>
                        <div class="text-3xl font-bold text-emerald-400">${d.activityDuration}<span class="text-sm text-slate-400 ml-1">小时</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 metric-card">
                        <div class="text-sm text-slate-400 mb-1">参与活动人次</div>
                        <div class="text-3xl font-bold text-amber-400">191<span class="text-sm text-slate-400 ml-1">人次</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 metric-card">
                        <div class="text-sm text-slate-400 mb-1">绘本阅读时长</div>
                        <div class="text-3xl font-bold text-purple-400">${d.bookReadDuration}<span class="text-sm text-slate-400 ml-1">小时</span></div>
                    </div>
                </div>
            </section>
            <section class="mb-6">
                <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span class="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-400 rounded-full"></span>
                    园所绘本概况
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                        <div class="text-sm text-slate-400 mb-1">绘本总数</div>
                        <div class="text-2xl font-bold text-white">${d.bookTotal}<span class="text-sm text-slate-400 ml-1">本</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                        <div class="text-sm text-slate-400 mb-1">阅读次数</div>
                        <div class="text-2xl font-bold text-white">${d.bookReadCount}<span class="text-sm text-slate-400 ml-1">次</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                        <div class="text-sm text-slate-400 mb-1">阅读时长</div>
                        <div class="text-2xl font-bold text-white">${d.bookReadDuration}<span class="text-sm text-slate-400 ml-1">小时</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                        <div class="text-sm text-slate-400 mb-1">绘本类型</div>
                        <div class="text-2xl font-bold text-white">6<span class="text-sm text-slate-400 ml-1">种</span></div>
                    </div>
                </div>
                <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                    <h3 class="text-sm font-semibold text-slate-300 mb-3">按类型分类统计</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        ${d.bookByType.map(item => `
                            <div class="bg-slate-700/40 rounded-xl p-3 text-center hover:bg-slate-600/40 transition-colors cursor-pointer">
                                <div class="text-sm font-medium text-white mb-2">${item.type}</div>
                                <div class="text-lg font-bold text-blue-400">${item.count}<span class="text-xs text-slate-400">次</span></div>
                                <div class="text-xs text-slate-400 mt-1">${item.duration}小时</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                    <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span class="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-400 rounded-full"></span>
                        园所设备概况
                    </h2>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="text-center"><div class="text-2xl font-bold text-amber-400">${d.deviceTotal}</div><div class="text-xs text-slate-400 mt-1">设备总数(台)</div></div>
                        <div class="text-center"><div class="text-2xl font-bold text-blue-400">${d.deviceUseCount}</div><div class="text-xs text-slate-400 mt-1">总使用次数</div></div>
                        <div class="text-center"><div class="text-2xl font-bold text-emerald-400">${d.deviceUseDuration}</div><div class="text-xs text-slate-400 mt-1">总使用时长(h)</div></div>
                    </div>
                    <div id="sd-device-pie-chart" class="h-64 mt-4"></div>
                </div>
                <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                    <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span class="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-400 rounded-full"></span>
                        园所基础信息
                    </h2>
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <div class="text-center"><div class="text-2xl font-bold text-purple-400">${d.classTotal}</div><div class="text-xs text-slate-400 mt-1">班级总数</div></div>
                        <div class="text-center"><div class="text-2xl font-bold text-pink-400">${d.teacherTotal}</div><div class="text-xs text-slate-400 mt-1">教师总数</div></div>
                        <div class="text-center"><div class="text-2xl font-bold text-cyan-400">${d.studentTotal}</div><div class="text-xs text-slate-400 mt-1">幼儿总数</div></div>
                    </div>
                    <div id="sd-base-info-chart" class="h-64 mt-4"></div>
                </div>
            </section>
        `;
        requestAnimationFrame(() => { requestAnimationFrame(() => { this.initOverviewCharts(); }); });
    },

    initOverviewCharts() {
        const pieEl = document.getElementById('sd-device-pie-chart');
        if (pieEl) {
            const chart = echarts.init(pieEl);
            const devices = MockData.schoolData.devices;
            const sc = { '\u5728\u7ebf': 0, '\u79bb\u7ebf': 0, '\u7ef4\u62a4\u4e2d': 0 };
            devices.forEach(d => sc[d.status]++);
            chart.setOption({
                backgroundColor: 'transparent',
                tooltip: { trigger: 'item', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', textStyle: { color: '#fff' } },
                legend: { bottom: 0, textStyle: { color: '#94a3b8', fontSize: 12 } },
                series: [{ type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
                    itemStyle: { borderRadius: 6, borderColor: '#1e293b', borderWidth: 2 },
                    label: { show: true, color: '#fff', formatter: '{b}: {c}\u53f0' },
                    data: [
                        { value: sc['\u5728\u7ebf'], name: '\u5728\u7ebf', itemStyle: { color: '#22c55e' } },
                        { value: sc['\u79bb\u7ebf'], name: '\u79bb\u7ebf', itemStyle: { color: '#ef4444' } },
                        { value: sc['\u7ef4\u62a4\u4e2d'], name: '\u7ef4\u62a4\u4e2d', itemStyle: { color: '#f59e0b' } }
                    ]
                }]
            });
            Charts.instances.sdDevicePie = chart;
            window.addEventListener('resize', () => chart.resize());
        }
        const barEl = document.getElementById('sd-base-info-chart');
        if (barEl) {
            const chart = echarts.init(barEl);
            const classes = MockData.schoolData.classes;
            chart.setOption({
                backgroundColor: 'transparent',
                tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', textStyle: { color: '#fff' } },
                grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
                xAxis: { type: 'category', data: classes.map(c => c.name), axisLabel: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#334155' } } },
                yAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1e293b' } } },
                series: [{ name: '\u5b66\u751f\u6570', type: 'bar', data: classes.map(c => c.studentCount),
                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#818cf8' }, { offset: 1, color: '#6366f1' }]), borderRadius: [4, 4, 0, 0] },
                    barWidth: '50%'
                }]
            });
            Charts.instances.sdBaseInfo = chart;
            window.addEventListener('resize', () => chart.resize());
        }
    },

    // ========== 绘本活动 ==========
    renderActivity(container) {
        const data = this.getFilteredActivities();
        const total = data.length;
        const totalPages = Math.ceil(total / this.activityPageSize) || 1;
        const start = (this.activityPage - 1) * this.activityPageSize;
        const pageData = data.slice(start, start + this.activityPageSize);
        const classNames = [...new Set(MockData.schoolData.activities.map(a => a.className))];
        const teacherNames = [...new Set(MockData.schoolData.activities.map(a => a.teacher))];

        container.innerHTML = `
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 mb-6">
                <div class="flex flex-wrap items-end gap-4">
                    <div><label class="text-xs text-slate-400 block mb-1">活动结束时间</label>
                        <input type="date" id="sd-act-date" value="${this.filters.activity.dateEnd}" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"></div>
                    <div><label class="text-xs text-slate-400 block mb-1">参与班级</label>
                        <select id="sd-act-class" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">全部班级</option>
                            ${classNames.map(c => '<option value="' + c + '"' + (this.filters.activity.className === c ? ' selected' : '') + '>' + c + '</option>').join('')}
                        </select></div>
                    <div><label class="text-xs text-slate-400 block mb-1">教师</label>
                        <select id="sd-act-teacher" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">全部教师</option>
                            ${teacherNames.map(t => '<option value="' + t + '"' + (this.filters.activity.teacher === t ? ' selected' : '') + '>' + t + '</option>').join('')}
                        </select></div>
                    <button id="sd-act-search" class="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">查询</button>
                    <button id="sd-act-reset" class="bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg px-4 py-2 transition-colors">重置</button>
                </div>
            </div>
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead><tr class="bg-slate-700/50">
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">活动开始时间</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">活动结束时间</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">教师</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">参与班级</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">参与幼儿</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">绘本名称</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">操作</th>
                        </tr></thead>
                        <tbody>${pageData.map((item, idx) => '<tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover"><td class="px-4 py-3 text-sm text-slate-300">' + (start + idx + 1) + '</td><td class="px-4 py-3 text-sm text-slate-300">' + item.startTime + '</td><td class="px-4 py-3 text-sm text-slate-300">' + item.endTime + '</td><td class="px-4 py-3 text-sm text-white font-medium">' + item.teacher + '</td><td class="px-4 py-3 text-sm text-slate-300">' + item.className + '</td><td class="px-4 py-3 text-sm text-slate-300">' + item.studentCount + '\u4eba</td><td class="px-4 py-3 text-sm text-slate-300">' + item.bookName + '</td><td class="px-4 py-3 text-center"><button class="sd-act-view-btn text-blue-400 hover:text-blue-300 text-sm transition-colors" data-id="' + item.id + '">\u67e5\u770b</button></td></tr>').join('')}</tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between px-4 py-3 bg-slate-700/30">
                    <div class="text-sm text-slate-400">\u5171 ${total} \u6761\u8bb0\u5f55\uff0c\u6bcf\u9875 ${this.activityPageSize} \u6761</div>
                    <div class="flex items-center gap-2">
                        <button class="sd-page-btn px-3 py-1 rounded text-sm ${this.activityPage <= 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="prev" ${this.activityPage <= 1 ? 'disabled' : ''}>\u4e0a\u4e00\u9875</button>
                        ${this.renderPageNumbers(this.activityPage, totalPages)}
                        <button class="sd-page-btn px-3 py-1 rounded text-sm ${this.activityPage >= totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="next" ${this.activityPage >= totalPages ? 'disabled' : ''}>\u4e0b\u4e00\u9875</button>
                        <span class="text-sm text-slate-400 ml-2">\u7b2c ${this.activityPage}/${totalPages} \u9875</span>
                    </div>
                </div>
            </div>
        `;
        this.bindActivityEvents(totalPages);
    },

    getFilteredActivities() {
        let data = [...MockData.schoolData.activities];
        const f = this.filters.activity;
        if (f.dateEnd) data = data.filter(a => a.endTime.split(' ')[0] <= f.dateEnd);
        if (f.className) data = data.filter(a => a.className === f.className);
        if (f.teacher) data = data.filter(a => a.teacher === f.teacher);
        return data;
    },

    bindActivityEvents(totalPages) {
        document.getElementById('sd-act-search')?.addEventListener('click', () => {
            this.filters.activity.dateEnd = document.getElementById('sd-act-date')?.value || '';
            this.filters.activity.className = document.getElementById('sd-act-class')?.value || '';
            this.filters.activity.teacher = document.getElementById('sd-act-teacher')?.value || '';
            this.activityPage = 1;
            this.renderTab('sdActivity');
        });
        document.getElementById('sd-act-reset')?.addEventListener('click', () => {
            this.filters.activity = { dateEnd: '', className: '', teacher: '' };
            this.activityPage = 1;
            this.renderTab('sdActivity');
        });
        document.querySelectorAll('.sd-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const page = btn.dataset.page;
                if (action === 'prev' && this.activityPage > 1) this.activityPage--;
                else if (action === 'next' && this.activityPage < totalPages) this.activityPage++;
                else if (page) this.activityPage = parseInt(page);
                this.renderTab('sdActivity');
            });
        });
        document.querySelectorAll('.sd-act-view-btn').forEach(btn => {
            btn.addEventListener('click', () => { this.showActivityDetail(parseInt(btn.dataset.id)); });
        });
    },

    showActivityDetail(id) {
        const item = MockData.schoolData.activities.find(a => a.id === id);
        if (!item) return;
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]';
        modal.innerHTML = '<div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-lg w-full mx-4 shadow-2xl">' +
            '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white">\u7ed8\u672c\u6d3b\u52a8\u8be6\u60c5</h3>' +
            '<button class="sd-modal-close text-slate-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>' +
            '<div class="space-y-3">' +
            '<div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">\u7ed8\u672c\u540d\u79f0</span><span class="text-white font-medium">' + item.bookName + '</span></div>' +
            '<div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">\u6388\u8bfe\u6559\u5e08</span><span class="text-white">' + item.teacher + '</span></div>' +
            '<div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">\u53c2\u4e0e\u73ed\u7ea7</span><span class="text-white">' + item.className + '</span></div>' +
            '<div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">\u53c2\u4e0e\u4eba\u6570</span><span class="text-white">' + item.studentCount + '\u4eba</span></div>' +
            '<div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">\u5f00\u59cb\u65f6\u95f4</span><span class="text-white">' + item.startTime + '</span></div>' +
            '<div class="flex justify-between py-2"><span class="text-slate-400">\u7ed3\u675f\u65f6\u95f4</span><span class="text-white">' + item.endTime + '</span></div></div>' +
            '<div class="mt-4 p-3 bg-slate-700/40 rounded-xl"><div class="text-sm text-slate-400 mb-2">\u6d3b\u52a8\u8bc4\u4ef7</div>' +
            '<div class="flex items-center gap-1"><span class="text-amber-400">\u2605\u2605\u2605\u2605\u2606</span><span class="text-sm text-amber-400 ml-1">4.0</span></div>' +
            '<div class="text-xs text-slate-400 mt-1">\u5e7c\u513f\u53c2\u4e0e\u5ea6\u9ad8\uff0c\u4e92\u52a8\u79ef\u6781</div></div></div>';
        document.body.appendChild(modal);
        modal.querySelector('.sd-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    },

    renderPageNumbers(current, total) {
        let html = '';
        const maxShow = 5;
        let start = Math.max(1, current - Math.floor(maxShow / 2));
        let end = Math.min(total, start + maxShow - 1);
        if (end - start < maxShow - 1) start = Math.max(1, end - maxShow + 1);
        for (let i = start; i <= end; i++) {
            html += '<button class="sd-page-btn px-3 py-1 rounded text-sm ' + (i === current ? 'bg-blue-500 text-white' : 'text-slate-300 hover:bg-slate-600') + '" data-page="' + i + '">' + i + '</button>';
        }
        return html;
    },

    // ========== 绘本 ==========
    renderBooks(container) {
        const data = this.getFilteredBooks();
        const total = data.length;
        const totalPages = Math.ceil(total / this.bookPageSize) || 1;
        const start = (this.bookPage - 1) * this.bookPageSize;
        const pageData = data.slice(start, start + this.bookPageSize);
        const types = [...new Set(MockData.schoolData.books.map(b => b.type))];

        container.innerHTML = `
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 mb-6">
                <div class="flex flex-wrap items-end gap-4">
                    <div><label class="text-xs text-slate-400 block mb-1">绘本名称</label>
                        <input type="text" id="sd-book-name" value="${this.filters.book.name}" placeholder="\u641c\u7d22\u7ed8\u672c\u540d\u79f0" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 w-48"></div>
                    <div><label class="text-xs text-slate-400 block mb-1">绘本类型</label>
                        <select id="sd-book-type" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">全部类型</option>
                            ${types.map(t => '<option value="' + t + '"' + (this.filters.book.type === t ? ' selected' : '') + '>' + t + '</option>').join('')}
                        </select></div>
                    <button id="sd-book-search" class="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">查询</button>
                    <button id="sd-book-reset" class="bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg px-4 py-2 transition-colors">重置</button>
                </div>
            </div>
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead><tr class="bg-slate-700/50">
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">绘本</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">作者</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">类型</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读次数</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读时长</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">操作</th>
                        </tr></thead>
                        <tbody>${pageData.map((item, idx) => '<tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover"><td class="px-4 py-3 text-sm text-slate-300">' + (start + idx + 1) + '</td><td class="px-4 py-3"><div class="flex items-center gap-2"><span class="text-xl">' + item.cover + '</span><span class="text-sm text-white font-medium">' + item.name + '</span></div></td><td class="px-4 py-3 text-sm text-slate-300">' + item.author + '</td><td class="px-4 py-3"><span class="text-xs px-2 py-1 rounded-full ' + this.getTypeColor(item.type) + '">' + item.type + '</span></td><td class="px-4 py-3 text-sm text-center text-white font-medium">' + item.readCount + '</td><td class="px-4 py-3 text-sm text-center text-slate-300">' + item.readDuration + '</td><td class="px-4 py-3 text-center"><button class="sd-book-view-btn text-blue-400 hover:text-blue-300 text-sm transition-colors" data-id="' + item.id + '">\u8be6\u60c5</button></td></tr>').join('')}</tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between px-4 py-3 bg-slate-700/30">
                    <div class="text-sm text-slate-400">\u5171 ${total} \u6761\u8bb0\u5f55</div>
                    <div class="flex items-center gap-2">
                        <button class="sd-book-page-btn px-3 py-1 rounded text-sm ${this.bookPage <= 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="prev" ${this.bookPage <= 1 ? 'disabled' : ''}>\u4e0a\u4e00\u9875</button>
                        ${this.renderBookPageNumbers(this.bookPage, totalPages)}
                        <button class="sd-book-page-btn px-3 py-1 rounded text-sm ${this.bookPage >= totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="next" ${this.bookPage >= totalPages ? 'disabled' : ''}>\u4e0b\u4e00\u9875</button>
                    </div>
                </div>
            </div>
        `;
        this.bindBookEvents(totalPages);
    },

    getFilteredBooks() {
        let data = [...MockData.schoolData.books];
        const f = this.filters.book;
        if (f.name) data = data.filter(b => b.name.includes(f.name));
        if (f.type) data = data.filter(b => b.type === f.type);
        return data;
    },

    renderBookPageNumbers(current, total) {
        let html = '';
        for (let i = 1; i <= total; i++) {
            html += '<button class="sd-book-page-btn px-3 py-1 rounded text-sm ' + (i === current ? 'bg-blue-500 text-white' : 'text-slate-300 hover:bg-slate-600') + '" data-page="' + i + '">' + i + '</button>';
        }
        return html;
    },

    bindBookEvents(totalPages) {
        document.getElementById('sd-book-search')?.addEventListener('click', () => {
            this.filters.book.name = document.getElementById('sd-book-name')?.value || '';
            this.filters.book.type = document.getElementById('sd-book-type')?.value || '';
            this.bookPage = 1;
            this.renderTab('sdBooks');
        });
        document.getElementById('sd-book-reset')?.addEventListener('click', () => {
            this.filters.book = { name: '', type: '' };
            this.bookPage = 1;
            this.renderTab('sdBooks');
        });
        document.querySelectorAll('.sd-book-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const page = btn.dataset.page;
                if (action === 'prev' && this.bookPage > 1) this.bookPage--;
                else if (action === 'next' && this.bookPage < totalPages) this.bookPage++;
                else if (page) this.bookPage = parseInt(page);
                this.renderTab('sdBooks');
            });
        });
        document.querySelectorAll('.sd-book-view-btn').forEach(btn => {
            btn.addEventListener('click', () => { this.showBookDetail(parseInt(btn.dataset.id)); });
        });
    },

    showBookDetail(id) {
        const item = MockData.schoolData.books.find(b => b.id === id);
        if (!item) return;
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]';
        modal.innerHTML = '<div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-lg w-full mx-4 shadow-2xl">' +
            '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white">\u7ed8\u672c\u8be6\u60c5</h3>' +
            '<button class="sd-modal-close text-slate-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>' +
            '<div class="flex items-center gap-4 mb-4"><div class="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center text-3xl">' + item.cover + '</div>' +
            '<div><div class="text-lg font-semibold text-white">' + item.name + '</div><div class="text-sm text-slate-400">' + item.author + '</div>' +
            '<span class="text-xs px-2 py-1 rounded-full ' + this.getTypeColor(item.type) + ' mt-1 inline-block">' + item.type + '</span></div></div>' +
            '<div class="grid grid-cols-2 gap-4"><div class="bg-slate-700/40 rounded-xl p-3 text-center"><div class="text-2xl font-bold text-blue-400">' + item.readCount + '</div><div class="text-xs text-slate-400">\u9605\u8bfb\u6b21\u6570</div></div>' +
            '<div class="bg-slate-700/40 rounded-xl p-3 text-center"><div class="text-2xl font-bold text-emerald-400">' + item.readDuration + '</div><div class="text-xs text-slate-400">\u9605\u8bfb\u65f6\u957f</div></div></div></div>';
        document.body.appendChild(modal);
        modal.querySelector('.sd-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    },

    getTypeColor(type) {
        const colors = {
            '\u65e5\u5e38\u751f\u6d3b': 'bg-blue-500/20 text-blue-400',
            '\u79d1\u666e\u767e\u79d1': 'bg-emerald-500/20 text-emerald-400',
            '\u8bed\u8a00\u5b66\u4e60': 'bg-amber-500/20 text-amber-400',
            '\u56fd\u5b66\u6587\u5316': 'bg-red-500/20 text-red-400',
            '\u60c5\u5546\u54c1\u683c': 'bg-purple-500/20 text-purple-400',
            '\u4eba\u9645\u4ea4\u5f80': 'bg-pink-500/20 text-pink-400'
        };
        return colors[type] || 'bg-slate-500/20 text-slate-400';
    },

    // ========== 设备使用 ==========
    renderDevice(container) {
        const devices = MockData.schoolData.devices;
        container.innerHTML = `
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead><tr class="bg-slate-700/50">
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">设备名称</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">所在位置</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">使用次数</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">使用时长(h)</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">状态</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">最后使用</th>
                        </tr></thead>
                        <tbody>${devices.map((d, idx) => '<tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover"><td class="px-4 py-3 text-sm text-slate-300">' + (idx + 1) + '</td><td class="px-4 py-3 text-sm text-white font-medium">' + d.name + '</td><td class="px-4 py-3 text-sm text-slate-300">' + d.location + '</td><td class="px-4 py-3 text-sm text-center text-white">' + d.useCount + '</td><td class="px-4 py-3 text-sm text-center text-slate-300">' + d.useDuration + '</td><td class="px-4 py-3 text-center"><span class="text-xs px-2 py-1 rounded-full ' + (d.status === '\u5728\u7ebf' ? 'bg-emerald-500/20 text-emerald-400' : d.status === '\u79bb\u7ebf' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400') + '">' + d.status + '</span></td><td class="px-4 py-3 text-sm text-slate-400">' + d.lastUse + '</td></tr>').join('')}</tbody>
                    </table>
                </div>
                <div class="px-4 py-3 bg-slate-700/30 text-sm text-slate-400">\u5171 ${devices.length} \u53f0\u8bbe\u5907</div>
            </div>
            <div class="mt-6 bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2"><span class="w-2 h-5 bg-amber-500 rounded-full"></span>设备使用排行</h3>
                <div id="sd-device-bar-chart" class="h-80"></div>
            </div>
        `;
        requestAnimationFrame(() => { requestAnimationFrame(() => {
            const el = document.getElementById('sd-device-bar-chart');
            if (el) {
                const chart = echarts.init(el);
                const sorted = [...devices].sort((a, b) => b.useCount - a.useCount);
                chart.setOption({
                    backgroundColor: 'transparent',
                    tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', textStyle: { color: '#fff' } },
                    grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
                    xAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1e293b' } } },
                    yAxis: { type: 'category', data: sorted.map(d => d.name), axisLabel: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#334155' } } },
                    series: [{ name: '\u4f7f\u7528\u6b21\u6570', type: 'bar', data: sorted.map(d => d.useCount),
                        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#f97316' }]), borderRadius: [0, 4, 4, 0] }, barWidth: '55%' }]
                });
                Charts.instances.sdDeviceBar = chart;
                window.addEventListener('resize', () => chart.resize());
            }
        }); });
    },

    // ========== 班级 ==========
    renderClass(container) {
        const classes = MockData.schoolData.classes;
        container.innerHTML = `
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead><tr class="bg-slate-700/50">
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">班级名称</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">班主任</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">学生人数</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">活动次数</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读次数</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">平均时长(min)</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">操作</th>
                        </tr></thead>
                        <tbody>${classes.map((c, idx) => '<tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover"><td class="px-4 py-3 text-sm text-slate-300">' + (idx + 1) + '</td><td class="px-4 py-3 text-sm text-white font-medium">' + c.name + '</td><td class="px-4 py-3 text-sm text-slate-300">' + c.teacherName + '</td><td class="px-4 py-3 text-sm text-center text-white">' + c.studentCount + '</td><td class="px-4 py-3 text-sm text-center text-blue-400 font-medium">' + c.activityCount + '</td><td class="px-4 py-3 text-sm text-center text-emerald-400 font-medium">' + c.readCount + '</td><td class="px-4 py-3 text-sm text-center text-slate-300">' + c.avgDuration + '</td><td class="px-4 py-3 text-center"><button class="sd-class-view-btn text-blue-400 hover:text-blue-300 text-sm transition-colors" data-id="' + c.id + '">\u67e5\u770b\u8be6\u60c5</button></td></tr>').join('')}</tbody>
                    </table>
                </div>
                <div class="px-4 py-3 bg-slate-700/30 text-sm text-slate-400">\u5171 ${classes.length} \u4e2a\u73ed\u7ea7</div>
            </div>
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2"><span class="w-2 h-5 bg-blue-500 rounded-full"></span>班级活动数据对比</h3>
                <div id="sd-class-compare-chart" class="h-80"></div>
            </div>
        `;
        document.querySelectorAll('.sd-class-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const c = classes.find(cl => cl.id === id);
                if (!c) return;
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]';
                modal.innerHTML = '<div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-lg w-full mx-4 shadow-2xl">' +
                    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white">' + c.name + ' \u8be6\u60c5</h3>' +
                    '<button class="sd-modal-close text-slate-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>' +
                    '<div class="grid grid-cols-2 gap-4">' +
                    '<div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-white">' + c.studentCount + '</div><div class="text-xs text-slate-400">\u5b66\u751f\u4eba\u6570</div></div>' +
                    '<div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-blue-400">' + c.activityCount + '</div><div class="text-xs text-slate-400">\u6d3b\u52a8\u6b21\u6570</div></div>' +
                    '<div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-emerald-400">' + c.readCount + '</div><div class="text-xs text-slate-400">\u9605\u8bfb\u6b21\u6570</div></div>' +
                    '<div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-amber-400">' + c.avgDuration + 'min</div><div class="text-xs text-slate-400">\u5e73\u5747\u65f6\u957f</div></div></div>' +
                    '<div class="mt-4 text-sm text-slate-400">\u73ed\u4e3b\u4efb\uff1a' + c.teacherName + '</div></div>';
                document.body.appendChild(modal);
                modal.querySelector('.sd-modal-close').addEventListener('click', () => modal.remove());
                modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
            });
        });
        requestAnimationFrame(() => { requestAnimationFrame(() => {
            const el = document.getElementById('sd-class-compare-chart');
            if (el) {
                const chart = echarts.init(el);
                chart.setOption({
                    backgroundColor: 'transparent',
                    tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', textStyle: { color: '#fff' } },
                    legend: { data: ['\u6d3b\u52a8\u6b21\u6570', '\u9605\u8bfb\u6b21\u6570'], textStyle: { color: '#94a3b8' }, bottom: 0 },
                    grid: { left: '3%', right: '4%', bottom: '12%', top: '5%', containLabel: true },
                    xAxis: { type: 'category', data: classes.map(c => c.name), axisLabel: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#334155' } } },
                    yAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1e293b' } } },
                    series: [
                        { name: '\u6d3b\u52a8\u6b21\u6570', type: 'bar', data: classes.map(c => c.activityCount), itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] }, barWidth: '30%' },
                        { name: '\u9605\u8bfb\u6b21\u6570', type: 'bar', data: classes.map(c => c.readCount), itemStyle: { color: '#22c55e', borderRadius: [4, 4, 0, 0] }, barWidth: '30%' }
                    ]
                });
                Charts.instances.sdClassCompare = chart;
                window.addEventListener('resize', () => chart.resize());
            }
        }); });
    },

    // ========== 教师 ==========
    renderTeacher(container) {
        const teachers = MockData.schoolData.teachers;
        container.innerHTML = `
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead><tr class="bg-slate-700/50">
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">教师姓名</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">所带班级</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">活动次数</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">总时长(h)</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">学生数</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">使用绘本数</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">平均评分</th>
                        </tr></thead>
                        <tbody>${teachers.map((t, idx) => '<tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover"><td class="px-4 py-3 text-sm text-slate-300">' + (idx + 1) + '</td><td class="px-4 py-3 text-sm text-white font-medium">' + t.name + '</td><td class="px-4 py-3 text-sm text-slate-300">' + t.className + '</td><td class="px-4 py-3 text-sm text-center text-blue-400 font-medium">' + t.activityCount + '</td><td class="px-4 py-3 text-sm text-center text-slate-300">' + t.totalDuration + '</td><td class="px-4 py-3 text-sm text-center text-slate-300">' + t.studentCount + '</td><td class="px-4 py-3 text-sm text-center text-slate-300">' + t.bookCount + '</td><td class="px-4 py-3 text-center"><div class="flex items-center justify-center gap-1"><svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span class="text-sm text-amber-400">' + t.avgRating + '</span></div></td></tr>').join('')}</tbody>
                    </table>
                </div>
                <div class="px-4 py-3 bg-slate-700/30 text-sm text-slate-400">\u5171 ${teachers.length} \u4f4d\u6559\u5e08</div>
            </div>
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2"><span class="w-2 h-5 bg-purple-500 rounded-full"></span>教师活动排行</h3>
                <div id="sd-teacher-rank-chart" class="h-80"></div>
            </div>
        `;
        requestAnimationFrame(() => { requestAnimationFrame(() => {
            const el = document.getElementById('sd-teacher-rank-chart');
            if (el) {
                const chart = echarts.init(el);
                const sorted = [...teachers].sort((a, b) => b.activityCount - a.activityCount);
                chart.setOption({
                    backgroundColor: 'transparent',
                    tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', textStyle: { color: '#fff' } },
                    grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
                    xAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1e293b' } } },
                    yAxis: { type: 'category', data: sorted.map(t => t.name), axisLabel: { color: '#94a3b8', fontSize: 12 }, axisLine: { lineStyle: { color: '#334155' } }, inverse: true },
                    series: [{ name: '\u6d3b\u52a8\u6b21\u6570', type: 'bar', data: sorted.map(t => t.activityCount),
                        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#a855f7' }, { offset: 1, color: '#ec4899' }]), borderRadius: [0, 4, 4, 0] },
                        barWidth: '55%', label: { show: true, position: 'right', color: '#fff', fontSize: 12 } }]
                });
                Charts.instances.sdTeacherRank = chart;
                window.addEventListener('resize', () => chart.resize());
            }
        }); });
    },

    // ========== 幼儿 ==========
    renderStudent(container) {
        const data = this.getFilteredStudents();
        const total = data.length;
        const totalPages = Math.ceil(total / this.studentPageSize) || 1;
        const start = (this.studentPage - 1) * this.studentPageSize;
        const pageData = data.slice(start, start + this.studentPageSize);
        const classNames = [...new Set(MockData.schoolData.students.map(s => s.className))];

        container.innerHTML = `
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 mb-6">
                <div class="flex flex-wrap items-end gap-4">
                    <div><label class="text-xs text-slate-400 block mb-1">幼儿姓名</label>
                        <input type="text" id="sd-stu-name" value="${this.filters.student.name}" placeholder="\u641c\u7d22\u59d3\u540d" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 w-40"></div>
                    <div><label class="text-xs text-slate-400 block mb-1">所在班级</label>
                        <select id="sd-stu-class" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">全部班级</option>
                            ${classNames.map(c => '<option value="' + c + '"' + (this.filters.student.className === c ? ' selected' : '') + '>' + c + '</option>').join('')}
                        </select></div>
                    <button id="sd-stu-search" class="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">查询</button>
                    <button id="sd-stu-reset" class="bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg px-4 py-2 transition-colors">重置</button>
                </div>
            </div>
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead><tr class="bg-slate-700/50">
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">姓名</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">班级</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读次数</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读时长</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">偏好类型</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读等级</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">最近活跃</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">操作</th>
                        </tr></thead>
                        <tbody>${pageData.map((s, idx) => {
                            const levelColor = s.level === '\u9605\u8bfb\u8fbe\u4eba' ? 'bg-amber-500/20 text-amber-400' : s.level === '\u9605\u8bfb\u5c0f\u80fd\u624b' ? 'bg-blue-500/20 text-blue-400' : s.level === '\u9605\u8bfb\u65b0\u661f' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400';
                            return '<tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover"><td class="px-4 py-3 text-sm text-slate-300">' + (start + idx + 1) + '</td><td class="px-4 py-3 text-sm text-white font-medium">' + s.name + '</td><td class="px-4 py-3 text-sm text-slate-300">' + s.className + '</td><td class="px-4 py-3 text-sm text-center text-blue-400 font-medium">' + s.readCount + '</td><td class="px-4 py-3 text-sm text-center text-slate-300">' + s.readDuration + '</td><td class="px-4 py-3 text-center"><span class="text-xs px-2 py-1 rounded-full ' + this.getTypeColor(s.favoriteType) + '">' + s.favoriteType + '</span></td><td class="px-4 py-3 text-center"><span class="text-xs px-2 py-1 rounded-full ' + levelColor + '">' + s.level + '</span></td><td class="px-4 py-3 text-sm text-slate-400">' + s.lastActive + '</td><td class="px-4 py-3 text-center"><button class="sd-stu-view-btn text-blue-400 hover:text-blue-300 text-sm transition-colors" data-id="' + s.id + '">\u67e5\u770b</button></td></tr>';
                        }).join('')}</tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between px-4 py-3 bg-slate-700/30">
                    <div class="text-sm text-slate-400">\u5171 ${total} \u6761\u8bb0\u5f55</div>
                    <div class="flex items-center gap-2">
                        <button class="sd-stu-page-btn px-3 py-1 rounded text-sm ${this.studentPage <= 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="prev" ${this.studentPage <= 1 ? 'disabled' : ''}>\u4e0a\u4e00\u9875</button>
                        ${this.renderStudentPageNumbers(this.studentPage, totalPages)}
                        <button class="sd-stu-page-btn px-3 py-1 rounded text-sm ${this.studentPage >= totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="next" ${this.studentPage >= totalPages ? 'disabled' : ''}>\u4e0b\u4e00\u9875</button>
                    </div>
                </div>
            </div>
        `;
        this.bindStudentEvents(totalPages);
    },

    getFilteredStudents() {
        let data = [...MockData.schoolData.students];
        const f = this.filters.student;
        if (f.name) data = data.filter(s => s.name.includes(f.name));
        if (f.className) data = data.filter(s => s.className === f.className);
        return data;
    },

    renderStudentPageNumbers(current, total) {
        let html = '';
        for (let i = 1; i <= total; i++) {
            html += '<button class="sd-stu-page-btn px-3 py-1 rounded text-sm ' + (i === current ? 'bg-blue-500 text-white' : 'text-slate-300 hover:bg-slate-600') + '" data-page="' + i + '">' + i + '</button>';
        }
        return html;
    },

    bindStudentEvents(totalPages) {
        document.getElementById('sd-stu-search')?.addEventListener('click', () => {
            this.filters.student.name = document.getElementById('sd-stu-name')?.value || '';
            this.filters.student.className = document.getElementById('sd-stu-class')?.value || '';
            this.studentPage = 1;
            this.renderTab('sdStudent');
        });
        document.getElementById('sd-stu-reset')?.addEventListener('click', () => {
            this.filters.student = { name: '', className: '' };
            this.studentPage = 1;
            this.renderTab('sdStudent');
        });
        document.querySelectorAll('.sd-stu-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const page = btn.dataset.page;
                if (action === 'prev' && this.studentPage > 1) this.studentPage--;
                else if (action === 'next' && this.studentPage < totalPages) this.studentPage++;
                else if (page) this.studentPage = parseInt(page);
                this.renderTab('sdStudent');
            });
        });
        document.querySelectorAll('.sd-stu-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const s = MockData.schoolData.students.find(st => st.id === id);
                if (!s) return;
                const levelColor = s.level === '\u9605\u8bfb\u8fbe\u4eba' ? 'bg-amber-500/20 text-amber-400' : s.level === '\u9605\u8bfb\u5c0f\u80fd\u624b' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400';
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]';
                modal.innerHTML = '<div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-lg w-full mx-4 shadow-2xl">' +
                    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white">' + s.name + ' \u7684\u9605\u8bfb\u6863\u6848</h3>' +
                    '<button class="sd-modal-close text-slate-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>' +
                    '<div class="grid grid-cols-2 gap-4 mb-4">' +
                    '<div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-blue-400">' + s.readCount + '</div><div class="text-xs text-slate-400">\u9605\u8bfb\u6b21\u6570</div></div>' +
                    '<div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-emerald-400">' + s.readDuration + '</div><div class="text-xs text-slate-400">\u9605\u8bfb\u65f6\u957f</div></div></div>' +
                    '<div class="space-y-2">' +
                    '<div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">\u73ed\u7ea7</span><span class="text-white">' + s.className + '</span></div>' +
                    '<div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">\u504f\u597d\u7c7b\u578b</span><span class="text-white">' + s.favoriteType + '</span></div>' +
                    '<div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">\u9605\u8bfb\u7b49\u7ea7</span><span class="text-white"><span class="text-xs px-2 py-1 rounded-full ' + levelColor + '">' + s.level + '</span></span></div>' +
                    '<div class="flex justify-between py-2"><span class="text-slate-400">\u6700\u8fd1\u6d3b\u8dc3</span><span class="text-white">' + s.lastActive + '</span></div></div></div>';
                document.body.appendChild(modal);
                modal.querySelector('.sd-modal-close').addEventListener('click', () => modal.remove());
                modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
            });
        });
    }
};
