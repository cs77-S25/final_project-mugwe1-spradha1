import { useEffect, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import FormSidebar from "./FormSidebar";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
	CategoryType,
	categoryColors,
	defaultColors,
	ForumPost,
} from "./ForumConstants";
import NewPostForm from "./NewForumPostForm";
import { formatDistanceToNow, format} from 'date-fns';

export default function ForumContent() {
	const [posts, setPosts] = useState<ForumPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
		[]
	);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [showNewPostForm, setShowNewPostForm] = useState(false);

	const fetchPosts = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch("/api/forum/posts", { credentials: "include" });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data: ForumPost[] = await res.json();
			setPosts(
				data.sort(
					(a, b) =>
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				)
			);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const displayedPosts = posts.filter((p) => {
		const okCat =
			selectedCategories.length === 0 ||
			selectedCategories.includes(p.category);
		const term = searchTerm.toLowerCase().trim();
		const okSearch =
			term === "" ||
			p.title.toLowerCase().includes(term) ||
			p.content.toLowerCase().includes(term) ||
			p.author_name.toLowerCase().includes(term);
		return okCat && okSearch;
	});

	return (
		<div className="flex h-screen">
			{/* Sidebar area */}
			<Sidebar>
				<FormSidebar
					selectedCategories={selectedCategories}
					onCategoryChange={setSelectedCategories}
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
					collapsed={isCollapsed}
					setCollapsed={setIsCollapsed}
				/>
			</Sidebar>
			<div className="flex-1 bg-white dark:bg-black h-full p-6 overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-5xl font-bold">Forum</h1>
					<button
						className="flex gap-2 px-4 py-2 bg-[#A11833] text-white rounded hover:bg-[#3F030F] cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-800 hover:text-[#dbb52c] transition-all duration-600 ease-in-out"
						onClick={() => setShowNewPostForm(true)}
					>
						<Plus size={24} className="min-w-[24px]" />
						New Post
					</button>
				</div>
				<h2 className="text-2xl mb-6">Discuss fashion with fellow students</h2>

				{showNewPostForm && (
					<NewPostForm
						onPostCreated={() => {
							setShowNewPostForm(false);
							fetchPosts();
						}}
						onCancel={() => setShowNewPostForm(false)}
					/>
				)}
				{loading && <p>Loading posts…</p>}
				{error && <p className="text-red-500">Error: {error}</p>}
				{!loading && !error && displayedPosts.length === 0 && (
					<p>No posts yet—be the first to create one!</p>
				)}

				{displayedPosts.length > 0 && (
					<div className="space-y-4">
						{displayedPosts.map((post) => {
							const colors = categoryColors[post.category] || defaultColors;
							const badgeCls = `
                flex gap-0.5 px-1 py-0.5 text-white rounded text-xs mb-2
                ${colors.bgColor} hover:text-white cursor-pointer
              `;
							return (
								<Link
									key={post.id}
									to={`/forum/post/${post.id}`}
									className="block"
								>
									<div className="p-6 mb-3 border border-gray-400 rounded shadow-sm bg-gray-50 hover:border-gray-500 hover:bg-gray-200 transition dark:bg-black dark:ring-1 dark:ring-[#DB572C] dark:border-transparent dark:hover:bg-gray-950 dark:hover:ring-white transition-all duration-600 ease-in-out">
										<h2 className="text-2xl font-bold mb-1">{post.title}</h2>
										<button className={badgeCls}>{post.category}</button>
										<div className="text-sm text-gray-700 dark:text-gray-400 mb-4">
											{post.author_name} •{" "}
											{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}{" "}
										</div>
										<p className="text-xl">{post.content}</p>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
