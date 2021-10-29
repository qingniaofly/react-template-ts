const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
// const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
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
    svgLoader,
} = require('./config');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);
//global style
// const extractGlobalCSS = new ExtractTextPlugin({filename: 'css/global-[name].css'});
// const extractCutomeAntdCSS = new ExtractTextPlugin({filename: 'css/global-antd-[name].css'});
// //style for css moudules
// const extractModulesCSS = new ExtractTextPlugin({filename: 'css/[name].css'});

module.exports = {
    mode: 'production',
    // Don't attempt to continue if there are any errors.
    bail: true,
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
    devtool: 'source-map',
    entry: entry(paths),
    output: output(paths),
    resolve: resolve(paths, {'@': paths.appSrc}),
    externals: {
        'jsencrypt': "JSEncrypt"
    },
    module: {
        //makes missing exports an error instead of warning
        strictExportPresence: true,
        rules: [
            // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
            // { parser: { requireEnsure: false } },
            eslintRules(paths),
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list
                oneOf: [
                    babelLoader(paths),
                    ...getStyleLoaders(),
                    imagesUrlLoader(),
                    fontsLoader(),
                    svgLoader()
                ]
            }
        ]
    },
    optimization: {
        // chunkIds: "named", //for debug
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                commons: {
                    name: 'commons',
                    // minChunks: Infinity,
                    minSize: 100,
                    minChunks: 3,
                    reuseExistingChunk: true
                },
                react: {
                    name: 'react',
                    test:  /[\\/]node_modules[\\/](react|react-dom|redux|react-router|react-router-dom)[\\/]/,
                    chunks: "initial",
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
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            title: 'web_library',
            inject: true,
            template: paths.appHtml,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),

        // Makes some environment variables available in index.html.
        // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In development, this will be an empty string.
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),

        process.env.BUNDLE_ANALYZERREPORT_REREPORT === 'true' && new BundleAnalyzerPlugin(),
        new ProgressBarPlugin(),



        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
        // It is absolutely essential that NODE_ENV was set to production here.
        // Otherwise React will be compiled in the very slow development mode.
        new webpack.DefinePlugin(env.stringified),

        new webpack.ProvidePlugin({
            dayjs: 'dayjs'
        }),

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),



        new webpack.optimize.RuntimeChunkPlugin({
            name: 'manifest'
        }),

        new AntdDayjsWebpackPlugin()
    ].filter(Boolean),
    node: {
        constants: false
    }
};
