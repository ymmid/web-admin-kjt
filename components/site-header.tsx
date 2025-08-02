"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  if (!mounted) return null;
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="theme-switch"
              checked={isDark}
              onCheckedChange={(checked) => {
                setTheme(checked ? "dark" : "light");
              }}
            />
            <Label htmlFor="theme-switch">
              {isDark ? "Dark Mode" : "Light Mode"}
            </Label>
          </div>
        </div>
      </div>
    </header>
  );
}
