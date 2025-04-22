export interface OfferMade {
	id: number;
	created_at: string;
	item_id: number;
	buyer_id: number;
	offer_amount: number;
	status: "Pending" | "Accepted" | "Declined" | "Completed" | "Cancelled";
	item_title: string;
	item_price: number;
	item_picture_data: string;
	seller_name: string;
	seller_id: number;
	seller_profile_picture_url: string;
	seller_contact: string;
	seller_completed: boolean;
	buyer_completed: boolean;
}
