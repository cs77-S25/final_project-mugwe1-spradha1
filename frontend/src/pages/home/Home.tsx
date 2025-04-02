import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
	return (
		<>
			<div>Home</div>
			<div>
				Goto <Link to="/store">Store</Link>
			</div>
			<div>
				Goto <Link to="/forum">Forum</Link>
			</div>
		</>
	);
}
