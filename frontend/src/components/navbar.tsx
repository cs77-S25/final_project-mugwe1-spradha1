import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<nav className="flex justify-between items-center bg-red-800 p-4 z-20 sticky top-0">
			<div className="text-xl font-bold text-white">
				<Link to="/">Swycle ♻️</Link>
			</div>
			<ul className="flex space-x-4">
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
					<Link to="/" className="text-white hover:text-black">
						Login
					</Link>
				</li>
			</ul>
		</nav>
	);
}
