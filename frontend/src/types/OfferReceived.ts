export interface OfferReceived {
	id: number;
	created_at: string;
	item_id: number;
	seller_id: number;
	offer_amount: number;
	status: "Pending" | "Accepted" | "Declined" | "Completed" | "Cancelled";
	item_title: string;
	item_price: number;
	item_picture_data: string;
	buyer_name: string;
	buyer_id: number;
	buyer_profile_picture_url: string;
	buyer_contact: string;
	seller_completed: boolean;
	buyer_completed: boolean;
}
