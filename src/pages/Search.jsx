import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function Search() {
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    color: "",
    location: "",
    status: "",
    date: "",
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) params.append(key, value.trim());
    });

    return params.toString();
  }, [filters]);

  async function fetchItems() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/items/search?${queryString}`);
      if (!res.ok) {
        throw new Error("Failed to fetch search results.");
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchItems();
  }

  function handleReset() {
    setFilters({
      q: "",
      category: "",
      color: "",
      location: "",
      status: "",
      date: "",
    });
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <h1>Search Items</h1>
      <p>Search reported lost and found items using filters.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <input
          type="text"
          name="q"
          placeholder="Keyword"
          value={filters.q}
          onChange={handleChange}
        />

        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="documents">Documents</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>

        <input
          type="text"
          name="color"
          placeholder="Color"
          value={filters.color}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />

        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All statuses</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
          <option value="claimed">Claimed</option>
        </select>

        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit">Search</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {loading && <p>Loading results...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "12px",
                  padding: "1rem",
                  background: "#fff",
                  color: "#222",
                }}
              >
                <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                <p><strong>Description:</strong> {item.description || "N/A"}</p>
                <p><strong>Category:</strong> {item.category || "N/A"}</p>
                <p><strong>Color:</strong> {item.color || "N/A"}</p>
                <p><strong>Location:</strong> {item.location_found || "N/A"}</p>
                <p><strong>Status:</strong> {item.status || "N/A"}</p>
                <p><strong>Date:</strong> {item.date_reported || "N/A"}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
