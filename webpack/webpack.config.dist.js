var path = require('path'); // 为了得到项目根路径
var webpack = require('webpack'); // webpack核心
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // 为了单独打包css
// var CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理文件夹
var HtmlWebpackPlugin = require('html-webpack-plugin'); //根据模板生成最终html文件
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
var os = require('os');
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});
var bundleConfig = require('../antd/dist/bundle-config.json');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname); // 项目根路径
var APP_PATH = path.resolve(ROOT_PATH, '../src'); // 项目src目录
var APP_FILE = path.resolve(APP_PATH, 'app'); // 项目的入口文件（即src/app.jsx）
// var IP_FILE = path.resolve(APP_PATH, 'config/index.js'); // 项目IP配置
var BUILD_PATH = path.resolve(ROOT_PATH, '../antd/dist'); // 发布文件所存放的目录
// var ZIP_PATH = path.resolve(ROOT_PATH, 'antd');

module.exports = {
    entry: {
        // ip: path.resolve(__dirname, 'src/config/index.js'),
        app: [
            APP_FILE,
            'babel-polyfill'
        ]
    },
    output: {
        publicPath: './dist/',
        path: BUILD_PATH,
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].min.js'
    },
    module: {
        rules: [{
            test: /\.js$/, // 解析.js
            exclude: [/node_modules/],
            use: ['happypack/loader?id=js']
        }, {
            test: /\.css$/, // 解析.css,注意这里要用这个插件作为loader,最后才能生成单独的css文件
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['happypack/loader?id=css']
            })
        },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['happypack/loader?id=less']
                })
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|appcache)(\?|$)/, // 解析各种非图片文件
                exclude: /node_modules/,
                use: ['file-loader?name=[name].[ext]']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                exclude: /node_modules/,
                use: ['url-loader?limit=8192&name=images/[hash:8].[name].[ext]'],
            },
            {
                test: /\.jsx$/,
                exclude: [/node_modules/],
                use: ['happypack/loader?id=jsx']
            }
        ]
    },
    /* 额外的插件 */
    plugins: [
        new webpack.DefinePlugin({
            'PRODUCTION': JSON.stringify(true)
        }),

        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: '../index.html', //生成的html存放路径，相对于（比如前面配置的BUILD_PATH是“build/dist”,即index.html会生成到build下，其他文件会打包到build/dist下）
            template: './src/template/index.html', //html模板路径
            bundleName: bundleConfig.bundle.js,
            favicon: './favicon.ico',
            inject: 'body', // 是否将js放在body的末尾
            hash: false, // 是否为本页面所有资源文件添加一个独特的hash值
        }),
        new CopyWebpackPlugin([
            {from: './src/config/LM_IP.js', to: 'LM_IP.js'},
        ]),
        // 配置了这个插件，再配合上面loader中的配置，将所有样式文件打包为一个单独的css文件
        new ExtractTextPlugin('[name].[chunkhash].css'),
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            minChunks: 3,
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            verboseWhenProfiling: true,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['babel-loader']
        }),
        new HappyPack({
            id: 'jsx',
            threadPool: happyThreadPool,
            verboseWhenProfiling: true,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['jsx-loader', 'babel-loader'],
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            verboseWhenProfiling: true,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['css-loader', 'postcss-loader'],
        }),
        new HappyPack({
            id: 'less',
            threadPool: happyThreadPool,
            verboseWhenProfiling: true,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['css-loader', 'postcss-loader', 'less-loader'],
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../antd/dist/bundle.manifest.json')
        }),
        new ParallelUglifyPlugin({
            workerCount: os.cpus().length,
            uglifyJS: {
                output: {
                    comments: false, // 删除代码中所有注释
                    max_line_len: 50000
                },
                compress: {
                    warnings: false, // 忽略警告
                    drop_debugger: true,
                    drop_console: true
                }
            }
        })
    ],
    // 配置额外的解决方案
    resolve: {
        modules: [
            APP_PATH,
            'node_modules'
        ],
        extensions: ['.js', '.jsx', '.less', '.css'], //后缀名自动补全
        alias: {
            _component: path.resolve(APP_PATH, 'component'),
            _containers: path.resolve(APP_PATH, 'containers'),
            _config: path.resolve(APP_PATH, 'config'),
            _assets: path.resolve(APP_PATH, 'assets'),
            _redux: path.resolve(APP_PATH, 'redux'),
            _services: path.resolve(APP_PATH, 'services')
        }
    }
};
