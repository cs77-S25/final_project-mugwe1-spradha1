export interface StoreItem {
	id: number;
	created_at: string;
	user_id: number;
	title: string;
	description: string;
	price: number;
	picture_data: string;
	category:
		| "Jackets"
		| "Tops"
		| "Bottoms"
		| "Shoes"
		| "Hats"
		| "Accessories"
		| "Misc";
	gender: string;
	condition: "Excellent" | "Good" | "Fair";
	color:
		| "Red"
		| "Blue"
		| "Green"
		| "Yellow"
		| "Black"
		| "White"
		| "Purple"
		| "Pink"
		| "Orange"
		| "Brown";
	size: string;
	liked: boolean;
	like_count: number;
	is_available: boolean;
}
