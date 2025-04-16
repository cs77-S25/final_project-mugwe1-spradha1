import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";


interface ForumPost {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
}

interface Comment {
  id: number;
  author: string;
  date: string;
  text: string;
}

const duposts: ForumPost[] = [
  {
    id: 1,
    title: "1st",
    author: "1",
    date: "2025-04-01",
    content: "Well well well well well well well well well",
  },
  {
    id: 2,
    title: "2nd",
    author: "Ugz",
    date: "2025-04-02",
    content: "what what what what what what what what",
  },
  {
    id: 3,
    title: "3rd",
    author: "Mountaint0psEAcret",
    date: "2025-04-03",
    content: "Do we have something interesting here?",
  },
];

const ducomments: Comment[] = [
  { id: 1, author: "Ug", date: "2025-04-04", text: "nice" },
  { id: 2, author: "Ugw", date: "2025-04-04", text: "nicex2" },
  { id: 3, author: "Ugwe", date: "2025-04-05", text: "nice10x" },
];

export default function ForumPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {

    const foundPost = duposts.find((p) => p.id === Number(postId));
    setPost(foundPost || null);

    setComments(ducomments);
  }, [postId]);

  const handleAddComment = () => {
    if (newComment.trim() === "" || !post) return;

    const comment: Comment = {
      id: comments.length + 1,
      author: "Current User", 
      date: new Date().toISOString().split("T")[0],
      text: newComment,
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl">Post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link to="/forum" className="flex items-center text-blue-500 mb-4">
        <ArrowLeft size={20} className="text-[#A11833] custom-hover-shadow"/>
        <span className="font-bold text-gray-600 ml-2 hover:font-normal">Back to Forum</span>
      </Link>
      <article className="bg-gray-50 p-10 rounded shadow">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="text-sm text-gray-600 mb-4">
          Posted by {post.author} on {post.date}
        </div>
        <p className="text-gray-800">{post.content}</p>
      </article>
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
     
        <div className="mb-6">
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}/>
          <button onClick={handleAddComment}
            className="flex gap-2 px-4 py-2 bg-[#A11833] text-white rounded hover:bg-[#3F030F] hover:text-white hover:cursor-pointer">
            Post Comment
          </button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment.id} className="p-6 bg-gray-50 rounded shadow">
              <div className="text-sm text-gray-600">
                {comment.author} on {comment.date}
              </div>
              <p className="text-gray-800 mt-1">{comment.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
