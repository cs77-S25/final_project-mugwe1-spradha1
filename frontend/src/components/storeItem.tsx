import React, { useState } from "react";
import { StoreItem } from "@/types/StoreItem";
import { Heart } from "lucide-react";

interface StoreItemCardProps {
	storeItem: StoreItem;
}

export const StoreItemCard: React.FC<StoreItemCardProps> = ({ storeItem }) => {
	const [heart, setHeart] = useState(false);
	return (
		<div className="w-72 mb-8">
			<div className="relative h-72 w-full overflow-hidden rounded shadow-gray-400 hover:shadow-lg transition-all duration-300">
				<img
					src={storeItem.imageUrl}
					alt={storeItem.title}
					className="h-full w-full object-cover"
				/>
			</div>

			<div className="flex justify-between items-center w-full mt-2">
				<div className="text-gray-700 font-bold">${storeItem.price}</div>
				<button onClick={() => setHeart(!heart)}>
					{heart ? <Heart fill="pink" /> : <Heart />}
				</button>
			</div>
			<div className="text-gray-700">{storeItem.title}</div>
			<div className="text-gray-700">Condition: {storeItem.condition}</div>
		</div>
	);
};
