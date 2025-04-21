import React, { useState, Children, cloneElement, isValidElement } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { on } from "events";
interface SidebarProps {
    children: React.ReactNode;
    className?: string;
    initialCollapsed?: boolean;
    isCollapsed?: boolean;
    onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({
    children,
    className,
    initialCollapsed = false,
    isCollapsed: controlledCollapsed,
    onCollapseChange

}: SidebarProps) {
    const [internalCollapsed, setInternalCollapsed] = useState(initialCollapsed);

    const isCollapsed = controlledCollapsed ?? internalCollapsed;
    const setIsCollapsed = (value: boolean) => {
        setInternalCollapsed(value);
        onCollapseChange?.(value);
    };

    return (
        <div className={`relative h-[calc(100vh-8rem)] mt-8 ml-4 bg-[#A11833] hover:bg-[#3F030F] transition-all duration-600 ease-in-out rounded-lg ${
            isCollapsed ? "w-20" : "w-64"} ${className || ""}`}>
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1.5 hover:bg-gray-400 cursor-pointer hover:text-white shadow-md z-50 border border-gray-200"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            <div className="p-4 overflow-y-auto overflow-x-hidden h-full">
                {Children.map(children, (child) => {
                    if (isValidElement(child)) {
                        return cloneElement(child as React.ReactElement<any>, { collapsed:isCollapsed, setCollapsed:setIsCollapsed });
                    }
                    return child;
                })}
            </div>
        </div>
  );
}