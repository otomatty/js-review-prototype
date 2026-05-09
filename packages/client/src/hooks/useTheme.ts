/**
 * テーマ (ライト / ダーク) の状態管理 Hook。
 *
 * - 真の値: `<html>` 要素の `dark` クラス
 * - ユーザー選好: localStorage の `theme` キー (`"light"` | `"dark"` | 未設定)
 * - 未設定時は OS の `prefers-color-scheme` に追従する。明示選択後は固定。
 *
 * 初期 class 付与は `index.html` のインラインスクリプトで先行実行される。
 * このフックは React マウント時点の class 状態を初期値として取り込む。
 */

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

// `index.html` のインラインスクリプト内のキー名と一致させること。
export const THEME_STORAGE_KEY = "theme";

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

interface ThemeApi {
  theme: Theme;
  toggleTheme: () => void;
}

export function useTheme(): ThemeApi {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  // localStorage 書き込みは「明示選択時のみ」に限定したいので、
  // theme をキーにした副作用エフェクトでは行わず、toggleTheme 内で行う。
  // OS pref 由来の変更は localStorage に残さず、引き続き OS 追従させる。
  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (_) {
      // private モード等で書けない場合は黙って諦める
    }
  }, [theme]);

  // theme state を DOM (`<html class="dark">`) に同期
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // ユーザーが明示選択していない (= localStorage 未設定) 間は OS 設定に追従
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_STORAGE_KEY);
      } catch (_) {}
      if (stored === "light" || stored === "dark") return;
      setTheme(event.matches ? "dark" : "light");
    };
    // Safari 13 / iOS 13 では addEventListener が無く addListener しか持たない。
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handleChange);
      return () => mql.removeEventListener("change", handleChange);
    }
    mql.addListener(handleChange);
    return () => mql.removeListener(handleChange);
  }, []);

  return { theme, toggleTheme };
}
