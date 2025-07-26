"use client";

import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

type Props = {
  className?: string;
};

export function ToggleTheme({ className }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className={cn(className)}
      icon={theme === "dark" ? <SunIcon /> : <MoonIcon />}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </Button>
  );
}
