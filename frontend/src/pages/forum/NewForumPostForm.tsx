import React, { useState } from "react";
import { CategoryType, categoryColors } from "./ForumConstants";

interface NewPostFormProps {
  onPostCreated: () => void;
  onCancel: () => void; 
}

export default function NewPostForm({ onPostCreated, onCancel }: NewPostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CategoryType>("General"); 
  const [photo, setPhoto] = useState<File | null>(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const availableCategories = Object.keys(categoryColors) as CategoryType[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (!title || !content || !category) {
      setError("Please fill in all required fields (Title, Content, Category).");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        credentials: 'include',
        body: formData, 
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create post' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      onPostCreated(); 

    } catch (err: any) {
      setError(`Error creating post: ${err.message}`);
      console.error("Post creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onCancel();
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50 dark:bg-gray-900" onClick={handleOutsideClick}>
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md dark:bg-gray-950" >
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-300">Create New Post</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-400">Title:</label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-400">Content:</label>
            <textarea
              id="content"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-400">Category:</label>
            <select
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              disabled={loading}
              required
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-400">Photo (Optional):</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
              disabled={loading}
            />
             {photo && <p className="text-sm text-gray-600 mt-2">Selected file: {photo.name}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#A11833] hover:bg-[#3F030F] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Create Post'}
            </button>
            <button
              type="button"
              className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}