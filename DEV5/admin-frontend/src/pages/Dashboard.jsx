import { useState, useEffect, useMemo } from "react";
import { getUsers, getStats, getEvents, getEntries } from "../api/adminApi";

export default function Dashboard() {
	const [users, setUsers] = useState([]);
	const [stats, setStats] = useState(null);
	const [events, setEvents] = useState([]);
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [filters, setFilters] = useState({
		userId: "",
		type: "",
		limit: "50",
	});

	const loadInitialData = async () => {
		try {
			setLoading(true);
			setError(null);
			const [usersData, statsData] = await Promise.all([getUsers(), getStats()]);
			setUsers(usersData);
			setStats(statsData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const loadFilteredData = async () => {
		try {
			setError(null);
			const [eventsData, entriesData] = await Promise.all([getEvents(filters), getEntries(filters)]);
			setEvents(eventsData);
			setEntries(entriesData);
		} catch (err) {
			setError(err.message);
		}
	};

	useEffect(() => {
		loadInitialData();
	}, []);

	useEffect(() => {
		if (users.length > 0) {
			loadFilteredData();
		}
	}, [filters, users.length]);

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const eventTypes = useMemo(() => {
		const types = new Set();
		events.forEach((event) => {
			if (event.type) types.add(event.type);
		});
		return Array.from(types).sort();
	}, [events]);

	if (loading && !stats) {
		return <div style={{ padding: "20px", textAlign: "center" }}>Loading dashboard...</div>;
	}

	if (error) {
		return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
	}

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h1>Admin Dashboard</h1>

			{/* Filters */}
			<div
				style={{
					backgroundColor: "#c26dbf",
					padding: "20px",
					borderRadius: "8px",
					marginBottom: "20px",
				}}
			>
				<h3>Filters</h3>
				<div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
					<div>
						<label style={{ display: "block", marginBottom: "5px" }}>Event Type:</label>
						<select value={filters.type} onChange={(e) => handleFilterChange("type", e.target.value)} style={{ padding: "8px", minWidth: "150px" }}>
							<option value="">All Types</option>
							{eventTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>

					<div>
						<label style={{ display: "block", marginBottom: "5px" }}>User:</label>
						<select value={filters.userId} onChange={(e) => handleFilterChange("userId", e.target.value)} style={{ padding: "8px", minWidth: "150px" }}>
							<option value="">All Users</option>
							{users.map((user) => (
								<option key={user.id || user._id} value={user.id || user._id}>
									{user.name || user.email || user.id || user._id}
								</option>
							))}
						</select>
					</div>

					<div>
						<label style={{ display: "block", marginBottom: "5px" }}>Limit:</label>
						<input type="number" value={filters.limit} onChange={(e) => handleFilterChange("limit", e.target.value)} min="1" style={{ padding: "8px", width: "100px" }} />
					</div>
				</div>
			</div>

			{/* Stats Section */}
			{stats && (
				<div style={{ marginBottom: "30px" }}>
					<h2>Statistics</h2>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
							gap: "20px",
						}}
					>
						<div
							style={{
								backgroundColor: "#77bceeff",
								padding: "15px",
								borderRadius: "8px",
								border: "1px solid #90caf9",
							}}
						>
							<h4 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>Total Events</h4>
							<p style={{ fontSize: "24px", margin: 0, fontWeight: "bold" }}>{stats.totalEvents || 0}</p>
						</div>

						<div
							style={{
								backgroundColor: "#a74db7ff",
								padding: "15px",
								borderRadius: "8px",
								border: "1px solid #000000ff",
							}}
						>
							<h4 style={{ margin: "0 0 10px 0", color: "#7b1fa2" }}>Events by Type</h4>
							<div style={{ maxHeight: "150px", overflowY: "auto" }}>
								{Object.entries(stats.eventsByType || {}).map(([type, count]) => (
									<div key={type} style={{ display: "flex", justifyContent: "space-between", margin: "5px 0" }}>
										<span>{type}:</span>
										<strong>{count}</strong>
									</div>
								))}
							</div>
						</div>

						<div
							style={{
								backgroundColor: "#87e187ff",
								padding: "15px",
								borderRadius: "8px",
								border: "1px solid #a5d6a7",
							}}
						>
							<h4 style={{ margin: "0 0 10px 0", color: "#388e3c" }}>Top Pages</h4>
							<div style={{ maxHeight: "150px", overflowY: "auto" }}>
								{(stats.topPages || []).slice(0, 5).map((page, index) => (
									<div key={index} style={{ display: "flex", justifyContent: "space-between", margin: "5px 0" }}>
										<span>{page.page || page.url}:</span>
										<strong>{page.count || page.visits}</strong>
									</div>
								))}
							</div>
						</div>

						<div
							style={{
								backgroundColor: "#f3d098ff",
								padding: "15px",
								borderRadius: "8px",
								border: "1px solid #ffcc80",
							}}
						>
							<h4 style={{ margin: "0 0 10px 0", color: "#f57c00" }}>Events Per Day</h4>
							<div style={{ maxHeight: "150px", overflowY: "auto" }}>
								{Array.isArray(stats.eventsPerDay) && stats.eventsPerDay.length > 0 ? (
									stats.eventsPerDay.slice(0, 7).map((item) => (
										<div
											key={item.date}
											style={{
												display: "flex",
												justifyContent: "space-between",
												margin: "5px 0",
											}}
										>
											<span>{item.date}:</span>
											<strong>{item.count}</strong>
										</div>
									))
								) : (
									<div style={{ color: "#666" }}>No data</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Events Table */}
			<div style={{ marginBottom: "30px" }}>
				<h2>Events ({events.length})</h2>
				<div
					style={{
						border: "1px solid #ddd",
						borderRadius: "8px",
						overflow: "hidden",
						backgroundColor: "white",
					}}
				>
					<div style={{ overflowX: "auto" }}>
						<table style={{ width: "100%", borderCollapse: "collapse" }}>
							<thead>
								<tr style={{ backgroundColor: "#f8f9fa" }}>
									<th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Created At</th>
									<th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Type</th>
									<th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Page</th>
									<th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Button</th>
									<th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>User ID</th>
								</tr>
							</thead>
							<tbody>
								{events.map((event, index) => (
									<tr key={index} style={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
										<td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{event.createdAt ? new Date(event.createdAt).toLocaleString() : "N/A"}</td>
										<td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{event.type || "N/A"}</td>
										<td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{event.meta?.page || "N/A"}</td>
										<td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{event.meta?.button || "N/A"}</td>
										<td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{event.userId || "N/A"}</td>
									</tr>
								))}
							</tbody>
						</table>
						{events.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No events found matching the current filters.</div>}
					</div>
				</div>
			</div>

			{/* Entries Table */}
			<div>
				<h2>Entries ({entries.length})</h2>
				<div
					style={{
						border: "1px solid #ddd",
						borderRadius: "8px",
						overflow: "hidden",
						backgroundColor: "white",
					}}
				>
					<div style={{ overflowX: "auto" }}>
						<table style={{ width: "100%", borderCollapse: "collapse" }}>
							<thead>
								<tr style={{ backgroundColor: "#f8f9fa" }}>
									<th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Created At</th>
									<th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Zodiac Sign</th>
									<th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Sentiment</th>
									<th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Sentiment Score</th>
									<th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>User ID</th>
								</tr>
							</thead>
							<tbody>
								{entries.map((entry, index) => (
									<tr key={index}>
										<td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "N/A"}</td>
										<td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{entry.zodiacSign || "N/A"}</td>
										<td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{entry.analysis?.sentiment || "N/A"}</td>
										<td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{entry.analysis?.sentimentScore !== undefined ? entry.analysis.sentimentScore.toFixed(2) : "N/A"}</td>
										<td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{entry.userId || "N/A"}</td>
									</tr>
								))}
							</tbody>
						</table>
						{entries.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No entries found matching the current filters.</div>}
					</div>
				</div>
			</div>
		</div>
	);
}
