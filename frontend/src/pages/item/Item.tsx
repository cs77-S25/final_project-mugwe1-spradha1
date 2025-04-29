import React from "react";
import { useParams } from "react-router-dom";
import { StoreItemWithUser } from "@/types/StoreItemWithUser";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function Item() {
	// Setting up state variables
	const [storeItem, setStoreItem] = React.useState<StoreItemWithUser | null>(
		null
	);
	const [loading, setLoading] = React.useState(true);
	const [heart, setHeart] = React.useState(false);
	const [heartLoading, setHeartLoading] = React.useState(false);
	const [likeCount, setLikeCount] = React.useState(0);
	const [isOwner, setIsOwner] = React.useState(false);
	const [deleteLoading, setDeleteLoading] = React.useState(false);
	const [offerAmount, setOfferAmount] = React.useState<string>("");
	const [offerError, setOfferError] = React.useState<string>("");
	const [offerLoading, setOfferLoading] = React.useState(false);

	// Getting auth context
	const userAuth = useAuth();
	const authUserId = userAuth.user?.id;

	const params = useParams();
	if (!params.itemId) {
		return <div>Invalid Route</div>;
	}
	const itemId = parseInt(params.itemId);

	// navigate
	const navigate = useNavigate();

	// Fetching item data
	useEffect(() => {
		const fetchItem = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/store-items/${itemId}`);
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				const data = await response.json();
				console.log("Fetched store items:", data);
				setStoreItem(data);
			} catch (error) {
				console.error("Error fetching item:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchItem();
	}, []);

	useEffect(() => {
		if (storeItem) {
			setHeart(storeItem.liked);
			setLikeCount(storeItem.like_count);
		}
	}, [storeItem]);

	// Check if the user is the owner of the item
	useEffect(() => {
		if (storeItem && authUserId) {
			setIsOwner(storeItem.user_id === authUserId);
		}
	}, [storeItem, authUserId]);

	// Click handlers
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

	const handleDeleteItem = async (itemId: number) => {
		try {
			setDeleteLoading(true);
			const res = await fetch(`/api/store-items/${itemId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			});
			if (!res.ok) throw new Error(res.statusText);
			window.location.href = "/store";
		} catch (error) {
			console.error("Error deleting item:", error);
		} finally {
			setDeleteLoading(false);
		}
	};

	const handleMakeOffer = async () => {
		if (!validateOffer()) {
			setOfferAmount("");
			return;
		}
		try {
			setOfferLoading(true);
			const res = await fetch(`/api/store-items/${itemId}/offer`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ offer_amount: parseFloat(offerAmount) }),
			});
			if (!res.ok) throw new Error(res.statusText);
			navigate(`/offers-made`);
		} catch (err) {
			console.error(err);
			setOfferError("Failed to submit offer. Please try again.");
			setOfferAmount("");
		} finally {
			setOfferLoading(false);
		}
	};

	// Validate offer before sending
	const validateOffer = (): boolean => {
		if (!storeItem) return false;
		const regex = /^\d+\.\d{2}$/;
		if (!regex.test(offerAmount)) {
			setOfferError(
				"Offer must be a positive number with exactly two decimal places."
			);
			return false;
		}
		const amount = parseFloat(offerAmount);
		if (amount <= 0) {
			setOfferError("Offer must be greater than $0.00.");
			return false;
		}
		if (amount > storeItem.price) {
			setOfferError(
				`Offer must be at most the listing price of $${storeItem.price.toFixed(
					2
				)}.`
			);
			return false;
		}
		setOfferError("");
		return true;
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
		<div className="min-h-screen p-8 bg-gray-50 dark:bg-black">
			<div className="max-w-7xl mx-auto">
				<Link to="/store" className="flex items-center mb-4">
					<ArrowLeft size={20} className="text-[#A11833] custom-hover-shadow" />
					<span className="font-bold text-gray-600 dark:text-white ml-2 hover:font-normal">
						Back to Store
					</span>
				</Link>
				<div className="bounded-lg overflow-hidden border-2 border-black dark:bg-gray-800 dark:border-gray-700">
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
							<Link to={`/profile/${storeItem.user_id}`}>
								<div className="flex items-center space-x-2 mb-2">
									<Avatar className="w-14 h-14">
										<AvatarImage
											src={storeItem.user_profile_picture_url}
											alt={storeItem.user_name}
											referrerPolicy="no-referrer"
										/>
										<AvatarFallback>
											{getInitials(storeItem.user_name)}
										</AvatarFallback>
									</Avatar>
									<span className="text-xl">{storeItem.user_name}</span>
									{isOwner && <span className="font-bold text-xl">(You)</span>}
								</div>
							</Link>
							<p className=" mb-4 text-xl">{storeItem.description}</p>
							<p className="text-2xl font-semibold mb-4 dark:text-orange-100">
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
										fill={heart ? "red" : "none"}
									/>
								</button>
								<span className="ml-2 text-2xl">{likeCount}</span>
							</div>
							<div className="flex items-center mb-4">
								<span className="font-bold mr-2">Condition:</span>
								<span className="">{storeItem.condition}</span>
							</div>
							<div className="flex items-center mb-4">
								<span className=" font-bold mr-2">Size:</span>
								<span className="">{storeItem.size}</span>
							</div>
							<div className="flex items-center mb-4">
								<span className=" font-bold mr-2">Gender:</span>
								<span className="">{storeItem.gender}</span>
							</div>
							<div className="flex items-center mb-4">
								<span className=" font-bold mr-2">Category:</span>
								<span className="">{storeItem.category}</span>
							</div>
							<div className="flex items-center mb-4">
								<span className=" font-bold mr-2">Color:</span>
								<span className="">{storeItem.color}</span>
							</div>
							<div className="mt-auto">
								<div className="mt-auto">
									{!storeItem.is_available ? (
										<Button
											size="lg"
											className="w-full mb-4 border-black bg-gray-400"
											variant={"default"}
										>
											Item Sold
										</Button>
									) : isOwner ? (
										// If the user is the owner, show the delete button + dialog popup
										<Dialog>
											<DialogTrigger asChild>
												<Button
													variant="destructive"
													size="lg"
													className="w-full mb-4"
												>
													Delete Item
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Confirm Deletion</DialogTitle>
													<DialogDescription>
														Are you sure you want to delete this item? This
														action cannot be undone.
													</DialogDescription>
												</DialogHeader>
												<DialogFooter>
													<Button
														variant="destructive"
														onClick={() => handleDeleteItem(storeItem!.id)}
														disabled={deleteLoading}
													>
														{deleteLoading && (
															<Loader2 className="animate-spin" />
														)}
														{deleteLoading ? "Deleting..." : "Confirm Delete"}
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									) : (
										// If the user is not the owner, show the make offer button + dialog popup
										// Also check if the user has already made an offer
										<Dialog>
											<DialogTrigger asChild>
												<Button
													size="lg"
													className="w-full mb-4 border-2 bg-red-700 hover:bg-red-800 disabled:bg-gray-400"
													disabled={storeItem.current_user_made_offer}
												>
													{storeItem.current_user_made_offer
														? "Existing Offer Pending"
														: "Make Offer"}
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Make Offer</DialogTitle>
													<DialogDescription>
														Enter your offer below:
													</DialogDescription>
												</DialogHeader>
												<Input
													type="text"
													placeholder="e.g. 19.99"
													value={offerAmount}
													onChange={(e) => setOfferAmount(e.target.value)}
													className="w-full mb-2"
												/>
												{offerError && (
													<p className="text-red-500 mb-2">{offerError}</p>
												)}
												<DialogFooter>
													<Button
														onClick={handleMakeOffer}
														disabled={offerAmount === "" || offerLoading}
													>
														{offerLoading && (
															<Loader2 className="animate-spin" />
														)}
														Submit Offer
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
