/**
 * 模範解答アコーディオン。
 *
 * - `assignment.solution` が未設定なら何も描画しない
 * - 満点 (100点) を取得するまでトグルは disabled (カンニング抑制)
 *   - 「常に公開モード」が ON の場合は満点未達でも開閉できる
 * - 展開時は CodeMirror (readonly) でシンタックスハイライト付き表示
 * - コピーボタンで解答テキストをクリップボードへ
 */

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";

const ALWAYS_SHOW_KEY = "jsreview/solution/alwaysShow";

interface Props {
  solution: string | undefined;
  bestScore: number | null;
}

export function SolutionAccordion({ solution, bestScore }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [alwaysShow, setAlwaysShow] = useState<boolean>(() =>
    readAlwaysShow(),
  );

  // 配列リテラルを直接渡すと毎レンダで新しい参照になり、CodeMirror が
  // 拡張を再構成してしまうため安定参照にする。
  const editorExtensions = useMemo(
    () => [javascript(), EditorView.lineWrapping],
    [],
  );

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  if (!solution) return null;

  const unlocked = alwaysShow || (bestScore !== null && bestScore >= 100);
  const disabled = !unlocked;

  const toggle = () => {
    if (disabled) return;
    setOpen((v) => !v);
  };

  const handleAlwaysShowChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    setAlwaysShow(next);
    writeAlwaysShow(next);
    // ロック中に「常に表示」を ON にした場合、UI 状態をすぐ反映するため
    // open は触らない (ユーザーが明示的に開く形にする)。
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(solution);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="solution-accordion">
      <div className="solution-header">
        <button
          type="button"
          className="solution-toggle"
          onClick={toggle}
          disabled={disabled}
          aria-expanded={open}
          title={
            disabled
              ? "100点を取ると解答例を表示できます"
              : open
                ? "解答例を閉じる"
                : "解答例を表示"
          }
        >
          <span className="solution-caret" aria-hidden="true">
            {open ? "▼" : "▶"}
          </span>
          解答例
          {disabled && (
            <span className="solution-lock" aria-hidden="true">
              🔒 100点で解放
            </span>
          )}
        </button>
        <label className="solution-always-show">
          <input
            type="checkbox"
            checked={alwaysShow}
            onChange={handleAlwaysShowChange}
          />
          常に表示
        </label>
      </div>

      {open && !disabled && (
        <div className="solution-body">
          <div className="solution-actions">
            <button
              type="button"
              className="btn solution-copy"
              onClick={handleCopy}
            >
              {copied ? "✓ コピーしました" : "コピー"}
            </button>
          </div>
          <div className="solution-editor">
            <CodeMirror
              value={solution}
              editable={false}
              readOnly
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: false,
                foldGutter: false,
              }}
              extensions={editorExtensions}
              theme="light"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function readAlwaysShow(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(ALWAYS_SHOW_KEY) === "1";
  } catch {
    return false;
  }
}

function writeAlwaysShow(value: boolean): void {
  try {
    if (typeof window === "undefined") return;
    if (value) {
      window.localStorage.setItem(ALWAYS_SHOW_KEY, "1");
    } else {
      window.localStorage.removeItem(ALWAYS_SHOW_KEY);
    }
  } catch {
    // localStorage 不可でも UI は動かす
  }
}
