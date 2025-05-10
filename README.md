# 基于sveltekit的管理控制端

## 子树更新与同步

### 提交prisma的更改

```bash
git add prisma/
git commit -m "Update prisma"
git push origin main
```

### 将更改推送到vue3-web-prisma仓库

```bash
git subtree push --prefix=prisma https://github.com/guangyiliushan/vue3-web-prisma.git main
```

### 拉取最新更改

```bash
git subtree pull --prefix=prisma https://github.com/guangyiliushan/vue3-web-prisma.git main --squash
```
