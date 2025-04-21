import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CategoryType, categoryColors, defaultColors, ForumPost, ForumComment } from "./ForumConstants";


export default function ForumPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const[comments, setComments] = useState<ForumComment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const[currentUser, setCurrentUser] = useState<{id: number, name: string } | null>(null);


  useEffect(() => {

    fetch("/api/me", { credentials : "include" })
    .then((r) => r.json())
    .then((data) => {
      if (data.user_data) {
        setCurrentUser({id: data.user_data.id, name: data.user_data.name});
      }
    })
    .catch(() => {
      ////
    });

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
           
           const errorData = await response.json().catch(() => ({ error: `Failed to fetch post ${postId}` }));
           throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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

  const handleAddComment = async () => {
    if (!newCommentContent.trim() || !post) return;

    const res = await fetch(`/api/forum/posts/${post.id}/comments`, {
      method:  "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content : newCommentContent }),
    });
    if (!res.ok) {
      console.error("Counld not save comment");
      return;
    }
    const saved: ForumComment = await res.json(); 

    setComments((prev) => [saved, ...prev]);
    setNewCommentContent("");
  };


  if (loading) return <div className="flex items-center justify-center min-h-screen"><p>Loading post...</p></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">Error loading post: {error}</p></div>;
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
        <ArrowLeft size={20} className="text-[#A11833] custom-hover-shadow"/>
        <span className="font-bold text-gray-600 ml-2 hover:font-normal">Back to Forum</span>
      </Link>
      <article className="bg-gray-50 p-10 rounded shadow">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

        <button className={categoryButtonClassName}>
          {post.category}
        </button>

        <div className="text-sm text-gray-600 mb-4 mt-2">
          Posted by {post.author_name} on {new Date(post.created_at).toLocaleDateString()} {/* Use author_name and format date */}
        </div>

        {post.photo_data && (
            <div className="mb-4">
                <img
                    src={`data:image/jpeg;base64,${post.photo_data}`}
                    alt="Post photo"
                    className="max-w-full h-auto rounded shadow"
                />
            </div>
        )}

        <p className="text-gray-800">{post.content}</p>
      </article>

      {/* Comments Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        {/* Add Comment Form */}
        <div className="mb-6">
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Write a comment..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            rows={3}/>
          <button onClick={handleAddComment}
            className="flex gap-2 px-4 py-2 bg-[#A11833] text-white rounded hover:bg-[#3F030F] hover:text-white hover:cursor-pointer">
            Post Comment
          </button>
        </div>

        {/* List of Comments */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment.id} className="p-6 bg-gray-50 rounded shadow">
              <div className="text-sm text-gray-600">
                {comment.commenter_name} on {new Date(comment.created_at).toLocaleDateString()} {/* Use commenter_name and format date */}
              </div>
              <p className="text-gray-800 mt-1">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}