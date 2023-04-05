import { randomString } from "@banjoanton/utils";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { confique } from "../src";
import { PACKAGE_TEST_EXTENSION } from "../src/extension";
import { createConfig, createConfigFile, deleteAll } from "./util";

describe("confique", () => {
    let libName = "confique";

    beforeEach(() => {
        libName = `confique-${randomString(5, "abcdefghijklmnopqrstuvwxyz")}`;
    });

    afterAll(async () => {
        await deleteAll();
    });

    it("should load TS", async () => {
        const created = await createConfigFile(libName, "ts");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("ts"));
        await created.delete();
    });

    it("should load JS", async () => {
        const created = await createConfigFile(libName, "js");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("js"));
        await created.delete();
    });

    it("should load JSON", async () => {
        const created = await createConfigFile(libName, "json");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("json"));
        await created.delete();
    });

    it("should load YAML", async () => {
        const created = await createConfigFile(libName, "yaml");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("yaml"));
        await created.delete();
    });

    it("should load YML", async () => {
        const created = await createConfigFile(libName, "yml");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("yml"));
        await created.delete();
    });

    it("should load RC", async () => {
        const created = await createConfigFile(libName, "rc");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("rc"));
        await created.delete();
    });

    it("should load package.json", async () => {
        const created = await createConfigFile(libName, "package.json");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("package.json"));
        await created.delete();
    });

    it("should search TS", async () => {
        const created = await createConfigFile(libName, "ts");
        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("ts"));
        await created.delete();
    });

    it("should search JS", async () => {
        const created = await createConfigFile(libName, "js");
        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("js"));
        await created.delete();
    });

    it("should search JSON", async () => {
        const created = await createConfigFile(libName, "json");
        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("json"));
        await created.delete();
    });

    it("should search YAML", async () => {
        const created = await createConfigFile(libName, "yaml");
        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("yaml"));
        await created.delete();
    });

    it("should search RC", async () => {
        const created = await createConfigFile(libName, "rc");
        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("rc"));
        await created.delete();
    });

    it("should throw if no config found", async () => {
        const config = confique(libName, { throw: true });
        try {
            await config.search();
        } catch (error: any) {
            expect(error?.message).toBe(`No config found for ${libName}`);
        }
    });

    it("should prefer TS over JS without config", async () => {
        const ts = await createConfigFile(libName, "ts");
        const js = await createConfigFile(libName, "js");

        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("ts"));

        await ts.delete();
        await js.delete();
    });

    it("should prefer JS over TS with config", async () => {
        const ts = await createConfigFile(libName, "ts");
        const js = await createConfigFile(libName, "js");

        const config = confique(libName, { preferOrder: ["js", "ts"] });
        const result = await config.search();
        expect(result).toEqual(createConfig("js"));

        await ts.delete();
        await js.delete();
    });

    it("works with custom export for TS", async () => {
        const customExport = "custom";
        const created = await createConfigFile(libName, "ts", customExport);
        const config = confique(libName, { module: customExport });
        const result = await config.search();
        expect(result).toEqual(createConfig("ts"));
        await created.delete();
    });

    it("works with custom export for JS", async () => {
        const customExport = "custom";
        const created = await createConfigFile(libName, "js", customExport);
        const config = confique(libName, { module: customExport });
        const result = await config.search();
        expect(result).toEqual(createConfig("js"));
        await created.delete();
    });

    it("works with custom export for JSON", async () => {
        const customExport = "custom";
        const created = await createConfigFile(libName, "json", customExport);
        const config = confique(libName, { module: customExport });
        const result = await config.search();
        expect(result).toEqual(createConfig("json"));
        await created.delete();
    });

    it("works with custom export for YAML", async () => {
        const customExport = "custom";
        const created = await createConfigFile(libName, "yaml", customExport);
        const config = confique(libName, { module: customExport });
        const result = await config.search();
        expect(result).toEqual(createConfig("yaml"));
        await created.delete();
    });

    it("works with custom export for RC", async () => {
        const customExport = "custom";
        const created = await createConfigFile(libName, "rc", customExport);
        const config = confique(libName, { module: customExport });
        const result = await config.search();
        expect(result).toEqual(createConfig("rc"));
        await created.delete();
    });

    it("works with custom export for package.json", async () => {
        const customExport = "custom";
        const created = await createConfigFile(libName, "package.json", customExport);
        const config = confique(libName, {
            module: customExport,
            fileNames: [`${libName}-${PACKAGE_TEST_EXTENSION}`],
        });
        const result = await config.search();
        expect(result).toEqual(createConfig("package.json"));
        await created.delete();
    });
});
