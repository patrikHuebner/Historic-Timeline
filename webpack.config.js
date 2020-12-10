const APP_title = 'Interaktiver Zeitstrahl';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IS_WDS = /webpack-dev-server/.test(process.env.npm_lifecycle_script);
const webpack = require('webpack');

/**
 * Get current time
 * @example 10:34:12 am
 * @param {Date} date
 * @returns {string}
 */
function getTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return hours + ':' + minutes + ':' + seconds + " " + ampm;
}

/**
 * Get current date
 * @example 13-09-2016
 * @returns {string}
 */
function getDate() {
    var currentDate = new Date();
    return ("0" + (currentDate.getMonth() + 1)).slice(-2) + '/' + ("0" + currentDate.getDate()).slice(-2) + '/' + currentDate.getFullYear() + ' @ ' + getTime(currentDate);
}

module.exports = {
    mode: 'development', // development || production
    entry: {
        build: ['@babel/polyfill', './dev/js/index.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist/assets'),
        publicPath: IS_WDS ? '' : './assets/',
        filename: IS_WDS ? '[name].js' : '[name].[chunkhash].js',
    },
    resolve: {
        alias: {
            'fontAssets': path.resolve(__dirname, 'dist/assets/fonts'),
        }
    },
    devServer: {
        port: 4000,
        // host: '192.168.178.95', // host: '192.168.178.95', || 119
        contentBase: path.join(__dirname, 'dist'),
        writeToDisk: false, // false: keep in RAM, true: write to disk
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-syntax-dynamic-import']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'glslify-import-loader',
                    'raw-loader',
                    'glslify-loader'
                ]
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use:
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.DefinePlugin({
            //VERSION: JSON.stringify('12345')
            VERSION: JSON.stringify(getDate())
        }),
        new HtmlWebpackPlugin({
            title: APP_title,
            template: path.resolve(__dirname, 'dev/index.ejs'),
            filename: IS_WDS ? 'index.html' : '../index.html',
            inject: true,
            // hash: true,
            minify: {
                removeComments: IS_WDS ? false : true,
                collapseWhitespace: IS_WDS ? false : true,
            }
        }),
    ]
}