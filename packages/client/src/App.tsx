/**
 * アプリ全体のルート定義のみを持つ。
 *
 * 画面の構造:
 * - `/`                              … ステージ選択 (SelectPage)
 * - `/stages/:stage`                 … ステージ詳細・章セクション (StagePage)
 * - `/problems/:assignmentId`        … 問題演習画面 (PracticePage)
 * - その他                           … `/` へリダイレクト
 *
 * `progress-store` と `stage-unlock-store` の初期化はここで一度だけ行う。
 */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SelectPage } from "./pages/SelectPage.js";
import { StagePage } from "./pages/StagePage.js";
import { PracticePage } from "./pages/PracticePage.js";
import { StageUnlockDialog } from "./components/StageUnlockDialog.js";
import { ResetNoticeToast } from "./components/ResetNoticeToast.js";
import { initProgressStore } from "./lib/progress-store.js";
import { startStageUnlockSync } from "./lib/stage-unlock-store.js";

initProgressStore();
startStageUnlockSync();

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectPage />} />
        <Route path="/stages/:stage" element={<StagePage />} />
        <Route
          path="/problems/:assignmentId"
          element={<PracticePage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <StageUnlockDialog />
      <ResetNoticeToast />
    </BrowserRouter>
  );
}
