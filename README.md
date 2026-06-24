# romantic-blessing-page
A romantic blessing page

- 私用版: https://hqf4737.github.io/romantic-blessing-page/
- 公开版: https://hqf4737.github.io/romantic-blessing-page/public/

## 版本区分

默认开发只更新私用版。公开版是单独的内容快照，不会自动跟随私用版文案更新。

- 私用版内容: 修改 `src/App.jsx` 里的 `privateLines`
- 公开版内容: 修改 `src/App.jsx` 里的 `publicLines`
- 公开版入口: 构建后自动生成 `dist/public/index.html`

## 日常更新流程

平时只改私用版内容，也就是 `privateLines`。改完运行:

```bash
npm run build
```

确认私用版正常后再提交和发布。

## 公开版更新流程

只有明确要同步给别人看的内容时，才修改 `publicLines`。

公开版发布前需要确认:

- `publicLines` 不包含私密称呼、照片、文件名或其他个人信息
- 打开 `/public/` 不需要密码
- `/public/` 里没有出现只想放在私用版的内容

## 隐私提醒

GitHub Pages 是公开静态托管。前端密码只能挡住普通访问，不能真正保护私密照片或文件。

不要把私密照片、原图或其他敏感文件提交到这个公开仓库，也不要发布到 `gh-pages`。如果后续需要真正放私密素材，应该换成有后端鉴权或私有存储的方案。
