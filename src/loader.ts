import { includes, sortBy } from "@banjoanton/utils";
import {
    getExtension,
    SUPPORTED_EXTENSIONS,
    SUPPORTED_JITI_EXTENSIONS,
    SUPPORTED_YAML_EXTENSIONS,
    type SupportedExtensions,
} from "./extension";
import { Jiti } from "./parsers/jiti";
import { Yaml } from "./parsers/yaml";

const defaultSearchPaths = (libraryName: string) => [
    "package.json",
    `.${libraryName}rc`,
    `.${libraryName}rc.ts`,
    `.${libraryName}rc.js`,
    `.${libraryName}rc.cjs`,
    `.${libraryName}rc.mjs`,
    `.${libraryName}rc.json`,
    `.${libraryName}rc.yaml`,
    `.${libraryName}rc.yml`,
    `${libraryName}.config.ts`,
    `${libraryName}.config.js`,
    `${libraryName}.config.cjs`,
    `${libraryName}.config.mjs`,
    `${libraryName}.config.json`,
    `${libraryName}.config.yaml`,
    `${libraryName}.config.yml`,
];

type Options = {
    searchPaths?: string[];
    throw?: boolean;
    export?: string;
    preferOrder?: SupportedExtensions[];
};

export const confique = (libraryName: string, options?: Options) => {
    const searchPaths = options?.searchPaths || defaultSearchPaths(libraryName);

    const load = async (filePath: string, options?: Options) => {
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
            const loadedConfig = await load(path, options);
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
