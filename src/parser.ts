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
}) => {
    if (content.includes("module.exports")) {
        return parsed;
    }

    const useDefaultExport = options.export === "default";
    const hasDefaultExport = parsed.default !== undefined;
    if (hasDefaultExport && useDefaultExport) {
        return parsed.default;
    }

    if (useDefaultExport) {
        return parsed;
    }

    return parsed[options.export];
};
