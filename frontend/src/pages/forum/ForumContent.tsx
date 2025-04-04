import React from "react";
import { Plus } from "lucide-react";

interface ForumPost {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
}

const posts: ForumPost[] = [
  {
    id: 1,
    title: "1st",
    author: "1",
    date: "2025-04-01",
    content:
      "Well well well well well well well well well",
  },
  {
    id: 2,
    title: "2nd",
    author: "Ugz",
    date: "2025-04-02",
    content: "what what what what what what what what what what what what what what what what",
  },
  {
    id: 3,
    title: "3rd",
    author: "Mountaint0psEAcret",
    date: "2025-04-03",
    content: "Do we wew we we we we we we we we we we we we we we we we have here!",
  },
];

export default function ForumContent() {
  return (
    <div className="flex-1 bg-white h-full p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forum</h1>
        <button className="flex gap-2 px-4 py-2 bg-[#A11833] text-white rounded hover:bg-[#3F030F] hover:text-white">
		<Plus size={24} className="min-w-[24px]"/>
		  
		  New Post
		  

        </button>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id}
            className="p-4 border border-gray-300 rounded shadow-sm bg-gray-50">
            <h2 className="text-xl font-bold mb-1">{post.title}</h2>
            <div className="text-sm text-gray-600 mb-2">
              {post.author} - {post.date}
            </div>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

