import React from "react";
import { useParams } from "react-router-dom";
import { StoreItem } from "@/types/StoreItem";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link } from "react-router-dom";

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

export default function Item() {
	const params = useParams();
	if (!params.itemId) {
		return <div>Item not found</div>;
	}
	const itemId = parseInt(params.itemId);
	const item = mockData.find((item) => item.id === itemId);
	if (!item) {
		return <div>Item not found</div>;
	}

	// Used to scroll automatically when routed
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="min-h-screen p-8 bg-gray-50">
			<div className="max-w-7xl mx-auto bg-white rounded-lg overflow-hidden border-2 border-black">
				<div className="flex">
					{/* Left: Item Image */}
					<div className="w-1/2">
						<img
							src={item.imageUrl}
							alt={item.title}
							className="w-full h-full object-cover"
						/>
					</div>
					{/* Right: Item Details */}
					<div className="w-1/2 p-6 flex flex-col">
						<h1 className="text-3xl font-bold mb-2">{item.title}</h1>
						<h2 className="text-xl mb-2">
							Seller:{" "}
							<Link to="/profile/1" className="underline">
								Summit
							</Link>
						</h2>
						<p className="text-gray-700 mb-4 text-xl">{item.description}</p>
						<p className="text-2xl font-semibold mb-4">
							${item.price.toFixed(2)}
						</p>
						<div className="flex items-center mb-4">
							<span className="text-gray-700 font-bold mr-2">Condition:</span>
							<span className="text-gray-700">{item.condition}</span>
						</div>
						<div className="flex items-center mb-4">
							<span className="text-gray-700 font-bold mr-2">Size:</span>
							<span className="text-gray-700">{item.size}</span>
						</div>
						<div className="flex items-center mb-4">
							<span className="text-gray-700 font-bold mr-2">Gender:</span>
							<span className="text-gray-700">{item.gender}</span>
						</div>
						<div className="flex items-center mb-4">
							<span className="text-gray-700 font-bold mr-2">Category:</span>
							<span className="text-gray-700">{item.category}</span>
						</div>
						<div className="flex items-center mb-4">
							<span className="text-gray-700 font-bold mr-2">Color:</span>
							<span className="text-gray-700">{item.color}</span>
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
