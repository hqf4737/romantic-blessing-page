# romantic-blessing-page

A romantic blessing page.

- 私用版: https://hqf4737.github.io/romantic-blessing-page/
- 公开版: https://hqf4737.github.io/romantic-blessing-page/public/

## 版本区分

这个项目现在分成两个独立入口：

- 私用版入口: `index.html` -> `src/App.jsx`
- 公开版入口: `public/index.html` -> `src/public/PublicApp.jsx`

日常开发默认只更新私用版。公开版相当于当前快照，已经和私用版拆开打包；后续给私用版添加新功能、照片、文案或交互时，只要不改 `src/public/` 和 `public/index.html`，公开版就不会跟着变化。

## 日常开发流程

普通更新只改私用版相关文件，例如：

- `src/App.jsx`
- `src/styles.css`
- 私用版才会用到的组件或素材

改完运行：

```bash
npm run build
```

确认私用版正常后再提交和发布。私用版打开时需要密码，当前密码为 `0908`，代码里只保存加盐哈希，不直接保存明文密码。

## 公开版更新流程

只有明确要把内容同步给别人看时，才特殊处理公开版。公开版只改这些文件：

- `src/public/PublicApp.jsx`
- `src/public/public.css`
- `public/index.html`

公开版发布前需要确认：

- `/public/` 不需要密码。
- `/public/` 没有私密称呼、照片、文件名或个人信息。
- 公开文案仍然使用“我希望”“我爱的人，”，不要出现只想放在私用版里的内容。
- 私用版新功能没有被复制到 `src/public/`，除非这次就是要公开同步。

## 隐私提醒

GitHub Pages 是公开静态托管。前端密码只能挡住普通访问，不能真正保护私密照片或文件。

不要把私密照片、原图或其他敏感文件提交到这个公开仓库，也不要发布到 `gh-pages`。如果后续需要真正放私密素材，应该改成有后端鉴权或私有存储的方案。
