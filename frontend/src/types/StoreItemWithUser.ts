import { StoreItem } from "./StoreItem";

export interface StoreItemWithUser extends StoreItem {
	user_name: string;
	user_profile_picture_url: string;
	current_user_made_offer: boolean;
}
