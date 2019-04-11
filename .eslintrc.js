module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
  "globals": {
    "ENV": true,
  },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
      "plugins": ["prettier"],
    "rules": {
        "indent": [
            "error",
            2
        ],

        "prettier/prettier": "error",

        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
