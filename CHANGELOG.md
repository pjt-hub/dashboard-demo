# 更新日志 (Changelog)

本文档记录绘本阅读机器人仪表盘项目的所有重要更新。

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