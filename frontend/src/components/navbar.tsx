import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const AvatarDropdown = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="cursor-pointer">
					<AvatarImage
						src="https://github.com/mountaint0p.png"
						alt="User Avatar"
					/>
					<AvatarFallback>SP</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<Link to="/profile/1">
						<DropdownMenuItem>My Profile</DropdownMenuItem>
					</Link>
					<DropdownMenuItem>List Store Item</DropdownMenuItem>
					<DropdownMenuItem>Create Forum Post</DropdownMenuItem>
					<DropdownMenuItem>Log Out</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default function Navbar() {
	return (
		<nav className="flex justify-between items-center bg-[#A11833] p-4 z-20 sticky top-0">
			<div className="text-xl font-bold text-white">
				<Link to="/">Swycle ♻️</Link>
			</div>
			<ul className="flex items-center space-x-4">
				<li>
					<Link to="/" className="text-white hover:text-black">
						Home
					</Link>
				</li>
				<li>
					<Link to="/forum" className="text-white hover:text-black">
						Forum
					</Link>
				</li>
				<li>
					<Link to="/store" className="text-white hover:text-black">
						Store
					</Link>
				</li>
				<li>
					<AvatarDropdown />
				</li>
			</ul>
		</nav>
	);
}
