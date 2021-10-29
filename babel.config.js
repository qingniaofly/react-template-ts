const presets = [
    ["@babel/env", {
        "modules": false,
        //注：usage, 不会检查node_modules下的packages
        "useBuiltIns": "entry",
        "corejs": 3
    }],
    ["@babel/preset-typescript", {onlyRemoveTypeImports: true}],
    "@babel/react"
]

const plugins = [
    ["@babel/plugin-transform-runtime", {"regenerator": true}],
    ["@babel/plugin-proposal-decorators",{"legacy": true}],
    ["@babel/plugin-proposal-class-properties",{"loose": true}],
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    ["import", {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": true
    }],
    ["import", {
        "libraryName": "lodash",
        "libraryDirectory": "",
        "camel2DashComponentName": false
    }, "lodash"],
    // "@babel/plugin-proposal-export-default-from",
    process.env["ENV"] === "development" &&  "react-hot-loader/babel"
].filter(Boolean)


module.exports = {
    presets,
    plugins
}
