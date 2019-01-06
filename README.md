项目名称
====
用于毕设，书籍评价系统，用于广泛分享读者间的阅读总结，技巧等类博文系统
<br/>作者： Jayant
<br/>时间：2019.1.2

#### 项目目录结构介绍:
<br/>├── Readme.md                   // READMEmd
<br/>├── index.js                    // 入口html
<br/>├── config                      // 配置
<br/>│   ├── dev.env.js
<br/>│   ├── prod.env.js           
<br/>│   └── index.js                // 配置控制
<br/>|
<br/>├── service                     //服务端代码
<br/>│   ├── dao                     //dao
<br/>│   ├── routes                  //路由
<br/>│   └── db                      //数据库配置及相关语句
<br/>│       ├── db.js               //数据库连接配置
<br/>│       └── sqlMap.js           //各语句
<br/>├── src 
<br/>│   ├── assets                  
<br/>│   ├── components              //组件
<br/>│   ├── routes                  //路由
<br/>│   ├── views                   //页面
<br/>│   ├── App.vue                 //主
<br/>│   └── main.js                        
<br/>├── static                      //静态文件存放
<br/>└── 

#### 系统运行前置安装条件：
###### Node v6.12.2
###### npm v3.10.10
###### node-inspector v1.1.2
###### python v2.7.12
###### mysql

#### 该系统主要使用技术或工具
###### vue-cli、express、Node、mysql、element-ui、VSCode

#### 后端服务 
###### 启动后端服务：
```bash
# 进入后台目录文件
cd service
# app listening on port 3000
node app.js
```
#### 启动node-inspector进行后端代码调试
```bash
# service中进行debug
node --debug app.js
# 新建cmd，并输入以下命令
node-inspector --web-port=3000，Visit http://127.0.0.1:3000/?port=5858 to start debugging.
# chorme中进行断点调试
```
#### 运行前端工程
``` bash
# 安装开发依赖包
npm install
# 开启服务于热更新在8001端口
npm run dev
```
