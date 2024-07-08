import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import pkg from "./package.json" assert { type: "json" };

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
  plugins: [dts()],
});
