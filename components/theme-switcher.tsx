"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
	const [rendered, setRendered] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();

	useEffect(() => {
		setRendered(true);
	}, []);

	function changeTheme() {
		if (resolvedTheme === undefined) {
			setTheme("dark");
			return;
		}
		resolvedTheme === "dark" ? setTheme("light") : setTheme("dark");
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
				if (resolvedTheme === "light") {
					return <Moon />;
				} else if (resolvedTheme === "dark") {
					return <Sun />;
				}
				return <SunMoon />;
			})()}
		</Button>
	);
}
