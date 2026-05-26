# 更新日志 (Changelog)

本文档记录绘本阅读机器人仪表盘项目的所有重要更新。

---

## [2026-05-26]

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