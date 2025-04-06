import { Route, Routes, useLocation } from "react-router-dom";
import Store from "@/pages/store/Store";
import Forum from "@/pages/forum/Forum";
import Home from "@/pages/home/Home";
import Navbar from "./components/navbar";
import Item from "@/pages/item/Item";
import Profile from "@/pages/profile/Profile";

function App() {
	const location = useLocation();
  	const isHomePage = location.pathname === "/";
	return (
		<>
			{/* Navbar component */}
			{!isHomePage && <Navbar />}
			<Routes>
				{/* Defining routes for all paths on the website*/}
				<Route path="/" element={<Home />} />
				<Route path="/forum" element={<Forum />} />
				<Route path="/store" element={<Store />} />
				<Route path="/item/:itemId" element={<Item />} />
				<Route path="/profile/:userId" element={<Profile />} />
			</Routes>
		</>
	);
}

export default App;
