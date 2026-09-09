# 网站盒子公网部署指南

网站盒子是纯静态网页，不依赖服务器和数据库，可以直接托管到任意静态网站平台。部署后，各设备都能通过公网网址打开；收藏数据仍保存在访问设备的浏览器里，换设备不会自动同步。

## 方式一：Netlify（最快，免命令行）

1. 打开 <https://app.netlify.com/drop>，注册或登录 Netlify。
2. 将本目录整个拖到页面中（包含 `index.html`、`css`、`js`、`assets`）。
3. 等待部署完成后，Netlify 会给出一个类似 `https://xxx.netlify.app` 的公网地址。
4. 可在 Site settings 中把子域名改成更好记的名字，例如 `my-web-box.netlify.app`。

每次修改文件后，重新拖一次即可更新。想省事也可以安装 Netlify CLI 后运行：

```powershell
npx netlify-cli deploy --prod --dir=C:\Users\86182\Documents\Codex\2026-09-09\wo\outputs\website-box
```

## 方式二：GitHub Pages（适合长期更新）

1. 在 GitHub 上创建一个公开仓库，例如 `website-box`，建议不要勾选自动生成 README。
2. 在 PowerShell 中执行：

```powershell
cd C:\Users\86182\Documents\Codex\2026-09-09\wo\outputs\website-box
git init
git add .
git commit -m "init website box"
git branch -M main
git remote add origin https://github.com/你的用户名/website-box.git
git push -u origin main
```

3. 打开仓库的 `Settings -> Pages`，把 Source 设为 `Deploy from a branch`，Branch 选择 `main`，目录选择 `/ (root)`。
4. 保存后，页面地址为 `https://你的用户名.github.io/website-box`。

以后在本地修改后重复执行 `git add .`、`git commit`、`git push` 即可自动更新。

## 跨设备数据说明

- 每台设备首次打开网址时都会显示示例数据，之后各自保存在该设备的浏览器中。
- 想把一台设备上的收藏迁到另一台，请在这台设备点击右上角“导出备份”，再到另一台设备点击“导入备份”。
- 当前版本不做云端账号同步。如果以后需要多设备看到同一份收藏，需要增加后端数据库，例如 Supabase 或 Firebase。
