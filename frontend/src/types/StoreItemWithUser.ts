import { StoreItem } from "./StoreItem";

export interface StoreItemWithUser extends StoreItem {
	user_name: string;
	current_user_made_offer: boolean;
}
