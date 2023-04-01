import { includes, sortBy } from "@banjoanton/utils";
import { Jiti } from "./parsers/jiti";
import { Yaml } from "./parsers/yaml";

const SUPPORTED_JITI_EXTENSIONS = ["json", "ts", "js", "cjs", "mjs"] as const;
const SUPPORTED_YAML_EXTENSIONS = ["yaml", "yml"] as const;
const PACKAGE_JSON = "package.json" as const;

const SUPPORTED_EXTENSIONS = [
    ...SUPPORTED_JITI_EXTENSIONS,
    ...SUPPORTED_YAML_EXTENSIONS,
    ...PACKAGE_JSON,
];
type SupportedExtensions = (typeof SUPPORTED_EXTENSIONS)[number];

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
    preferOrder?: SupportedExtensions[];
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
            const exportOption = options?.export || "default";
            const rc = await Jiti.parse(filePath, { export: exportOption });
            if (rc) return rc;
            const yamlRc = await Yaml.parse(filePath, { export: exportOption });
            if (yamlRc) return yamlRc;
            return null;
        } else if (includes(SUPPORTED_YAML_EXTENSIONS, extension)) {
            const exportOption = options?.export || "default";
            const yamlConfig = await Yaml.parse(filePath, { export: exportOption });
            if (yamlConfig) return yamlConfig;
            return null;
        } else if (includes(SUPPORTED_JITI_EXTENSIONS, extension)) {
            const exportOption = options?.export || "default";
            const parsed = await Jiti.parse(filePath, { export: exportOption });
            if (parsed) return parsed;
            return null;
        }

        throw new Error(`Unsupported extension: ${extension}`);
    };

    const search = async () => {
        const paths = sortBy(searchPaths, path => {
            const preferredOrder = options?.preferOrder || [];

            const extension = getExtension(path);

            if (!includes(SUPPORTED_EXTENSIONS, extension)) {
                return Number.MAX_SAFE_INTEGER;
            }

            if (!includes(preferredOrder, extension as SupportedExtensions)) {
                return Number.MAX_SAFE_INTEGER;
            }

            const result = preferredOrder.indexOf(extension as SupportedExtensions);

            return result;
        });

        for (const path of paths) {
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

const test = config("test", { export: "default", preferOrder: ["ts", "package.json"] });
const result = await test.search();
console.log(result);
