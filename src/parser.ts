export type ParseOptions = {
    module: string;
};

export const defaultOptions: ParseOptions = {
    module: "default",
};

export const parser = ({
    content,
    parsed,
    options,
}: {
    content: string;
    parsed: any;
    options: ParseOptions;
    filePath: string;
}) => {
    const useDefaultExport = options.module === "default";

    if (content.includes("module.exports")) {
        return parsed;
    }

    const hasDefaultExport = parsed.default !== undefined;
    if (hasDefaultExport && useDefaultExport) {
        return parsed.default;
    }

    if (useDefaultExport) {
        return parsed;
    }

    const customInModuleExports = parsed[options.module];
    if (customInModuleExports) {
        return customInModuleExports;
    }

    const customInDefault = parsed?.default?.[options.module];
    if (hasDefaultExport && customInDefault) {
        return customInDefault;
    }

    return null;
};
