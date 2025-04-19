import { Route, Routes } from "react-router-dom";
import Store from "@/pages/store/Store";
import Forum from "@/pages/forum/Forum";
import Home from "@/pages/home/Home";
import Navbar from "./components/navbar";
import Item from "@/pages/item/Item";
import Profile from "@/pages/profile/Profile";
import UploadItem from "@/pages/uploadItem/UploadItem";
import ForumPostPage from "@/pages/forum/ForumPostPage";
import "./app.css";

function App() {
	return (
		<>
			{/* Navbar component */}
			<Navbar />
			{/* Main content area */}
			<Routes>
				{/* Defining routes for all paths on the website*/}
				<Route path="/" element={<Home />} />
				<Route path="/forum" element={<Forum />} />
				<Route path="/store" element={<Store />} />
				<Route path="/item/:itemId" element={<Item />} />
				<Route path="/profile/:userId" element={<Profile />} />
				<Route path="/upload-item" element={<UploadItem />} />
				<Route path="/forum/post/:postId" element={<ForumPostPage />} />
			</Routes>
		</>
	);
}

export default App;
