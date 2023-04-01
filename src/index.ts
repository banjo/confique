import { includes } from "@banjoanton/utils";
import { Jiti } from "./parser";

const SUPPORTED_JITI_EXTENSIONS = ["json", "ts", "js", "cjs", "mjs"] as const;

const getExtension = (path: string): string => {
    if (path.endsWith("rc")) {
        return "rc";
    }

    const extension = path.split(".").pop();

    if (!extension) {
        throw new Error(`No extension found in ${path}`);
    }

    return extension;
};

type Options = {
    searchPaths?: string[];
    throw?: boolean;
    export?: string;
};

const defaultSearchPaths = (libraryName: string) => [
    "package.json",
    `.${libraryName}rc`,
    `.${libraryName}rc.ts`,
    `.${libraryName}rc.json`,
    `.${libraryName}rc.js`,
    `.${libraryName}rc.cjs`,
    `.${libraryName}rc.mjs`,
    `${libraryName}.config.ts`,
    `${libraryName}.config.js`,
    `${libraryName}.config.cjs`,
    `${libraryName}.config.mjs`,
    `${libraryName}.config.json`,
];

const config = (libraryName: string, options?: Options) => {
    const searchPaths = options?.searchPaths || defaultSearchPaths(libraryName);

    const load = async (filePath: string) => {
        const extension = getExtension(filePath);

        if (filePath.endsWith("package.json")) {
            const packageJson = await Jiti.parse(filePath);
            const packageConfig = packageJson?.[libraryName];
            if (packageConfig) return packageConfig;
            return null;
        } else if (extension === "rc") {
            const rc = await Jiti.parse(filePath);
            if (rc) return rc;
            // try yaml
        } else if (includes(SUPPORTED_JITI_EXTENSIONS, extension)) {
            const exportOption = options?.export || "default";
            const parsed = await Jiti.parse(filePath, { export: exportOption });
            if (parsed) return parsed;
            return null;
        }

        throw new Error(`Unsupported extension: ${extension}`);
    };

    const search = async () => {
        for (const path of searchPaths) {
            const loadedConfig = await load(path);
            if (loadedConfig) return loadedConfig;
        }

        if (options?.throw) {
            throw new Error(`No config found for ${libraryName}`);
        }

        return null;
    };

    return {
        search,
        load,
    };
};

const test = config("test", { export: "config", searchPaths: ["test.config.ts"] });
const result = await test.search();
console.log(result);
