import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	define: {
		VITE_GOOGLE_CLIENT_ID: JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID),
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},

	server: {
		// Dev proxy server for local development
		allowedHosts: ["swycle.sccs.swarthmore.edu"],
		proxy: {
			"/api": {
				target: "http://localhost:5001",
				changeOrigin: true,
				secure: false,
			},
		},
	},

	preview: {
		// Preview server for production build
		// allowedHosts: ["swycle.sccs.swarthmore.edu"],
		proxy: {
			"/api": {
				target: "http://swycle-backend:5001",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
