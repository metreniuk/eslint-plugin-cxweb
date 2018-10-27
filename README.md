# eslint-plugin-cxweb

custom eslint plugin for cxweb specific rules

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-cxweb`:

```
$ npm install eslint-plugin-cxweb --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-cxweb` globally.

## Usage

Add `cxweb` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "cxweb"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "cxweb/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





