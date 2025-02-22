---
title: handling code commit conflicts
date: 2024-02-25T00:00:00.000Z
tags: [git]
category: 技术
comments: false
draft: false
---

## 问题一：远程与本地记录不一致

我在web上直接点击创建仓库，当时生成默认的文件。后续在本地添加远程分支的时候，提示我没有提交记录无法保存。现在已经解决了问题。

- 本地添加远程记录

```shell
git remote add origin https://xxx.git
```

- 强制提交

```shell
git push -u origin main
```

- 若是提示没有历史记录(可以先忽略历史提交)

适合合并远程 `main` 分支的历史记录到当前分支，并且允许合并两者之间没有共同历史记录的情况

```shell
git merge origin/main --allow-unrelated-histories
```

- 删除分支

```shell
// 删除本地分支
git branch -d localBranchName

// 删除远程分支
git push origin --delete remoteBranchName
```
