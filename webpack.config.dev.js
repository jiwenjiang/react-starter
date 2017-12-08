var path = require('path'); // node内置path模块
var webpack = require('webpack'); // webpack打包工具
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var os = require('os');
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});


// 定义地址
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'app'); //根目录文件app.jsx地址
var BUILD_PATH = path.resolve(ROOT_PATH, '/antd/dist'); // 发布文件所存放的目录

module.exports = {
    entry: {
        app: [
            'webpack-hot-middleware/client',
            'babel-polyfill',
            APP_FILE
        ]
    },
    output: {
        publicPath: '/antd/dist/', //编译好的文件，在服务器的路径,这是静态资源引用路径
        path: BUILD_PATH, //发布文件地址
        filename: '[name].js', //编译后的文件名字
        chunkFilename: '[name].[chunkhash:5].min.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['happypack/loader?id=js', 'eslint-loader'],
            include: [APP_PATH]
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ['happypack/loader?id=css'],
            include: [APP_PATH]
        }, {
            test: /\.less$/, // 去掉exclude: /^node_modules$/和include: [APP_PATH]是为了babel-plugin-import按需加载antd资源
            use: ['happypack/loader?id=less']
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|appcache)(\?|$)/,
            exclude: /node_modules/,
            use: ['file-loader?name=[name].[ext]'],
            include: [APP_PATH]
        }, {
            test: /\.(png|jpe?g|gif|svg)$/,
            exclude: /node_modules/,
            use: ['url-loader?limit=8192&name=images/[hash:8].[name].[ext]'],
            include: [APP_PATH]
        }, {
            test: /\.jsx$/,
            enforce: 'pre',
            use: ['happypack/loader?id=jsx'],
            include: [APP_PATH],
            exclude: /node_modules/
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'PRODUCTION': JSON.stringify(false)
        }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/template/index.html',
            favicon: './favicon.ico',
            hash: false,
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.HotModuleReplacementPlugin(), // 热更新插件
        new webpack.NoEmitOnErrorsPlugin(), // 即使有错误也不中断运行
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['react-hot-loader', 'babel-loader?cacheDirectory', 'eslint-loader'],
        }),
        new HappyPack({
            id: 'jsx',
            threadPool: happyThreadPool,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['react-hot-loader', 'jsx-loader', 'babel-loader?cacheDirectory', 'eslint-loader']
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['style-loader', 'css-loader', 'postcss-loader'],
        }),
        new HappyPack({
            id: 'less',
            threadPool: happyThreadPool,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css'], //后缀名自动补全
        alias: {
            _component: path.resolve(APP_PATH, 'component'),
            _containers: path.resolve(APP_PATH, 'containers'),
            _config: path.resolve(APP_PATH, 'config'),
            _assets: path.resolve(APP_PATH, 'assets'),
            _redux: path.resolve(APP_PATH, 'redux'),
            _services: path.resolve(APP_PATH, 'services')
        }
    },
    devtool: 'source-map'
};