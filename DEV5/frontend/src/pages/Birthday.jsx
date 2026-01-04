export default function Birthday({ birthday, setBirthday, loading, error, onSubmit }) {
	function handleSubmit(e) {
		e.preventDefault();
		onSubmit();
	}

	return (
		<div
			style={{
				padding: "2rem",
				maxWidth: "400px",
				margin: "0 auto",
				fontFamily: "Arial, sans-serif",
			}}
		>
			<h1
				style={{
					textAlign: "center",
					marginBottom: "2rem",
					color: "#333",
				}}
			>
				Astro Diary
			</h1>

			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "1rem" }}>
					<label
						htmlFor="birthday"
						style={{
							display: "block",
							marginBottom: "0.5rem",
							fontWeight: "bold",
						}}
					>
						Your Birthday:
					</label>
					<input
						id="birthday"
						type="date"
						value={birthday}
						onChange={(e) => setBirthday(e.target.value)}
						required
						style={{
							width: "100%",
							padding: "0.5rem",
							border: "1px solid #ddd",
							borderRadius: "4px",
							fontSize: "1rem",
						}}
					/>
				</div>

				{error && (
					<div
						style={{
							color: "red",
							marginBottom: "1rem",
							padding: "0.5rem",
							backgroundColor: "#ffebee",
							border: "1px solid #f44336",
							borderRadius: "4px",
						}}
					>
						{error}
					</div>
				)}

				<button
					type="submit"
					disabled={loading || !birthday}
					style={{
						width: "100%",
						padding: "0.75rem",
						backgroundColor: loading ? "#ccc" : "#007bff",
						color: "white",
						border: "none",
						borderRadius: "4px",
						fontSize: "1rem",
						cursor: loading ? "not-allowed" : "pointer",
					}}
				>
					{loading ? "Loading..." : "Get My Daily Prompt"}
				</button>
			</form>
		</div>
	);
}