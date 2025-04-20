export type CategoryType = "General" | "Announcement" | "Event" | "Fitcheck";

export const categoryColors: Record<CategoryType, { bgColor: string; hoverColor: string }> = {
  "General": { bgColor: "bg-gray-500", hoverColor: "hover:bg-gray-700" },
  "Announcement": { bgColor: "bg-blue-600", hoverColor: "hover:bg-blue-800" },
  "Event": { bgColor: "bg-purple-600", hoverColor: "hover:bg-purple-800" },
  "Fitcheck": { bgColor: "bg-green-600", hoverColor: "hover:bg-green-800" },
};

export const defaultColors = {
  bgColor: "bg-[#A11833]",
  hoverColor: "hover:bg-[#3F030F]"
};

export interface ForumPost {
  id: number;
  title: string;
  user_id: number; 
  author_name: string; 
  content: string;
  category: CategoryType;
  photo_data: string | null; 
  created_at: string; 
}

export interface ForumComment {
    id: number;
    forum_post_id: number;
    user_id: number;
    commenter_name: string; 
    content: string;
    created_at: string; 
}