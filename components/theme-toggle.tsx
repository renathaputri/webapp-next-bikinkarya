"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi2";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const defaultClass = "relative h-9 w-9 rounded-md border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors";
  const fallbackClass = className || defaultClass;

  if (!mounted) {
    return (
      <button className={fallbackClass} />
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      title={resolvedTheme === "dark" ? "Switch to light" : "Switch to dark"}
      className={fallbackClass}
    >
      <HiSun
        className="h-[18px] w-[18px] transition-all duration-200"
        style={{
          opacity: resolvedTheme === "dark" ? 0 : 1,
          transform: resolvedTheme === "dark" ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)",
          position: resolvedTheme === "dark" ? "absolute" : "static",
        }}
      />
      <HiMoon
        className="h-[18px] w-[18px] transition-all duration-200"
        style={{
          opacity: resolvedTheme === "dark" ? 1 : 0,
          transform: resolvedTheme === "dark" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
          position: resolvedTheme === "dark" ? "static" : "absolute",
        }}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}