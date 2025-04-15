import { StoreItemCard } from "@/pages/store/storeItemCard";
import { StoreItem } from "@/types/StoreItem";
import { useEffect, useState } from "react";

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

import { X, Plus } from "lucide-react";

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

export default function Store() {
	// Filter states
	const [selectedColors, setSelectedColors] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
	const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch store items from the backend
		const fetchStoreItems = async () => {
			try {
				const response = await fetch("http://127.0.0.1:5000/store-items");
				const data = await response.json();
				console.log("Fetched store items:", data);
				setStoreItems(data);
			} catch (error) {
				console.error("Error fetching store items:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStoreItems();
	}, []);

	// Filter Logic: Show items that match any selected groups, or all if none are selected
	const filteredItems = storeItems.filter((item) => {
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

				<div className="flex justify-between items-center mb-4">
					{/* Filter Dropdowns */}
					<div className="flex gap-4">
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
					<button className="flex gap-2 px-4 py-2 bg-[#A11833] text-white rounded hover:bg-[#3F030F] hover:text-white mr-8">
						<Plus size={24} className="min-w-4" />
						List Item
					</button>
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
