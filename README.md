尼好程序开发测试项目管理软件
===

## 快速开始

```bash
npm install
npm start
```

## 账号

账号: admin
密码: 123456

## 目录结构
```
.
├── README.md
├── config
│   └── routes.json   路由配置
├── mocker  mock 数据
│   ├── auth
│   │   └── index.js
│   ├── demo.js
│   ├── index.js
│   ├── login.js
│   └── selectPage.js
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── sandbox.config.json
├── src
│   ├── assets
│   │   ├── head.png
│   │   ├── logo-dark.svg
│   │   └── logo-light.svg
│   ├── index.css
│   ├── index.tsx
│   ├── layouts 框架组件
│   │   ├── BasicLayout.tsx
│   │   ├── UserLayout.tsx
│   │   └── logo.svg
│   ├── models    remach models
│   │   ├── Doc
│   │   │   └── doc.ts
│   │   ├── demo.ts
│   │   ├── global.ts
│   │   ├── home.ts
│   │   └── login.ts
│   ├── pages  页面， 文件名大写
│   │   ├── Dashboard
│   │   │   └── index.tsx
│   │   ├── Demo
│   │   │   ├── Detail
│   │   │   │   ├── index.tsx
│   │   │   │   └── items.tsx
│   │   │   └── index.tsx
│   │   ├── TableList
│   │   │   └── index.tsx
│   │   └── login
│   │       ├── index.module.less
│   │       └── index.tsx
│   ├── react-app-env.d.ts
│   └── servers 放置api文件的地方，文件名已后端接口模块名命名，不以路由命名
│       └── index.ts
└── tsconfig.json
```
