import React, { useState, useEffect } from "react";
import { Search, Funnel, ChevronDown, ChevronUp } from "lucide-react";
import { CategoryType } from "./ForumConstants";

interface FormSidebarProps {
  selectedCategories: CategoryType[];
  onCategoryChange: (cats: CategoryType[]) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const CATEGORIES: CategoryType[] = [
  "General",
  "Announcement",
  "Event",
  "Fitcheck",
];

export default function FormSidebar({
  selectedCategories,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  collapsed,
  setCollapsed,
}: FormSidebarProps) {
  const [showFilters, setShowFilters] = useState(true);
  
  
  useEffect(() => {
      setShowFilters(!collapsed);
  }, [collapsed]);

  const handleExpandClick = () => {
    if (collapsed) {
        setCollapsed(false);
    }
  };

  const navItemClasses =
    "flex items-center p-4 rounded-lg text-white hover:text-[#DB572C] hover:bg-white hover:font-bold transition-all duration-600 w-full";
  const layoutClasses = "gap-4";

  return (
    <nav className={`transition-all duration-600 ease-in-out ${
        collapsed ? "w-14" : "w-58"
      }`}
    >
      <ul className="space-y-2">
        {/** search **/}
        <li>
          <div
            onClick={handleExpandClick}
            className={`${navItemClasses} ${layoutClasses} bg-[#A11833] cursor-text`}
            title={collapsed ? "Click to expand and search" : "Search posts"}>
            <Search size={24} className="min-w-[24px]"/>
            {!collapsed && (
              <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="ml-3 bg-transparent flex-1 focus:outline-none placeholder-gray-400"/>
            )}
          </div>
        </li>

        <li className="space-y-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (collapsed) {
                setCollapsed(false)
              } else {
                setShowFilters((v) => !v);
              }
            }}
            className={`${navItemClasses} ${layoutClasses} justify-between cursor-pointer `}
            title={collapsed ? "Click to expand filters" : "Filters"}
            aria-expanded={showFilters}>
            <div className={`flex items-center  ${layoutClasses}`}>
              <Funnel size={24} className="min-w-[24px]" />
              {!collapsed && (                          
                <span className="truncate font-medium pl-3">Filters</span>
              )}
            </div>
            {!collapsed && showFilters ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {showFilters && !collapsed &&(
            <div
              id="filter-options"
              className="pl-16 pr-6 pb-2 space-y-5 text-white ">
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                 Categories
                </h4>
                <ul className="space-y-3">
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <label className="flex items-center gap-2 cursor-pointer text-base text-white hover:text-gray-300 transition-colors duration-150">
                        <input
                          type="checkbox"
                          className="rounded border-[#DB572C] text-[#DB572C] focus:ring-2 focus:ring-[#DB572C] focus:ring-offset-0"
                          checked={selectedCategories.includes(cat)}
                          onChange={(e) =>
                            onCategoryChange(
                              e.target.checked
                                ? [...selectedCategories, cat]
                                : selectedCategories.filter((c) => c !== cat)
                            )
                          }
                        />
                        {!collapsed && <span>{cat}</span>}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
