import { Route, Routes } from "react-router-dom";
import Store from "@/pages/store/Store";
import Forum from "@/pages/forum/Forum";
import Home from "@/pages/home/Home";
import Navbar from "./components/navbar";

function App() {
	return (
		<>
			{/* Navbar component */}
			<Navbar />
			<Routes>
				{/* Defining routes for all paths on the website*/}
				<Route path="/" element={<Home />} />
				<Route path="/forum" element={<Forum />} />
				<Route path="/store" element={<Store />} />
			</Routes>
		</>
	);
}

export default App;
