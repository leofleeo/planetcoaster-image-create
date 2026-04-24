"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
	const [rendered, setRendered] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setRendered(true);
	}, []);

	function changeTheme() {
		if (theme === undefined) {
			setTheme("dark");
			return;
		}
		theme === "dark" ? setTheme("light") : setTheme("dark");
	}

	if (!rendered) {
		return (
			<Button variant="outline" size="icon-lg" onClick={changeTheme}>
				<SunMoon />
			</Button>
		);
	}

	return (
		<Button variant="outline" size="icon-lg" onClick={changeTheme}>
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
