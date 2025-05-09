import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
	CategoryType,
	categoryColors,
	defaultColors,
	ForumPost,
	ForumComment,
} from "./ForumConstants";
import { useAuth } from "@/context/UserContext";
import { Trash } from "lucide-react";
import Linkify from 'linkify-react';
import { formatDistanceToNow, format} from 'date-fns';

export default function ForumPostPage() {
	const { postId } = useParams<{ postId: string }>();
	const [post, setPost] = useState<ForumPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [comments, setComments] = useState<ForumComment[]>([]);
	const [newCommentContent, setNewCommentContent] = useState("");

	const [isOwner, setIsOwner] = useState(false);

	const authUser = useAuth();
	const userId = authUser?.user?.id;

	const navigate = useNavigate();

	const handleDeletePost = async () => {
		try {
			const response = await fetch(`/api/forum/posts/${postId}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to delete post");
			}

			// Redirect to the forum page after deletion
			navigate("/forum");
		} catch (error) {
			console.log("Error deleting post:", error);
			setError("Failed to delete post");
		}
	};
	
	//deleting comment

	const handleDeleteComment = async (commentId: number) => {
		try {
			const response = await fetch(`/api/forum/comments/${commentId}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to delete comment");
			}

			setComments(comments.filter(comment => comment.id !== commentId));
		} catch (error) {
			console.log("Error deleting comment:", error);
		}
	};






	useEffect(() => {
		const fetchPost = async () => {
			if (!postId) {
				setError("No post ID provided.");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);
				const response = await fetch(`/api/forum/posts/${postId}`);
				if (!response.ok) {
					if (response.status === 404) {
						setPost(null);
					}

					const errorData = await response
						.json()
						.catch(() => ({ error: `Failed to fetch post ${postId}` }));
					throw new Error(
						errorData.error || `HTTP error! status: ${response.status}`
					);
				}
				const data: ForumPost = await response.json();
				setPost(data);
				setComments(data.comments || []);

				/////////
			} catch (err: any) {
				setError(err.message);
				console.error(`Failed to fetch post ${postId}:`, err);
				setPost(null);
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
	}, [postId]);

	// Use effect to check if the user is the owner of the post
	useEffect(() => {
		if (post && userId) {
			setIsOwner(post.user_id === userId);
		}
	}, [post, userId]);

	const handleAddComment = async () => {
		if (!newCommentContent.trim() || !post) return;

		const res = await fetch(`/api/forum/posts/${post.id}/comments`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content: newCommentContent }),
		});
		if (!res.ok) {
			console.error("Could not save comment");
			return;
		}
		const saved: ForumComment = await res.json();

		setComments((prev) => [saved, ...prev]);
		setNewCommentContent("");
	};

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p>Loading post...</p>
			</div>
		);
	if (error)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-red-500">Error loading post: {error}</p>
			</div>
		);
	if (!post) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-2xl">Post not found</p>
			</div>
		);
	}

	const colors = categoryColors[post.category as CategoryType] || defaultColors;

	const categoryButtonClassName = `flex gap-0.5 px-1 py-0.5 text-white rounded cursor-pointer hover:text-white text-xs mb-2
    ${colors.bgColor} ${colors.hoverColor}`;

	return (
		<div className="max-w-3xl mx-auto p-4">
			<Link to="/forum" className="flex items-center text-blue-500 mb-4">
				<ArrowLeft
					size={20}
					className="text-[#A11833] custom-hover-shadow dark:text-gray-400 dark:ring-1 dark:ring-[#DB572C]"
				/>
				<span className="text-gray-600 ml-2 hover:font-bold dark:text-white transition-all duration-300 ease-in-out">
					Back to Forum
				</span>
			</Link>
			<article className="bg-gray-50 p-10 rounded shadow dark:bg-black dark:text-white dark:ring-1 dark:ring-[#DB572C] relative">
				<h1 className="text-3xl font-bold mb-2">{post.title}</h1>

				<button className={categoryButtonClassName}>{post.category}</button>

				<div className="text-base font-medium text-gray-800 mb-4 mt-2 dark:text-gray-400">
					Posted by{" "}
					<Link to={`/profile/${post.user_id}`} className="underline">
						{post.author_name}
					</Link>{" "}
					{isOwner && <span className="font-bold">(You)</span>}{" "}
					{/* Show "You" if the user is the owner */}
					<p className= "text-xs font-normal text-gray-700 dark:text-gray-300">
					{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}{" "}
					on {format(new Date(post.created_at), 'MMMM d')}{" "}
					at {format(new Date(post.created_at), 'h:mm a')}</p>
					
				</div>


				{post.photo_data && (
					<div className="mb-4 hover:ring-2 dark:hover:ring-gray-700 transition-all duration-300 ease-in-out">
						<img
							src={`data:image/jpeg;base64,${post.photo_data}`}
							alt="Post photo"
							className="max-w-full h-auto rounded shadow"
						/>
					</div>
				)}

				<p className="text-gray-800 text-2xl font-medium dark:text-white">
					<Linkify options={{ 
						className: "break-words text-blue-500 hover:underline",
						target: "blank",
						rel: "noopener noreferrer",}}>
						{post.content}
					</Linkify>
				</p>

				{isOwner && (
					// Delete Post Button
					<button
						onClick={handleDeletePost}
						className="absolute top-12 right-5 flex gap-2 px-2.5 py-2 bg-[#A11833] dark:bg-gray-900 text-white rounded hover:bg-[#3F030F] hover:cursor-pointer hover:text-[#dbb52c] transition-all duration-300 ease-in-out">
						<Trash size={16} />
					
					</button>
				)}
			</article>

			{/* Comments Section */}
			<section className="mt-8 max-w-3xl">
				<h2 className="text-2xl font-bold mb-4">Comments</h2>

				{/* Add Comment Form */}
				<div className="mb-6">
					<textarea
						className="w-full p-2 border rounded mb-2 "
						placeholder="Write a comment..."
						value={newCommentContent}
						onChange={(e) => setNewCommentContent(e.target.value)}
						rows={3}
					/>
					<button
						onClick={handleAddComment}
						className="flex gap-2 px-4 py-2 bg-[#A11833] dark:bg-gray-900 text-white rounded hover:bg-[#3F030F] hover:cursor-pointer hover:text-[#dbb52c] transition-all duration-300 ease-in-out"
					>
						Post Comment
					</button>
				</div>

				{/* List of Comments */}
				<div className="space-y-4 w-full">
					{comments.map((comment) => (
						<div key={comment.id}
							className="p-6 border rounded bg-gray-50 rounded shadow dark:bg-black dark:ring-1 dark:ring-gray-500 dark:ring-inset break-words w-full hover:ring-1 hover:ring-gray-700 dark:hover:ring-gray-300 transition-all duration-300 ease-in-out mt-5 relative">
							<div className="text-sm text-gray-600 dark:text-gray-400 dark:font-bold mb-4">
								<span className="font-medium text-sm dark:text-gray-200">{comment.commenter_name}</span>
								<p className= "text-xs dark:text-gray-400"><span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
								<span> on </span>
								<span>{format(new Date(comment.created_at), 'MMMM d, yyyy')}</span>
								<span> at </span>
								<span>{format(new Date(comment.created_at), 'h:mm a')}</span></p>
							</div>

							{comment.user_id === userId && (
								<button onClick={() => handleDeleteComment(comment.id)}
									className="absolute top-7 right-7 text-black hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 cursor-pointer transition-colors"
									title="Delete comment">
									<Trash size={16} />
								</button>
							)}


							<p className="text-black mt-1 dark:text-white text-xl">
								{/* {comment.content} */}
								<Linkify options={{ 
									className: "break-words text-blue-500 hover:underline",
									target: "blank",
									rel: "noopener noreferrer",}}>
									{comment.content}
								</Linkify>
							</p>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
