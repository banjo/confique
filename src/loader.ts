import { includes, sortBy } from "@banjoanton/utils";
import {
    getExtension,
    PACKAGE_TEST_EXTENSION,
    SUPPORTED_EXTENSIONS,
    SUPPORTED_JITI_EXTENSIONS,
    SUPPORTED_YAML_EXTENSIONS,
    type SupportedExtensions,
} from "./extension";
import { Jiti } from "./parsers/jiti";
import { Yaml } from "./parsers/yaml";

const defaultFileNames = (libraryName: string) => [
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
    fileNames?: string[];
    throw?: boolean;
    module?: string;
    preferOrder?: SupportedExtensions[];
};

export const confique = (libraryName: string, options?: Options) => {
    const fileNames = options?.fileNames || defaultFileNames(libraryName);

    const load = async (filePath: string, options?: Options) => {
        const extension = getExtension(filePath);

        if (filePath.endsWith("package.json") || filePath.endsWith(PACKAGE_TEST_EXTENSION)) {
            const packageJson = await Jiti.parse(filePath);
            const packageConfig = packageJson?.[options?.module ?? libraryName];
            if (packageConfig) return packageConfig;
            return null;
        }

        if (extension === "rc") {
            const exportOption = options?.module || "default";
            const rc = await Jiti.parse(filePath, { module: exportOption });
            if (rc) return rc;
            const yamlRc = await Yaml.parse(filePath, { module: exportOption });
            if (yamlRc) return yamlRc;
            return null;
        }

        if (includes(SUPPORTED_YAML_EXTENSIONS, extension)) {
            const exportOption = options?.module || "default";
            const yamlConfig = await Yaml.parse(filePath, { module: exportOption });
            if (yamlConfig) return yamlConfig;
            return null;
        }

        if (includes(SUPPORTED_JITI_EXTENSIONS, extension)) {
            const exportOption = options?.module || "default";
            const parsed = await Jiti.parse(filePath, { module: exportOption });
            if (parsed) return parsed;
            return null;
        }

        throw new Error(`Unsupported extension: ${extension}`);
    };

    const search = async () => {
        const paths = sortBy(fileNames, path => {
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
