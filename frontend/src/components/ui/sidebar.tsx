import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export default function Sidebar({ children, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className={`relative h-[calc(100vh-8rem)] mt-8 ml-4 bg-[#A11833] hover:bg-[#3F030F] transition-all duration-300 ease-in-out rounded-lg shadow-lg ${
        isCollapsed ? "w-20" : "w-64"} ${className || ""}`}>
      <button onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-5 top-4 transform bg-white rounded-full p-2 hover:bg-gray-100 shadow-md z-50 border border-gray-200"
        style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      <div className="p-4 overflow-y-auto h-full">{children}</div>
    </div>
  );
}