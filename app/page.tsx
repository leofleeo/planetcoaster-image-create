"use client";

import ThemeSwitcher from "@/components/theme-switcher";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full flex-col items-center justify-between py-16 px-16 bg-white dark:bg-black sm:items-start">
				<div className="flex items-center justify-between w-full">
					<h1 className="text-2xl font-bold">Planet Coaster Map Creator</h1>
					<ThemeSwitcher />
				</div>
			</main>
		</div>
	);
}
