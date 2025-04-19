"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { useAuth } from "@/context/UserContext";

import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 5000000;
const VALID_FILE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/heic",
];

// Define validation schema via Zod
const storeItemSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	// Price must be a string so regex can be applied. We convert it later.
	price: z
		.string()
		.regex(/^\d+\.\d{2}$/, {
			message: "Price must be a positive number with exactly 2 decimal places",
		})
		.refine((num) => parseFloat(num) > 0, {
			message: "Price must be greater than zero",
		}),
	picture_file: z
		.custom<File>((value) => value instanceof File, {
			message: "Picture is required",
		})
		.refine((file) => file?.size <= MAX_FILE_SIZE, `Max picture size is 5MB.`)
		.refine(
			(file) => VALID_FILE_TYPES.includes(file?.type),
			"Only .jpg, .jpeg, .png, .webp, and .heic formats are supported."
		),
	category: z.enum(
		["Jackets", "Tops", "Bottoms", "Shoes", "Hats", "Accessories", "Misc"],
		{
			errorMap: () => ({ message: "Please select a category" }),
		}
	),
	gender: z.enum(["Men", "Women", "Gender Neutral"], {
		errorMap: () => ({ message: "Please select a gender" }),
	}),
	condition: z.enum(["Excellent", "Good", "Fair"], {
		errorMap: () => ({ message: "Please select a condition" }),
	}),
	color: z.enum(
		[
			"Red",
			"Blue",
			"Green",
			"Yellow",
			"Black",
			"White",
			"Purple",
			"Pink",
			"Orange",
			"Brown",
		],
		{ errorMap: () => ({ message: "Please select a color" }) }
	),
	size: z.string().min(1, "Size is required"),
});

type StoreItemFormValues = z.infer<typeof storeItemSchema>;

export default function UploadItem() {
	const form = useForm<StoreItemFormValues>({
		resolver: zodResolver(storeItemSchema),
		defaultValues: {
			title: "",
			description: "",
			price: "",
			picture_file: undefined,
			category: undefined,
			gender: undefined,
			condition: undefined,
			color: undefined,
			size: "",
		},
	});

	// Auth context
	const userAuth = useAuth();

	// keep track of submission status
	const { isSubmitting } = form.formState;

	// Navigate
	const navigate = useNavigate();

	const onSubmit = async (data: StoreItemFormValues) => {
		// Using formData to handle file upload
		const formData = new FormData();

		if (!userAuth || !userAuth.user) {
			console.error("User not authenticated");
			return;
		}

		// Append text fields
		formData.append("user_id", userAuth.user.id.toString());
		formData.append("title", data.title);
		formData.append("description", data.description);
		formData.append("price", parseFloat(data.price).toString());
		formData.append("category", data.category);
		formData.append("gender", data.gender);
		formData.append("condition", data.condition);
		formData.append("color", data.color);
		formData.append("size", data.size);

		// Append the file directly
		formData.append("picture_file", data.picture_file);

		try {
			const response = await fetch("/api/store-items", {
				method: "POST",
				body: formData,
			});
			if (!response.ok) {
				throw new Error("Failed to upload item");
			}

			// On success, redirect to the store page
			navigate("/store");
		} catch (error) {
			console.error("Error uploading item:", error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center mt-4">
			<div className="text-3xl font-bold">Item Upload</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 max-w-xl mx-auto p-4"
				>
					{/* Title */}
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="ex: 'Super cool jacket'" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Description */}
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="ex: 'Please buy this super cool jacket 🥺'"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Price */}
					<FormField
						control={form.control}
						name="price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Price</FormLabel>
								<FormControl>
									<Input placeholder="$$$" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Picture Upload */}
					<FormField
						control={form.control}
						name="picture_file"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Picture</FormLabel>
								<FormControl>
									<Input
										type="file"
										accept="image/*"
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											if (e.target.files && e.target.files[0]) {
												field.onChange(e.target.files[0]);
											}
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Category */}
					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder="Select a category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Jackets">Jackets</SelectItem>
											<SelectItem value="Tops">Tops</SelectItem>
											<SelectItem value="Bottoms">Bottoms</SelectItem>
											<SelectItem value="Shoes">Shoes</SelectItem>
											<SelectItem value="Hats">Hats</SelectItem>
											<SelectItem value="Accessories">Accessories</SelectItem>
											<SelectItem value="Misc">Misc</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Gender */}
					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Gender</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder="Select gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Men">Men</SelectItem>
											<SelectItem value="Women">Women</SelectItem>
											<SelectItem value="Gender Neutral">
												Gender Neutral
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Condition */}
					<FormField
						control={form.control}
						name="condition"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Condition</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder="Select condition" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Excellent">Excellent</SelectItem>
											<SelectItem value="Good">Good</SelectItem>
											<SelectItem value="Fair">Fair</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Color */}
					<FormField
						control={form.control}
						name="color"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Color</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder="Select color" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Red">Red</SelectItem>
											<SelectItem value="Blue">Blue</SelectItem>
											<SelectItem value="Green">Green</SelectItem>
											<SelectItem value="Yellow">Yellow</SelectItem>
											<SelectItem value="Black">Black</SelectItem>
											<SelectItem value="White">White</SelectItem>
											<SelectItem value="Purple">Purple</SelectItem>
											<SelectItem value="Pink">Pink</SelectItem>
											<SelectItem value="Orange">Orange</SelectItem>
											<SelectItem value="Brown">Brown</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Size */}
					<FormField
						control={form.control}
						name="size"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Size</FormLabel>
								<FormControl>
									<Input placeholder="Size" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
						{isSubmitting && <Loader2 className="animate-spin" />}
						{isSubmitting ? "Submitting..." : "Submit"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
