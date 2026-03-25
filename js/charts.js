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
        try { fn(); } catch (e) { console.warn('Chart init error:', e); }
    },

    createChart(domId) {
        const dom = document.getElementById(domId);
        if (!dom) return null;
        const chart = echarts.init(dom);
        this.instances.push(chart);
        return chart;
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

    // ========== 大数据总览图表 ==========
    initDataOverviewCharts(customData = null) {
        const data = customData || {
            bookTypes: MockData.bookTypes,
            abilityDistribution: MockData.abilityDistribution,
            weeklyActivity: MockData.weeklyActivity,
            classRanking: MockData.classRanking,
            teacherRanking: MockData.teacherRanking,
            parentReading: MockData.parentReading,
            classUsageComparison: null
        };
        this.safeInit(() => this.initBookTypePie(data.bookTypes));
        this.safeInit(() => this.initAbilityRadar(data.abilityDistribution));
        this.safeInit(() => this.initWeeklyActivityBar(data.weeklyActivity));
        this.safeInit(() => this.initClassRankingBar(data.classRanking));
        this.safeInit(() => this.initTeacherRankingBar(data.teacherRanking));
        this.safeInit(() => this.initParentReadingLine(data.parentReading));
        this.safeInit(() => this.initClassUsageCompareRadar(data.classUsageComparison));
    },

    // 绘本类型占比 - 饼图
    initBookTypePie(customData = null) {
        const data = customData || MockData.bookTypes;
        const chart = this.createChart('book-type-chart');
        if (!chart) return;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { ...this.darkTheme.tooltip, trigger: 'item', formatter: '{b}: {c}次 ({d}%)' },
            legend: { bottom: 0, textStyle: { color: '#a0aec0', fontSize: 12 } },
            color: ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'],
            series: [{
                type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
                avoidLabelOverlap: true,
                itemStyle: { borderRadius: 6, borderColor: 'rgba(120,160,220,0.35)', borderWidth: 2 },
                label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, color: '#a0aec0' },
                emphasis: { label: { fontSize: 14, fontWeight: 'bold', color: '#f1f5f9' }, itemStyle: { shadowBlur: 20, shadowColor: 'rgba(59,130,246,0.3)' } },
                data: data.map(t => ({ name: t.name, value: t.value }))
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // 能力分布 - 雷达图
    initAbilityRadar(customData = null) {
        const chart = this.createChart('ability-distribution-chart');
        if (!chart) return;
        const data = customData || MockData.abilityDistribution;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: this.darkTheme.tooltip,
            radar: {
                indicator: data.map(d => ({ name: d.name, max: 100 })),
                shape: 'polygon', splitNumber: 4,
                axisName: { color: '#a0aec0', fontSize: 12 },
                splitLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } },
                splitArea: { areaStyle: { color: ['rgba(15,23,42,0.1)', 'rgba(30,41,59,0.2)', 'rgba(51,65,85,0.15)', 'rgba(71,85,105,0.1)'] } },
                axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } }
            },
            series: [{
                type: 'radar',
                data: [{
                    value: data.map(d => d.value), name: '能力分布',
                    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59,130,246,0.3)' }, { offset: 1, color: 'rgba(6,182,212,0.05)' }]) },
                    lineStyle: { color: '#3b82f6', width: 2, shadowBlur: 8, shadowColor: 'rgba(59,130,246,0.3)' },
                    itemStyle: { color: '#60a5fa', borderColor: '#3b82f6', borderWidth: 2 }
                }]
            }]
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

    // 近七日活动 - 柱状图
    initWeeklyActivityBar(customData = null) {
        const chart = this.createChart('weekly-activity-chart');
        if (!chart) return;
        const data = customData || MockData.weeklyActivity;
        const isMonthly = data.granularity === 'month';
        const rotate = !isMonthly && data.dates.length > 14 ? 35 : 0;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { ...this.darkTheme.tooltip, trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(59,130,246,0.05)' } } },
            grid: { left: 40, right: 20, top: 20, bottom: 30 },
            xAxis: {
                type: 'category',
                data: data.dates,
                axisLabel: {
                    color: '#8896a6',
                    fontSize: 11,
                    rotate,
                    interval: data.dates.length > 16 ? 2 : 0
                },
                axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } },
                axisTick: { show: false }
            },
            yAxis: { type: 'value', axisLabel: { color: '#8896a6', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } } },
            series: [{
                type: 'bar', data: data.values, barWidth: data.dates.length > 12 ? '55%' : '40%',
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#06b6d4' }, { offset: 1, color: '#3b82f6' }]),
                    shadowBlur: 8, shadowColor: 'rgba(6,182,212,0.2)'
                }
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    },

    // 班级排名 - 横向柱状图
    initClassRankingBar(customData = null) {
        const chart = this.createChart('class-ranking-chart');
        if (!chart) return;
        const data = (customData || MockData.classRanking).slice().reverse();
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
                            ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#f97316' }])
                            : new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#3b82f6' }, { offset: 1, color: '#60a5fa' }]),
                        shadowBlur: 6, shadowColor: 'rgba(59,130,246,0.15)'
                    }
                })),
                label: { show: true, position: 'right', color: '#a0aec0', fontSize: 11, formatter: '{c}次' }
            }]
        });
        window.addEventListener('resize', () => chart.resize());
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

    // 家长阅读趋势 - 折线图
    initParentReadingLine(customData = null) {
        const chart = this.createChart('parent-reading-chart');
        if (!chart) return;
        const data = customData || MockData.parentReading;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { ...this.darkTheme.tooltip, trigger: 'axis' },
            legend: { bottom: 0, textStyle: { color: '#a0aec0', fontSize: 12 } },
            grid: { left: 40, right: 20, top: 20, bottom: 40 },
            xAxis: { type: 'category', data: data.dates, axisLabel: { color: '#8896a6', fontSize: 11 }, axisLine: { lineStyle: { color: 'rgba(85,100,120,0.35)' } }, axisTick: { show: false } },
            yAxis: { type: 'value', axisLabel: { color: '#8896a6', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(85,100,120,0.3)' } } },
            series: [
                {
                    name: '推送次数', type: 'line', data: data.pushCount, smooth: true,
                    lineStyle: { color: '#3b82f6', width: 2, shadowBlur: 8, shadowColor: 'rgba(59,130,246,0.3)' },
                    itemStyle: { color: '#3b82f6' },
                    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59,130,246,0.2)' }, { offset: 1, color: 'rgba(59,130,246,0)' }]) }
                },
                {
                    name: '家长阅读次数', type: 'line', data: data.readCount, smooth: true,
                    lineStyle: { color: '#f59e0b', width: 2, shadowBlur: 8, shadowColor: 'rgba(245,158,11,0.3)' },
                    itemStyle: { color: '#f59e0b' },
                    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(245,158,11,0.2)' }, { offset: 1, color: 'rgba(245,158,11,0)' }]) }
                }
            ]
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
            color: ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'],
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
