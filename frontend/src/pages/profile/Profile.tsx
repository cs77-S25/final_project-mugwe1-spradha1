import { useParams } from "react-router-dom";
import { StoreItem } from "@/types/StoreItem";
import { User } from "@/types/User";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreItemCard } from "@/pages/store/storeItemCard";

export default function Profile() {
	const params = useParams();
	// Will be used later to fetch user data
	if (!params.userId) {
		return <div>User not found</div>;
	}
	const [profileUser, setProfileUser] = useState<User | null>(null);
	const [profileStoreItems, setProfileStoreItems] = useState<StoreItem[]>([]);
	const [loading, setLoading] = useState(true);
	const userId = parseInt(params.userId);

	useEffect(() => {
		window.scrollTo(0, 0);

		const fetchProfileUser = async () => {
			try {
				const response = await fetch(`/api/user/${userId}`);
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				const data = await response.json();
				setProfileUser(data);
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		};

		const fetchProfileStoreItems = async () => {
			try {
				const response = await fetch(`/api/user/${userId}/store-items`);
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				const data = await response.json();
				setProfileStoreItems(data);
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		};

		setLoading(true);
		fetchProfileUser();
		fetchProfileStoreItems();
		setLoading(false);
	}, [userId]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-xl">Loading...</p>
			</div>
		);
	}

	if (!profileUser) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-xl">User not found</p>
			</div>
		);
	}

	return (
		<div className="overflow-y-auto p-4 overscroll-none">
			<div className="max-w-7xl mx-auto">
				<div className="text-5xl font-bold mb-2">Profile</div>
				<div className="flex items-center mb-4">
					<Avatar className="h-20 w-20">
						<AvatarImage
							src={profileUser.profile_picture_url}
							alt="User Avatar"
							referrerPolicy="no-referrer"
						/>
						<AvatarFallback>SP</AvatarFallback>
					</Avatar>
					<div>
						<div className="text-lg font-bold ml-4">{profileUser.name}</div>
					</div>
				</div>
				<div className="text-2xl font-bold mb-4">Bio</div>
				<div className="text-base mb-4 w-1/3">
					{profileUser.bio.length > 0 ? profileUser.bio : "No bio written yet"}
				</div>
				<div className="text-2xl font-bold mb-4">Stats</div>
				<div className="grid grid-cols-4 gap-4 w-full mt-4">
					<div className="flex flex-col items-center">
						<p className="text-xl font-bold">10</p>
						<p className="text-lg text-muted-foreground">Past Sales</p>
					</div>
					<div className="flex flex-col items-center">
						<p className="text-xl font-bold">10</p>
						<p className="text-lg text-muted-foreground">Items on Sale</p>
					</div>
					<div className="flex flex-col items-center">
						<p className="text-xl font-bold">10</p>
						<p className="text-lg text-muted-foreground">Purchases</p>
					</div>
					<div className="flex flex-col items-center">
						<p className="text-xl font-bold">10</p>
						<p className="text-lg text-muted-foreground">Forum Posts</p>
					</div>
				</div>
				{/* Tabbed Interface */}
				<Tabs defaultValue="selling" className="mt-8">
					<TabsList>
						<TabsTrigger value="selling">Selling</TabsTrigger>
						<TabsTrigger value="liked">Liked</TabsTrigger>
						<TabsTrigger value="forum">Forum</TabsTrigger>
					</TabsList>
					<TabsContent value="selling">
						{profileStoreItems.length === 0 && (
							<div className="mt-4 text-center">No listed store items yet.</div>
						)}
						<div className="grid grid-cols-4 gap-4 mt-4">
							{profileStoreItems.map((item) => (
								<StoreItemCard key={item.id} storeItem={item} />
							))}
						</div>
					</TabsContent>
					<TabsContent value="liked">
						<div className="mt-4 text-center">No liked store items yet.</div>
					</TabsContent>
					<TabsContent value="forum">
						<div className="mt-4 text-center">No forum posts yet.</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
