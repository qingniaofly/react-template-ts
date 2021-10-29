## 应用管家


## 🚀技术栈
- [x] 构建：Babel7 Webpack(4.x)
- [x] 热更新
- [x] UI组件：Antd(4.x)
- [x] React(16.11.0)
- [x] immutable：immer
- [x] Ajax：axios
- [x] 代码校验: Eslint
- [x] 代码格式: prettie
- [x] 国际化: react-intl
- [x] 状态管理: redux rxjs


## 🏃 开始
> 为了更好的开发体验，你还需要安装以下 VSCode 插件
>
> - **Prettier - Code formatter**
> - **ESLint**


如果你用的是windows,最好全局将autocrlf设置为false
```
git config --global core.autocrlf false
```


```sh
yarn
yarn start
```


## 🌳 目录结构
```sh
├── /webpack/                    # 构建项目配置
├── /public/                     # 外部依赖
├── /typings/                    # 全局类型
├── /scripts/                    # 构建脚本
├── /src/                        # 源码目录
│ ├── /components/               # 组件目录
│ ├── /containers/               # 容器目录
│ ├── /constants/                # constant 目录
│ ├── /hooks/                    # 自定义hook 目录
│ ├── /routes/                   # 路由目录
│ ├── /layouts/                  # 布局目录
│ ├── /scss/                     # 全局样式
│ ├── /services/                 # 请求服务目录
│ ├── /store/                    # redux目录
│ │ ├── locale                   # 语言状态
│ │ ├── middleware               # 中间件
│ │ ├── user                     # 用户信息
│ ├── /translations/             # 国际化
│ ├── /utils/                    # util 目录
│ │ ├── utils.axios.ts           # 基于axios封装的http请求工具
│ │ ├── urtils.redux.ts          # 重写redux方法
│ │ ├── urtils.cookies.ts        # 封装js-cookies
│ └── index.tsx                  # 项目入口
```

