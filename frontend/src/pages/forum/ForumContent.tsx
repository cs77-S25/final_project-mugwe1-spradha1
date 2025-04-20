import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryType, categoryColors, defaultColors, ForumPost } from "./ForumConstants";
import NewPostForm from "./NewForumPostForm";

export default function ForumContent() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await fetch('/api/forum/posts');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error fetching posts' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data: ForumPost[] = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setPosts(sortedData);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    setShowNewPostForm(false);
    fetchPosts(); 
  };

  if (loading) return <div className="flex-1 bg-white h-full p-6 overflow-y-auto"><p>Loading posts...</p></div>;
  if (error) return <div className="flex-1 bg-white h-full p-6 overflow-y-auto"><p className="text-red-500">Error loading posts: {error}</p></div>;

  return (
    <div className="flex-1 bg-white h-full p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forum</h1>
        <button
          className="flex gap-2 px-4 py-2 bg-[#A11833] text-white rounded hover:bg-[#3F030F] hover:text-white cursor-pointer"
          onClick={() => setShowNewPostForm(true)}>
          <Plus size={24} className="min-w-[24px]"/>
          New Post
        </button>
      </div>

      {showNewPostForm && (
        <NewPostForm
          onPostCreated={handlePostCreated} 
          onCancel={() => setShowNewPostForm(false)}/>
      )}

      {!loading && !error && posts.length === 0 && (
         <p>No posts. Why not be the first one to create one! Is that rhyme?</p>
      )}


      {posts.length > 0 && (
         <div className="space-y-4">
            {posts.map((post) => {
            const colors = categoryColors[post.category as CategoryType] || defaultColors;

            const categoryButtonClassName = `flex gap-0.5 px-1 py-0.5 text-white rounded cursor-pointer hover:text-white text-xs mb-2
            ${colors.bgColor} ${colors.hoverColor}`;

            return (
                <Link key={post.id} to={`/forum/post/${post.id}`}>
                <div className="p-6 mb-3 border border-gray-300 rounded shadow-sm bg-gray-50 hover:border-gray-500 hover:bg-gray-200">
                <h2 className="text-xl font-bold mb-1">{post.title}</h2>
                <button className={categoryButtonClassName}>{post.category}</button>
                <div className="text-sm text-gray-600 mb-2">
                    {post.author_name} - {new Date(post.created_at).toLocaleDateString()}
                </div>
                <p>{post.content}</p>
                </div>
            </Link>
            );
    })}
        </div>
      )}
    </div>
  );
}