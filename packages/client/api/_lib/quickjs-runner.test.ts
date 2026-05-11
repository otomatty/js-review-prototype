import { describe, expect, test } from "bun:test";

import { getQuickJSModule, QuickJsRunner } from "./quickjs-runner";

describe("QuickJsRunner", async () => {
  const qjs = await getQuickJSModule();
  const runner = new QuickJsRunner(qjs, 32);

  test("stdout mode compares console.log", async () => {
    const results = await runner.runAll(
      `console.log(1 + 1);`,
      [{ name: "t", expectedStdout: "2" }],
      { testKind: "stdout" },
    );
    expect(results[0]?.passed).toBe(true);
    expect(results[0]?.stdout).toBe("2");
  });

  test("freerun captures stdout", async () => {
    const r = await runner.runFreeRun(`console.log("hi");`);
    expect(r.passed).toBe(true);
    expect(r.stdout).toBe("hi");
  });

  test("infinite loop times out", async () => {
    const r = await runner.runFreeRun(`while(true){}`);
    expect(r.passed).toBe(false);
    expect(r.error).toBe("TIMEOUT");
  });
});
