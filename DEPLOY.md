# 发布说明

这个项目是纯静态页面，最省事的发布方式是 `Netlify` 或 `Vercel`。

## 方式一：Netlify

1. 把当前 `dashboard` 目录上传到 GitHub 仓库。
2. 打开 Netlify，选择 `Add new site`。
3. 连接你的 GitHub 仓库。
4. 构建设置保持默认即可。
5. 发布目录填 `.`。
6. 点击部署。

项目里已经包含 [netlify.toml](/D:/绘本阅读机器人/dashboard/netlify.toml)，通常不需要再额外改配置。

## 方式二：Vercel

1. 把当前 `dashboard` 目录上传到 GitHub 仓库。
2. 打开 Vercel，选择 `Add New Project`。
3. 导入对应仓库。
4. Framework Preset 选 `Other`。
5. 不需要构建命令。
6. 输出目录留空或填 `.`。
7. 点击部署。

项目里已经包含 [vercel.json](/D:/绘本阅读机器人/dashboard/vercel.json)。

## 本地先预览

在项目目录执行：

```powershell
python -m http.server 8080
```

然后浏览器访问：

```text
http://localhost:8080/index.html
```

## 注意

- 页面依赖外部 CDN：`Tailwind`、`ECharts`、`Google Fonts`。
- 如果对方网络访问这些 CDN 受限，页面可能样式不完整或图表不显示。
- 如果你要发给国内用户长期体验，下一步建议把这些 CDN 资源改成本地文件。
