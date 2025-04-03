export interface StoreItem {
	id: number;
	title: string;
	description: string;
	price: number;
	imageUrl: string;
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
}
