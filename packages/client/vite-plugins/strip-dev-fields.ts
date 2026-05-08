/**
 * Vite plugin: 課題定義から開発専用フィールドを **クライアントバンドル時点で削除** する。
 *
 * `@jsreview/shared` 内の問題定義 (`packages/shared/src/problems/<NN>-*.ts`) には
 * 採点回帰テスト用の `solution` / `badSolutions` フィールドが含まれている。これらは
 * 受講者にそのまま配信したくないので、Vite の transform フェーズで AST から該当
 * プロパティを取り除いてからバンドルに乗せる。
 *
 * shared の本体は触らないので、`bun test` 経由で走る回帰テストでは
 * フィールドがそのまま見える。
 */

import type { Plugin } from "vite";

import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";

// `@babel/traverse` の ESM/CJS 相互運用問題に合わせる
// (grading/ast.ts と同じパターン)
const traverse =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((_traverse as any).default ?? _traverse) as typeof _traverse;

const STRIPPED_FIELDS = new Set(["solution", "badSolutions"]);

export function stripDevFields(): Plugin {
  return {
    name: "jsreview:strip-dev-fields",
    enforce: "pre",
    transform(code, id) {
      // 対象は `packages/shared/src/problems/<NN>-*.ts` のみ。
      // `_common.ts` や `index.ts` には対象フィールドが無いのでスキップしてコストを下げる。
      if (!/\/shared\/src\/problems\/\d+-[^/]+\.ts$/.test(id)) return null;

      let ast: ReturnType<typeof parse>;
      try {
        ast = parse(code, {
          sourceType: "module",
          plugins: ["typescript"],
          ranges: true,
        });
      } catch {
        return null;
      }

      const removals: [number, number][] = [];

      traverse(ast as never, {
        ObjectProperty(path) {
          const key = path.node.key;
          if (
            key.type === "Identifier" &&
            STRIPPED_FIELDS.has(key.name) &&
            path.node.start != null &&
            path.node.end != null
          ) {
            // 後続のカンマも巻き込む (`solution: '..',\n` の最後の `,`)
            let end = path.node.end;
            const trailing = code.slice(end).match(/^\s*,/);
            if (trailing) end += trailing[0].length;
            removals.push([path.node.start, end]);
          }
        },
      });

      if (removals.length === 0) return null;

      // 後ろから前に向かって削除していけばインデックスがズレない
      removals.sort((a, b) => b[0] - a[0]);
      let out = code;
      for (const [s, e] of removals) {
        out = out.slice(0, s) + out.slice(e);
      }

      return { code: out, map: null };
    },
  };
}
