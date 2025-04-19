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
  author: string;
  date: string;
  content: string;
  category: CategoryType;
}

export const posts: ForumPost[] = [
  {
    id: 1,
    title: "1st",
    author: "1",
    date: "2025-04-01",
    content:
      "Well well well well well well well well well",
    category: "General",
  },
  {
    id: 2,
    title: "2nd",
    author: "Ugz",
    date: "2025-04-02",
    content: "what what what what what what what what what what what what what what what what",
    category: "Announcement",
  },
  {
    id: 3,
    title: "3rd",
    author: "Mountaint0psEAcret",
    date: "2025-04-03",
    content: "Do we wew we we we we we we we we we we we we we we we we have here!",
    category: "Event",
  },
  {
    id: 4,
    title: "4th",
    author: "Menitrust",
    date: "2025-04-03",
    content: "Rate my fit out of ten?",
    category: "Fitcheck",
  },
];
