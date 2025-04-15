import { StoreItem } from "./StoreItem";

export interface StoreItemWithUser extends StoreItem {
	user_name: string;
	user_email: string;
}
