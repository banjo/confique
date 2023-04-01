import yaml from "js-yaml";
import fs from "node:fs";
import { defaultOptions, ParseOptions, parser } from "../parser";

const parse = async (filePath: string, options?: ParseOptions) => {
    const opts = { ...defaultOptions, ...options };
    const fullPath = `${process.cwd()}/${filePath}`;

    let parsed: unknown | null = null;
    let content: string | null = null;
    try {
        content = await fs.promises.readFile(fullPath, "utf8");
        parsed = yaml.load(content);
    } catch {
        return null;
    }

    return parser({ content, options: opts, parsed });
};

const parseSync = (filePath: string) => {
    const fullPath = `${process.cwd()}/${filePath}`;

    try {
        const content = fs.readFileSync(fullPath, "utf8");
        const parsed = yaml.load(content);
        return parsed;
    } catch {
        return null;
    }
};

export const Yaml = {
    parse,
    parseSync,
};
