import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import LoginButton from "./loginButton";
import { useAuth } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { getInitials } from "@/lib/utils";

const AvatarDropdown = () => {
	const userAuth = useAuth();
	const navigate = useNavigate();
	if (!userAuth.user) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="cursor-pointer">
					<AvatarImage
						src={userAuth.user.profile_picture_url}
						alt="User Avatar"
						referrerPolicy="no-referrer"
					/>
					<AvatarFallback>{getInitials(userAuth.user.name)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<Link to={`/profile/${userAuth.user.id}`}>
						<DropdownMenuItem>My Profile</DropdownMenuItem>
					</Link>
					<Link to="/upload-item">
						<DropdownMenuItem>List Store Item</DropdownMenuItem>
					</Link>
					<DropdownMenuItem>Create Forum Post</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							userAuth.logout();
							navigate("/");
						}}
					>
						Logout
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default function Navbar() {
	const userAuth = useAuth();
	return (
		<nav className="flex justify-between items-center bg-[#A11833] p-4 z-20 sticky top-0">
			<div className="text-xl font-bold text-white">
				<Link to="/">Swycle ♻️</Link>
			</div>
			<ul className="flex items-center space-x-4">
				{userAuth.user ? (
					<>
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
					</>
				) : (
					<LoginButton />
				)}
			</ul>
		</nav>
	);
}
