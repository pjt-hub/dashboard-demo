// 图表管理器 - 深色科技风主题
const Charts = {
    instances: [],

    dispose() {
        this.instances.forEach(chart => {
            if (chart && !chart.isDisposed()) chart.dispose();
        });
        this.instances = [];
    },

    safeInit(fn) {
        try { fn(); } catch (e) {
            // 用 error 而非 warn，并打出函数源码片段，方便定位是哪张图表初始化失败
            console.error('Chart init error:', e, '\n源码片段:', String(fn).slice(0, 120));
        }
    },

    // —— 园所班均使用 散点气泡图(管理员视角) ——
    // filterDistrict: 'all' | 具体区名,默认 'all'
    initBanjunScatter(domId, data, filterDistrict) {
        const chart = this.createChart(domId);
        if (!chart || !data || !data.schools || !data.schools.length) return null;
        const filter = filterDistrict || 'all';
        const allSchools = data.schools;
        const schools = filter === 'all' ? allSchools : allSchools.filter(s => (s.district || '未分类') === filter);
        const palette = this.palette();
        // 颜色映射用全量数据,避免筛选后颜色串位
        const allDistricts = Array.from(new Set(allSchools.map(s => s.district || '未分类')));
        const colorOf = d => palette[allDistricts.indexOf(d) % palette.length];

        const districtMap = {};
        schools.forEach(s => {
            const d = s.district || '未分类';
            if (!districtMap[d]) districtMap[d] = [];
            districtMap[d].push(s);
        });
        const districts = Object.keys(districtMap);

        const series = districts.map(district => ({
            name: district,
            type: 'scatter',
            symbolSize: (val, params) => {
                const cls = params.data.classCount || 1;
                return Math.max(14, Math.min(40, Math.sqrt(cls) * 5.5));
            },
            itemStyle: {
                color: colorOf(district),
                opacity: 0.55,
                borderColor: '#FFFFFF',
                borderWidth: 1.5,
                shadowColor: 'rgba(91,33,182,0.18)',
                shadowBlur: 6,
            },
            emphasis: {
                focus: 'series',
                scale: 1.4,
                itemStyle: { opacity: 1, shadowBlur: 16, borderWidth: 2 },
                label: { show: true, formatter: p => p.data.name, position: 'top', fontSize: 11, fontWeight: 600, color: '#1E1B4B' }
            },
            data: districtMap[district].map(s => ({
                value: [s.avgActivityCount, s.avgParticipantCount],
                name: s.name,
                district: s.district,
                classCount: s.classCount,
            })),
        }));

        // markLine 用当前可见数据重算,使象限切分对得上
        const avg = (arr, key) => arr.length ? +(arr.reduce((s, x) => s + x[key], 0) / arr.length).toFixed(1) : 0;
        const avgX = filter === 'all' ? data.summary.avgActivityCount : avg(schools, 'avgActivityCount');
        const avgY = filter === 'all' ? data.summary.avgParticipantCount : avg(schools, 'avgParticipantCount');
        const avgLabel = filter === 'all' ? '区域均' : `${filter}均`;

        const option = {
            color: palette,
            tooltip: {
                trigger: 'item',
                formatter: p => {
                    const d = p.data;
                    return `<div style="font-weight:600;margin-bottom:4px">${d.name}</div>` +
                           `<div style="color:#6D28D9">${d.district} · ${d.classCount} 个班</div>` +
                           `<div style="margin-top:4px">班均活动 <b>${d.value[0]}</b> 次</div>` +
                           `<div>班均参与 <b>${d.value[1]}</b> 人次</div>`;
                }
            },
            legend: {
                top: 0,
                left: 'center',
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: { color: this.axisColor(), fontSize: 11 },
                data: districts,
            },
            grid: { top: 36, left: 50, right: 18, bottom: 44 },
            xAxis: {
                type: 'value',
                name: '班均活动次数 (次/班)',
                nameLocation: 'middle',
                nameGap: 28,
                nameTextStyle: { color: this.axisColor(), fontSize: 11 },
                axisLine: { lineStyle: { color: this.splitLineColor() } },
                axisLabel: { color: this.axisColor(), fontSize: 11 },
                splitLine: { lineStyle: { color: this.splitLineColor(), type: 'dashed' } },
            },
            yAxis: {
                type: 'value',
                name: '班均参与人次',
                nameLocation: 'middle',
                nameGap: 36,
                nameTextStyle: { color: this.axisColor(), fontSize: 11 },
                axisLine: { lineStyle: { color: this.splitLineColor() } },
                axisLabel: { color: this.axisColor(), fontSize: 11 },
                splitLine: { lineStyle: { color: this.splitLineColor(), type: 'dashed' } },
            },
            series: series.concat([{
                // 区域均值参考线(把图分 4 象限)
                type: 'scatter',
                data: [],
                markLine: {
                    silent: true,
                    symbol: 'none',
                    lineStyle: { color: '#A78BFA', type: 'dashed', width: 1 },
                    label: {
                        formatter: p => p.data.xAxis !== undefined ? `${avgLabel} ${avgX}` : `${avgLabel} ${avgY}`,
                        color: '#7C3AED',
                        fontSize: 10,
                    },
                    data: [
                        { xAxis: avgX },
                        { yAxis: avgY },
                    ]
                }
            }])
        };
        chart.setOption(option);
        return chart;
    },

    createChart(domId) {
        const dom = document.getElementById(domId);
        if (!dom) return null;
        if (!this._themesRegistered) this.registerThemes();
        const themeName = this.isWarm() ? 'warm' : null;
        const chart = echarts.init(dom, themeName);
        this.instances.push(chart);
        return chart;
    },

    registerThemes() {
        if (this._themesRegistered) return;
        if (typeof echarts === 'undefined') return;
        echarts.registerTheme('warm', {
            color: ['#1677FF', '#13C2C2', '#FAAD14', '#EB2F96', '#52C41A', '#722ED1', '#F5222D', '#2F54EB'],
            backgroundColor: 'transparent',
            textStyle: { color: '#4A4D5E' },
            title: { textStyle: { color: '#1A1B25' }, subtextStyle: { color: '#9094A8' } },
            line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 2 }, symbolSize: 6, smooth: true },
            radar: {
                axisLine: { lineStyle: { color: '#D8DAE5' } },
                splitLine: { lineStyle: { color: '#ECECF2' } },
                splitArea: { areaStyle: { color: ['rgba(247,248,252,0.6)', 'rgba(238,241,250,0.4)'] } }
            },
            bar: { itemStyle: { borderRadius: 4 } },
            categoryAxis: {
                axisLine: { lineStyle: { color: '#D8DAE5' } },
                axisTick: { lineStyle: { color: '#D8DAE5' } },
                axisLabel: { color: '#4A4D5E' },
                splitLine: { lineStyle: { color: '#ECECF2' } }
            },
            valueAxis: {
                axisLine: { lineStyle: { color: '#D8DAE5' } },
                axisTick: { lineStyle: { color: '#D8DAE5' } },
                axisLabel: { color: '#4A4D5E' },
                splitLine: { lineStyle: { color: '#ECECF2' } }
            },
            legend: { textStyle: { color: '#4A4D5E' } },
            tooltip: {
                backgroundColor: 'rgba(255,255,255,0.98)',
                borderColor: '#D8DAE5',
                borderWidth: 1,
                textStyle: { color: '#1A1B25' },
                axisPointer: { lineStyle: { color: '#6366F1' }, crossStyle: { color: '#6366F1' } }
            }
        });
        this._themesRegistered = true;
    },

    // 通用深色主题配置
    darkTheme: {
        backgroundColor: 'transparent',
        textStyle: { color: '#a0aec0' },
        title: { textStyle: { color: '#f1f5f9' } },
        legend: { textStyle: { color: '#a0aec0' } },
        tooltip: {
            backgroundColor: 'rgba(30,41,59,0.95)',
            borderColor: 'rgba(96,165,250,0.2)',
            textStyle: { color: '#e2e8f0' }
        }
    },

    // 暖白主题配置
    warmTheme: {
        backgroundColor: 'transparent',
        textStyle: { color: '#6E5F50' },
        title: { textStyle: { color: '#4A3F35' } },
        legend: { textStyle: { color: '#6E5F50' } },
        tooltip: {
            backgroundColor: 'rgba(255,251,243,0.98)',
            borderColor: '#D9C7A8',
            textStyle: { color: '#4A3F35' }
        }
    },

    isWarm() {
        // 默认 = 白紫主题(无 class);只有显式挂上 theme-dark 才走深色
        if (typeof document === 'undefined') return false;
        return !document.body.classList.contains('theme-dark');
    },

    // 当前生效的色板（用在 option.color 替换硬编码数组）
    palette() {
        return this.isWarm()
            ? ['#8B5CF6', '#6366F1', '#F59E0B', '#EC4899', '#14B8A6', '#A78BFA', '#F472B6', '#2563EB']
            : ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#14b8a6', '#a855f7'];
    },
    axisColor() { return this.isWarm() ? '#6D28D9' : '#94a3b8'; },
    splitLineColor() { return this.isWarm() ? 'rgba(221,214,254,0.5)' : 'rgba(148,163,184,0.15)'; },
    radarSplitArea() {
        return this.isWarm()
            ? ['rgba(245,243,255,0.6)', 'rgba(237,233,254,0.5)', 'rgba(221,214,254,0.4)', 'rgba(196,181,253,0.3)']
            : ['rgba(15,23,42,0.1)', 'rgba(30,41,59,0.2)', 'rgba(51,65,85,0.15)', 'rgba(71,85,105,0.1)'];
    },
    theme() { return this.isWarm() ? this.warmTheme : this.darkTheme; },

    // ========== 大数据总览图表 ==========
    initDataOverviewCharts(customData = null) {
        const data = customData || {
            bookTypes: MockData.bookTypes,
            abilityDistribution: MockData.abilityDistribution,
            weeklyActivity: MockData.weeklyActivity,
            teacherRanking: MockData.teacherRanking,
            classRanking: MockData.classRanking,
            classUsageComparison: null,
            kindergartenUsageSeries: null,
            bookTypeTimeSeries: null
        };
        // 绘本类型图表：饼图展示
        this.safeInit(() => this.initBookTypePie(data.bookTypes));
        this.safeInit(() => this.initAbilityRadar(data.abilityDistribution));
        // 缓存活动数据 + 按当前选择类型渲染（折线 / 柱状）
        if (typeof App !== 'undefined') App._lastWeeklyActivityData = data.weeklyActivity;
        const weeklyTypes = (typeof App !== 'undefined' && App.weeklyActivityChartTypes) || ['line', 'bar'];
        // 园长视角：大数据总览页用「教师活动次数 Top10」替代原「园所绘本活动次数」趋势图
        if (typeof App !== 'undefined' && App.currentRole === 'principal') {
            this.safeInit(() => this.initTeacherTop10Bar(App.buildTeacherTop10()));
        } else {
            this.safeInit(() => this.initWeeklyActivityBar(data.weeklyActivity, weeklyTypes));
        }
        // admin 视角的"园所使用次数趋势"已搬到区域数据页 compare tab，总览页不再渲染
        if (App.currentRole !== 'admin') {
            this.safeInit(() => this.initTeacherRankingBar(data.teacherRanking));
        }
        // 班级 TOP10 图表已下线（园长视角去重，班级差异请去"园所数据-班级"tab）
        this.safeInit(() => this.initClassUsageCompareRadar(data.classUsageComparison));
    },

    // 绘本类型阅读次数 - 饼图
    initBookTypePie(customData = null) {
        const chart = this.createChart('book-type-chart');
        if (!chart) return;

        // 兼容时间序列入参：把堆叠总和聚合为饼图所需的 {name,value}
        let pieData;
        if (customData && customData.series && customData.dates) {
            pieData = customData.series.map(item => ({
                name: item.name,
                value: (item.values || []).reduce((s, v) => s + (v || 0), 0)
            }));
        } else {
            pieData = (customData || MockData.bookTypes).map(t => ({ name: t.name, value: t.value }));
        }

        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { ...this.darkTheme.tooltip, trigger: 'item', formatter: '{b}: {c}次 ({d}%)' },
            legend: { bottom: 0, textStyle: { color: '#a0aec0', fontSize: 12 } },
            color: ['#1677FF', '#13C2C2', '#FAAD14', '#EB2F96', '#52C41A', '#722ED1'],
            series: [{
                type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
                avoidLabelOverlap: true,
                itemStyle: { borderRadius: 6, borderColor: 'rgba(120,160,220,0.35)', borderWidth: 2 },
                label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, color: '#a0aec0' },
                emphasis: { label: { fontSize: 14, fontWeight: 'bold', color: '#f1f5f9' }, itemStyle: { shadowBlur: 20, shadowColor: 'rgba(59,130,246,0.3)' } },
                data: pieData
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // 能力分布 - 气泡布局
    initAbilityRadar(customData = null, domId = 'ability-distribution-chart') {
        const chart = this.createChart(domId);
        if (!chart) return;
        const data = (customData && customData.length) ? customData : [];
        const empty = !data.length || data.every(d => !d.value);

        // 优先用数据自带 size；否则按 value 线性映射
        const sizeOf = d => d.size || (36 + Math.max(0, Math.min(100, d.value || 0)) / 100 * 48);
        // 字号随气泡尺寸缩放，提升大小气泡的视觉差
        const fontOf = sz => Math.max(10, Math.min(15, Math.round(sz / 7)));

        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { show: false },
            xAxis: { show: false, min: 0, max: 100, type: 'value' },
            yAxis: { show: false, min: 0, max: 100, type: 'value', inverse: true },
            grid: { left: 60, right: 60, top: 30, bottom: 30, containLabel: false },
            series: [{
                type: 'scatter',
                data: data.map(d => {
                    const sz = sizeOf(d);
                    const fs = fontOf(sz);
                    return {
                        name: d.name,
                        value: [d.x, d.y, d.value],
                        score: d.value,
                        symbolSize: sz,
                        itemStyle: {
                            color: d.color,
                            shadowBlur: 16,
                            shadowColor: (d.color || '#3b82f6') + '66'
                        },
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
                emphasis: {
                    scale: 1.06,
                    itemStyle: { shadowBlur: 22 }
                }
            }],
            graphic: empty ? [{
                type: 'text', left: 'center', top: 'middle',
                style: { text: '该时段无阅读记录', fill: '#94a3b8', font: '12px sans-serif' },
                z: 100
            }] : []
        });
        window.addEventListener('resize', () => chart.resize());
    },

    initClassUsageCompareRadar(customData = null) {
        const chart = this.createChart('class-usage-compare-chart');
        if (!chart || !customData || !customData.series?.length) return;
        const palette = ['#22d3ee', '#3b82f6', '#a855f7', '#f59e0b'];
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: this.darkTheme.tooltip,
            legend: { bottom: 0, textStyle: { color: '#a0aec0', fontSize: 12 } },
            color: palette,
            radar: {
                indicator: customData.indicators,
                shape: 'polygon',
                radius: '62%',
                splitNumber: 4,
                axisName: { color: '#cbd5f5', fontSize: 12 },
                splitLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } },
                splitArea: { areaStyle: { color: ['rgba(15,23,42,0.12)', 'rgba(30,41,59,0.18)', 'rgba(51,65,85,0.14)', 'rgba(71,85,105,0.08)'] } },
                axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } }
            },
            series: [{
                type: 'radar',
                data: customData.series.map((item, index) => ({
                    ...item,
                    symbol: 'circle',
                    symbolSize: 7,
                    lineStyle: { width: 2, color: palette[index % palette.length] },
                    itemStyle: { color: palette[index % palette.length] },
                    areaStyle: { color: palette[index % palette.length], opacity: 0.12 }
                }))
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // 纯函数：根据 data + types 构造 option（用于 init / 切换时复用同一实例 setOption 重渲）
    buildWeeklyActivityOption(data, types) {
        const list = Array.isArray(types) ? types.slice() : [types];
        const showLine = list.includes('line');
        const showBar = list.includes('bar');
        const isMonthly = data && data.granularity === 'month';
        const dates = (data && data.dates) || [];
        const values = (data && data.values) || [];
        const rotate = !isMonthly && dates.length > 14 ? 35 : 0;

        const series = [];
        if (showBar) {
            series.push({
                id: 'bar',
                name: '柱状',
                type: 'bar',
                data: values,
                barWidth: dates.length > 12 ? '55%' : '40%',
                z: 1,
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#3b82f6' }, { offset: 1, color: '#1e40af' }]),
                    shadowBlur: 8,
                    shadowColor: 'rgba(6,182,212,0.2)',
                    opacity: showLine ? 0.32 : 1
                }
            });
        }
        if (showLine) {
            series.push({
                id: 'line',
                name: '折线',
                type: 'line',
                data: values,
                smooth: true,
                symbol: 'circle',
                symbolSize: showBar ? 8 : 7,
                z: 10,
                lineStyle: {
                    width: showBar ? 3 : 2.5,
                    color: '#06b6d4',
                    shadowBlur: 6,
                    shadowColor: 'rgba(6,182,212,0.45)'
                },
                itemStyle: { color: '#06b6d4', borderColor: '#0891b2', borderWidth: 2 },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: showBar ? 'rgba(6,182,212,0.18)' : 'rgba(6,182,212,0.35)' },
                        { offset: 1, color: 'rgba(59,130,246,0.02)' }
                    ])
                }
            });
        }

        return {
            backgroundColor: 'transparent',
            tooltip: { ...this.darkTheme.tooltip, trigger: 'axis', axisPointer: { type: showLine ? 'cross' : 'shadow', shadowStyle: { color: 'rgba(59,130,246,0.05)' }, lineStyle: { color: 'rgba(99,102,241,0.3)' } } },
            grid: { left: 40, right: 20, top: 20, bottom: 30 },
            xAxis: {
                type: 'category',
                boundaryGap: showBar,
                data: dates,
                axisLabel: {
                    color: '#8896a6',
                    fontSize: 11,
                    rotate,
                    interval: dates.length > 16 ? 2 : 0
                },
                axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } },
                axisTick: { show: false }
            },
            yAxis: { type: 'value', axisLabel: { color: '#8896a6', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } } },
            series
        };
    },

    // 区域/园所活动次数 - 折线/柱状（支持数组多选）
    initWeeklyActivityBar(customData = null, chartType = ['line', 'bar']) {
        const dom = document.getElementById('weekly-activity-chart');
        if (!dom) return;
        const data = customData || MockData.weeklyActivity;
        const types = Array.isArray(chartType) ? chartType : [chartType];
        // 强制重建实例：避免上次的 series id 残留导致 merge 异常
        if (typeof echarts !== 'undefined') {
            const existing = echarts.getInstanceByDom(dom);
            if (existing && !existing.isDisposed()) {
                existing.dispose();
                this.instances = this.instances.filter(c => c !== existing);
            }
        }
        const chart = this.createChart('weekly-activity-chart');
        if (!chart) return;
        chart.setOption(this.buildWeeklyActivityOption(data, types), true);
        window.addEventListener('resize', () => chart.resize());
    },

    // 仅更新 series（不 dispose），由切换按钮调用：保证按钮态与渲染严格一致，无时序窗口
    updateWeeklyActivityChart(customData = null, chartType = ['line', 'bar']) {
        const dom = document.getElementById('weekly-activity-chart');
        if (!dom || typeof echarts === 'undefined') return false;
        const chart = echarts.getInstanceByDom(dom);
        if (!chart || chart.isDisposed()) return false;
        const data = customData || MockData.weeklyActivity;
        const types = Array.isArray(chartType) ? chartType : [chartType];
        chart.setOption(this.buildWeeklyActivityOption(data, types), true);
        return true;
    },

    // 园所数据页 - 班级活动情况变化（按时间序列，每个班一柱+一线）
    buildSchoolClassActivityOption(data, chartType) {
        const colors = ['#22d3ee', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];
        const seriesList = (data && data.series) || [];

        let types;
        if (Array.isArray(chartType)) {
            types = chartType.length ? chartType : ['line'];
        } else {
            types = [chartType];
        }
        const showBar = types.includes('bar');
        const showLine = types.includes('line');

        const groupCount = Math.max(1, seriesList.length);
        const barWidth = `${Math.max(8, Math.floor(60 / groupCount))}%`;

        const barSeries = showBar ? seriesList.map((item, index) => ({
            id: `bar-${index}`,
            name: item.name + (showLine ? ' · 柱状' : ''),
            type: 'bar',
            data: item.values,
            barWidth,
            barGap: '20%',
            z: 1,
            itemStyle: {
                borderRadius: [4, 4, 0, 0],
                opacity: showLine ? 0.32 : 1,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colors[index % colors.length] },
                    { offset: 1, color: colors[index % colors.length] + 'AA' }
                ])
            }
        })) : [];

        const lineSeries = showLine ? seriesList.map((item, index) => ({
            id: `line-${index}`,
            name: item.name + (showBar ? ' · 折线' : ''),
            type: 'line',
            data: item.values,
            smooth: true,
            symbol: 'circle',
            symbolSize: showBar ? 7 : 6,
            z: 10,
            lineStyle: { width: showBar ? 2.5 : 2, color: colors[index % colors.length] },
            itemStyle: { color: colors[index % colors.length], borderColor: '#fff', borderWidth: showBar ? 1.5 : 0 },
            areaStyle: showBar ? undefined : {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colors[index % colors.length] + '33' },
                    { offset: 1, color: colors[index % colors.length] + '00' }
                ])
            }
        })) : [];

        const dates = (data && data.dates) || [];
        const rotate = dates.length > 14 ? 35 : 0;

        return {
            backgroundColor: 'transparent',
            tooltip: {
                ...this.darkTheme.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'cross', lineStyle: { color: 'rgba(99,102,241,0.3)' } },
                formatter: function(params) {
                    if (!params || !params.length) return '';
                    const date = params[0].axisValue;
                    let html = `<div style="font-weight:600;margin-bottom:4px">${date}</div>`;
                    const seen = new Set();
                    params.forEach(p => {
                        const baseName = String(p.seriesName || '').replace(/\s*·\s*(柱状|折线)$/, '');
                        if (seen.has(baseName)) return;
                        seen.add(baseName);
                        html += `<div style="display:flex;align-items:center;gap:6px">
                            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
                            <span>${baseName}: ${p.value}次</span>
                        </div>`;
                    });
                    return html;
                }
            },
            legend: {
                bottom: 0,
                textStyle: { color: '#a0aec0', fontSize: 11 },
                type: 'scroll',
                pageTextStyle: { color: '#a0aec0' }
            },
            grid: { left: 50, right: 24, top: 30, bottom: 40 },
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: { color: '#8896a6', fontSize: 11, rotate, interval: dates.length > 16 ? 2 : 0 },
                axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#8896a6', fontSize: 11 },
                splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } }
            },
            series: [...barSeries, ...lineSeries]
        };
    },

    initSchoolClassActivityChart(data, chartType = ['line', 'bar']) {
        const dom = document.getElementById('school-class-activity-chart');
        if (!dom) return;
        if (typeof echarts !== 'undefined') {
            const existing = echarts.getInstanceByDom(dom);
            if (existing && !existing.isDisposed()) {
                existing.dispose();
                this.instances = this.instances.filter(c => c !== existing);
            }
        }
        const chart = this.createChart('school-class-activity-chart');
        if (!chart) return;
        chart.setOption(this.buildSchoolClassActivityOption(data, chartType), true);
        window.addEventListener('resize', () => chart.resize());
    },

    updateSchoolClassActivityChart(data, chartType = ['line', 'bar']) {
        const dom = document.getElementById('school-class-activity-chart');
        if (!dom || typeof echarts === 'undefined') return false;
        const chart = echarts.getInstanceByDom(dom);
        if (!chart || chart.isDisposed()) return false;
        chart.setOption(this.buildSchoolClassActivityOption(data, chartType), true);
        return true;
    },

    // 教师排名 - 横向柱状图
    initTeacherRankingBar(customData = null) {
        const chart = this.createChart('teacher-ranking-chart');
        if (!chart) return;
        const data = (customData || MockData.teacherRanking).slice().reverse();
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { ...this.darkTheme.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: 70, right: 50, top: 10, bottom: 10 },
            xAxis: { type: 'value', axisLabel: { color: '#8896a6', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } } },
            yAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { color: '#a0aec0', fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{
                type: 'bar', barWidth: '50%',
                data: data.map((d, i) => ({
                    value: d.count,
                    itemStyle: {
                        borderRadius: [0, 4, 4, 0],
                        color: i >= data.length - 3
                            ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#8b5cf6' }, { offset: 1, color: '#a78bfa' }])
                            : new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#6366f1' }, { offset: 1, color: '#818cf8' }]),
                        shadowBlur: 6, shadowColor: 'rgba(99,102,241,0.15)'
                    }
                })),
                label: { show: true, position: 'right', color: '#a0aec0', fontSize: 11, formatter: '{c}次' }
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // 教师活动次数 Top10（园长视角，大数据总览页）—— 竖柱状图，X 轴教师、Y 轴活动次数
    initTeacherTop10Bar(customData = null) {
        const dom = document.getElementById('teacher-top10-chart');
        if (!dom) return;
        if (typeof echarts !== 'undefined') {
            const existing = echarts.getInstanceByDom(dom);
            if (existing && !existing.isDisposed()) {
                existing.dispose();
                this.instances = this.instances.filter(c => c !== existing);
            }
        }
        const chart = this.createChart('teacher-top10-chart');
        if (!chart) return;
        const data = (customData || []).slice();
        const rotate = data.length > 6 ? 30 : 0;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                ...this.darkTheme.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function(params) {
                    if (!params || !params.length) return '';
                    const p = params[0];
                    return `<div style="font-weight:600;margin-bottom:4px">${p.axisValue}</div>
                        <div style="display:flex;align-items:center;gap:6px">
                            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
                            <span>活动次数: ${p.value}次</span>
                        </div>`;
                }
            },
            grid: { left: 50, right: 24, top: 30, bottom: rotate ? 56 : 40 },
            xAxis: {
                type: 'category',
                data: data.map(d => d.name),
                axisLabel: { color: '#8896a6', fontSize: 11, interval: 0, rotate },
                axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#8896a6', fontSize: 11 },
                splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } }
            },
            series: [{
                type: 'bar',
                barWidth: '50%',
                itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#22d3ee' },
                        { offset: 1, color: '#22d3eeAA' }
                    ])
                },
                data: data.map(d => d.count),
                label: { show: true, position: 'top', color: '#8896a6', fontSize: 11, formatter: '{c}' }
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // 园所使用次数趋势（管理员端）。chartType: 字符串 'combo'|'bar'|'line' 或 数组 ['line','bar']
    // 纯函数：构造园所使用次数趋势 option
    buildKindergartenUsageOption(data, chartType) {
        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];
        const seriesList = (data && data.series) || [];

        // 入参规范化（兼容老 'combo'/'bar'/'line' 字符串）
        let types;
        if (Array.isArray(chartType)) {
            types = chartType.length ? chartType : ['line'];
        } else if (chartType === 'combo') {
            types = ['line', 'bar'];
        } else {
            types = [chartType];
        }
        const showBar = types.includes('bar');
        const showLine = types.includes('line');

        const groupCount = Math.max(1, seriesList.length);
        const barWidth = `${Math.max(8, Math.floor(60 / groupCount))}%`;

        const barSeries = showBar ? seriesList.map((item, index) => ({
            id: `bar-${index}`,
            name: item.name + (showLine ? ' · 柱状' : ''),
            type: 'bar',
            data: item.values,
            barWidth,
            barGap: '20%',
            z: 1,
            itemStyle: {
                borderRadius: [4, 4, 0, 0],
                opacity: showLine ? 0.32 : 1,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colors[index % colors.length] },
                    { offset: 1, color: colors[index % colors.length] + 'AA' }
                ])
            }
        })) : [];

        const lineSeries = showLine ? seriesList.map((item, index) => ({
            id: `line-${index}`,
            name: item.name + (showBar ? ' · 折线' : ''),
            type: 'line',
            data: item.values,
            smooth: true,
            symbol: 'circle',
            symbolSize: showBar ? 7 : 6,
            z: 10,
            lineStyle: { width: showBar ? 2.5 : 2, color: colors[index % colors.length] },
            itemStyle: { color: colors[index % colors.length], borderColor: '#fff', borderWidth: showBar ? 1.5 : 0 },
            areaStyle: showBar ? undefined : {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colors[index % colors.length] + '33' },
                    { offset: 1, color: colors[index % colors.length] + '00' }
                ])
            }
        })) : [];

        return {
            backgroundColor: 'transparent',
            tooltip: {
                ...this.darkTheme.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'cross', lineStyle: { color: 'rgba(99,102,241,0.3)' } },
                formatter: function(params) {
                    if (!params || !params.length) return '';
                    const date = params[0].axisValue;
                    let html = `<div style="font-weight:600;margin-bottom:4px">${date}</div>`;
                    // 折线+柱状叠加时同一园所会出现两次（一柱一线），按"原始园所名"去重
                    const seen = new Set();
                    params.forEach(p => {
                        const baseName = String(p.seriesName || '').replace(/\s*·\s*(柱状|折线)$/, '');
                        if (seen.has(baseName)) return;
                        seen.add(baseName);
                        html += `<div style="display:flex;align-items:center;gap:6px">
                            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
                            <span>${baseName}: ${p.value}次</span>
                        </div>`;
                    });
                    return html;
                }
            },
            legend: {
                bottom: 0,
                textStyle: { color: '#a0aec0', fontSize: 11 },
                type: 'scroll',
                pageTextStyle: { color: '#a0aec0' }
            },
            grid: { left: 50, right: 24, top: 36, bottom: 40 },
            xAxis: {
                type: 'category',
                data: (data && data.dates) || [],
                axisLabel: {
                    color: '#8896a6',
                    fontSize: 11,
                    rotate: ((data && data.dates) || []).length > 14 ? 35 : 0,
                    interval: ((data && data.dates) || []).length > 16 ? 2 : 0
                },
                axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#8896a6', fontSize: 11 },
                splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } }
            },
            series: [...barSeries, ...lineSeries]
        };
    },

    initKindergartenUsageLine(customData = null, chartType = ['line', 'bar']) {
        const dom = document.getElementById('kindergarten-usage-chart');
        if (!dom) return;
        if (typeof echarts !== 'undefined') {
            const existing = echarts.getInstanceByDom(dom);
            if (existing && !existing.isDisposed()) {
                existing.dispose();
                this.instances = this.instances.filter(c => c !== existing);
            }
        }
        const chart = this.createChart('kindergarten-usage-chart');
        if (!chart) return;
        const data = customData || { dates: [], values: [], series: [], granularity: 'day' };
        chart.setOption(this.buildKindergartenUsageOption(data, chartType), true);
        window.addEventListener('resize', () => chart.resize());
    },

    // 仅更新 series（不 dispose），由切换按钮调用
    updateKindergartenUsageChart(customData = null, chartType = ['line', 'bar']) {
        const dom = document.getElementById('kindergarten-usage-chart');
        if (!dom || typeof echarts === 'undefined') return false;
        const chart = echarts.getInstanceByDom(dom);
        if (!chart || chart.isDisposed()) return false;
        const data = customData || { dates: [], values: [], series: [], granularity: 'day' };
        chart.setOption(this.buildKindergartenUsageOption(data, chartType), true);
        return true;
    },

    // 班级排名 - 横向柱状图（园长端）
    initClassRankingBar(customData = null) {
        const chart = this.createChart('class-ranking-chart');
        if (!chart) return;
        const originalData = customData || MockData.classRanking;
        const data = originalData.slice().reverse();
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                ...this.darkTheme.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function(params) {
                    if (!params || !params[0]) return '';
                    const d = params[0];
                    const classItem = originalData.find(c => c.name === d.name);
                    return `${d.name}<br/>活动次数: ${d.value}次<br/>教师: ${classItem?.teacher || '-'}`;
                }
            },
            grid: { left: 70, right: 100, top: 10, bottom: 30 },
            xAxis: { type: 'value', axisLabel: { color: '#8896a6', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } } },
            yAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { color: '#a0aec0', fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{
                type: 'bar', barWidth: '50%',
                data: data.map((d, i) => ({
                    value: d.count,
                    itemStyle: {
                        borderRadius: [0, 4, 4, 0],
                        color: i >= data.length - 3
                            ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#10b981' }, { offset: 1, color: '#34d399' }])
                            : new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#059669' }, { offset: 1, color: '#10b981' }]),
                        shadowBlur: 6, shadowColor: 'rgba(16,185,129,0.15)'
                    }
                })),
                label: { show: true, position: 'right', color: '#a0aec0', fontSize: 11, formatter: '{c}次' }
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // ========== 园所数据 - 概述图表 ==========
    initSchoolCategoryPie(customData = null) {
        const chart = this.createChart('school-category-pie');
        if (!chart) return;
        const data = customData || MockData.schoolData.overview.categoryData;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { ...this.darkTheme.tooltip, trigger: 'item', formatter: '{b}: {c}次 ({d}%)' },
            legend: { bottom: 0, textStyle: { color: '#a0aec0', fontSize: 11 } },
            color: ['#1677FF', '#13C2C2', '#FAAD14', '#EB2F96', '#52C41A', '#722ED1'],
            series: [{
                type: 'pie', radius: ['35%', '60%'], center: ['50%', '42%'],
                itemStyle: { borderRadius: 4, borderColor: 'rgba(120,160,220,0.35)', borderWidth: 2 },
                label: { show: true, formatter: '{b}\n{d}%', fontSize: 10, color: '#a0aec0' },
                emphasis: { itemStyle: { shadowBlur: 15, shadowColor: 'rgba(59,130,246,0.3)' } },
                data: data.map(d => ({ name: d.name, value: d.readCount }))
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // ========== 班级报告 - 阅读绘本类型趋势折线图 ==========
    initClassBookTypeLine(seriesData, domId = 'class-book-type-chart') {
        const chart = this.createChart(domId);
        if (!chart) return;
        if (!seriesData || !seriesData.dates || !seriesData.dates.length) {
            chart.setOption({
                backgroundColor: 'transparent',
                title: { text: '当前时间范围内暂无数据', left: 'center', top: 'middle', textStyle: { color: '#64748b', fontSize: 12, fontWeight: 'normal' } }
            });
            return;
        }
        const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#6366f1'];
        const rotate = seriesData.dates.length > 14 ? 35 : 0;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                ...this.darkTheme.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'cross', lineStyle: { color: 'rgba(99,102,241,0.3)' } },
                formatter(params) {
                    if (!params || !params.length) return '';
                    const date = params[0].axisValue;
                    let html = `<div style="font-weight:600;margin-bottom:4px">${date}</div>`;
                    params.forEach(p => {
                        html += `<div style="display:flex;align-items:center;gap:6px">
                            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
                            <span>${p.seriesName}: ${p.value}本</span>
                        </div>`;
                    });
                    return html;
                }
            },
            legend: {
                bottom: 0,
                textStyle: { color: '#a0aec0', fontSize: 11 },
                type: 'scroll',
                pageTextStyle: { color: '#a0aec0' }
            },
            grid: { left: 45, right: 20, top: 20, bottom: 40 },
            xAxis: {
                type: 'category',
                data: seriesData.dates,
                boundaryGap: false,
                axisLabel: {
                    color: '#8896a6',
                    fontSize: 11,
                    rotate,
                    interval: seriesData.dates.length > 16 ? 'auto' : 0
                },
                axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#8896a6', fontSize: 11 },
                splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } }
            },
            series: seriesData.series.map((item, index) => ({
                name: item.name,
                type: 'line',
                data: item.values,
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                lineStyle: { width: 2, color: colors[index % colors.length] },
                itemStyle: { color: colors[index % colors.length] },
                emphasis: { focus: 'series' }
            }))
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // ========== 班级报告 - 能力分布趋势折线图 ==========
    initClassAbilityLine(seriesData, domId = 'class-ability-chart') {
        const chart = this.createChart(domId);
        if (!chart) return;
        if (!seriesData || !seriesData.dates || !seriesData.dates.length) {
            chart.setOption({
                backgroundColor: 'transparent',
                title: { text: '当前时间范围内暂无数据', left: 'center', top: 'middle', textStyle: { color: '#64748b', fontSize: 12, fontWeight: 'normal' } }
            });
            return;
        }
        const colors = ['#22d3ee', '#3b82f6', '#a855f7', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];
        const rotate = seriesData.dates.length > 14 ? 35 : 0;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                ...this.darkTheme.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'cross', lineStyle: { color: 'rgba(99,102,241,0.3)' } },
                formatter(params) {
                    if (!params || !params.length) return '';
                    const date = params[0].axisValue;
                    let html = `<div style="font-weight:600;margin-bottom:4px">${date}</div>`;
                    params.forEach(p => {
                        html += `<div style="display:flex;align-items:center;gap:6px">
                            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
                            <span>${p.seriesName}: ${p.value}</span>
                        </div>`;
                    });
                    return html;
                }
            },
            legend: {
                bottom: 0,
                textStyle: { color: '#a0aec0', fontSize: 11 },
                type: 'scroll',
                pageTextStyle: { color: '#a0aec0' }
            },
            grid: { left: 45, right: 20, top: 20, bottom: 40 },
            xAxis: {
                type: 'category',
                data: seriesData.dates,
                boundaryGap: false,
                axisLabel: {
                    color: '#8896a6',
                    fontSize: 11,
                    rotate,
                    interval: seriesData.dates.length > 16 ? 'auto' : 0
                },
                axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: { color: '#8896a6', fontSize: 11 },
                splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } }
            },
            series: seriesData.series.map((item, index) => ({
                name: item.name,
                type: 'line',
                data: item.values,
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                lineStyle: { width: 2, color: colors[index % colors.length] },
                itemStyle: { color: colors[index % colors.length] },
                emphasis: { focus: 'series' }
            }))
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // ========== AI总览 - 热门提问 TOP10 ==========
    initAiHotQuestionsBar(customData = null) {
        const chart = this.createChart('ai-hot-questions-chart');
        if (!chart) return;
        const list = (customData || (typeof MockData !== 'undefined' ? MockData.aiOverview?.hotQuestions : []) || []).slice(0, 10);
        const data = list.slice().reverse();
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                ...this.darkTheme.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter(params) {
                    if (!params || !params[0]) return '';
                    const d = params[0];
                    return `<div style="max-width:240px;white-space:normal">${d.name}</div><div style="margin-top:4px">提问次数：<span style="color:#fbbf24">${d.value}</span> 次</div>`;
                }
            },
            grid: { left: 8, right: 60, top: 10, bottom: 20, containLabel: true },
            xAxis: { type: 'value', axisLabel: { color: '#8896a6', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } } },
            yAxis: {
                type: 'category',
                data: data.map(d => d.q.length > 14 ? d.q.slice(0, 14) + '…' : d.q),
                axisLabel: { color: '#cbd5f5', fontSize: 11 },
                axisLine: { show: false },
                axisTick: { show: false }
            },
            series: [{
                type: 'bar', barWidth: '55%',
                data: data.map((d, i) => ({
                    value: d.count,
                    itemStyle: {
                        borderRadius: [0, 4, 4, 0],
                        color: i >= data.length - 3
                            ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#fbbf24' }])
                            : new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#6366f1' }, { offset: 1, color: '#22d3ee' }]),
                        shadowBlur: 6, shadowColor: 'rgba(99,102,241,0.18)'
                    }
                })),
                label: { show: true, position: 'right', color: '#a0aec0', fontSize: 11, formatter: '{c}次' }
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // ========== AI总览 - 绘本互动排行 TOP10 ==========
    initAiBookInteractionBar(customData = null) {
        const chart = this.createChart('ai-book-interaction-chart');
        if (!chart) return;
        const list = (customData || (typeof MockData !== 'undefined' ? MockData.aiOverview?.bookInteractions : []) || []).slice(0, 10);
        const data = list.slice().reverse();
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                ...this.darkTheme.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter(params) {
                    if (!params || !params[0]) return '';
                    const d = params[0];
                    return `《${d.name}》<br/>互动次数：<span style="color:#34d399">${d.value}</span> 次`;
                }
            },
            grid: { left: 8, right: 60, top: 10, bottom: 20, containLabel: true },
            xAxis: { type: 'value', axisLabel: { color: '#8896a6', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } } },
            yAxis: {
                type: 'category',
                data: data.map(d => `《${d.book}》`),
                axisLabel: { color: '#cbd5f5', fontSize: 11 },
                axisLine: { show: false },
                axisTick: { show: false }
            },
            series: [{
                type: 'bar', barWidth: '55%',
                data: data.map((d, i) => ({
                    value: d.count,
                    itemStyle: {
                        borderRadius: [0, 4, 4, 0],
                        color: i >= data.length - 3
                            ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#10b981' }, { offset: 1, color: '#34d399' }])
                            : new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#0ea5e9' }, { offset: 1, color: '#22d3ee' }]),
                        shadowBlur: 6, shadowColor: 'rgba(16,185,129,0.18)'
                    }
                })),
                label: { show: true, position: 'right', color: '#a0aec0', fontSize: 11, formatter: '{c}次' }
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // ========== AI总览 - 各班级 AI 对话次数变化（多线折线图） ==========
    initAiClassDialogTrend(seriesData) {
        const chart = this.createChart('ai-class-dialog-chart');
        if (!chart) return;
        if (!seriesData || !seriesData.dates || !seriesData.dates.length || !seriesData.series?.length) {
            chart.setOption({
                backgroundColor: 'transparent',
                title: { text: '当前时间范围内暂无数据', left: 'center', top: 'middle', textStyle: { color: '#64748b', fontSize: 12, fontWeight: 'normal' } }
            });
            return;
        }
        const colors = ['#f59e0b', '#22d3ee', '#a855f7', '#10b981', '#3b82f6', '#ef4444', '#ec4899', '#6366f1', '#84cc16'];
        const rotate = seriesData.dates.length > 14 ? 35 : 0;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                ...this.darkTheme.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'cross', lineStyle: { color: 'rgba(245,158,11,0.3)' } },
                formatter(params) {
                    if (!params || !params.length) return '';
                    const date = params[0].axisValue;
                    let total = 0;
                    let html = `<div style="font-weight:600;margin-bottom:4px">${date}</div>`;
                    params.forEach(p => {
                        total += p.value || 0;
                        html += `<div style="display:flex;align-items:center;gap:6px">
                            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
                            <span>${p.seriesName}: ${p.value}次</span>
                        </div>`;
                    });
                    html += `<div style="margin-top:4px;border-top:1px solid rgba(255,255,255,0.1);padding-top:4px">合计: ${total}次</div>`;
                    return html;
                }
            },
            legend: {
                bottom: 0,
                textStyle: { color: '#a0aec0', fontSize: 11 },
                type: 'scroll',
                pageTextStyle: { color: '#a0aec0' }
            },
            grid: { left: 45, right: 20, top: 20, bottom: rotate ? 70 : 55 },
            xAxis: {
                type: 'category',
                data: seriesData.dates,
                boundaryGap: false,
                axisLabel: {
                    color: '#8896a6',
                    fontSize: 11,
                    rotate,
                    interval: seriesData.dates.length > 16 ? 'auto' : 0
                },
                axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                minInterval: 1,
                axisLabel: { color: '#8896a6', fontSize: 11, formatter: v => `${v}` },
                splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } }
            },
            series: seriesData.series.map((item, index) => ({
                name: item.name,
                type: 'line',
                data: item.values,
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                lineStyle: { width: 2, color: colors[index % colors.length] },
                itemStyle: { color: colors[index % colors.length] },
                emphasis: { focus: 'series' }
            }))
        });
        window.addEventListener('resize', () => chart.resize());
    },

    initSchoolCategoryBar(customData = null) {
        const chart = this.createChart('school-category-bar');
        if (!chart) return;
        const data = customData || MockData.schoolData.overview.categoryData;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { ...this.darkTheme.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: 70, right: 40, top: 10, bottom: 30 },
            xAxis: { type: 'value', axisLabel: { color: '#8896a6', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } } },
            yAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { color: '#a0aec0', fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{
                type: 'bar', barWidth: '45%',
                data: data.map(d => parseFloat(d.duration)),
                itemStyle: {
                    borderRadius: [0, 4, 4, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#10b981' }, { offset: 1, color: '#34d399' }]),
                    shadowBlur: 6, shadowColor: 'rgba(16,185,129,0.15)'
                },
                label: { show: true, position: 'right', color: '#a0aec0', fontSize: 11, formatter: '{c}h' }
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    }
};
