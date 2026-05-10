/**
 * サーバ内部で使う型。
 *
 * 公開API用の型 (RunTestsRequest, RunTestsResponse, TestCase, TestResult) は
 * @jsreview/shared/types から再 export する。これにより、サーバが import するのは
 * 「sharedのtypes.tsだけ」という性質を保つ。
 */
export type {
  RunTestsRequest,
  RunTestsResponse,
  TestCase,
  TestKind,
  TestResult,
} from "@jsreview/shared/types";
