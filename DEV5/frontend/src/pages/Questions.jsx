export default function Questions({ prompt, answers, onChangeAnswer, loading, error, onSave }) {
	function handleSubmit(e) {
		e.preventDefault();
		onSave();
	}

	function handleAnswerChange(index, value) {
		onChangeAnswer(index, value);
	}

	return (
		<div
			style={{
				padding: "2rem",
				maxWidth: "600px",
				margin: "0 auto",
				fontFamily: "Arial, sans-serif",
			}}
		>
			<div style={{ marginBottom: "2rem", textAlign: "center" }}>
				<h2 style={{ color: "#333", marginBottom: "1rem" }}>
					{prompt.sign} • {new Date().toLocaleDateString()}
				</h2>
				<p
					style={{
						fontSize: "1.1rem",
						lineHeight: "1.5",
						color: "#666",
						fontStyle: "italic",
					}}
				>
					{prompt.text}
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				{prompt.questions.map((question, index) => (
					<div key={index} style={{ marginBottom: "1.5rem" }}>
						<label
							style={{
								display: "block",
								marginBottom: "0.5rem",
								fontWeight: "bold",
								color: "#333",
							}}
						>
							{question}
						</label>
						<textarea
							value={answers[index] || ""}
							onChange={(e) => handleAnswerChange(index, e.target.value)}
							required
							style={{
								width: "100%",
								minHeight: "100px",
								padding: "0.5rem",
								border: "1px solid #ddd",
								borderRadius: "4px",
								fontSize: "1rem",
								resize: "vertical",
								fontFamily: "inherit",
							}}
						/>
					</div>
				))}

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
					disabled={loading}
					style={{
						width: "100%",
						padding: "0.75rem",
						backgroundColor: loading ? "#ccc" : "#28a745",
						color: "white",
						border: "none",
						borderRadius: "4px",
						fontSize: "1rem",
						cursor: loading ? "not-allowed" : "pointer",
					}}
				>
					{loading ? "Saving..." : "Save My Entry"}
				</button>
			</form>
		</div>
	);
}