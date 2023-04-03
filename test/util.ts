import { globby } from "globby";
import yaml from "js-yaml";
import JSON5 from "json5";
import fs from "node:fs";

import {
    PACKAGE_TEST_EXTENSION,
    SUPPORTED_EXTENSIONS,
    type SupportedExtensions,
} from "../src/extension";

export const createConfig = (extension: SupportedExtensions, exportKey: string | null = null) => {
    const json = {
        test: "test123",
        extension,
    };

    const extensionsWithCustomDefault = ["yml", "yaml", "json", "rc", "package.json"];
    if (exportKey && extensionsWithCustomDefault.includes(extension)) {
        return {
            [exportKey]: json,
        };
    }

    return json;
};

export const createConfigFile = async (
    name: string,
    extension: SupportedExtensions,
    exportKey: string | null = null
) => {
    const config = createConfig(extension, exportKey);
    let fileName: string;
    if (extension === "rc") {
        fileName = `.${name}rc`;
    } else if (extension === "package.json") {
        fileName = `${name}-${PACKAGE_TEST_EXTENSION}`;
    } else {
        fileName = `${name}.config.${extension}`;
    }

    switch (extension) {
        case "json": {
            await fs.promises.writeFile(fileName, JSON.stringify(config));
            break;
        }
        case "ts": {
            const exportStatement = exportKey ? `export const ${exportKey} =` : "export default";
            await fs.promises.writeFile(fileName, `${exportStatement} ${JSON5.stringify(config)}`);
            break;
        }
        case "js": {
            const exportStatement = exportKey
                ? `export const ${exportKey} = `
                : "module.exports = ";

            await fs.promises.writeFile(fileName, `${exportStatement} ${JSON5.stringify(config)}`);
            break;
        }
        case "yaml": {
            await fs.promises.writeFile(fileName, yaml.dump(config, { indent: 4 }));
            break;
        }
        case "yml": {
            await fs.promises.writeFile(fileName, yaml.dump(config, { indent: 4 }));
            break;
        }
        case "rc": {
            await fs.promises.writeFile(fileName, JSON.stringify(config));
            break;
        }
        case "package.json": {
            const json = {
                [exportKey ?? name]: createConfig("package.json"),
            };
            await fs.promises.writeFile(fileName, JSON.stringify(json));
            break;
        }

        default: {
            throw new Error(`Unsupported extension: ${extension}`);
        }
    }

    return {
        fileName,
        delete: async () => {
            await fs.promises.rm(fileName);
        },
    };
};

const deleteFile = async (name: string) => {
    try {
        await fs.promises.rm(name);
        return true;
    } catch {
        return false;
    }
};

export const deleteAll = async () => {
    const extensions = SUPPORTED_EXTENSIONS.filter(ext => ext !== "package.json")
        .map(ext => `*.${ext}`)
        .join("|");

    const files = await globby([`**/{,.}confique-*(${extensions})`, "**/*package-test.json"], {
        dot: true,
    });

    for (const file of files) {
        await deleteFile(file);
    }
};
