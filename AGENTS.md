# Agent Instructions

本文件用于约束以后在本仓库中工作的 AI 编码代理。目标是让每次开发、提交和同步都更稳，避免误覆盖旧项目或把错误目录推到 GitHub。

## 最高原则

- 先确认当前位置，再动代码。
- 先确认 Git 状态，再提交或推送。
- 保护用户已有改动，不擅自回滚、覆盖或删除。
- 一个项目对应一个独立文件夹和一个独立 Git 仓库。
- 如果目录、远程仓库或分支看起来不匹配，停止并向用户确认。

## 开工前检查

每次开始改项目之前，先运行：

```powershell
Get-Location
git status --short --branch
git remote -v
```

确认以下内容：

- 当前目录是用户要操作的项目目录。
- 当前分支符合预期，通常是 `main`。
- 远程地址指向当前项目对应的 GitHub 仓库。
- 工作区是否已有用户未提交改动。

如果不是 Git 仓库，不要立刻 `git init`。先确认这是不是一个新项目目录，而不是旧项目的子目录。

## 新项目规范

新项目应放在独立目录中，不要嵌套到已有 Git 仓库内部。

如果是从 GitHub 上已有仓库开始，优先使用：

```powershell
git clone https://github.com/<user>/<repo>.git
```

如果是本地新项目，确认目录无误后再执行：

```powershell
git init
git branch -M main
```

添加远程时优先使用 HTTPS：

```powershell
git remote add origin https://github.com/<user>/<repo>.git
```

如果 `origin` 已存在，不要重复添加，改用：

```powershell
git remote set-url origin https://github.com/<user>/<repo>.git
```

## 文件提交规范

提交前先检查 `.gitignore`，确保不会提交依赖、构建产物和本地临时文件。

常见应忽略内容：

```gitignore
node_modules/
dist/
coverage/
*.log
*.tsbuildinfo
.env
.env.*
```

优先精确添加需要提交的文件，例如：

```powershell
git add README.md LICENSE .gitignore package.json src
```

只有在确认 `.gitignore` 正确且工作区内容全部属于当前项目时，才使用：

```powershell
git add .
```

提交前复查：

```powershell
git status --short
```

## 同步规范

推送前先尝试衔接远端更新：

```powershell
git pull --rebase origin main
git push origin main
```

如果本地分支第一次推送：

```powershell
git push -u origin main
```

推送完成后确认本地与远端对齐：

```powershell
git status --short --branch
git log --oneline --decorate -3
```

看到类似 `HEAD -> main, origin/main` 时，说明当前提交已同步到 GitHub。

## GitHub 网络与代理

本机可能存在 Git 全局代理配置：

```powershell
git config --show-origin --get-regexp "^(http|https)\..*proxy$|^http\.proxy$|^https\.proxy$"
```

如果推送失败，并出现类似：

```text
Failed to connect to github.com port 443 via 127.0.0.1
```

优先临时绕过代理推送：

```powershell
git -c http.proxy= -c https.proxy= push origin main
```

不要擅自清除全局代理配置。只有用户明确同意时，才执行：

```powershell
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 保护旧项目

遇到以下情况必须暂停确认：

- 当前目录和用户描述的项目名称不一致。
- `git remote -v` 指向另一个仓库。
- `git status` 显示大量不相关改动。
- 当前仓库包含另一个项目的源码或文档。
- 准备执行会覆盖历史或工作区的 Git 命令。

禁止在未获明确允许时执行：

```powershell
git reset --hard
git checkout -- .
git clean -fd
```

如果需要撤销 AI 自己刚刚做的改动，必须先确认不会影响用户已有文件。

## 完成前验证

代码改动完成后，根据项目类型运行合适的验证命令。

本项目常用：

```powershell
npm test
npm run build
```

文档或 Git 配置类改动至少要运行：

```powershell
git status --short --branch
```

只有完成验证后，才能说明工作已经完成或可以提交。
