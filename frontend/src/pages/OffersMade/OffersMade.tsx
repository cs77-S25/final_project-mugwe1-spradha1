import { useEffect, useState } from "react";
import { OfferMade } from "@/types/OfferMade";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/UserContext";
import OfferMadeCard from "@/pages/OffersMade/OfferMadeCard";

type Tab = "Pending" | "Accepted" | "Declined" | "Completed" | "Cancelled";

export default function OffersMade() {
	const [offers, setOffers] = useState<OfferMade[]>([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState<Tab>("Pending");

	const userAuth = useAuth();
	const userId = userAuth.user?.id;

	useEffect(() => {
		if (!userId) return;
		(async () => {
			try {
				const res = await fetch(`/api/user/${userId}/offers-made`);
				if (!res.ok) throw new Error(res.statusText);
				const data: OfferMade[] = await res.json();
				setOffers(data);
				console.log(data);
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
				<p className="text-xl">Loading offers...</p>
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
		<div className="min-h-screen p-8 bg-gray-50 dark:bg-black">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-5xl font-bold mb-4">My Offers Made</h1>
				<h2 className="text-2xl mb-6">
					See the current progress of your offers
				</h2>

				<Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
					<TabsList className="mb-4 dark:bg-gray-800 dark:hover:bg-gray-900">
						<TabsTrigger className="dark:hover:ring-1 dark:hover:ring-[#DB572C]" value="Pending">Pending</TabsTrigger>
						<TabsTrigger className="dark:hover:ring-1 dark:hover:ring-[#DB572C]" value="Accepted">Accepted</TabsTrigger>
						<TabsTrigger className="dark:hover:ring-1 dark:hover:ring-[#DB572C]" value="Declined">Declined</TabsTrigger>
						<TabsTrigger className="dark:hover:ring-1 dark:hover:ring-[#DB572C]" value="Completed">Completed</TabsTrigger>
						<TabsTrigger className="dark:hover:ring-1 dark:hover:ring-[#DB572C]" value="Cancelled">Cancelled</TabsTrigger>
					</TabsList>

					<TabsContent value="Pending">
						<h1 className="text-4xl font-semibold text-center mb-4">
							Pending Offers
						</h1>
						{filtered.length === 0 ? (
							<p className="text-center text-xl">No pending offers.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filtered.map((offer) => (
									<OfferMadeCard
										key={offer.id}
										offer={offer}
										setOffers={setOffers}
										setTab={setTab}
									/>
								))}
							</div>
						)}
					</TabsContent>

					<TabsContent value="Accepted">
						<h1 className="text-4xl font-semibold text-center mb-4">
							Accepted Offers
						</h1>
						{filtered.length === 0 ? (
							<p className="text-center text-xl">No accepted offers.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filtered.map((offer) => (
									<OfferMadeCard
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
						<h1 className="text-4xl font-semibold text-center mb-4">
							Declined Offers
						</h1>
						{filtered.length === 0 ? (
							<p className="text-center text-lg">No declined offers.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filtered.map((offer) => (
									<OfferMadeCard
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
						<h1 className="text-4xl font-semibold text-center mb-4">
							Completed Offers
						</h1>
						{filtered.length === 0 ? (
							<p className="text-center text-lg">No completed offers.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filtered.map((offer) => (
									<OfferMadeCard
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
									<OfferMadeCard
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
