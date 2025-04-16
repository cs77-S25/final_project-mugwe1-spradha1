import React from "react";
import Sidebar from '@/components/ui/sidebar';
import ForumSidebar from "./FormSidebar";
import ForumContent from "./ForumContent";

export default function Forum() {
  return (
    <div className="flex h-screen">
      <Sidebar>
      <ForumSidebar/>
      </Sidebar>
      <ForumContent/>
    </div>
  );
}

