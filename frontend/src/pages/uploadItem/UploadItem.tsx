"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
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

// Define validation schema via Zod
const storeItemSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	// We need price to be a string to help with the regex validation
	// but we will convert it to a number before sending it to the backend
	price: z
		.string()
		.regex(/^\d+\.\d{2}$/, {
			message: "Price must be a positive number with exactly 2 decimal places",
		})
		.refine((num) => parseFloat(num) > 0, {
			message: "Price must be greater than zero",
		}),
	picture_data: z.custom<File>((value) => value instanceof File, {
		message: "Picture is required",
	}),
	category: z.enum(
		["Jackets", "Tops", "Bottoms", "Shoes", "Hats", "Accessories", "Misc"],
		{
			errorMap: () => ({ message: "Please select a category" }),
		}
	),
	gender: z.enum(["Men", "Women", "Gender Neutral"], {
		errorMap: () => ({ message: "Please select a condition" }),
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
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<StoreItemFormValues>({
		resolver: zodResolver(storeItemSchema),
	});

	const onSubmit = async (data: StoreItemFormValues) => {
		console.log(data);
	};

	return (
		<div className="flex flex-col items-center justify-center mt-4">
			<div className="text-3xl text-bold">Item Upload</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6 max-w-xl mx-auto p-4"
			>
				{/* Title */}
				<div>
					<label className="block text-base font-medium mb-1">Title</label>
					<Input placeholder="Item title" {...register("title")} />
					{errors.title && (
						<p className="text-red-500 text-base mt-1">
							{errors.title.message}
						</p>
					)}
				</div>

				{/* Description */}
				<div>
					<label className="block text-base font-medium mb-1">
						Description
					</label>
					<Textarea
						placeholder="Item description"
						{...register("description")}
					/>
					{errors.description && (
						<p className="text-red-500 text-base mt-1">
							{errors.description.message}
						</p>
					)}
				</div>

				{/* Price */}
				<div>
					<label className="block text-base font-medium mb-1">Price</label>
					<Input placeholder="Price" {...register("price")} />
					{errors.price && (
						<p className="text-red-500 text-base mt-1">
							{errors.price.message}
						</p>
					)}
				</div>

				{/* Picture Upload */}
				<div>
					<label className="block text-base font-medium mb-1">Picture</label>
					<Input
						type="file"
						accept="image/*"
						// We use a custom onChange to capture the File from event.target.files[0]
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							if (e.target.files && e.target.files[0]) {
								setValue("picture_data", e.target.files[0], {
									shouldValidate: true,
								});
							}
						}}
						className="block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:font-semibold file:bg-gray-50"
					/>
					{errors.picture_data && (
						<p className="text-red-500 mt-1">
							{errors.picture_data.message as string}
						</p>
					)}
				</div>

				{/* Category */}
				<div>
					<label className="block text-base font-medium mb-1">Category</label>
					<Controller
						control={control}
						name="category"
						render={({ field }) => (
							<Select
								onValueChange={field.onChange}
								value={field.value}
								defaultValue=""
							>
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
						)}
					/>
					{errors.category && (
						<p className="text-red-500 mt-1">{errors.category.message}</p>
					)}
				</div>

				{/* Gender */}
				<div>
					<label className="block text-base font-medium mb-1">Gender</label>
					<Controller
						control={control}
						name="gender"
						render={({ field }) => (
							<Select
								onValueChange={field.onChange}
								value={field.value}
								defaultValue=""
							>
								<SelectTrigger>
									<SelectValue placeholder="Select gender" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Mens">Men</SelectItem>
									<SelectItem value="Womens">Women</SelectItem>
									<SelectItem value="Gender Neutral">Gender Neutral</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.condition && (
						<p className="text-red-500 mt-1">{errors.condition.message}</p>
					)}
				</div>

				{/* Condition */}
				<div>
					<label className="block text-base font-medium mb-1">Condition</label>
					<Controller
						control={control}
						name="condition"
						render={({ field }) => (
							<Select
								onValueChange={field.onChange}
								value={field.value}
								defaultValue=""
							>
								<SelectTrigger>
									<SelectValue placeholder="Select condition" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Excellent">Excellent</SelectItem>
									<SelectItem value="Good">Good</SelectItem>
									<SelectItem value="Fair">Fair</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.condition && (
						<p className="text-red-500 text-base mt-1">
							{errors.condition.message}
						</p>
					)}
				</div>

				{/* Color */}
				<div>
					<label className="block text-base font-medium mb-1">Color</label>
					<Controller
						control={control}
						name="color"
						render={({ field }) => (
							<Select
								onValueChange={field.onChange}
								value={field.value}
								defaultValue=""
							>
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
						)}
					/>
					{errors.color && (
						<p className="text-red-500 text-base mt-1">
							{errors.color.message}
						</p>
					)}
				</div>

				{/* Size */}
				<div>
					<label className="block text-base font-medium mb-1">Size</label>
					<Input placeholder="Size" {...register("size")} />
					{errors.size && (
						<p className="text-red-500 text-base mt-1">{errors.size.message}</p>
					)}
				</div>

				<Button type="submit" className="mt-4 w-full">
					Submit
				</Button>
			</form>
		</div>
	);
}
