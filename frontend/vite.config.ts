import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		// add this line to allow ngrok to connect to the frontend
		allowedHosts: [
			"bc6c-130-58-166-241.ngrok-free.app",
			"ce0d-130-58-164-147.ngrok-free.app",
			"swycle.sccs.swarthmore.edu",
		],
		// Proxity is necessary due to CORS issues with local dev
		// In theory, this should allow ngrok to hit the backend server as well
		proxy: {
			"/api": {
				target: "http://localhost:5001",
				changeOrigin: true,
				secure: false,
				//rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
