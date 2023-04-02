import { afterAll, describe, expect, it } from "vitest";
import { confique } from "../src";
import { createConfig, createConfigFile, deleteAll } from "./util";

describe("confique", () => {
    const libName = "confique";

    afterAll(() => {
        deleteAll();
    });

    it("should load TS", async () => {
        const created = createConfigFile(libName, "ts");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("ts"));
        created.delete();
    });

    it("should load JS", async () => {
        const created = createConfigFile(libName, "js");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("js"));
        created.delete();
    });

    it("should load JSON", async () => {
        const created = createConfigFile(libName, "json");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("json"));
        created.delete();
    });

    it("should load YAML", async () => {
        const created = createConfigFile(libName, "yaml");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("yaml"));
        created.delete();
    });

    it("should load YML", async () => {
        const created = createConfigFile(libName, "yml");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("yml"));
        created.delete();
    });

    it("should load RC", async () => {
        const created = createConfigFile(libName, "rc");
        const config = confique(libName);
        const result = await config.load(created.fileName);
        expect(result).toEqual(createConfig("rc"));
        created.delete();
    });

    it("should search TS", async () => {
        const created = createConfigFile(libName, "ts");
        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("ts"));
        created.delete();
    });

    it("should search JS", async () => {
        const created = createConfigFile(libName, "js");
        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("js"));
        created.delete();
    });

    it("should search JSON", async () => {
        const created = createConfigFile(libName, "json");
        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("json"));
        created.delete();
    });

    it("should search YAML", async () => {
        const created = createConfigFile(libName, "yaml");
        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("yaml"));
        created.delete();
    });

    it("should search RC", async () => {
        const created = createConfigFile(libName, "rc");
        const config = confique(libName);
        const result = await config.search();
        expect(result).toEqual(createConfig("rc"));
        created.delete();
    });

    it("should throw if no config found", async () => {
        const config = confique(libName, { throw: true });
        try {
            await config.search();
        } catch (error: any) {
            expect(error?.message).toBe("No config found for confique");
        }
    });
});
