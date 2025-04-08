import React from "react";
import Sidebar from "@/components/ui/sidebar";
import { Home, MessageSquare, Store, User } from "lucide-react";

export default function ForumSidebar() {
	return (
		<Sidebar>
			<nav>
				<ul className="space-y-4">
					<li>
						<a
							href="/"
							className="flex items-center gap-3 p-3 rounded-lg text-white hover:text-[#DB572C] hover:bg-gray-200 transition-all duration-200"
							title="Home"
						>
							<Home size={24} className="min-w-[24px]" />
							<span className="truncate">Home</span>
						</a>
					</li>
					<li>
						<a
							href="/forum"
							className="flex items-center gap-3 p-3 rounded-lg text-white hover:text-[#DB572C] hover:bg-gray-200 transition-all duration-200"
							title="Forum"
						>
							<MessageSquare size={24} className="min-w-[24px]" />
							<span className="truncate">Forum</span>
						</a>
					</li>
					<li>
						<a
							href="/store"
							className="flex items-center gap-3 p-3 rounded-lg text-white hover:text-[#DB572C] hover:bg-gray-200 transition-all duration-200"
							title="Categories"
						>
							<Store size={24} className="min-w-[24px]" />
							<span className="truncate">Store</span>
						</a>
					</li>
					<li>
						{/* Placeholder profile */}
						<a
							href="/profile/1"
							className="flex items-center gap-3 p-3 rounded-lg text-white hover:text-[#DB572C] hover:bg-gray-200 transition-all duration-200"
							title="Profile"
						>
							<User size={24} className="min-w-[24px]" />
							<span className="truncate">Profile</span>
						</a>
					</li>
				</ul>
			</nav>
		</Sidebar>
	);
}
