import React from "react";
import { Link } from "react-router-dom";
import { OfferReceived } from "@/types/OfferReceived";
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
	Completed: "bg-blue-600 text-white",
	Cancelled: "bg-red-600 text-white",
};

export default function OfferReceivedCard({
	offer,
	setOffers,
	setTab,
}: {
	offer: OfferReceived;
	setOffers: React.Dispatch<React.SetStateAction<OfferReceived[]>>;
	setTab: React.Dispatch<React.SetStateAction<Tab>>;
}) {
	const handleAccept = async (offerId: number) => {
		try {
			const res = await fetch(`/api/offers/${offerId}/accept`, {
				method: "PUT",
			});
			if (!res.ok) throw new Error(res.statusText);
			setOffers((prev) =>
				prev.map((offer) =>
					offer.id === offerId ? { ...offer, status: "Accepted" } : offer
				)
			);
			setTab("Accepted");
			// load contact info
			const data = await res.json();
			setOffers((prev) =>
				prev.map((offer) =>
					offer.id === offerId
						? { ...offer, buyer_contact: data.buyer_contact }
						: offer
				)
			);
		} catch (err) {
			console.error(err);
		}
	};

	const handleDecline = async (offerId: number) => {
		try {
			const res = await fetch(`/api/offers/${offerId}/decline`, {
				method: "PUT",
			});
			if (!res.ok) throw new Error(res.statusText);
			setOffers((prev) =>
				prev.map((offer) =>
					offer.id === offerId ? { ...offer, status: "Declined" } : offer
				)
			);
			setTab("Declined");
		} catch (err) {
			console.error(err);
		}
	};

	const handleComplete = async (offerId: number, buyer_completed: boolean) => {
		try {
			const res = await fetch(`/api/offers/${offerId}/complete-seller`, {
				method: "PUT",
			});
			if (!res.ok) throw new Error(res.statusText);

			if (buyer_completed) {
				// Set offer to completed and tab to completed
				setOffers((prev) =>
					prev.map((offer) =>
						offer.id === offerId
							? { ...offer, status: "Completed", seller_completed: true }
							: offer
					)
				);
				setTab("Completed");

				// For any other offers to the same item, set status to Declined locally
				const itemId = offer.item_id;
				setOffers((prev) =>
					prev.map((offer) =>
						offer.item_id === itemId && offer.id !== offerId
							? { ...offer, status: "Declined" }
							: offer
					)
				);
			} else {
				setOffers((prev) =>
					prev.map((offer) =>
						offer.id === offerId ? { ...offer, seller_completed: true } : offer
					)
				);
			}
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
						<Link to={`/profile/${offer.buyer_id}`}>
							<div className="flex items-center space-x-2">
								<Avatar className="w-10 h-10">
									<AvatarImage
										src={offer.buyer_profile_picture_url}
										alt={offer.buyer_name}
										referrerPolicy="no-referrer"
									/>
									<AvatarFallback>
										{getInitials(offer.buyer_name)}
									</AvatarFallback>
								</Avatar>
								<span className="text-lg">{offer.buyer_name}</span>
							</div>
						</Link>
						<p className="text-lg text-gray-500">
							Received on{" "}
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
				<p className="text-lg">
					Offer Amount: ${offer.offer_amount.toFixed(2)}
				</p>
			</CardContent>

			<CardFooter className="flex flex-col items-start justify-between">
				<div className="flex items-start justify-between w-full">
					<Badge className={`text-base ${badgeClasses[offer.status]}`}>
						{offer.status}
					</Badge>
					{/* Accepted Button*/}
					{offer.status === "Accepted" && !offer.seller_completed && (
						<div className="flex items-center space-x-2">
							{/* Seller still needs to complete */}
							{!offer.seller_completed && (
								<>
									<Button
										size="sm"
										className="bg-blue-600 hover:bg-blue-500 text-white"
										onClick={() =>
											handleComplete(offer.id, offer.buyer_completed)
										}
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
								</>
							)}
						</div>
					)}
					{/* Pending Buttons */}
					{offer.status === "Pending" && (
						<div className="flex space-x-2">
							<Button
								size="sm"
								onClick={() => handleAccept(offer.id)}
								className="bg-green-600 hover:bg-green-500"
							>
								Accept
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onClick={() => handleDecline(offer.id)}
							>
								Decline
							</Button>
						</div>
					)}
				</div>
				{/* Accepted Contact Info + Completion Status */}
				{offer.status === "Accepted" && (
					<div className="flex flex-col space-y-2">
						<div className="mt-2 text-gray-700">
							<p className="font-medium">Contact Buyer:</p>
							{offer.buyer_contact && <p>{offer.buyer_contact}</p>}
						</div>
						{/* Seller has completed, waiting on buyer */}
						{offer.seller_completed && !offer.buyer_completed && (
							<span className="text-gray-500">
								You’ve marked this complete. Waiting for buyer…
							</span>
						)}

						{/* Buyer has completed, waiting on seller */}
						{!offer.seller_completed && offer.buyer_completed && (
							<span className="text-gray-500">
								Buyer has marked this complete. Please finalize.
							</span>
						)}

						{/* Waiting on both */}
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
