import { useParams } from "react-router-dom";
import { StoreItem } from "@/types/StoreItem";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreItemCard } from "@/pages/store/StoreItemCard";

// Mock Data until backend is ready

const mockData: StoreItem[] = [
	{
		id: 0,
		title: "Denim Jacket",
		description: "A rugged denim jacket perfect for layering.",
		price: 59.7,
		imageUrl:
			"https://media-photos.depop.com/b1/9830149/2568252837_2e9b7676448d487b812b9ee6cc8ae0d3/P0.jpg",
		category: "Jackets",
		gender: "Unisex",
		condition: "Good",
		color: "Blue",
		size: "M",
	},
	{
		id: 1,
		title: "Nivarna T-Shirt",
		description: "Classic t-shirt with a vintage Nivarna print.",
		price: 24.87,
		imageUrl:
			"https://media-photos.depop.com/b1/44252282/2491125869_bb0b743358624e60a174b362e9e016f8/P0.jpg",
		category: "Tops",
		gender: "Male",
		condition: "Excellent",
		color: "Black",
		size: "L",
	},
	{
		id: 2,
		title: "Cargo Pants",
		description: "Nice cargo pants with plenty of pockets.",
		price: 39.5,
		imageUrl:
			"https://media-photos.depop.com/b1/45444992/2563672660_1bba74165ced4226be6eee126ec1055b/P0.jpg",
		category: "Bottoms",
		gender: "Female",
		condition: "Fair",
		color: "Green",
		size: "S",
	},
	{
		id: 3,
		title: "Nike Airforce 1",
		description: "Old pair of Nike Airforce 1 sneakers.",
		price: 50.0,
		imageUrl:
			"https://media-photos.depop.com/b1/369353590/2564259976_78e7d32b29ee4357a684ca2206679ba5/P0.jpg",
		category: "Shoes",
		gender: "Unisex",
		condition: "Good",
		color: "White",
		size: "10",
	},
	{
		id: 4,
		title: "Basketball Hat",
		description: "Lakers basketball hat.",
		price: 14.0,
		imageUrl:
			"https://media-photos.depop.com/b1/50247183/2507444774_759d7406006c42a3a42ab050007195f7/P0.jpg",
		category: "Hats",
		gender: "Unisex",
		condition: "Good",
		color: "Purple",
		size: "",
	},
	{
		id: 5,
		title: "Leather Belt",
		description: "Leather belt with a sonic design.",
		price: 19.99,
		imageUrl:
			"https://media-photos.depop.com/b1/48864608/2557008258_38601450746d4fa7804a23e1216b1dee/P0.jpg",
		category: "Accessories",
		gender: "Male",
		condition: "Excellent",
		color: "Black",
		size: "",
	},
	{
		id: 6,
		title: "Tote Bag",
		description: "Tote bag with an anime print.",
		price: 15.99,
		imageUrl:
			"https://media-photos.depop.com/b1/318465847/2557750701_ebdd9ff7a2b442b8b00d416c7d6052b7/P0.jpg",
		category: "Misc",
		gender: "Unisex",
		condition: "Excellent",
		color: "Brown",
		size: "",
	},
	{
		id: 7,
		title: "Baggy Jeans",
		description: "Trendy baggy jeans for a casual look.",
		price: 30.99,
		imageUrl:
			"https://media-photos.depop.com/b1/457776392/2568029273_22e15114d14b46408954c73d42d0bdce/P5.jpg",
		category: "Bottoms",
		gender: "Female",
		condition: "Fair",
		color: "Blue",
		size: "",
	},
];

export default function Profile() {
	const params = useParams();
	// Will be used later to fetch user data
	if (!params.userId) {
		return <div>Item not found</div>;
	}

	return (
		<div className="overflow-y-auto p-4 overscroll-none">
			<div className="max-w-7xl mx-auto">
				<div className="text-5xl font-bold mb-2">Profile</div>
				<div className="flex items-center mb-4">
					<Avatar className="cursor-pointer h-20 w-20">
						<AvatarImage
							src="https://github.com/mountaint0p.png"
							alt="User Avatar"
						/>
						<AvatarFallback>SP</AvatarFallback>
					</Avatar>
					<div>
						<div className="text-lg font-bold ml-4">Summit Pradhan</div>
					</div>
				</div>
				<div className="text-2xl font-bold mb-4">Bio</div>
				<div className="text-base mb-4 w-1/3">
					Hi, I'm Summit! I love thrifting and finding unique pieces. I enjoy
					playing the guitar, cooking, and traveling.
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
						<div className="grid grid-cols-4 gap-4 mt-4">
							{mockData.map((item) => (
								<StoreItemCard key={item.id} storeItem={item} />
							))}
						</div>
					</TabsContent>
					<TabsContent value="liked">
						<div className="grid grid-cols-4 gap-4 mt-4">
							{[mockData[0], mockData[2], mockData[5]].map((item) => (
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
