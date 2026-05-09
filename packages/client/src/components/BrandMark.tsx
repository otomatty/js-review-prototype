import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

/**
 * Acial Design ブランドマーク。
 * テキストロゴで、頭文字 A だけブランドグラデーション (青→赤) を当てる。
 */
export function BrandMark({ className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-baseline font-sans text-[15px] font-black tracking-[-0.01em] text-foreground",
        className,
      )}
      aria-label="Acial Design"
    >
      <span className="gradient-text">A</span>cial Design
    </span>
  );
}
