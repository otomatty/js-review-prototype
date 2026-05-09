import { AnimatedThemeToggler } from "./ui/animated-theme-toggler.js";

export function ThemeToggle() {
  return (
    <AnimatedThemeToggler
      className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-ink-300 hover:bg-card [&_svg]:size-4 dark:hover:border-ink-600"
      duration={500}
      aria-label="テーマを切り替え"
      title="テーマを切り替え"
    />
  );
}
