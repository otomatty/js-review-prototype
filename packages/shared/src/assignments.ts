/**
 * 後方互換のための再エクスポート shim。
 *
 * 課題定義の本体は `./problems/` 配下にトピック単位で分割されている。
 * クライアントは従来通り `@jsreview/shared/assignments` から
 * `assignments` / `topics` / `findAssignment` などを取得できる。
 */

export {
  assignments,
  topics,
  findAssignment,
  findTopic,
  assignmentsByTopic,
} from "./problems/index.js";
