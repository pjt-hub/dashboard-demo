# 更新日志 (Changelog)

本文档记录绘本阅读机器人仪表盘项目的所有重要更新。

---

## [2026-05-27]

### 变更
- **大数据总览 vs 区域/园所数据 双视角职责重新划分** - 两页之前互相重复展示 KPI / TOP10 排名，这次按"总览=看动静、区域/园所=看差异+下钻"分清职责。
  - **总览页 admin**：右侧两张 TOP10 排行卡（班均活动次数 / 班均参与人次）改为 **TOP3 摘要**，标题加"查看全部 →"按钮跳到区域数据页对比表
  - **总览页 principal**：删除"班级 TOP10 图表"卡 + "阅读 TOP10 绘本"表格（与园所数据页 classes/books tab 重复）。教师 TOP10 保留作为首屏轻量信号。`Charts.initDataOverviewCharts` 不再调 `initClassRankingBar`
  - **总览页 teacher**：阅读 TOP10 绘本表保留（本班视角无别处可看）
  - **区域数据页 admin（未选学校）**：原"全区数据概述"tab 替换为「**园所横向对比**」表 —— 每行一个园所，列：活动总次数 / 总时长 / 参与人次 / 班均活动 / 设备使用次数；列头点击排序、汇总行、园所/区域拼音搜索、区域 chips 筛选、行末"打开详情"复用 `viewSchoolDetail`
  - **园所数据页 principal · 数据概述 tab**：删除头部 5 KPI 重复卡（与总览页重复）；最顶新增「**本园关键差异速览**」4 项：高活跃班级数 / 低活跃班级数 / 教师活跃极差 / 设备使用极差，每条带"查看 →"跳到对应明细 tab。大模型 / 类型阅读 / 设备 / 推荐栏保留
  - **园所数据页 6 个明细 tab**（班级 / 教师 / 幼儿 / 绘本 / 设备 / 不含活动流水）：数值列加 `.compare-bar-cell` 条件格式背景条按相对百分位渲染、列头可排序、表头汇总行（总数 / 均值 / 合计）。班级 tab 还按"园均±20%/-50%"标记 is-high / is-low 高低活跃
  - **新增工具**：`App.barCell / barPct / sortableTh / schoolSort / toggleSort / sortByKey / getSchoolDiffSummary / renderSchoolDiffSummary / renderRegionalSchoolCompare / regionalCompareState / buildRegionalSchoolRows`，`tableWrap` 增加可选 `summary` 行参数 + sortable 列头
  - **CSS 新增**：`.compare-bar-cell` (深浅主题分别配色) / `.sortable-th` / `.compare-summary-row`
  - admin 单园弹窗（`viewSchoolDetail` 调 `renderSchoolOverview`）保持 5 KPI 概览不变（admin 第一次看到该园数据）；teacher 视角不动
  - 文件：`js/app.js`、`js/charts.js`、`css/style.css`、`index.html`（style.css?v=17、charts.js?v=16、app.js?v=21）

---

## [2026-05-26]

### 新增
- **AI 总览-阅读对话明细 新增"原始录音"播放按钮** - 每条小朋友提问右侧新增一个胶囊按钮，含"播放图标 + 5 段动效声纹 + 时长（如 2.4"）"。点击模拟播放该提问的原始录音，播放期间声纹会上下脉动、按钮变实色态、图标切到暂停；再次点击或点其他按钮自动停。同时支持 AI 对话详情、活跃幼儿/绘本下钻两类弹窗里所有 q/a 轮次。
  - 实现：用 Web Audio 合成与文本相关的"童声音色"（OscillatorNode 双声合成 + 时长按文本长度 1.2s~4.5s 缩放 + 字符 codepoint 当音高种子），不需要任何资源文件。原本是"无原始录音存档"，现在有了交互入口，待接真实音频时把 `playVoiceFromButton` 改成读 `t.audioUrl` 即可。
  - 新增 API：`App.voicePlayButton(text, label?)`、`App.playVoiceFromButton(id)`，全局单例 `_voicePlaying` 保证同一时间只有一个在播。
  - 新增 CSS：`.voice-play-btn / .voice-wave / @keyframes voice-wave-pulse`，深浅主题各自配色（暖色童趣感）。
  - 文件：`js/app.js`、`css/style.css`、`index.html`（style.css?v=16、app.js?v=20）

### 修复
- **折线/柱状切换按钮态难辨识** - 之前活跃态用 `bg-cyan-400/15 + text-cyan-200` 这种浅色调，在浅色主题下"高亮态"反而比"灰态"更淡，用户会误以为按钮态点反了（看图表又确实在变）。改成实色填充+白字+轻微阴影的活跃态、line-through+低透明度的灰态，深浅主题各自配色，按钮态从远处也能 1 秒分辨。
  - 新增 CSS：`.chart-toggle-group / .chart-toggle-btn / .is-active / .is-inactive / .is-locked / .chart-toggle-btn--purple`
  - 修改：`renderWeeklyActivityChartHeader / renderKindergartenUsageChartHeader` 用新 class 替换原 Tailwind 内联组合
  - 文件：`css/style.css`、`js/app.js`、`index.html`（style.css?v=14、app.js?v=19）

### 修复
- **区域绘本活动次数 / 园所使用次数趋势 切换按钮态与图表渲染不一致** - 之前点"柱状"置灰只剩"折线"高亮时，图表却仍然渲染柱状（series 被旧实例残留污染）。前两版用 dispose+rebuild 都没修干净，这次彻底改为：把 option 构造抽成纯函数 `Charts.buildWeeklyActivityOption / buildKindergartenUsageOption`，切换时复用同一 ECharts 实例 `setOption(opt, true)`（notMerge=true）原地重渲染，不再 dispose/rebuild dom，按钮态与渲染严格 1:1。
  - 新增：`Charts.buildWeeklyActivityOption`、`Charts.buildKindergartenUsageOption`、`Charts.updateWeeklyActivityChart`、`Charts.updateKindergartenUsageChart`
  - 修改：`App.refreshWeeklyActivityChart` 优先走 setOption 更新；`App.refreshKindergartenUsageChart({ headerOnly: true })` 切换按钮 / 勾选时只替换 header（保留 chart 容器与实例），首次渲染或异常路径才整段重建
  - `initDataOverviewCharts` fallback 默认值由 `['line']` → `['line','bar']`，与 state 默认对齐
  - 文件：`js/charts.js`、`js/app.js`、`index.html`（charts.js?v=15、app.js?v=18）

### 变更
- **区域绘本活动次数 / 园所使用次数趋势 改为折线+柱状多选** - 之前是单选切换，现在两个图表都默认折线+柱状同时显示，标题右侧的小按钮可以独立点亮/隐藏（最少保留一种），按钮在仅剩一种时禁用避免误操作。
  - 修改函数：`renderWeeklyActivityChartHeader / toggleWeeklyActivityChartType / refreshWeeklyActivityChart`、`renderKindergartenUsageChartHeader / toggleKindergartenUsageChartType / refreshKindergartenUsageChart`，对应的 `Charts.initWeeklyActivityBar / Charts.initKindergartenUsageLine` 入参改为支持数组（同时兼容老的字符串入参）
  - 园所使用次数趋势同时移除了"总和折线 + 副 Y 轴"，每个园所一柱一线，柱在叠加折线时半透明显示
  - 文件：`js/app.js`、`js/charts.js`

### 修复
- **左侧问号气泡被遮挡** - 之前 `.chart-help-tip` 用绝对定位，挂在 `.chart-help` 内，会被父级 `overflow:hidden` 卡住，导致靠左模块的问号气泡显示不全。改成全局 `position:fixed` 气泡 + JS 计算坐标（自动检测下方空间不足时翻到上方，并对视口边缘做 8px 内边距钳制），不再受任何父容器裁剪影响。
  - 修改函数：`App.helpIcon()`、新增 `App._ensureHelpTip / _showHelpTip / _hideHelpTip`
  - 文件：`js/app.js`、`css/style.css`（移除旧的 `.chart-help-tip`，新增 `.global-help-tip`）

### 新增
- **模块标题加规则说明气泡（？）** - 所有 chartTitle 标题旁新增小问号图标，鼠标悬停（或键盘聚焦）展示该模块的"统计范围 / 口径 / 指标说明 / 用途"，便于一线教师/园长理解数据来源。
  - 通用化：`App.chartTitle(title, color, helpText)` 增加可选第三参数；自定义头部用 `App.helpIcon(helpText)`。
  - 已配置说明的模块：幼儿阅读绘本类型、幼儿阅读绘本-能力分布、区域/园所绘本活动次数、园所班均使用对比、园所使用次数趋势、绘本活动次数排名前十教师/班级、阅读次数排名前十绘本、绘本活动概览、大模型使用概况、绘本分类阅读数据、设备概况、绘本推荐栏。
  - 文件：`js/app.js`、`css/style.css`（新增 .chart-help / .chart-help-tip 样式，深浅主题各自适配）

### 变更
- **绘本推荐栏改为 4 张固定推荐位** - 之前 4 张卡都是按阅读次数排出来的，标签和推荐语区分度有限。改成四类不同来源、不同标签：
  - 第 1 张「高热度」：园所近 1 个月阅读次数最多的绘本
  - 第 2、3 张「高互动」：园所近 1 个月大模型对话互动轮数最多的两本
  - 第 4 张「可拓展」：园所近期阅读最少的类型，从全部绘本中挑出该类型阅读量最高的一本
  - 互动数据基于 `studentChatRecords` 累加每本书的对话轮数；类型阅读量基于 `schoolData.overview.categoryData`，教师视角用 `selectedClass.bookTypeStats`
  - 修改函数：`getSchoolOverviewBookRecommendations()`，调整了「绘本推荐栏」标题气泡说明与 `badge` 颜色映射
  - 文件：`js/app.js`

### 变更
- **绘本推荐栏推荐语差异化** - 之前所有书共用同一句"园所整体阅读热度较高..."，现按 优先推荐 / 高热度 / 可延展 三档输出不同推荐语，并把绘本名 / 阅读次数 / 类型动态嵌入文案，便于教师快速决策。
  - 标签划分规则：第 1 名 → 优先推荐；第 2 名或阅读次数 ≥ 榜首 70% → 高热度；其余 → 可延展。
  - 修改函数：`getSchoolOverviewBookRecommendations()`
  - 文件：`js/app.js`

### 变更
- **大数据总览-区域绘本活动次数图改为折线图** - 用折线反映总体趋势更直观；标题右侧新增"折线/柱状"切换按钮，可按需切换。
  - 修改函数：`Charts.initWeeklyActivityBar()` 增加 `chartType` 参数；`App.renderWeeklyActivityChartHeader()` / `App.setWeeklyActivityChartType()`
  - 文件：`js/charts.js`、`js/app.js`
- **大数据总览-园所使用次数改为柱状+折线组合图** - 每个选中园所一组分组柱状图（按时间分组对比），叠加一条橙色折线展示所选园所的使用次数总和（用副 Y 轴）。同时反映对比与趋势。
  - 修改函数：`Charts.initKindergartenUsageLine()`
  - 文件：`js/charts.js`
- **学校"查看详情"弹窗内容升级** - 弹窗内容由"基础信息+班均统计"改为完整的"园所数据概述"（与该校园所数据页-数据概述一致：活动概览、大模型使用、绘本分类阅读、设备概况），实现"先弹窗预览、再决定是否进入完整页"。
  - 弹窗宽度从 max-w-3xl 提升到 max-w-6xl，整体留白加大。
  - "打开"按钮文案改为"打开详情"。
  - 修改函数：`viewSchoolDetail()` 复用 `renderSchoolOverview()`
  - 文件：`js/app.js`

---

## [2026-05-25]

### 新增
- **学校筛选支持拼音首字母** - 教育局管理员"学校筛选"页搜索框新增拼音首字母模糊匹配，输入 `yg` 可命中"阳光幼儿园"，`hd` 命中"海淀区"。同时升级活动/教师/幼儿表的姓名/教师筛选。
  - 新增工具：`PinyinUtil`（轻量字典实现，无外部依赖）
  - 文件：`js/app.js`
- **班级页面新增筛选搜索** - 园所数据-班级标签页新增"班级名称 / 教师姓名"筛选，均支持中文与拼音首字母（如 `dyb` 命中"大一班"）。
  - 修改函数：`renderSchoolClasses()`
  - 文件：`js/app.js`

### 变更
- **学校"查看详情"改为弹窗预览 + 打开按钮** - 点击学校卡片"查看详情"先弹出学校信息预览弹窗（基础信息 + 班均活动统计），右上角"打开"按钮跳转到该学校的园所数据页，更轻量的二次确认体验。
  - 修改函数：`viewSchoolDetail()`，新增 `openSchoolPage()`
  - 文件：`js/app.js`

---

## [2026-03-31]

### 修复
- **白屏问题修复** - 修复 `calculateStudentSegments` 函数中 `a.students` 空值访问导致的JavaScript崩溃
  - 添加 `if (a.students && Array.isArray(a.students))` 防护条件
  - 文件: `js/app.js`

### 变更
- **移除"活动完成质量分析"模块** - 无法判断质量等级（优秀/良好/一般/需改进），无评估标准
  - 替换为"班级活动趋势"图表，展示近7日活动次数
  - 修改函数: `renderTeacherClassAiAnalysis()`, `initTeacherClassAiCharts()`
  - 文件: `js/app.js`

- **移除"阅读等级"标签** - 无法判断学生阅读等级，无分级标准
  - 当前版本未发现该标签，确认无需处理

### 技术细节
- CORS问题指导：引导用户使用 `http://localhost:8080` 而非 `file://` 协议访问
- 图表重写：`initTeacherClassAiCharts()` 从堆叠柱状图改为趋势柱状图
- 数据来源：基于 `getFilteredActivitiesByDateRange()` 获取真实活动数据

---

## [2026-03-30]

### 新增
- **班级对比雷达图数值修复** - 修复数值超出max值导致图表渲染失真
  - 指标重命名：'参与人数'→'平均参与'，'阅读时长'→'平均时长'
  - max值调整：'平均时长'从20提升至45
  - 添加 `Math.min` 防护确保所有值≤对应max
  - 文件: `js/app.js` - `calculateClassComparisonMatrix()`

### UI优化
- **园所班均使用对比页面UI风格统一**
  - 统一Tailwind配色方案
  - 底图适配优化
  - 外层容器样式一致性调整

---

## 待办事项 (Roadmap)

### 数据验证
- [ ] 确认活动数据字段完整性
- [ ] 验证学生-活动关联数据

### 功能优化
- [ ] 增加日期范围筛选器
- [ ] 优化图表响应式布局

---

## 版本说明

- **日期格式**: YYYY-MM-DD
- **类型**: 新增(Added) / 变更(Changed) / 修复(Fixed) / 移除(Removed)