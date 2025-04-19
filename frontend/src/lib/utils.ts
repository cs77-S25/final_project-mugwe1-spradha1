import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Takes a full name string separated by spaces and returns the initials.
export function getInitials(fullName: string) {
	if (typeof fullName !== "string") return "";

	const parts = fullName.trim().split(" ");
	if (parts.length === 0) return "";

	const firstInitial = parts[0].charAt(0).toUpperCase();
	const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
	return firstInitial + lastInitial;
}
