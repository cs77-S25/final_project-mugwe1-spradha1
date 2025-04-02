import React from "react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
	return (
		<div className="fixed top-14 left-0 w-1/6 h-[calc(100vh-4rem)] bg-gray-200 p-4">
			{children}
		</div>
	);
}
