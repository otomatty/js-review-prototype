/**
 * アプリ全体のルート定義のみを持つ。
 *
 * 画面の構造:
 * - `/`                       … 問題選択画面 (SelectPage)
 * - `/problems/:assignmentId` … 問題演習画面 (PracticePage)
 * - その他                    … `/` へリダイレクト
 *
 * `progress-store` の初期化はここで一度だけ行う。
 */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SelectPage } from "./pages/SelectPage.js";
import { PracticePage } from "./pages/PracticePage.js";
import { initProgressStore } from "./lib/progress-store.js";

initProgressStore();

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectPage />} />
        <Route
          path="/problems/:assignmentId"
          element={<PracticePage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
