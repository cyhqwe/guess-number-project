# Agent Instructions

本文件用于约束以后在本仓库中工作的 AI 编码代理。目标是让每次开发、提交和同步都更稳，避免误覆盖旧项目或把错误目录推到 GitHub。

## 最高原则

- 先确认当前位置，再动代码。
- 先确认 Git 状态，再提交或推送。
- 保护用户已有改动，不擅自回滚、覆盖或删除。
- 一个项目对应一个独立文件夹和一个独立 Git 仓库。
- 如果目录、远程仓库或分支看起来不匹配，停止并向用户确认。

## 基础环境规则

默认按以下本机环境理解和执行项目任务：

- OS: Windows 11
- GPU target: NVIDIA GeForce RTX 3050 Laptop GPU
- 默认 Conda env: `D:\Python\newinstaller\Miniconda\envs\pytorch-weather`
- Python: `3.11`

涉及 Python、PyTorch、CUDA、GPU 推理或训练时，优先使用默认 Conda 环境中的 Python：

```powershell
& "D:\Python\newinstaller\Miniconda\envs\pytorch-weather\python.exe" --version
```

如果需要安装依赖，先确认当前任务确实属于 Python/GPU 工作流，再在该环境中安装；不要把依赖安装到系统 Python 或其他未知环境。

涉及 GPU 能力判断时，先检查：

```powershell
nvidia-smi
```

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

## 项目流程

当用户提出新功能、新产品想法、较大改动或需要完整开发闭环时，按下面流程推进。除非用户明确要求跳过，否则不要直接进入实现。

标准流程：

```text
brainstorming
-> office-hours
-> writing-plans
-> autoplan
-> 如果 autoplan 提出修改，回到 writing-plans 修订
-> executing-plans
-> review
-> qa
-> ship
```

### 阶段职责

- `brainstorming`：先理解项目上下文、用户目标、约束和成功标准；形成设计方向并等待用户批准。
- `office-hours`：对想法做更高层的产品、用户、需求和取舍审视，避免一开始就把错误方向做深。
- `writing-plans`：把已批准的设计写成可执行计划，保存到 `docs/superpowers/plans/`，并让每个任务可测试、可提交。
- `autoplan`：对计划做自动评审，覆盖 CEO、设计、工程和 DX 视角；如果提出修改，必须回到 `writing-plans` 修订计划后再继续。
- `executing-plans`：按计划执行，不在 `main` 上直接实现，优先使用隔离分支或 worktree；每个任务完成后运行对应验证并提交。
- `review`：在准备落地前做预合并代码审查，检查 diff、风险、遗漏测试和文档同步问题。
- `qa`：对可运行应用做用户视角 QA；发现可修复问题时按严重程度逐个修复、逐个提交、逐个复测。
- `ship`：完成最终验证、版本/变更记录、推送和 PR 创建；不能绕过测试或 review 直接推送。

### Git 配合点

流程开始前：

```powershell
Get-Location
git status --short --branch
git remote -v
git pull --rebase origin main
```

设计和计划阶段：

- `brainstorming` 生成设计文档后，提交一次文档变更。
- `writing-plans` 生成计划文档后，提交一次计划变更。
- `autoplan` 修改计划时，计划文件必须重新提交。

执行阶段：

- 不要在 `main` 上直接实现功能，除非用户明确要求。
- 为实现创建独立分支，分支名用简短英文描述，例如：

```powershell
git checkout -b feature/<short-name>
```

- 按计划任务小步提交，优先一项任务一个提交。
- 每次提交前运行：

```powershell
git status --short
```

Review 和 QA 阶段：

- `review` 前确认当前分支包含待审 diff，且工作区没有无关改动。
- `qa` 修复 bug 时，一个 bug 一个提交，提交信息优先使用 `fix(qa): ...`。
- QA 后必须重新运行项目验证命令。

Ship 阶段：

- `ship` 前必须有新鲜验证结果。
- 推送前不要使用 force push。
- 如果 GitHub 代理失败，优先使用临时绕过代理命令：

```powershell
git -c http.proxy= -c https.proxy= push origin <branch-name>
```

### 上下文压缩节点

在长流程中，必须主动压缩上下文，避免后续执行阶段丢失关键决策或被旧上下文干扰。

压缩时机：

- 进入 `executing-plans` 前压缩一次上下文。
- 进入 `qa` 前再压缩一次上下文。
- 进入 `ship` 前再压缩一次上下文。

每次压缩前，应确保以下内容已经落盘或能从 Git 恢复：

- 当前目标和用户批准的设计。
- 当前计划文件路径。
- 当前分支名和远程地址。
- 已完成和未完成任务。
- 最新验证结果。
- 任何用户明确偏好或禁止事项。

如果当前环境没有显式“压缩上下文”工具，就用项目文件承载上下文，例如：

- 更新对应的设计文档。
- 更新对应的计划文档。
- 在必要时创建或更新 `docs/superpowers/context/` 下的交接记录。
- 提交这些上下文文件后再继续下一阶段。

## 6A 工作流

当用户输入以“以6A工作流”开头的内容时，立即响应：

```text
6A工作流已激活
```

6A 工作流用于把模糊需求转成精确规范、架构设计、原子任务、执行记录和最终评估。它可以和上面的标准项目流程配合使用：6A 负责需求、架构和任务拆解的严谨性；`review`、`qa`、`ship` 负责落地前质量检查和发布。

### 角色定位

执行 6A 工作流时，代理应以软件架构师和工程师身份工作，重点能力包括：

- 上下文工程：先构建完整任务上下文，再做方案判断。
- 规范驱动：把模糊需求转化为精确、可执行、可测试的规范。
- 质量优先：每个阶段都有质量门控，不能跳过关键确认。
- 项目对齐：深入理解现有项目结构、技术栈、代码模式和约束。

### A1: Align 对齐阶段

目标：将模糊需求转化为精确规范。

必须执行：

- 分析现有项目结构、技术栈、代码模式和业务域。
- 创建 `docs/<任务名>/ALIGNMENT_<任务名>.md`，记录原始需求、任务边界、理解确认、疑问澄清和关键假设。
- 自动识别歧义，生成结构化问题清单。
- 能基于项目上下文合理决策时，给出明确决策；无法安全决策时，中断并询问用户。
- 形成最终共识文档 `docs/<任务名>/CONSENSUS_<任务名>.md`。

质量门控：

- 需求无明显歧义。
- 技术方案与现有架构对齐。
- 任务边界清楚。
- 验收标准可测试。
- 所有关键假设已确认或显式记录。

Git 配合：

```powershell
git add docs/<任务名>/ALIGNMENT_<任务名>.md docs/<任务名>/CONSENSUS_<任务名>.md
git commit -m "docs: align <任务名> requirements"
```

### A2: Architect 架构阶段

目标：将共识文档转化为系统架构与设计。

必须执行：

- 基于 `CONSENSUS` 文档创建 `docs/<任务名>/DESIGN_<任务名>.md`。
- 设计文档应包含 Mermaid 架构图、核心组件、接口契约、数据流和异常处理策略。
- 严格限定任务范围，优先复用现有组件、工具和项目惯例。

质量门控：

- 架构图清晰准确。
- 接口定义完整。
- 数据流和异常路径可理解。
- 与现有系统无冲突。
- 设计可实现、可测试、可维护。

Git 配合：

```powershell
git add docs/<任务名>/DESIGN_<任务名>.md
git commit -m "docs: design <任务名> architecture"
```

### A3: Atomize 原子化阶段

目标：把架构设计拆分为可执行的原子任务。

必须执行：

- 创建 `docs/<任务名>/TASK_<任务名>.md`。
- 每个原子任务都要写清输入契约、输出契约、实现约束、验收标准和依赖关系。
- 使用 Mermaid 绘制任务依赖图。
- 拆分时控制复杂度，确保每个任务可独立验证。

质量门控：

- 任务覆盖完整需求。
- 依赖关系无循环。
- 每个任务都有独立验收标准。
- 并行任务和后置任务关系清楚。
- 复杂度评估合理。

Git 配合：

```powershell
git add docs/<任务名>/TASK_<任务名>.md
git commit -m "docs: atomize <任务名> tasks"
```

### A4: Approve 审批阶段

目标：对原子任务进行人工审查与确认。

必须执行：

- 检查完整性、一致性、可行性、可控性和可测性。
- 向用户呈现最终确认清单。
- 用户确认前，不进入自动化执行。

最终确认清单必须覆盖：

- 实现需求无歧义。
- 子任务定义明确。
- 边界清晰。
- 验收标准明确。
- 质量标准明确。

质量门控：

- 检查清单无阻塞问题。
- 用户已明确批准继续执行。

Git 配合：

- 如果审批阶段修改了 `TASK`、`DESIGN` 或 `CONSENSUS` 文档，必须提交这些修改后再进入执行。

### A5: Automate 自动化执行阶段

目标：按文档逐步执行原子任务。

必须执行：

- 创建或更新 `docs/<任务名>/ACCEPTANCE_<任务名>.md` 记录执行进度。
- 按依赖顺序执行每个子任务。
- 每个任务执行前检查输入契约、环境依赖和前置依赖。
- 按设计编写代码和测试。
- 运行验证测试并更新验收记录。
- 严格遵循现有项目代码风格，优先复用现有组件和工具。

异常处理：

- 遇到无法自主决策的问题、技术阻塞或文档不一致时，立即中断。
- 在 `TASK` 或 `ACCEPTANCE` 文档中记录阻塞细节。
- 等待用户澄清后，从中断点继续。

Git 配合：

- 不在 `main` 上直接实现，除非用户明确要求。
- 每个原子任务完成后，优先单独提交。
- 提交前运行 `git status --short`，只添加与当前任务相关的文件。

### A6: Assess 评估阶段

目标：对执行结果进行质量评估与最终交付。

必须执行：

- 更新 `ACCEPTANCE` 文档，确认所有需求是否实现、验收标准是否满足、项目是否编译通过、测试是否通过。
- 评估代码质量、测试质量、文档质量和系统集成度。
- 生成 `docs/<任务名>/FINAL_<任务名>.md` 作为项目总结报告。
- 生成 `docs/<任务名>/TODO_<任务名>.md`，记录明确待办事项、缺少配置和操作指引。

技术规范：

- API key、token、密码等敏感信息必须使用 `.env` 或安全配置管理，不能提交到 Git。
- 任何代码变更都要同步更新相关文档。
- 测试优先，覆盖正常流程、边界条件和异常情况。

Git 配合：

```powershell
git add docs/<任务名>/ACCEPTANCE_<任务名>.md docs/<任务名>/FINAL_<任务名>.md docs/<任务名>/TODO_<任务名>.md
git status --short
```

如果代码或配置也发生变化，按功能边界一起提交。完成后继续进入 `review -> qa -> ship`，除非用户明确只需要本地交付。

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
