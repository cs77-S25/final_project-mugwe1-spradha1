export default function StoreContent() {
	return (
		<div className="ml-[16.6667%] h-[calc(100vh-4rem)] overflow-y-auto p-4 overscroll-none">
			<div className="text-3xl font-bold">Store</div>
			<div className="space-y-4">
				{Array.from({ length: 50 }, (_, i) => (
					<p key={i}>Line {i + 1}</p>
				))}
			</div>
		</div>
	);
}
