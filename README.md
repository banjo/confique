# Confique

> A simple configuration loader with TypeScript and ESM support out of the box

[![NPM version](https://img.shields.io/npm/v/confique?color=%23c53635&label=%20)](https://www.npmjs.com/package/confique)

-   Search and load configuration
-   Good defaults or customise to your needs
-   TypeScript and ESM support out of the box
-   Define order of precedence

Will load the files in the following order by default, for a library called `banjo`:

-   `package.json`
-   .rc files (`.banjorc`, `.banjorc.ts`, `.banjorc.js`, `.banjorc.cjs`, `.banjorc.mjs`, `.banjorc.json`, `.banjorc.yaml`, `.banjorc.yml`)
-   config files (`banjo.config.ts`, `banjo.config.js`, `banjo.config.cjs`, `banjo.config.mjs`, `banjo.config.json`, `banjo.config.yaml`, `banjo.config.yml`)

## Installation

```bash
npm install confique
```

## Usage

```ts
import { confique } from "confique";


// different ways to configure
const confiq = confique("libraryName");
const confiq = confique("libraryName", { preferOrder: ["js", "ts"] });
const confiq = confique("libraryName", { searchPaths: ["fileName.ts", "fileName.js"] });
const confiq = confique("libraryName", { module: "config" });

// search for all possible files
const loaded = await confiq.search();

// load a specific file
const loaded = await confiq.load("path/to/config.ts");
```
