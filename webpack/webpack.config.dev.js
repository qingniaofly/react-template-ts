const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin")
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin")

const {
    getClientEnvironment,
    paths,
    entry,
    output,
    resolve,
    getStyleLoaders,
    eslintRules,
    babelLoader,
    imagesUrlLoader,
    fontsLoader,
    svgLoader
} = require("./config")

// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = ""
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl)
module.exports = {
    mode: "development",
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
    devtool: "cheap-module-source-map",
    entry: entry(paths),
    output: output(paths),
    resolve: resolve(paths, { "@": paths.appSrc }),
    externals: {
        jsencrypt: "JSEncrypt"
    },
    // headers: {
    //     "Access-Control-Allow-Origin": "*"
    // },
    module: {
        strictExportPresence: true,
        rules: [
            // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
            // { parser: { requireEnsure: false } },
            eslintRules(paths),
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list
                oneOf: [babelLoader(paths), imagesUrlLoader(), ...getStyleLoaders(), fontsLoader(), svgLoader()]
            }
        ]
    },
    optimization: {
        // chunkIds: "named", //for debug
        splitChunks: {
            chunks: "all",
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: "~",
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                commons: {
                    name: "commons",
                    // minChunks: Infinity,
                    minSize: 100,
                    minChunks: 3,
                    reuseExistingChunk: true
                },
                react: {
                    name: "react",
                    test: /[\\/]node_modules[\\/](react|react-dom|redux|react-router|react-router-dom)[\\/]/,
                    chunks: "initial"
                    // enforce: true
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new HardSourceWebpackPlugin({
            environmentHash: {
                root: process.cwd(),
                directories: [],
                files: ["package-lock.json", "yarn.lock"]
            }
        }),
        new webpack.ProvidePlugin({
            dayjs: "dayjs"
        }),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            title: "web_library",
            inject: true,
            showErrors: true,
            template: paths.appHtml
        }),

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "static/css/[name].[contenthash:8].css",
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
        }),

        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        // Makes some environment variables available in index.html.
        // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In development, this will be an empty string.
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
        new webpack.DefinePlugin(env.stringified),

        new webpack.NamedModulesPlugin(),

        new webpack.HotModuleReplacementPlugin(),
        // skip the emitting phase whenever there are errors while compiling, this
        //won't reload page
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.HashedModuleIdsPlugin(),

        new ForkTsCheckerWebpackPlugin(),

        new webpack.optimize.RuntimeChunkPlugin({
            name: "manifest"
        }),

        new AntdDayjsWebpackPlugin()
    ],
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
        hints: false
    },
    node: {
        constants: false
    }
}
