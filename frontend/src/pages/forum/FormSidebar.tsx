import React, { useState } from "react";
import { Search, Funnel, ChevronDown, ChevronUp } from "lucide-react";

const filters = [
    {
        label: "Category",
        type: "checkbox",
        options: ["one", "two", "three"],
    },
    {
        label: "Tags",
        type: "checkbox",
        options: ["oneone", "twotwo", "threethree", "fourfour"],
    },
];

interface ForumSidebarProps {
    isCollapsed?: boolean;
}

export default function ForumSidebar({ isCollapsed = false }: ForumSidebarProps) { 
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});

    const handleFilterToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isCollapsed) {
            setShowFilters(!showFilters);
        }
        else {
            setShowFilters(false);
        }
    };

    const handleCheckboxChange = (filterLabel: string, option: string, isChecked: boolean) => {
        setSelectedFilters(prev => {
            const currentOptions = prev[filterLabel] || [];
            let updatedFilters;
            if (isChecked) {
                updatedFilters = { ...prev, [filterLabel]: [...currentOptions, option] };
            } else {
                updatedFilters = { ...prev, [filterLabel]: currentOptions.filter(o => o !== option) };
            }
            console.log("Selected Filters:", updatedFilters);
            return updatedFilters;
        });
    };

    const navItemClasses = `flex items-center p-3 rounded-lg text-white hover:text-[#DB572C] hover:bg-white hover:font-bold transition-all duration-400 w-full`;
    const layoutClasses = isCollapsed ? 'justify-left' : 'gap-4';

    return (
        <nav>
            <ul className="space-y-2">
                <li>
                    <a href="/"
                        className={`${navItemClasses} ${layoutClasses}`}
                        title="Search">
                        <Search size={24} className="min-w-[24px]" />
                        {!isCollapsed && <span className="truncate font-medium">Search</span>}
                    </a>
                </li>

                <li className="space-y-1">
                    <button
                        onClick={handleFilterToggle}
                        className={`${navItemClasses} ${layoutClasses} justify-between cursor-pointer `}
                        title="Filters"
                        aria-expanded={showFilters && !isCollapsed}
                        aria-controls="filter-options">
                        <div className={`flex items-center ${layoutClasses}`}>
                            <Funnel size={24} className="min-w-[24px]" />
                            {!isCollapsed && <span className="truncate font-medium">Filters</span>}
                        </div>
                        {!isCollapsed && (
                            showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />
                        )}
                    </button>
					
	
                    {showFilters && !isCollapsed && (
                        <div id="filter-options" className="pl-12 pr-15 pb-2 space-y-5 text-white  ">
                            {filters.map((filterGroup) => (
                                <div key={filterGroup.label} className="pt-2 border-t border-gray-500 first:border-t-0 first:pt-0">
                                    <h4 className="mb-2 text-sm font-semibold text-gray-200 uppercase tracking-wider">
                                        {filterGroup.label}
                                    </h4>
                                    <ul className="space-y-1">
                                        {filterGroup.options.map((option) => (
                                            <li key={option}>
                                                <label className="flex items-center gap-2 cursor-pointer text-sm text-white hover:text-grey transition-colors duration-150">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-[#DB572C]  text-[#DB572C] focus:ring-2 focus:ring-[#DB572C] focus:ring-offset-0"
                                                        checked={selectedFilters[filterGroup.label]?.includes(option) || false}
                                                        onChange={(e) => handleCheckboxChange(filterGroup.label, option, e.target.checked)}/>
                                                    {option}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
}
