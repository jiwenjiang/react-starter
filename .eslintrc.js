module.exports = {
    "parser": "babel-eslint",
    "env": {
        "commonjs": true,
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "no-console": 0,
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error"
        // "linebreak-style": [
        //     "warn",
        //     "unix"
        // ],
        // "quotes": [
        //     "error",
        //     "single"
        // ]
        // "semi": [
        //     "error",
        //     "always"
        // ]
    }
}