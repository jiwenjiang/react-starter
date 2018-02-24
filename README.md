## react-starter <img src='https://img.shields.io/badge/node-v7.8.0-green.svg'>

## 技术栈 (technology)

```
react + redux + webpack2.x
```

## 文件结构 (File structure)


```
├── webpack                     webpack构建目录
├── antd                        项目build目录
├── .eslintrc.js                eslint配置文件
├── .babelrc                    babel配置文件
├── package.json                项目配置文件
├── src                         生产目录
    |—— app.jsx                 入口文件
    |—— assets                  静态资源
    |——|—— style                全局样式    
    |——|—— img                  图片
    |——|—— fonts                字体图标
    |——|—— antd-fonts           antd文件字体
    |—— component               项目公用组件（木偶组件）
    |—— config                  项目配置文件    
    |——|—— ip                   项目访问路径配置    
    |——|—— index                项目访问外部ip配置(开发环境)  
    |——|—— LM_IP                项目访问外部ip配置(生产环境，之所以单独拿出来是因为实际项目需要先打包，线下部署时才能确定真正ip)
    |—— containers              项目业务组件（容器组件）
    |—— redux                   项目状态管理
    |——|—— action               action
    |——|—— reducer              reducer
    |——|—— store                store
    |—— router                  项目路由
    |—— services                公用服务  
    |——|—— consts               主要用于放置一些静态配置项
    |——|—— decorator            装饰器
    |——|—— filter               过滤器
    |——|—— regexp               正则  
    |——|—— utils                工具类
    |——|—— xhr                  项目ajax服务封装
    |—— template                webpack生产环境打包项目的模板
  
```



## 项目运行(Probject running)

1.克隆项目到本地 : git clone https://github.com/jiwenjiang/react-starter.git

2.安装依赖环境 : yarn install

3.启动项目 : yarn dev        

4.打包项目 : yarn dist






