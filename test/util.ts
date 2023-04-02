import yaml from "js-yaml";
import JSON5 from "json5";
import fs from "node:fs";

import { SupportedExtensions } from "../src/extension";

export const createConfig = (extension: SupportedExtensions) => {
    return {
        test: "test",
        extension,
    };
};

export const createConfigFile = (name: string, extension: SupportedExtensions) => {
    const config = createConfig(extension);
    let fileName: string;
    if (extension === "rc") {
        fileName = `.${name}rc`;
    } else {
        fileName = `${name}.config.${extension}`;
    }

    switch (extension) {
        case "json": {
            fs.writeFileSync(fileName, JSON.stringify(config));
            break;
        }
        case "ts": {
            fs.writeFileSync(fileName, `export default ${JSON5.stringify(config)}`);
            break;
        }
        case "js": {
            fs.writeFileSync(fileName, `module.exports = ${JSON5.stringify(config)}`);
            break;
        }
        case "yaml": {
            fs.writeFileSync(fileName, yaml.dump(config));
            break;
        }
        case "yml": {
            fs.writeFileSync(fileName, yaml.dump(config));
            break;
        }
        case "rc": {
            fs.writeFileSync(fileName, JSON.stringify(config));
            break;
        }
        default: {
            throw new Error(`Unsupported extension: ${extension}`);
        }
    }

    return {
        fileName,
        delete: () => {
            fs.rmSync(fileName);
        },
    };
};

const deleteFile = (name: string, extension: SupportedExtensions) => {
    try {
        fs.rmSync(`${name}.config.${extension}`);
        return true;
    } catch {
        return false;
    }
};

export const deleteAll = () => {
    deleteFile("confique", "json");
    deleteFile("confique", "ts");
    deleteFile("confique", "js");
    deleteFile("confique", "yaml");
};
