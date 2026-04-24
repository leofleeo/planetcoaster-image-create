"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	function changeTheme() {
		if (theme === undefined) {
			setTheme("dark");
			return;
		}
		theme === "dark" ? setTheme("light") : setTheme("dark");
	}

	return (
		<Button
			variant="outline"
			size="icon-lg"
			onClick={changeTheme}
			aria-label="switch theme"
		>
			{(() => {
				if (theme === "light") {
					return <Moon />;
				} else if (theme === "dark") {
					return <Sun />;
				}
				return <SunMoon />;
			})()}
		</Button>
	);
}
