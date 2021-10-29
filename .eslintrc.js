module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        // Uses the recommended rules from @eslint-plugin-react
        "plugin:react/recommended",
         // Uses the recommended rules from react-hooks
        //  "plugin:react-hooks/recommended",
        // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "plugin:@typescript-eslint/recommended",
        // Uses eslint-config-prettier to disable ESLint rules from
        //@typescript-eslint/eslint-plugin that would conflict with prettier
        "prettier/@typescript-eslint",
        // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors.
        // Make sure this is always the last configuration in the extends array
        "plugin:prettier/recommended",
    ],
    plugins: ["@typescript-eslint", "react", "prettier"],
    env: {
        browser: true,
        node: true,
        es6: true
    },
    settings: {
        // Tells eslint-plugin-react to automatically detect the version of React to use
        react: {
            version: "detect"
        }
    },
    parserOptions: {
        ecmaVersion: 9,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    globals: {
        __dirname: false,
        require: false,
        document: false,
        window: false,
        console: false,
        module: false,
        dayjs: false,
    },
    rules: {
        "no-var": "error",
        "prettier/prettier": "error",
        'arrow-parens': 0,
        //函数的箭头之前或之后有空格
        'arrow-spacing': 2,
        // 对象字面量中冒号的后面必须有空格，前面不允许有空格
        "key-spacing": [2, {
            "beforeColon": false,
            "afterColon": true
        }],
        // 关键字前后必须存在空格
        "keyword-spacing": [2, {
            "before": true,
            "after": true
        }],
        //构造函数首字母大写
        "new-cap": [2, {"newIsCap": true, "capIsNew": false}],
        //在写逗号时，逗号前面不需要加空格，而逗号后面需要添加空格
        "comma-spacing": [2, {"before": false, "after": true}],
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
        //函数定义的时候不允许出现重复的参数
        "no-dupe-args": 2,
        // 必须使用 === 或 !==，禁止使用 == 或 !=，与 null 比较时除外
        'eqeqeq': [2, 'always', {null: 'ignore'}],
        //跟prettier冲突
        // "space-before-function-paren": [2, {
        //     "anonymous": "never",
        //     "named": "never",
        //     "asyncArrow": "always"
        // }],
        "space-before-function-paren": [0, "always"],
        //代码末尾不需要分号
        "semi": [2, "never"],
        "space-before-blocks": [1, "always"],
        //es6中``操作符优先，替代+操作符
        "prefer-template": 1,
        //限制函数的最大参数个数,
        "max-params": [2, 6],
        // 禁止 for 循环出现方向错误的循环，比如 for (i = 0; i < 10; i--)
        'for-direction': 'error',
        // getter 必须有返回值，并且禁止返回空，比如 return;
        'getter-return': ['error', {allowImplicit: false}],
        //该条规则主要用于定义数组字面量定义数组时，前后是否加空格，
        //接受两个可选配置，always 和never ,如果设置为always 那么就应该在在写数组是前后都留空格
        "array-bracket-spacing": [2, "never"],
        //在定义对象或数组时，最后一项不能加逗号
        "comma-dangle": [2, "never"],
        //typescript
        "@typescript-eslint/no-non-null-assertion": 0,
        //any, 扩展运算符中可以运用any
        "@typescript-eslint/no-explicit-any": [1, { "ignoreRestArgs": true }],
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/naming-convention":"off",
        // "@typescript-eslint/naming-convention": [
        //     "error",
        //     {"selector": "default", "format": ["camelCase"]},
        //     {"selector": "variableLike", "format": ["camelCase", "PascalCase"] },
        //     {"selector": "enumMember", "format": ["UPPER_CASE"] },
        //     {"selector": "enum", "format": ["UPPER_CASE"], "prefix": ["E"] },
        //     {"selector": "typeParameter","format": ["PascalCase"],"prefix": ["T"]},
        //     {"selector": "interface","format": ["PascalCase"],"prefix": ["I"]}
        // ],
        "@typescript-eslint/explicit-module-boundary-types": 0,
        //关闭方法必须要返回类型
        "@typescript-eslint/explicit-function-return-type": 0,
        "react/prop-types": "off",
    }
}
