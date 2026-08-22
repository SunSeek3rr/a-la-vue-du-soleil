import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    base: "/a-la-vue-du-soleil/",
    root: "src",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main : resolve(__dirname, 'src/index.html'),
                experience : resolve(__dirname, 'src/experience.html')
            }
        }
    },
    server: {
        open: true,
    },
});
