module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    // http://eslint.org/docs/rules/comma-style
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "space-before-function-paren": [0, { "anonymous": "always", "named": "never", "asyncArrow": "never" }],
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    "comma-dangle": [1, "always-multiline"],
    // 控制逗号前后的空格
    "comma-spacing": [1, { "before": false, "after": true }],
    // 控制逗号在行尾出现还是在行首出现
    "comma-style": [1, "last"],
    'linebreak-style': 'off',
    'generator-star-spacing': 0,
    'no-param-reassign': 0,
    'max-len': 'off',
    'no-console': 'off',
    'no-unused-expressions': 0,
    'no-useless-return': 0,
    'quotes': [1, "single"],
  }
};
