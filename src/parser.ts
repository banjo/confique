export type ParseOptions = {
    export: string;
};

export const defaultOptions: ParseOptions = {
    export: "default",
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
    const useDefaultExport = options.export === "default";

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

    const customInModuleExports = parsed[options.export];
    if (customInModuleExports) {
        return customInModuleExports;
    }

    const customInDefault = parsed?.default?.[options.export];
    if (hasDefaultExport && customInDefault) {
        return customInDefault;
    }

    return null;
};
