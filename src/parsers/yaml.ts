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
    } catch (error: any) {
        console.log(error?.message);
        return null;
    }

    return parser({ content, options: opts, parsed, filePath });
};

const parseSync = (filePath: string, options?: ParseOptions) => {
    const opts = { ...defaultOptions, ...options };

    const fullPath = `${process.cwd()}/${filePath}`;

    let parsed: unknown | null = null;
    let content: string | null = null;
    try {
        content = fs.readFileSync(fullPath, "utf8");
        parsed = yaml.load(content);
    } catch {
        return null;
    }

    return parser({ content, options: opts, parsed, filePath });
};

export const Yaml = {
    parse,
    parseSync,
};
