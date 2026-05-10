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
import type { ObjectMethod, ObjectProperty } from "@babel/types";

// `@babel/traverse` の ESM/CJS 相互運用問題に合わせる
// (grading/ast.ts と同じパターン)
const traverseModule = _traverse as typeof _traverse & {
  default?: typeof _traverse;
};
const traverse = traverseModule.default ?? _traverse;

const STRIPPED_FIELDS = new Set(["solution", "badSolutions"]);

/** Vite の transform が付けるクエリ (?v= / ?import 等) と Windows パスを除いた上でマッチ用に正規化する。 */
function normalizeModuleIdForMatch(id: string): string {
  return id.split(/[?#]/)[0].replace(/\\/g, "/");
}

export function stripDevFields(): Plugin {
  return {
    name: "jsreview:strip-dev-fields",
    enforce: "pre",
    transform(code, id) {
      // 対象は `packages/shared/src/problems/<NN>-*.ts` のみ。
      // `_common.ts` や `index.ts` には対象フィールドが無いのでスキップしてコストを下げる。
      const pathId = normalizeModuleIdForMatch(id);
      if (!/\/shared\/src\/problems\/\d+-[^/]+\.ts$/.test(pathId)) {return null;}

      let ast: ReturnType<typeof parse>;
      try {
        ast = parse(code, {
          sourceType: "module",
          plugins: ["typescript"],
          ranges: true,
        });
      } catch (error) {
        // fail-closed: パース不能なファイルを素通しすると solution が漏れる可能性があるため
        // ビルドを止める
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
          `[jsreview:strip-dev-fields] Failed to parse ${pathId}: ${message}`,
        );
      }

      const removals: [number, number][] = [];

      function collectRemoval(node: ObjectProperty | ObjectMethod): void {
        const { key } = node;
        // shorthand `{ solution }` のような書き方も含めて、
        // `Identifier` (`solution: ...`) と `StringLiteral` (`"solution": ...`) を両方拾う。
        const name =
          key?.type === "Identifier"
            ? key.name
            : key?.type === "StringLiteral"
              ? key.value
              : null;

        if (
          typeof name === "string" &&
          STRIPPED_FIELDS.has(name) &&
          typeof node.start === "number" &&
          typeof node.end === "number"
        ) {
          // 後続のカンマも巻き込む (`solution: '..',\n` の最後の `,`)
          let end = node.end;
          const trailing = code.slice(end).match(/^\s*,/);
          if (trailing) {end += trailing[0].length;}
          removals.push([node.start, end]);
        }
      }

      traverse(ast as never, {
        ObjectProperty(path) {
          collectRemoval(path.node);
        },
        ObjectMethod(path) {
          collectRemoval(path.node);
        },
      });

      if (removals.length === 0) {return null;}

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
