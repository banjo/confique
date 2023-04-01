import jiti from "jiti";
import fs from "node:fs";
import * as url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const jitiFile = jiti(__filename, { esmResolve: true });

export type ParseOptions = {
    export: string;
};

export const defaultOptions: ParseOptions = {
    export: "default",
};

const parser = ({
    content,
    parsed,
    options,
}: {
    content: string;
    parsed: any;
    options: ParseOptions;
}) => {
    if (content.includes("module.exports")) {
        return parsed;
    }

    const hasDefaultExport = parsed.default !== undefined;
    if (hasDefaultExport && options.export === "default") {
        return parsed.default;
    }

    return parsed[options.export];
};

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

    const content = fs.readFileSync(fullPath, "utf8");
    const parsed = jitiFile(fullPath);

    return parser({ content, options: opts, parsed });
};

export const Jiti = {
    parse,
    parseSync,
};
