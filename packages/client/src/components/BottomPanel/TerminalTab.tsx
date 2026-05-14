/**
 * 下部パネル「ターミナル」タブ。 SQL 課題で sql.js セッションへ対話実行できる REPL (#109)。
 *
 * - xterm.js は dynamic import (~200KB) で初回のみロード
 * - `@xterm/addon-fit` でコンテナサイズに追従
 * - 行入力は `Enter` で確定 (multi-line は未対応、 1 行 1 SQL のシンプル運用)
 * - `(assignmentId, seedHash)` キーの terminal セッションを `sql-terminal.ts` で管理し、
 *   採点用 DB とは独立 (ターミナルから `DROP` しても採点に影響しない)
 */

import { useEffect, useRef, useState } from "react";
import { memoizePromiseFactory } from "quickjs-emscripten-core";
import type { Terminal as XtermTerminal } from "@xterm/xterm";
import type { FitAddon as XtermFitAddon } from "@xterm/addon-fit";

import {
  disposeTerminalSession,
  getTerminalSession,
  type TerminalExecResult,
} from "../../lib/sql-terminal.js";

interface Props {
  enabled: boolean;
  assignmentId: string;
  seed: string;
}

// xterm + addon-fit + xterm.css を dynamic import で 1 度だけ読み込む。
type XtermBundle = {
  Terminal: typeof XtermTerminal;
  FitAddon: typeof XtermFitAddon;
};
const loadXterm = memoizePromiseFactory(async (): Promise<XtermBundle> => {
  const [xtermMod, fitMod] = await Promise.all([
    import("@xterm/xterm"),
    import("@xterm/addon-fit"),
    import("@xterm/xterm/css/xterm.css"),
  ]);
  return { Terminal: xtermMod.Terminal, FitAddon: fitMod.FitAddon };
});

// sql.js も dynamic import (terminal セッション用)。 採点ランナと同じ wasm モジュールを共有する。
type InitSqlJs = (config?: { locateFile?: (file: string) => string }) => Promise<{
  Database: new () => {
    exec(sql: string): Array<{ columns: string[]; values: unknown[][] }>;
    close(): void;
  };
}>;
const loadSqlJsForTerminal = memoizePromiseFactory(async () => {
  const mod = (await import("sql.js")) as unknown as { default: InitSqlJs };
  return mod.default({ locateFile: (f: string) => `/sqljs/${f}` });
});

const ESC = "\x1b";

export function TerminalTab({ enabled, assignmentId, seed }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // sessionId が変わるたびに terminal を作り直す。
  const sessionId = `${assignmentId}::${seed}`;

  useEffect(() => {
    if (!enabled) {return;}
    const container = containerRef.current;
    if (!container) {return;}

    let cancelled = false;
    let terminal: XtermTerminal | null = null;
    let fitAddon: XtermFitAddon | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let session: Awaited<ReturnType<typeof getTerminalSession>> | null = null;

    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const [{ Terminal, FitAddon }, terminalSession] = await Promise.all([
          loadXterm(),
          getTerminalSession(assignmentId, seed, loadSqlJsForTerminal),
        ]);
        if (cancelled) {return;}
        session = terminalSession;
        terminal = new Terminal({
          cursorBlink: true,
          fontSize: 13,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          theme: { background: "#0b1020" },
          convertEol: true,
        });
        fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(container);
        fitAddon.fit();

        terminal.writeln(`${ESC}[1;36mSQL Terminal${ESC}[0m (sql.js / SQLite)`);
        terminal.writeln(
          "1 行に SQL を 1 文書いて Enter で実行します。 採点 DB とは別の独立セッションです。",
        );
        writePrompt(terminal);

        let buffer = "";
        terminal.onData((data: string) => {
          if (!terminal || !session) {return;}
          for (const ch of data) {
            const code = ch.charCodeAt(0);
            if (ch === "\r") {
              terminal.writeln("");
              const sql = buffer.trim();
              buffer = "";
              if (sql.length > 0) {
                const results = session.exec(sql);
                writeResults(terminal, results);
              }
              writePrompt(terminal);
            } else if (code === 0x7f /* Backspace */) {
              if (buffer.length > 0) {
                buffer = buffer.slice(0, -1);
                terminal.write("\b \b");
              }
            } else if (code === 0x03 /* Ctrl+C */) {
              terminal.writeln("^C");
              buffer = "";
              writePrompt(terminal);
            } else if (code >= 0x20) {
              buffer += ch;
              terminal.write(ch);
            }
          }
        });

        // コンテナサイズ変化に追従。
        resizeObserver = new ResizeObserver(() => {
          try {
            fitAddon?.fit();
          } catch {
            // ignore (アンマウント直後等)
          }
        });
        resizeObserver.observe(container);

        setLoading(false);
      } catch (e) {
        if (cancelled) {return;}
        setError(e instanceof Error ? e.message : String(e));
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      terminal?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, sessionId]);

  // アンマウント時にセッション破棄 (タブ閉じや課題遷移)。
  useEffect(() => {
    return () => {
      disposeTerminalSession();
    };
  }, []);

  if (!enabled) {
    return (
      <div className="flex flex-col">
        <div className="border-b border-border bg-card/60 px-6 py-1.5">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            ターミナル
          </span>
        </div>
        <div className="bg-background px-6 py-3 font-sans text-[12px] text-muted-foreground">
          この課題ではターミナルは利用できません。 SQL 課題で有効になります。
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-h-[40vh] min-h-[200px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-card/60 px-6 py-1.5">
        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          ターミナル (sql.js)
        </span>
        {loading ? (
          <span className="font-sans text-[11px] text-muted-foreground">
            読み込み中...
          </span>
        ) : null}
      </div>
      <div className="relative min-h-0 flex-1 bg-[#0b1020]">
        <div ref={containerRef} className="absolute inset-0" />
      </div>
      {error ? (
        <div className="border-t border-destructive/30 bg-destructive/5 px-6 py-2 font-sans text-[12px] text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}

function writePrompt(terminal: XtermTerminal): void {
  terminal.write(`${ESC}[1;32msql>${ESC}[0m `);
}

function writeResults(
  terminal: XtermTerminal,
  results: TerminalExecResult[],
): void {
  if (results.length === 0) {
    terminal.writeln("(OK)");
    return;
  }
  for (const r of results) {
    if (r.error) {
      terminal.writeln(`${ESC}[31mERROR:${ESC}[0m ${r.error}`);
      continue;
    }
    if (r.rows.length === 0) {
      terminal.writeln("(no rows)");
      continue;
    }
    const widths = r.columns.map((c, i) => {
      let w = c.length;
      for (const row of r.rows) {
        const cell = formatCell(row[i]);
        if (cell.length > w) {w = cell.length;}
      }
      return Math.min(w, 32);
    });
    terminal.writeln(
      r.columns.map((c, i) => c.padEnd(widths[i])).join(" | "),
    );
    terminal.writeln(widths.map((w) => "-".repeat(w)).join("-+-"));
    for (const row of r.rows) {
      terminal.writeln(
        row.map((v, i) => formatCell(v).padEnd(widths[i])).join(" | "),
      );
    }
  }
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) {return "NULL";}
  if (typeof v === "string") {return v;}
  if (typeof v === "number" || typeof v === "boolean" || typeof v === "bigint") {
    return String(v);
  }
  try {
    return JSON.stringify(v) ?? "(?)";
  } catch {
    return "(?)";
  }
}
