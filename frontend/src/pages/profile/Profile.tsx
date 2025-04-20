import { useParams } from "react-router-dom";
import { StoreItem } from "@/types/StoreItem";
import { User } from "@/types/User";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreItemCard } from "@/pages/store/storeItemCard";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/context/UserContext";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
	const params = useParams();
	if (!params.userId) {
		return <div>User not found</div>;
	}

	// States
	const [profileUser, setProfileUser] = useState<User | null>(null);
	const [profileStoreItems, setProfileStoreItems] = useState<StoreItem[]>([]);
	const [profileLikedItems, setProfileLikedItems] = useState<StoreItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [isOwner, setIsOwner] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newBio, setNewBio] = useState("");
	const userId = parseInt(params.userId);

	const userAuth = useAuth();

	useEffect(() => {
		// Scroll to top on page load, workaround for react-router-dom
		window.scrollTo(0, 0);

		const fetchProfileUser = async () => {
			try {
				const response = await fetch(`/api/user/${userId}`);
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				const data: User = await response.json();
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

		const fetchProfileLikedItems = async () => {
			try {
				const response = await fetch(`/api/user/${userId}/liked-items`);
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				const data = await response.json();
				setProfileLikedItems(data);
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		};

		setLoading(true);
		fetchProfileUser();
		fetchProfileStoreItems();
		fetchProfileLikedItems();
		setLoading(false);
	}, [userId]);

	// When profileUser loads, initialize bio state
	useEffect(() => {
		if (profileUser) {
			setNewBio(profileUser.bio || "");
		}
	}, [profileUser]);

	// Check if the logged-in user is the owner of the profile
	useEffect(() => {
		if (userAuth.user && userAuth.user.id === userId) {
			setIsOwner(true);
		}
	}, [userAuth, userId]);

	const handleSaveBio = async () => {
		try {
			const response = await fetch(`/api/user/${userId}/bio`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ bio: newBio }),
			});
			if (!response.ok) throw new Error(response.statusText);
			// update local state
			setProfileUser((prev) => (prev ? { ...prev, bio: newBio } : prev));
			setIsDialogOpen(false);
		} catch (error) {
			console.error("Failed to update bio:", error);
		}
	};

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
						<AvatarFallback>{getInitials(profileUser.name)}</AvatarFallback>
					</Avatar>
					<div className="ml-4 flex items-center space-x-2">
						<div className="text-lg font-bold">{profileUser.name}</div>
						{/* If the user is the owner, show the edit button */}
						{isOwner && (
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger asChild>
									<Button
										size="sm"
										variant={"secondary"}
										className="border-2 border-gray-500"
									>
										Edit Profile
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Edit Profile</DialogTitle>
										<DialogDescription>
											Edit your profile bio below.
										</DialogDescription>
									</DialogHeader>
									<Textarea
										value={newBio}
										onChange={(e) => setNewBio(e.target.value)}
										rows={4}
										className="w-full"
									/>
									<DialogFooter>
										<Button onClick={handleSaveBio}>Save</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						)}
					</div>
				</div>

				{/*User bio */}
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

				{/* Tabbed Interface*/}
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
						{profileLikedItems.length === 0 && (
							<div className="mt-4 text-center">No liked store items yet.</div>
						)}
						<div className="grid grid-cols-4 gap-4 mt-4">
							{profileLikedItems.map((item) => (
								<StoreItemCard key={item.id} storeItem={item} />
							))}
						</div>
					</TabsContent>
					<TabsContent value="forum">
						<div className="mt-4 text-center">No forum posts yet.</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
