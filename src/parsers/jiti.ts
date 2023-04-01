import jiti from "jiti";
import fs from "node:fs";
import * as url from "node:url";
import { defaultOptions, ParseOptions, parser } from "../parser";

const __filename = url.fileURLToPath(import.meta.url);
const jitiFile = jiti(__filename, { esmResolve: true });

const parse = async (filePath: string, options?: ParseOptions) => {
    const opts = { ...defaultOptions, ...options };
    const fullPath = `${process.cwd()}/${filePath}`;

    let parsed: string | null = null;
    let content: string | null = null;
    try {
        content = await fs.promises.readFile(fullPath, "utf8");
        parsed = jitiFile(fullPath);
    } catch {
        return null;
    }

    return parser({ content, options: opts, parsed });
};

const parseSync = (filePath: string, options?: ParseOptions) => {
    const opts = { ...defaultOptions, ...options };
    const fullPath = `${process.cwd()}/${filePath}`;

    let parsed: string | null = null;
    let content: string | null = null;
    try {
        content = fs.readFileSync(fullPath, "utf8");
        parsed = jitiFile(fullPath);
    } catch {
        return null;
    }

    return parser({ content, options: opts, parsed });
};

export const Jiti = {
    parse,
    parseSync,
};
