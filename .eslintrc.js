module.exports = {
    "parser": "babel-eslint",
    "rules": {
        "strict": 0
    },
    "env": {
        "commonjs": true,
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "comma-dangle": [
            "warn",
            "never"
        ],
        "indent": [
            "warn",
            4
        ],
        "linebreak-style": [
            "warn",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": 0,
        /* Advanced Rules*/
        // "no-unused-expressions": "warn",
        // "no-useless-concat": "warn",
        // "block-scoped-var": "error",
        // "consistent-return": "error"
    }
}