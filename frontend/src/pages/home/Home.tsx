import React from "react";
import { Link } from "react-router-dom";
import signupIcon from "@/components/images/new-account.png";
import loginIcon from "@/components/images/login.png";

export default function Home() {
	return (
		<div
			className="min-h-screen w-full bg-gray-100 text-black flex flex-col"
			style={{
				backgroundImage:
					"radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)",
				backgroundSize: "20px 20px",
			}}
		>
			<header className="flex justify-center py-4">
				<div className="max-w-5xl w-full flex items-center justify-between px-4">
					<nav className="flex space-x-8">
						<Link to="/store" className="text-lg font-medium hover:underline">
							Store
						</Link>
						<Link to="/forum" className="text-lg font-medium hover:underline">
							Forum
						</Link>
					</nav>

					<div className="flex space-x-4">
						<button className="flex items-center space-x-2 px-3 py-1 border rounded hover:bg-gray-200">
							<img src={signupIcon} alt="Sign Up Icon" className="w-4 h-4" />
							<span>Sign Me Up</span>
						</button>
						<button className="flex items-center space-x-2 px-3 py-1 border rounded bg-[#A11833] text-white hover:bg-gray-200 hover:text-black">
							<img src={loginIcon} alt="Log In Icon" className="w-4 h-4" />
							<span>Log Me In</span>
						</button>
					</div>
				</div>
			</header>

			<main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
				<img
					src="https://via.placeholder.com/150"
					alt="Logo Placeholder"
					className="mb-4"
				/>
				{/* still trying to change the font without error */}
				<div className="relative inline-block mb-6">
					<h1 className="text-[3rem] font-bold leading-none font-nothing">
						The Platform for Sustainable Style
					</h1>
				</div>

				<p className="max-w-2xl text-lg md:text-xl font-semibold text-gray-700">
					Welcome to Swycle, a community of Swatties shaping sustainable style.
					<br />
					Connect, Buy, Sell, and Exchange quality pieces
				</p>
			</main>
		</div>
	);
}
