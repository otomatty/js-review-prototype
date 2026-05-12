import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { stripDevFields } from "./vite-plugins/strip-dev-fields";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [stripDevFields(), react(), tailwindcss()],
  define: {
    "process.env": {},
  },
  resolve: {
    alias: [
      {
        find: /^@\/(.*)$/,
        replacement: path.resolve(__dirname, "src/$1"),
      },
      {
        find: /^@jsreview\/shared$/,
        replacement: path.resolve(__dirname, "../shared/src/index.ts"),
      },
      {
        find: "@jsreview/shared/types",
        replacement: path.resolve(__dirname, "../shared/src/types.ts"),
      },
      {
        find: "@jsreview/shared/assignments",
        replacement: path.resolve(__dirname, "../shared/src/assignments.ts"),
      },
      {
        find: "@jsreview/shared/grading/ast",
        replacement: path.resolve(__dirname, "../shared/src/grading/ast.ts"),
      },
      {
        find: "@jsreview/shared/grading/score",
        replacement: path.resolve(__dirname, "../shared/src/grading/score.ts"),
      },
    ],
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
    // eslint-linter-browserify は CJS を ESM ラップしているので明示
    include: ["eslint-linter-browserify"],
  },
});
