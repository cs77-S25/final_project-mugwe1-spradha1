// ForumContent.tsx
import React from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { CategoryType, categoryColors, defaultColors, ForumPost, posts } from "./ForumConstants";


export default function ForumContent() {
  return (
    <div className="flex-1 bg-white h-full p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forum</h1>
        <button className="flex gap-2 px-4 py-2 bg-[#A11833] text-white rounded hover:bg-[#3F030F] hover:text-white cursor-pointer">
		<Plus size={24} className="min-w-[24px]"/>

		  New Post

        </button>
      </div>
      <div className="space-y-4">
        {posts.map((post) => {

          const colors = categoryColors[post.category] || defaultColors;


          const categoryButtonClassName = `flex gap-0.5 px-1 py-0.5 text-white rounded cursor-pointer hover:text-white text-xs mb-2
          ${colors.bgColor} ${colors.hoverColor}`;

          return (
            <Link key={post.id} to={`/forum/post/${post.id}`}>
            <div className="p-6 mb-3 border border-gray-300 rounded shadow-sm bg-gray-50 hover:border-gray-500 hover:bg-gray-200">
            <h2 className="text-xl font-bold mb-1">{post.title}</h2>
        
            <button className={categoryButtonClassName}>{post.category}</button>
           
            <div className="text-sm text-gray-600 mb-2">
              {post.author} - {post.date}
              </div>
              <p>{post.content}</p>
            </div>
          </Link>
          );
  })}
      </div>
    </div>
  );
}