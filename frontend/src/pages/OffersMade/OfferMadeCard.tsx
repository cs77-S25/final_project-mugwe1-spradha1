import React from "react";
import { Link } from "react-router-dom";
import { OfferMade } from "@/types/OfferMade";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

type Tab = "Pending" | "Accepted" | "Declined" | "Completed" | "Cancelled";

// Determine badge background classes based on status
const badgeClasses = {
	Pending: "bg-yellow-600 text-white",
	Accepted: "bg-green-600 text-white",
	Declined: "bg-red-600 text-white",
	Completed: "bg-blue-600  text-white",
	Cancelled: "bg-red-600 text-white",
};

export default function OfferMadeCard({
	offer,
	setOffers,
	setTab,
}: {
	offer: OfferMade;
	setOffers: React.Dispatch<React.SetStateAction<OfferMade[]>>;
	setTab: React.Dispatch<React.SetStateAction<Tab>>;
}) {
	const handleComplete = async (offerId: number, seller_completed: boolean) => {
		try {
			const res = await fetch(`/api/offers/${offerId}/complete-buyer`, {
				method: "PUT",
			});
			if (!res.ok) throw new Error(res.statusText);

			if (seller_completed) {
				setOffers((prev) =>
					prev.map((offer) =>
						offer.id === offerId
							? { ...offer, status: "Completed", buyer_completed: true }
							: offer
					)
				);
				setTab("Completed");
			} else {
				setOffers((prev) =>
					prev.map((offer) =>
						offer.id === offerId ? { ...offer, buyer_completed: true } : offer
					)
				);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleDelete = async (offerId: number) => {
		try {
			const res = await fetch(`/api/offers/${offerId}/delete-pending`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(res.statusText);
			setOffers((prev) => prev.filter((offer) => offer.id !== offerId));
		} catch (err) {
			console.error(err);
		}
	};

	const handleCancel = async (offerId: number) => {
		try {
			const res = await fetch(`/api/offers/${offerId}/cancel-accepted`, {
				method: "PUT",
			});
			if (!res.ok) throw new Error(res.statusText);
			setOffers((prev) =>
				prev.map((offer) =>
					offer.id === offerId ? { ...offer, status: "Cancelled" } : offer
				)
			);
			setTab("Cancelled");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Card key={offer.id} className="flex flex-col">
			<CardHeader>
				<div className="flex items-center space-x-4">
					<Link to={`/item/${offer.item_id}`}>
						<img
							src={`data:image/jpeg;base64,${offer.item_picture_data}`}
							alt={offer.item_title}
							className="w-32 h-32 object-cover rounded"
						/>
					</Link>
					<div>
						<CardTitle className="text-2xl">{offer.item_title}</CardTitle>
						<Link to={`/profile/${offer.seller_id}`}>
							<div className="flex items-center space-x-2">
								<Avatar className="w-10 h-10">
									<AvatarImage
										src={offer.seller_profile_picture_url}
										alt={offer.seller_name}
										referrerPolicy="no-referrer"
									/>
									<AvatarFallback>
										{getInitials(offer.seller_name)}
									</AvatarFallback>
								</Avatar>
								<span className="text-lg">{offer.seller_name}</span>
							</div>
						</Link>
						<p className="text-lg text-gray-500">
							Offered on{" "}
							{new Date(offer.created_at).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</p>
					</div>
				</div>
			</CardHeader>

			<CardContent className="mt-4 flex-1">
				<p className="text-lg">List Price: ${offer.item_price.toFixed(2)}</p>
				<p className="text-lg">Your Offer: ${offer.offer_amount.toFixed(2)}</p>
			</CardContent>

			<CardFooter className="flex flex-col items-start justify-between">
				<div className="flex items-start justify-between w-full">
					<Badge className={`text-base ${badgeClasses[offer.status]}`}>
						{offer.status}
					</Badge>
					{/* Accepted Button*/}
					{offer.status === "Accepted" && !offer.buyer_completed && (
						<div className="flex items-center space-x-2">
							{/* Buyer still needs to complete */}
							<Button
								size="sm"
								className="bg-blue-600 hover:bg-blue-500 text-white"
								onClick={() => handleComplete(offer.id, offer.seller_completed)}
							>
								Mark Completed
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onClick={() => handleCancel(offer.id)}
							>
								Cancel
							</Button>
						</div>
					)}
					{/* Pending Buttons */}
					{offer.status === "Pending" && (
						<div className="flex space-x-2">
							<Button
								size="sm"
								variant="destructive"
								onClick={() => handleDelete(offer.id)}
							>
								Delete
							</Button>
						</div>
					)}
				</div>

				{/* Accepted Contact Info + Completion Status */}
				{offer.status === "Accepted" && (
					<div className="flex flex-col space-y-2">
						<div className="mt-2 text-gray-700">
							<p className="font-medium">Contact Buyer:</p>
							{offer.seller_contact && <p>{offer.seller_contact}</p>}
						</div>
						{/* Buyer has completed, waiting on seller */}
						{offer.buyer_completed && !offer.seller_completed && (
							<span className="text-gray-500">
								You've marked this complete. Waiting for seller...
							</span>
						)}

						{/* Seller has completed, waiting on buyer */}
						{!offer.buyer_completed && offer.seller_completed && (
							<span className="text-gray-500">
								Seller has marked this complete. Please finalize.
							</span>
						)}
						{/* Waiting on both buyer and seller */}
						{!offer.seller_completed && !offer.buyer_completed && (
							<span className="text-gray-500">
								After finishing the transaction, please mark this offer as
								completed.
							</span>
						)}
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
