import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Issue: react router does NOT automatically scroll to the top of the page when navigating to a new route.
// Solution: use the useLocation hook to detect when the route changes and scroll to the top of the page.
export function ScrollToTop({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return <>{children}</>;
}
