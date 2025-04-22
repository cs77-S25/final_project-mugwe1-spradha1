// src/pages/OffersReceived.tsx
import { useEffect, useState } from "react";
import { OfferReceived } from "@/types/OfferReceived";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/UserContext";

import OfferReceivedCard from "@/pages/OffersReceived/OfferReceivedCard";

type Tab = "Pending" | "Accepted" | "Declined" | "Completed" | "Cancelled";

export default function OffersReceived() {
	const [offers, setOffers] = useState<OfferReceived[]>([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState<Tab>("Pending");

	const userAuth = useAuth();
	const userId = userAuth.user?.id;

	useEffect(() => {
		if (!userId) return;
		(async () => {
			try {
				const res = await fetch(`/api/user/${userId}/offers-received`);
				if (!res.ok) throw new Error(res.statusText);
				const data: OfferReceived[] = await res.json();
				setOffers(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		})();
	}, [userId]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-xl">Loading received offers...</p>
			</div>
		);
	}

	const filtered = offers.filter((offer) => {
		switch (tab) {
			case "Pending":
				return offer.status === "Pending";
			case "Accepted":
				return offer.status === "Accepted";
			case "Declined":
				return offer.status === "Declined";
			case "Completed":
				return offer.status === "Completed";
			case "Cancelled":
				return offer.status === "Cancelled";
			default:
				return false;
		}
	});

	return (
		<div className="min-h-screen p-8 bg-gray-50">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-5xl font-bold mb-4">Offers Received</h1>
				<h2 className="text-2xl mb-6">Find your next potential buyer</h2>

				<Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
					<TabsList className="mb-4">
						<TabsTrigger value="Pending">Pending</TabsTrigger>
						<TabsTrigger value="Accepted">Accepted</TabsTrigger>
						<TabsTrigger value="Declined">Declined</TabsTrigger>
						<TabsTrigger value="Completed">Completed</TabsTrigger>
						<TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
					</TabsList>

					<TabsContent value="Pending">
						<div className="text-4xl text-center font-semibold mb-4">
							Pending Offers
						</div>
						{filtered.length === 0 ? (
							<p className="text-center text-xl">No pending offers.</p>
						) : (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{filtered.map((offer) => (
										<OfferReceivedCard
											key={offer.id}
											offer={offer}
											setOffers={setOffers}
											setTab={setTab}
										/>
									))}
								</div>
							</>
						)}
					</TabsContent>

					<TabsContent value="Accepted">
						<div className="text-4xl text-center font-semibold mb-4">
							Accepted Offers
						</div>
						{filtered.length === 0 ? (
							<p className="text-center text-xl">No accepted offers.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filtered.map((offer) => (
									<OfferReceivedCard
										key={offer.id}
										offer={offer}
										setOffers={setOffers}
										setTab={setTab}
									/>
								))}
							</div>
						)}
					</TabsContent>

					<TabsContent value="Declined">
						<div className="text-4xl text-center font-semibold mb-4">
							Declined Offers
						</div>
						{filtered.length === 0 ? (
							<p className="text-center text-xl">No declined offers.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filtered.map((offer) => (
									<OfferReceivedCard
										key={offer.id}
										offer={offer}
										setOffers={setOffers}
										setTab={setTab}
									/>
								))}
							</div>
						)}
					</TabsContent>

					<TabsContent value="Completed">
						<div className="text-4xl text-center font-semibold mb-4">
							Completed Offers
						</div>
						{filtered.length === 0 ? (
							<p className="text-center text-xl">No completed offers.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filtered.map((offer) => (
									<OfferReceivedCard
										key={offer.id}
										offer={offer}
										setOffers={setOffers}
										setTab={setTab}
									/>
								))}
							</div>
						)}
					</TabsContent>

					<TabsContent value="Cancelled">
						<div className="text-4xl text-center font-semibold mb-4">
							Cancelled Offers
						</div>
						{filtered.length === 0 ? (
							<p className="text-center text-xl">No cancelled offers.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filtered.map((offer) => (
									<OfferReceivedCard
										key={offer.id}
										offer={offer}
										setOffers={setOffers}
										setTab={setTab}
									/>
								))}
							</div>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
