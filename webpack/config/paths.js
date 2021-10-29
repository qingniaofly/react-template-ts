const path = require('path');
const fs = require('fs');
// const url = require('url');
const packageName = require("../../package.json").name
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath) => {
    if (!appDirectory) {
        throw new Error('appDirectory has not been set or is invalid!');
    }
    return path.resolve(appDirectory, relativePath);
};

const ensureSlash = (pathStr, needsSlash) => {
    const hasSlash = pathStr.endsWith('/');
    if (hasSlash && !needsSlash) {
        return pathStr.substr(pathStr, pathStr.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${pathStr}/`;
    }
    return pathStr;
};

const envPublicUrl = process.env.PUBLIC_URL;

const getPublicUrl = appPackageJson => {
    return envPublicUrl || require(appPackageJson).homepage; //eslint-disable-line
};

// We use `PUBLIC_URL` environment variable to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const getServedPath = appPackageJson => {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
};

const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
  ];
  
  // Resolve file paths in the same order as webpack
  const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension =>
      fs.existsSync(resolveFn(`${filePath}.${extension}`))
    );
  
    if (extension) {
      return resolveFn(`${filePath}.${extension}`);
    }
  
    return resolveFn(`${filePath}.js`);
  };

// config after eject: we're in ./config/
module.exports = {
    appName: 'react-boilerplate',
    subAppName: packageName,
    dotenv: resolveApp('.env'),
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveModule(resolveApp, 'src/index'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    appScss: "src/common/scss/common.scss",
    yarnLockFile: resolveApp('yarn.lock'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: getServedPath(resolveApp('package.json')),
    appTsConfig: resolveApp('tsconfig.json')
};

module.exports.useTypeScript = fs.existsSync(resolveApp('tsconfig.json'))
module.exports.moduleFileExtensions = moduleFileExtensions
