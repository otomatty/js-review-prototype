import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark.js";

interface Props {
  /** Brand mark の左に出す back-link (任意) */
  backLink?: { to: string; label: string; ariaLabel?: string };
  /** ヘッダー右側に並べるコントロール群 */
  right?: ReactNode;
  className?: string;
}

/**
 * Acial Design 仕様の共通ヘッダー。
 * 高さ 64px / 半透明白背景 + backdrop-blur / 下端にブランドグラデーション hairline。
 */
export function AppHeader({ backLink, right, className }: Props) {
  return (
    <header
      className={cn(
        "relative flex h-16 items-center justify-between border-b border-border bg-card/78 px-6 backdrop-blur-xl backdrop-saturate-150",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        {backLink ? (
          <>
            <Link
              to={backLink.to}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-[12.5px] font-semibold text-muted-foreground no-underline transition-colors hover:border-ink-300 hover:bg-card hover:text-foreground dark:hover:border-ink-600"
              aria-label={backLink.ariaLabel ?? backLink.label}
            >
              {backLink.label}
            </Link>
            <span className="brand-divider" aria-hidden />
          </>
        ) : null}
        <BrandMark />
        <span className="brand-divider" aria-hidden />
        <h1 className="m-0 font-jp text-[14.5px] font-bold leading-none text-foreground">
          JS自動コードレビュー
          <span className="ml-2 inline-block rounded-full bg-muted px-2 py-[2px] font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Prototype
          </span>
        </h1>
      </div>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
      <span
        className="pointer-events-none absolute inset-x-0 -bottom-px gradient-hairline"
        aria-hidden
      />
    </header>
  );
}
