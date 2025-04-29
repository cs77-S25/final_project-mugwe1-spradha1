import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "@/context/UserContext.tsx";
import { ScrollToTop } from "./components/scrollToTop.tsx";
import "./index.css";
import App from "./App.tsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// annoying type error for GoogleOauthProvider
const GoogleOAuthProviderAny = GoogleOAuthProvider as any;

// Contains all of the context providers for the app
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<GoogleOAuthProviderAny clientId={clientId}>
			<BrowserRouter>
				<UserProvider>
					<ScrollToTop>
						<App />
					</ScrollToTop>
				</UserProvider>
			</BrowserRouter>
		</GoogleOAuthProviderAny>
	</StrictMode>
);
