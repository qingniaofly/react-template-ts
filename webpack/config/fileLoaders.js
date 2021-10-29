// "url" loader works just like "file" loader but it also embeds
// assets smaller than specified size as data URLs to avoid requests.
const imagesUrlLoader = () => ({
    test: /\.(png|gif|bmp|jpg|jpe?g)([?#][a-zA-Z0-9#?&=.]*)?$/,
    loader: require.resolve('url-loader'),
    options: {
        limit: 10000,
        name: 'static/images/[name].[hash:8].[ext]'
    }
});

const woffUrlLoader = () => ({
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
    // loader: "url?limit=10000"
    use: [{
        loader: require.resolve('url-loader'),
        options: {
            limit: 10000,
            name: 'static/fonts/[name].[ext]',
            mimetype: 'application/font-woff',
            // publicPath: '../'
            // publicPath: url => `../fonts/${url}`
        }
    }]
});

//file with name extension tff, tof, eot,svg will be deal with file loader,
// and output it into fonts file of build assert, url will use relative path
const fontsLoader = () => ({
    // test: /.(woff(2)?|ttf|otf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: require.resolve('file-loader'),
    exclude: [
        /\.html$/,
        /\.(js|mjs|jsx|ts|tsx)$/,
        /\.p?css$/, //postcss and regular css
        /\.sass$/,
        /\.json$/,
        /\.svg$/,
    ],
    options: {
        name: 'static/fonts/[name].[ext]',
        limit: 10000,
        // outputPath: './', // where the fonts will go
        // publicPath: '../' // override the default path
        // publicPath: url => `../fonts/${url}`

    }
});


const svgLoader = () => ({
    test: /\.svg$/,
    use: [{
            loader: require.resolve('@svgr/webpack'),
        }
    ]
})

module.exports = {
    imagesUrlLoader,
    fontsLoader,
    svgLoader
};
