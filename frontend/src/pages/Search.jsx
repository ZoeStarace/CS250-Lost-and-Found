import "./Search.css";
import { useEffect, useMemo, useState } from "react";

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
        const res = await fetch(`http://localhost:3000/api/search?${queryString}`);      if (!res.ok) {
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
    const resetFilters = {
      q: "",
      category: "",
      color: "",
      location: "",
      status: "",
      date: "",
    };

    setFilters(resetFilters);
    setItems([]);
    setError("");
  }

  function formatReportedDate(timestamp) {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString();
  }

  return (
    <div className="search-container">
      <div className="search-box">
        <h1 className="search-title">Search Items</h1>

        <form onSubmit={handleSubmit} className="search-form">
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
            <option value="Not Found">Not Found</option>
            <option value="Found">Found</option>
            <option value="Claimed">Claimed</option>
          </select>

          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
          />

          <div className="search-buttons">
            <button type="submit">Search</button>
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p className="search-error">{error}</p>}

        <div className="search-results">
          {items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="search-card">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Color:</strong> {item.color}</p>
                <p><strong>Status:</strong> {item.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
