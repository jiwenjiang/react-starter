var path = require('path'); // 为了得到项目根路径
var webpack = require('webpack'); // webpack核心
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // 为了单独打包css
// var CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理文件夹
var HtmlWebpackPlugin = require('html-webpack-plugin'); //根据模板生成最终html文件
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
var os = require('os');
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});
var bundleConfig = require('./antd/dist/bundle-config.json');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname); // 项目根路径
var APP_PATH = path.resolve(ROOT_PATH, 'src'); // 项目src目录
var APP_FILE = path.resolve(APP_PATH, 'app'); // 项目的入口文件（即src/app.jsx）
// var IP_FILE = path.resolve(APP_PATH, 'config/index.js'); // 项目IP配置
var BUILD_PATH = path.resolve(ROOT_PATH, 'antd/dist'); // 发布文件所存放的目录
// var ZIP_PATH = path.resolve(ROOT_PATH, 'antd');

module.exports = {
    entry: {
        // ip: path.resolve(__dirname, 'src/config/index.js'),
        app: [
            APP_FILE,
            'babel-polyfill'
        ] // 需要被打包的文件，就这个入口文件
        // common: [
        // 'react',
        // 'react-dom',
        // 'react-router',
        // 'redux',
        // 'redux-thunk',
        // 'immutable'
        // ]
    },
    output: {
        publicPath: './dist/',
        path: BUILD_PATH, // 将文件打包到此目录下
        filename: '[name].[chunkhash].js', // 最终生成的文件名字，项目中为app.jsx,最终也会叫app.js
        chunkFilename: '[name].[chunkhash].min.js' // 这是配置一些非入口文件生成的最终文件名字，比如你用了代码分割，按需加载，把你的项目中某些文件单独打包了，就会用到这个。我们这里只有一个app.js,所以这个暂时用不上
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
            }) // 用这种方式写的，表示此类文件单独打包成一个css文件
        }, {
            // 解析less,原理同上
            test: /\.less$/, // 去掉exclude: /^node_modules$/是为了babel-plugin-import按需加载antd资源
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['happypack/loader?id=less']
            })
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|appcache)(\?|$)/, // 解析各种非图片文件
            exclude: /node_modules/,
            use: ['file-loader?name=[name].[ext]']
        }, {
            // 解析图片，小于8kb的转换成base64
            // 注意配种中的name,就是生成到了images文件夹下
            test: /\.(png|jpe?g|gif|svg)$/,
            exclude: /node_modules/,
            use: ['url-loader?limit=8192&name=images/[hash:8].[name].[ext]'],
            //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图
        }, {
            test: /\.jsx$/,
            exclude: [/node_modules/],
            use: ['happypack/loader?id=jsx']
        }]
    },
    /* 额外的插件 */
    plugins: [
        new webpack.DefinePlugin({ // 一定要配置这个，这个是为了告诉webpack，当前用什么模式打包代码，dev开发环境，test测试环境，advance预发环境，production生产环境
            'PRODUCTION': JSON.stringify(true)
        }),
        // new CleanWebpackPlugin(['antd'], {
        //   root: ROOT_PATH,
        //   verbose: true,
        //   dry: false
        // }),
        // 此插件详细教程 http://www.cnblogs.com/haogj/p/5160821.html
        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: '../index.html', //生成的html存放路径，相对于（比如前面配置的BUILD_PATH是“build/dist”,即index.html会生成到build下，其他文件会打包到build/dist下）
            template: './src/template/index.html', //html模板路径
            bundleName: bundleConfig.bundle.js,
            favicon: './favicon.ico',
            inject: 'body', // 是否将js放在body的末尾
            hash: false, // 是否为本页面所有资源文件添加一个独特的hash值
        }),
        new CopyWebpackPlugin([
            // {output}/file.txt
            {from: './src/config/LM_IP.js', to: 'LM_IP.js'},
        ]),
        // 配置了这个插件，再配合上面loader中的配置，将所有样式文件打包为一个单独的css文件
        new ExtractTextPlugin('[name].[chunkhash].css'),
        // 提取那些公共的模块、代码打包为一个单独的js文件
        // 下面这个方法第3个参数是自动去匹配，webpack遍历所有资源，发现是模块的，而且这个模块不是在src目录中的，就提取到公共js中
        // 即把所有node_modules中用到的包都单独打包到一个js中，如果有css,还会单独生成一个vendors.css文件
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            // (选择所有被选 chunks 的子 chunks)
            minChunks: 3,
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            verboseWhenProfiling: true,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['babel-loader']
            // debug:true
        }),
        new HappyPack({
            id: 'jsx',
            threadPool: happyThreadPool,
            verboseWhenProfiling: true,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['jsx-loader', 'babel-loader'],
            // debug:true
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            verboseWhenProfiling: true,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['css-loader', 'postcss-loader'],
            // debug:true
        }),
        new HappyPack({
            id: 'less',
            threadPool: happyThreadPool,
            verboseWhenProfiling: true,
            verbose: process.env.HAPPY_VERBOSE === '1',
            loaders: ['css-loader', 'postcss-loader', 'less-loader'],
            // debug:true
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./antd/dist/bundle.manifest.json')
        }),
        // Uglify 加密压缩源代码
        new ParallelUglifyPlugin({
            // include: BUILD_PATH,
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
