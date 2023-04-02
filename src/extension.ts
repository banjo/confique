export const SUPPORTED_JITI_EXTENSIONS = ["json", "ts", "js", "cjs", "mjs"] as const;
export const SUPPORTED_YAML_EXTENSIONS = ["yaml", "yml"] as const;
export const PACKAGE_JSON = "package.json" as const;

export const SUPPORTED_EXTENSIONS = [
    ...SUPPORTED_JITI_EXTENSIONS,
    ...SUPPORTED_YAML_EXTENSIONS,
    ...PACKAGE_JSON,
];

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
