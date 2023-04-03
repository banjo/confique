export const SUPPORTED_JITI_EXTENSIONS = ["json", "ts", "js", "cjs", "mjs"] as const;
export const SUPPORTED_YAML_EXTENSIONS = ["yaml", "yml"] as const;
export const CUSTOM_EXTENSIONS = ["package.json", "rc"] as const;

export const PACKAGE_TEST_EXTENSION = "package-test.json" as const;

export const SUPPORTED_EXTENSIONS = [
    ...SUPPORTED_JITI_EXTENSIONS,
    ...SUPPORTED_YAML_EXTENSIONS,
    ...CUSTOM_EXTENSIONS,
] as const;

export type SupportedExtensions = (typeof SUPPORTED_EXTENSIONS)[number];

export const getExtension = (path: string): string => {
    if (path.endsWith("rc")) {
        return "rc";
    }

    const extension = path.split(".").pop();

    if (!extension) {
        throw new Error(`No extension found in ${path}`);
    }

    return extension;
};
