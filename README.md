# comment-variables

![Logo and name for the Comment Variables ecosystem, dark default variant.](./assets/README/name-dark-default.png)

<!-- <picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/README/name-dark-default.png">
  <source media="(prefers-color-scheme: light)" srcset="./assets/README/name-light.png">
  <img alt="Logo and name for the Comment Variables ecosystem." src="./assets/README/name-dark-default.png">
</picture> -->

A CLI tool for configuring, managing and maintaining JavaScript comments as JavaScript variables, via a `comments.config.js` file at the root of your project.

![Intro example of going back and forth between Comment Variables placeholders and actual comments using comment-variables's resolve and compress commands.](./assets/README/example.gif)

## Installation

```
npm install -g comment-variables
```

## Commands

**`comment-variables` (aliases `jscomments`/`comvar`) comes with four commands in this initial release:**

```
comment-variables
```

Interacts with your root `comments.config.js` file's default exported object to print all the parameters you need to be aware of before running `compress` or `resolve`. Also acts as a dry run validation check. If no error is printed, it means you can run `compress` or `resolve` safely, as long as the printed parameters correspond to what you've expected from your defined config. (Additionally creates a resolved version of your config data as a JSON file, and as a .mjs file exporting both the typedef `ResolvedConfigData` and the object `resolvedConfigData`. If no configuration file is found, a tutorial mode is triggered, generating a template config file for you.)

```
comment-variables placeholders
```

Creates Comment Variables placeholders right next to the single sources of truth where Comment Variables are defined. (See in config example below.)

```
comment-variables compress
```

Scans your line and block comments for string values defined in your root `comments.config.js` file (like `"This is a comment"`) to turn them into their corresponding `$COMMENT#*` placeholders defined via your root `comments.config.js` file. (`This is a comment.` => `$COMMENT#COMMENT`)

```
comment-variables resolve
```

Scans your line and block comments for `$COMMENT#*` placeholders (like `$COMMENT#COMMENT`) to turn them into their corresponding string values defined in your root `comments.config.js` file. (`$COMMENT#COMMENT` => `This is a comment.`)

_The `compress` and `resolve` commands make each other entirely reversible._

## Flags

**The CLI tool comes with a single flag:**

```
comment-variables --config <your-config.js>
```

Passes a different file as your config file instead of the default root `comments.config.js` file (like `comment-variables --config your-config.js`), through a path relative to the root of your project.

_The --config flag can be composed with any of the commands:_

```
comment-variables --config your-config.js
comment-variables compress --config your-config.js
comment-variables resolve --config your-config.js
comment-variables placeholders --config your-config.js
```

## Settings

**The config object requires the following settings:**

```
data:
```

Your dedicated object defining your Comment Variables through nested key-value pairs of string literals.

```
ignores:
```

Your dedicated array defining your files and folders to be ignored by the `compress` and `resolve` commands through strings of paths relative to the root of your project.

## Options

**The config object supports the following options:**

```
lintConfigImports:
```

By default, `comment-variables` excludes your config file and all the (JavaScript/TypeScript) files it recursively imports. Passing `true` to this config option cancels this mechanism, linting config imports. (The config file however still remains excluded from linting.)

```
myIgnoresOnly:
```

By default, `comment-variables` includes a preset list of ignored folders (`"node_modules"`, `".next"`, `".react-router"`...). Passing `true` to this config option cancels this mechanism so that you can have full control over your ignored files and folders.

```
composedVariablesExclusives:
```

In due time, you may end up creating Comment Variables that are exclusively meant to be used to create other Comment Variables – the latter classified as composed variables. Passing an array to this config option, comprised of the keys of these original comment variables (for example, if a Comment Variable placeholder is `$COMMENT#COMMENT` its related key is `COMMENT`), prevents these original comment variables from being affected by the `compress` and `resolve` commands.

## **`comments.config.js`**

A root `comments.config.js` file looks like this. (This is an earlier version of the config file I'm using to manage my JavaScript comments in this library.)

```js
const data = {
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      exitDueToFailure:
        "Terminates the whole process with a 'failure' code (`1`)." /* $COMMENT#JSDOC#DEFINITIONS#EXITDUETOFAILURE */,
      makeRuleResolve:
        "The utility that creates the resolve rule based on the flattened config data, used to transform `$COMMENT` placeholders into actual comments." /* $COMMENT#JSDOC#DEFINITIONS#MAKERULERESOLVE */,
      makeRuleCompress:
        "The utility that creates the compress rule based on the reversed flattened config data, used to transform actual comments into `$COMMENT` placeholders." /* $COMMENT#JSDOC#DEFINITIONS#MAKERULECOMPRESS */,
      coreCommentsFlow:
        "The core flow at the heart of resolving and compressing comments." /* $COMMENT#JSDOC#DEFINITIONS#CORECOMMENTSFLOW */,
      resolveCommentsFlow:
        "The flow that resolves `$COMMENT` placeholders into actual comments." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMMENTSFLOW */,
      compressCommentsFlow:
        "The flow that compresses actual comments into `$COMMENT` placeholders." /* $COMMENT#JSDOC#DEFINITIONS#COMPRESSCOMMENTSFLOW */,
      placeholdersCommentsFlow:
        "The flow that creates `$COMMENT` placeholders right next to where they're defined." /* $COMMENT#JSDOC#DEFINITIONS#PLACEHOLDERSCOMMENTSFLOW */,
      logError:
        'Logs an error to the console depending on its type. (`"error"` or `"warning"`.)' /* $COMMENT#JSDOC#DEFINITIONS#LOGERROR */,
    }),
    params: Object.freeze({
      flattenedConfigData:
        "The flattened config data, with `$COMMENT` placeholders as keys and actual comments as values." /* $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA */,
      reversedFlattenedConfigData:
        "The reversed flattened config data, with actual comments as keys and `$COMMENT` placeholders as values." /* $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA */,
      composedVariablesExclusives:
        "The array of comment variables keys (implying their aliases as well) exclusively used to craft composed variables, that should be ignored by both the `resolve` and the `compress` commands." /* $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVES */,
      aliases_flattenedKeys:
        "The dictionary that connects aliases to their original flattened keys in case an encountered placeholder is actually an alias." /* $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS */,
      ruleName:
        'The name of the rule currently used. (Either `"resolve"` or `"compress"`.)' /* $COMMENT#JSDOC#PARAMS#RULENAME */,
      ignores:
        "The array of paths and globs for the flow's ESLint instance to ignore." /* $COMMENT#JSDOC#PARAMS#IGNORES */,
      eitherFlattenedConfigData:
        "Either the flattened config data or the reversed flattened config data, since they share the same structure." /* $COMMENT#JSDOC#PARAMS#EITHERFLATTENEDCONFIGDATA */,
      error:
        "The error object being handle for the logging." /* $COMMENT#JSDOC#PARAMS#ERROR */,
      options:
        "The additional options as follows:" /* $COMMENT#JSDOC#PARAMS#OPTIONS */,
      settings:
        "The required settings as follows:" /* $COMMENT#JSDOC#PARAMS#SETTINGS */,
      configPathIgnores:
        'The array of paths linked to the config file, (named "ignores" given it is ignored by the "compress" and "resolve" commands).' /* $COMMENT#JSDOC#PARAMS#CONFIGPATHIGNORES */,
      originalFlattenedConfigData:
        "The original flattened config data, before changes to aliases variables and composed variables are applied." /* $COMMENT#JSDOC#PARAMS#ORIGINALFLATTENEDCONFIGDATA */,
      relativeMjsPath:
        'The relative path of the generated `.mjs` file to be ignored in the "placeholders" process.' /* $COMMENT#JSDOC#PARAMS#RELATIVEMJSPATH */,
    }),
    returns: Object.freeze({
      exitDueToFailure:
        "Never. (Somehow typing needs to be explicit for unreachable code inference.)" /* $COMMENT#JSDOC#RETURNS#EXITDUETOFAILURE */,
      makeRuleResolve:
        "The resolve rule based on the flattened config data." /* $COMMENT#JSDOC#RETURNS#MAKERULERESOLVE */,
      makeRuleCompress:
        "The compress rule based on the reversed flattened config data." /* $COMMENT#JSDOC#RETURNS#MAKERULECOMPRESS */,
    }),
    constants: Object.freeze({
      sortedReversedFlattenedConfigData:
        "The whole `reversedFlattenedConfigData` turned from an object to an array of key-value arrays sorted by the descending length of each key to prevent partial replacements." /* $COMMENT#JSDOC#CONSTANTS#SORTEDREVERSEDFLATTENEDCONFIGDATA */,
      composedVariablesExclusivesSet:
        "A local Set out of composed variables exclusives for speed." /* $COMMENT#JSDOC#CONSTANTS#COMPOSEDVARIABLESEXCLUSIVESSET */,
    }),
  }),
};

const ignores = ["README.md", "generate.template.js", "generate.example.js"];

const lintConfigImports = false; // can be omitted
const myIgnoresOnly = false; // can be omitted

const composedVariablesExclusives = []; // can be omitted

const config = {
  data,
  ignores,
  lintConfigImports,
  myIgnoresOnly,
  composedVariablesExclusives,
};

export default config;
```

And yes, even comments within JavaScript and TypeScript blocks in Markdown files are addressed.

_Leverage the power of JavaScript to programmatically design your JavaScript comments._

**The Comment Variables VS Code extension is available [here](https://comvar.lemonsqueezy.com/buy/723b0220-ea5d-4b0a-835a-f0843e431639).**
