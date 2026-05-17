import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { copySqlJsWasm } from "./vite-plugins/copy-sqljs-wasm";
import { stripDevFields } from "./vite-plugins/strip-dev-fields";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [stripDevFields(), copySqlJsWasm(), react(), tailwindcss()],
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
      {
        // 完全一致のみ (prefix match は他の /grading/* import を奪うため正規表現で固定する)
        find: /^@jsreview\/shared\/grading$/,
        replacement: path.resolve(__dirname, "../shared/src/grading/index.ts"),
      },
    ],
  },
  server: {
    port: 5173,
  },
  worker: {
    // QuickJS WASM ローダが動的 import() で code-split されるため、
    // ワーカも ES モジュール形式でビルドする必要がある (既定の iife は code-split 非対応)。
    format: "es",
  },
  optimizeDeps: {
    // eslint-linter-browserify は CJS を ESM ラップしているので明示
    include: ["eslint-linter-browserify"],
    // Pyodide は dev 時に CJS interop でロードできず、 また巨大なため事前 bundle 対象から外す。
    // dynamic import で Python 課題を開いた瞬間にだけ chunk として fetch される (#108)。
    exclude: ["pyodide"],
  },
  build: {
    rollupOptions: {
      output: {
        // 言語別の重い依存を vendor chunk に切り出す。 主バンドルに含まれないため、
        // 該当言語の課題を開かない学習者には追加コストが一切かからない (#108 / #112)。
        // - vendor-pyodide: Pyodide ローダ + Python 言語拡張 (#108)
        // - vendor-php:     PHP 言語拡張 (#112)。 php-wasm ローダ自体は CDN 直 fetch なので
        //                   バンドルには含まれない。 chunk としては小さいが、 PHP 課題を
        //                   開かない限り読み込まれないようにしておく。
        manualChunks(id) {
          if (id.includes("/node_modules/pyodide/")) {return "vendor-pyodide";}
          if (id.includes("/node_modules/@codemirror/lang-python/")) {return "vendor-pyodide";}
          if (id.includes("/node_modules/@codemirror/lang-php/")) {return "vendor-php";}
          return undefined;
        },
      },
    },
  },
});
