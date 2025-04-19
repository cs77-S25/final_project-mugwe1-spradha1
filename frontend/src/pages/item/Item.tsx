import React from "react";
import { useParams } from "react-router-dom";
import { StoreItemWithUser } from "@/types/StoreItemWithUser";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Item() {
	const [storeItem, setStoreItem] = React.useState<StoreItemWithUser | null>(
		null
	);
	const [loading, setLoading] = React.useState(true);
	const [heart, setHeart] = React.useState(false);
	const [heartLoading, setHeartLoading] = React.useState(false);
	const [likeCount, setLikeCount] = React.useState(0);

	const params = useParams();
	if (!params.itemId) {
		return <div>Invalid Route</div>;
	}
	const itemId = parseInt(params.itemId);
	useEffect(() => {
		window.scrollTo(0, 0);

		const fetchItem = async () => {
			try {
				const response = await fetch(`/api/store-items/${itemId}`);
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				const data = await response.json();
				console.log("Fetched store items:", data);
				setStoreItem(data);
			} catch (error) {
				console.error("Error fetching item:", error);
			}
		};
		setLoading(true);
		fetchItem();
		setLoading(false);
	}, []);

	useEffect(() => {
		if (storeItem) {
			setHeart(storeItem.liked);
			setLikeCount(storeItem.like_count);
		}
	}, [storeItem]);

	const handleHeartClick = async () => {
		if (heartLoading) return;
		setHeartLoading(true);
		try {
			const res = await fetch(`/api/store-items/${itemId}/like`, {
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

	const imageDataUrl = `data:image/jpeg;base64,${storeItem?.picture_data}`;

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-2xl">Loading...</p>
			</div>
		);
	}

	if (!storeItem) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-2xl">Item not found</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-8 bg-gray-50">
			<div className="max-w-7xl mx-auto bg-white rounded-lg overflow-hidden border-2 border-black">
				<div className="flex">
					{/* Left: Item Image */}
					<div className="w-1/2">
						<img
							src={imageDataUrl}
							alt={storeItem.title}
							className="w-full h-full object-cover"
						/>
					</div>
					{/* Right: Item Details */}
					<div className="w-1/2 p-6 flex flex-col">
						<h1 className="text-3xl font-bold mb-2">{storeItem.title}</h1>
						<h2 className="text-xl mb-2">
							Seller:{" "}
							<Link to={`/profile/${storeItem.user_id}`} className="underline">
								{storeItem.user_name}
							</Link>
						</h2>
						<p className="text-gray-700 mb-4 text-xl">
							{storeItem.description}
						</p>
						<p className="text-2xl font-semibold mb-4">
							${storeItem.price.toFixed(2)}
						</p>
						<div className="flex items-center mb-4">
							<button
								onClick={handleHeartClick}
								disabled={heartLoading}
								className="flex items-center justify-center"
							>
								<Heart
									className="w-full h-full"
									stroke="currentColor"
									strokeWidth={2}
									fill={heart ? "pink" : "none"}
								/>
							</button>
							<span className="ml-2 text-gray-700 text-2xl">{likeCount}</span>
						</div>
						<div className="flex items-center mb-4">
							<span className="text-gray-700 font-bold mr-2">Condition:</span>
							<span className="text-gray-700">{storeItem.condition}</span>
						</div>
						<div className="flex items-center mb-4">
							<span className="text-gray-700 font-bold mr-2">Size:</span>
							<span className="text-gray-700">{storeItem.size}</span>
						</div>
						<div className="flex items-center mb-4">
							<span className="text-gray-700 font-bold mr-2">Gender:</span>
							<span className="text-gray-700">{storeItem.gender}</span>
						</div>
						<div className="flex items-center mb-4">
							<span className="text-gray-700 font-bold mr-2">Category:</span>
							<span className="text-gray-700">{storeItem.category}</span>
						</div>
						<div className="flex items-center mb-4">
							<span className="text-gray-700 font-bold mr-2">Color:</span>
							<span className="text-gray-700">{storeItem.color}</span>
						</div>
						<div className="mt-auto">
							<Button
								size="lg"
								variant="secondary"
								className="w-full mb-4 bg-blue-500 text-white hover:bg-blue-600"
							>
								Contact Seller
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
