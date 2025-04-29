import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import LoginButton from "./loginButton";
import { useAuth } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { getInitials } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const AvatarDropdown = () => {
	const userAuth = useAuth();
	const navigate = useNavigate();
	if (!userAuth.user) return null;

	const handleLogout = async () => {
		await userAuth.logout();
		navigate("/");
	};

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
			<DropdownMenuContent className="w-56 dark:bg-gray-800">
				<DropdownMenuGroup>
					<Link to={`/profile/${userAuth.user.id}`}>
						<DropdownMenuItem className="hover:!bg-gray-200 dark:hover:!bg-gray-200 dark:hover:!text-black hover:cursor-pointer transition-colors duration-400">My Profile</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					<Link to="/offers-made">
						<DropdownMenuItem className="hover:!bg-gray-200 dark:hover:!bg-gray-200 dark:hover:!text-black hover:cursor-pointer transition-colors duration-400">Offers Made</DropdownMenuItem>
					</Link>
					<Link to="/offers-received">
						<DropdownMenuItem className="hover:!bg-gray-200 dark:hover:!bg-gray-200 dark:hover:!text-black hover:cursor-pointer transition-colors duration-400">Offers Received</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="hover:!bg-gray-200 dark:hover:!bg-gray-200 dark:hover:!text-black hover:cursor-pointer transition-colors duration-400" onClick={handleLogout}>Logout</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default function Navbar() {
	const userAuth = useAuth();
	return (
		<nav className="flex justify-between items-center bg-[#A11833] p-4 z-20 sticky top-0 dark:bg-gray-800">
			<div className="text-xl font-bold text-white">
				<Link to="/"><img
					src="/src/components/images/swyclesvg.svg"
					alt="Swycle Logo"
            		width={30}/></Link>
			</div>
			<ul className="flex items-center space-x-4">
				{userAuth.user ? (
					<>
						<li>
							<ModeToggle />
						</li>
						<li>
							<Link
								to="/forum"
								className="text-white font-bold hover:text-[#DB572C] px-3 py-2 rounded-lg hover:bg-white hover:font-bold transition-colors duration-400"
							>
								Forum
							</Link>
						</li>
						<li>
							<Link
								to="/store"
								className="text-white font-bold hover:text-[#DB572C] px-3 py-2 rounded-lg hover:bg-white hover:font-bold transition-colors duration-400"
							>
								Store
							</Link>
						</li>
						<li>
							<AvatarDropdown/>
						</li>
					</>
				) : (
					<>
						<li>
							<ModeToggle/>
						</li>
						<LoginButton variant="navbar" />
					</>
				)}
			</ul>
		</nav>
	);
}
