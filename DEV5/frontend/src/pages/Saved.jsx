export default function Saved({ onReset }) {
	return (
		<div
			style={{
				padding: "2rem",
				maxWidth: "400px",
				margin: "0 auto",
				textAlign: "center",
				fontFamily: "Arial, sans-serif",
			}}
		>
			<div
				style={{
					fontSize: "3rem",
					marginBottom: "1rem",
				}}
			>
				✅
			</div>
			<h2 style={{ color: "#28a745", marginBottom: "1rem" }}>
				Entry Saved!
			</h2>
			<p
				style={{
					color: "#666",
					marginBottom: "2rem",
					lineHeight: "1.5",
				}}
			>
				Your diary entry has been saved successfully. Your thoughts and feelings are now preserved.
			</p>
			<button
				onClick={onReset}
				style={{
					padding: "0.75rem 2rem",
					backgroundColor: "#007bff",
					color: "white",
					border: "none",
					borderRadius: "4px",
					fontSize: "1rem",
					cursor: "pointer",
				}}
			>
				Write Another Entry
			</button>
		</div>
	);
}