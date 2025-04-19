import React, { useState } from "react";
import { StoreItem } from "@/types/StoreItem";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface StoreItemCardProps {
	storeItem: StoreItem;
}

export const StoreItemCard: React.FC<StoreItemCardProps> = ({ storeItem }) => {
	const [heart, setHeart] = useState(storeItem.liked);
	const [heartLoading, setHeartLoading] = useState(false);
	const [likeCount, setLikeCount] = useState(storeItem.like_count);
	const imageDataUrl = `data:image/jpeg;base64,${storeItem.picture_data}`;

	const handleHeartClick = async () => {
		if (heartLoading) return; // guard against spamming
		setHeartLoading(true);

		try {
			const res = await fetch(`/api/store-items/${storeItem.id}/like`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			if (!res.ok) throw new Error(res.statusText);
			setHeart((prev) => !prev);
			setLikeCount((prev) => (heart ? prev - 1 : prev + 1));
		} catch (err) {
			console.error(err);
		} finally {
			setHeartLoading(false);
		}
	};

	return (
		<div className="w-72 mb-8">
			<Link to={`/item/${storeItem.id}`}>
				<div className="relative h-72 w-full overflow-hidden rounded shadow-gray-400 hover:shadow-lg transition-all duration-300">
					<img
						src={imageDataUrl}
						alt={storeItem.title}
						className="h-full w-full object-cover"
					/>
				</div>
			</Link>

			<div className="flex justify-between items-center w-full mt-2">
				<div className="text-gray-700 font-bold">
					${storeItem.price.toFixed(2)}
				</div>
				<div className="flex items-center w-16 justify">
					<button
						onClick={handleHeartClick}
						disabled={heartLoading}
						className="w-6 h-6 flex items-center justify-center overflow-hidden flex-shrink-0"
					>
						<Heart
							className="w-full h-full"
							stroke="currentColor"
							strokeWidth={2}
							fill={heart ? "pink" : "none"}
						/>
					</button>
					<span className="ml-2 text-gray-700">{likeCount}</span>
				</div>
			</div>
			<div className="text-gray-700">{storeItem.title}</div>
			<div className="text-gray-700">Condition: {storeItem.condition}</div>
		</div>
	);
};
