"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/theme-provider";
import { Button } from "./button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 py-1.5"
            onClick={() => {
                if (theme === "dark") {
                    setTheme("light");
                } else {
                    setTheme("dark");
                }
            }}
        >
            {theme === "dark" ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
} 