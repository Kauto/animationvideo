import {resolve} from "path";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, "lib/animationvideo.ts"),
            name: "animationvideo",
            // the proper extensions will be added
            fileName: "animationvideo",
        },
        rollupOptions: {
            treeshake: "safest"
        },
        target: "esnext", // transpile as little as possible
    },
    plugins: [dts({
        rollupTypes: true,
        beforeWriteFile(filePath, content) {
            return {
                filePath,
                content: content.replace(/^declare\s/gm, "export declare "),
            };
        }
    })],
});
