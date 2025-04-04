import { StoreItemCard } from "@/pages/store/storeItemCard";
import { StoreItem } from "@/types/StoreItem";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuCheckboxItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { X } from "lucide-react";

interface DropdownMenuColorsProps {
	selectedColors: string[];
	setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DropdownMenuColors({
	selectedColors,
	setSelectedColors,
}: DropdownMenuColorsProps) {
	const colorOptions = [
		{ name: "Red", value: "red" },
		{ name: "Green", value: "green" },
		{ name: "Blue", value: "blue" },
		{ name: "Yellow", value: "yellow" },
		{ name: "Purple", value: "purple" },
		{ name: "Orange", value: "orange" },
		{ name: "Pink", value: "pink" },
		{ name: "Brown", value: "brown" },
		{ name: "Gray", value: "gray" },
		{ name: "Black", value: "black" },
		{ name: "White", value: "white" },
	];

	const toggleColor = (color: string) => {
		if (selectedColors.includes(color)) {
			setSelectedColors(selectedColors.filter((c) => c !== color));
		} else {
			setSelectedColors([...selectedColors, color]);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="lg"
					className={`text-base border-1 border-black ${
						selectedColors.length > 0 ? "font-extrabold" : ""
					} ${selectedColors.length > 0 ? "bg-red-100" : ""}
					`}
				>
					Color
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Select Colors</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{colorOptions.map((color) => (
					<DropdownMenuCheckboxItem
						key={color.name}
						checked={selectedColors.includes(color.name)}
						onCheckedChange={() => toggleColor(color.name)}
						onSelect={(e) => e.preventDefault()}
					>
						<div className="flex items-center space-x-2">
							<span
								className="w-3 h-3 rounded-full border-1 border-black"
								style={{ backgroundColor: color.value }}
							/>
							<span>{color.name}</span>
						</div>
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
interface DropdownMenuCategoryProps {
	selectedCategories: string[];
	setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DropdownMenuCategory({
	selectedCategories,
	setSelectedCategories,
}: DropdownMenuCategoryProps) {
	const categoryOptions = [
		"Jackets",
		"Tops",
		"Bottoms",
		"Shoes",
		"Hats",
		"Accessories",
		"Misc",
	];

	const toggleCategory = (category: string) => {
		if (selectedCategories.includes(category)) {
			setSelectedCategories(selectedCategories.filter((c) => c !== category));
		} else {
			setSelectedCategories([...selectedCategories, category]);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="lg"
					className={`text-base border-1 border-black ${
						selectedCategories.length > 0 ? "font-extrabold" : ""
					} ${selectedCategories.length > 0 ? "bg-red-100" : ""}
					`}
				>
					Category
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Select Category</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{categoryOptions.map((category) => (
					<DropdownMenuCheckboxItem
						key={category}
						checked={selectedCategories.includes(category)}
						onCheckedChange={() => toggleCategory(category)}
						onSelect={(e) => e.preventDefault()}
					>
						<div className="flex items-center space-x-2">
							<span>{category}</span>
						</div>
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

interface DropdownMenuConditionProps {
	selectedConditions: string[];
	setSelectedConditions: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DropdownMenuCondition({
	selectedConditions,
	setSelectedConditions,
}: DropdownMenuConditionProps) {
	const conditionOptions = ["Excellent", "Good", "Fair"];

	const toggleCondition = (condition: string) => {
		if (selectedConditions.includes(condition)) {
			setSelectedConditions(selectedConditions.filter((c) => c !== condition));
		} else {
			setSelectedConditions([...selectedConditions, condition]);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="lg"
					className={`text-base border-1 border-black ${
						selectedConditions.length > 0 ? "font-extrabold" : ""
					} ${selectedConditions.length > 0 ? "bg-red-100" : ""}
					`}
				>
					Condition
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Select Condition</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{conditionOptions.map((condition) => (
					<DropdownMenuCheckboxItem
						key={condition}
						checked={selectedConditions.includes(condition)}
						onCheckedChange={() => toggleCondition(condition)}
						onSelect={(e) => e.preventDefault()}
					>
						<div className="flex items-center space-x-2">
							<span>{condition}</span>
						</div>
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

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

export default function Store() {
	// Filter states
	const [selectedColors, setSelectedColors] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

	// Extend the mockData by repeating it 3 times
	const extendedMockData = [...mockData, ...mockData, ...mockData];

	// Filter Logic: Show items that match any selected groups, or all if none are selected
	const filteredItems = extendedMockData.filter((item) => {
		const colorMatch =
			selectedColors.length === 0 || selectedColors.includes(item.color);
		const categoryMatch =
			selectedCategories.length === 0 ||
			selectedCategories.includes(item.category);
		const conditionMatch =
			selectedConditions.length === 0 ||
			selectedConditions.includes(item.condition);
		return colorMatch && categoryMatch && conditionMatch;
	});

	return (
		<div className="overflow-y-auto p-4 overscroll-none">
			<div className="max-w-7xl mx-auto">
				<div className="text-5xl font-bold mb-2">Swycle Store</div>
				<div className="text-2xl mb-4">
					Find your next favorite piece at Swycle!
				</div>

				{/* Filter Dropdowns */}
				<div className="flex gap-4 mb-4">
					<DropdownMenuColors
						selectedColors={selectedColors}
						setSelectedColors={setSelectedColors}
					/>
					<DropdownMenuCategory
						selectedCategories={selectedCategories}
						setSelectedCategories={setSelectedCategories}
					/>
					<DropdownMenuCondition
						selectedConditions={selectedConditions}
						setSelectedConditions={setSelectedConditions}
					/>
				</div>

				{/* Filter Badges */}
				<div className="flex flex-wrap gap-2 mb-4">
					{selectedColors.map((color) => (
						<Badge
							key={`color-${color}`}
							className="flex items-center p-1 text-base"
							variant={"secondary"}
						>
							{color}
							<button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedColors((prev) => prev.filter((c) => c !== color));
								}}
								className="ml-1"
							>
								<X size={16} />
							</button>
						</Badge>
					))}
					{selectedCategories.map((category) => (
						<Badge
							key={`color-${category}`}
							className="flex items-center p-1 text-base"
							variant={"secondary"}
						>
							{category}
							<button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedCategories((prev) =>
										prev.filter((c) => c !== category)
									);
								}}
								className="ml-1"
							>
								<X size={16} />
							</button>
						</Badge>
					))}
					{selectedConditions.map((condition) => (
						<Badge
							key={`color-${condition}`}
							className="flex items-center p-1 text-base"
							variant={"secondary"}
						>
							{condition}
							<button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedConditions((prev) =>
										prev.filter((c) => c !== condition)
									);
								}}
								className="ml-1"
							>
								<X size={16} />
							</button>
						</Badge>
					))}
				</div>

				{/* Items */}
				<div className="grid grid-cols-4">
					{filteredItems.map((item, index) => (
						<StoreItemCard key={index} storeItem={item} />
					))}
				</div>
			</div>
		</div>
	);
}
