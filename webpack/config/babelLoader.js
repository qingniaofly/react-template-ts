const babelLoader = (paths) => ({
    test: /\.(js|mjs|jsx|ts|tsx)?$/,
    use: [
        {
            loader: require.resolve('thread-loader'),
            options: {
                workers: 2
            }
        },
        {
            loader: require.resolve('cache-loader'),
        },
        {
            loader: require.resolve('babel-loader'),
            options: {
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                //
                // DISABLED as it causes issues with source maps at the moment
                cacheDirectory: true,
                // Some modules have an .babelrc file that conflicts with our presets defined here
                // babelrc: false
                compact: process.env.NODE_ENV === 'production'
            }
        }
    ],
    include: [paths.appSrc], // Matches app's src directory
    exclude: /node_modules\/(?!react-intl|intl-messageformat|intl-messageformat-parser)/

});
module.exports = {
    babelLoader
};
