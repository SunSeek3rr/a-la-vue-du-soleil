import { defineConfig } from "vite";

export default defineConfig({
    // base: "/tfe/",
    root: "src",
    publicDir: "../assets",
    build: {
    outDir: "../dist",
    emptyOutDir: true,
    },
    server: {
    open: true,
    },
});
