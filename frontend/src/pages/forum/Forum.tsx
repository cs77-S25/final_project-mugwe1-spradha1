import React from "react";
import ForumSidebar from "./FormSidebar";
import ForumContent from "./ForumContent";

export default function Forum() {
  return (
    <div className="flex h-screen">
      <ForumSidebar/>
      <ForumContent/>
    </div>
  );
}

