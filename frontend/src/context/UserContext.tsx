import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";
import { User } from "@/types/User";

export type UserAuthType = {
	user: User | null;
	login: (googleToken?: string) => Promise<User | null>;
	logout: () => Promise<void>;
	isLoading: boolean;
};

// Context for user authentication
const UserContext = createContext<UserAuthType>({
	user: null,
	login: async () => Promise.resolve(null),
	logout: async () => Promise.resolve(),
	isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// helper to call /me and update state
	const fetchMe = useCallback(async () => {
		let me: User | null = null;
		try {
			const res = await fetch(`/api/me`, {
				credentials: "include",
			});
			if (res.ok) {
				const json = await res.json();
				me = json["user_data"];
				setUser(me);
				console.log("UserContext: fetched user", me);
			} else {
				setUser(null);
			}
		} catch {
			setUser(null);
		} finally {
			setIsLoading(false);
			return me;
		}
	}, []);

	const login = async (googleToken?: string) => {
		let authUserData: User | null = null;
		try {
			// hit /login to set the cookie
			const res = await fetch(`/api/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ google_token: googleToken }),
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Login failed");
			}
			// fetch user data from /me
			authUserData = await fetchMe();
		} catch (e) {
			console.error("Login error:", e);
			throw e;
		} finally {
			return authUserData;
		}
	};

	const logout = async () => {
		try {
			await fetch(`/api/logout`, {
				method: "POST",
				credentials: "include",
			});
		} catch (e) {
			console.error("Logout error", e);
		} finally {
			setUser(null);
		}
	};

	// on initial load, fetch user data
	// this will determine if the user is still logged in
	// or if their previous session has expired
	useEffect(() => {
		fetchMe();
	}, [fetchMe]);

	return (
		<UserContext.Provider value={{ user, login, logout, isLoading }}>
			{children}
		</UserContext.Provider>
	);
};

export const useAuth = () => useContext(UserContext);
