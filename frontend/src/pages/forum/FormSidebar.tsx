import React, { useState } from "react";
import { Search, Funnel, ChevronDown, ChevronUp } from "lucide-react";
import { CategoryType } from "./ForumConstants";

interface FormSidebarProps {
  selectedCategories: CategoryType[];
  onCategoryChange: (cats: CategoryType[]) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
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
}: FormSidebarProps) {
  const [showFilters, setShowFilters] = useState(true);
  const [collapsed, setCollapsed] = useState(false);  

  const navItemClasses =
    "flex items-center p-3 rounded-lg text-white hover:text-[#DB572C] hover:bg-white hover:font-bold transition-all duration-400 w-full";
  const layoutClasses = "gap-4";

  return (
    <nav>
      <ul className="space-y-2">
        {/** search **/}
        <li>
          <div
            className={`${navItemClasses} ${layoutClasses} bg-[#A11833] cursor-text`}
            title="Search posts">
            <Search size={24} className="min-w-[24px]" />
            {!collapsed && (
              <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="ml-3 bg-transparent flex-1 focus:outline-none placeholder-gray-200"
            />
            )}
          </div>
        </li>

        <li className="space-y-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFilters((v) => !v);
            }}
            className={`${navItemClasses} ${layoutClasses} justify-between cursor-pointer`}
            title="Filters"
            aria-expanded={showFilters}
          >
            <div className={`flex items-center ${layoutClasses}`}>
              <Funnel size={24} className="min-w-[24px]" />
              {!collapsed && (                          
                <span className="truncate font-medium">Filters</span>
              )}
            </div>
            {showFilters ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {showFilters && !collapsed &&(
            <div
              id="filter-options"
              className="pl-12 pr-6 pb-2 space-y-5 text-white"
            >
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-200 uppercase tracking-wider">
                  Category
                </h4>
                <ul className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-white hover:text-gray-300 transition-colors duration-150">
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
