//get env config
const getClientEnvironment = require('./env');
//base
const paths = require('./paths');
const {entry} = require('./entry');
const {output} = require('./output');
const {resolve} = require('./resolve');

//loaders
const {getStyleLoaders} = require('./styleLoaders');
const {eslintRules} = require('./eslintRules');
const {babelLoader} = require('./babelLoader');
const {imagesUrlLoader, fontsLoader, svgLoader} = require('./fileLoaders');

module.exports = {
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
};
