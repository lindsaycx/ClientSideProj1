const globals = require("globals");
const eslint = require("@eslint/js");

module.exports = [
    {
        ignores: ["**/*.min.js", "**/*.config.js", "**/webpack.config.js", "**/eslint.config.js"]
    },
    eslint.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jquery
            }
        },
        rules: {
            indent: ["warn", 4, { SwitchCase: 1 }],
            quotes: ["warn", "double"],
            semi: ["error", "always"],
            "no-unused-vars": ["warn", { vars: "local", args: "none", ignoreRestSiblings: true }]
        }
    }
];