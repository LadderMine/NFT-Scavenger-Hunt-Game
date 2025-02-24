import create from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
	devtools(
		persist(
			(set) => ({
				user: null,
				token: null,
				isAuthenticated: false,
				register: async (userData) => {
					try {
						const response = await fetch("/api/register", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(userData),
						});

						if (!response.ok) {
							throw new Error("Registration failed");
						}

						const data = await response.json();
						const { user, token } = data;
						set({ user, token, isAuthenticated: true });
						// Optionally, store the token in localStorage or set it in headers for future requests
					} catch (error) {
						console.error("Registration error:", error);
						// Handle registration error (e.g., show notification)
					}
				},
				login: async (credentials) => {
					try {
						const response = await fetch("/api/login", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(credentials),
						});

						if (!response.ok) {
							throw new Error("Login failed");
						}

						const data = await response.json();
						const { user, token } = data;
						set({ user, token, isAuthenticated: true });
						// Optionally, store the token in localStorage or set it in headers for future requests
					} catch (error) {
						console.error("Login error:", error);
						// Handle login error (e.g., show notification)
					}
				},
				logout: () => {
					set({ user: null, token: null, isAuthenticated: false });
					// Optionally, remove the token from localStorage or headers
				},
				fetchUser: async () => {
					try {
						const response = await fetch("/api/user", {
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								// Include authorization header with the token if required
							},
						});

						if (!response.ok) {
							throw new Error("Fetching user failed");
						}

						const user = await response.json();
						set({ user, isAuthenticated: true });
					} catch (error) {
						console.error("Fetching user error:", error);
						// Handle error (e.g., redirect to login)
					}
				},
			}),
			{
				name: "auth-storage",
				getStorage: () => localStorage,
			},
		),
		{ name: "AuthStore" },
	),
);

export default useAuthStore;
