import "./Search.css";
import { useEffect, useMemo, useState } from "react";
import { getIsAdmin, updateItemStatus, deleteItemAdmin } from "../firebase";

function highlight(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");

  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} style={{ backgroundColor: "yellow" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

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
      const res = await fetch(`http://localhost:3000/api/search?${queryString}`);
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

    async function checkAdmin() {
      try {
        const admin = await getIsAdmin();
        setIsAdmin(admin);
      } catch (err) {
        console.log("Error checking admin status:", err);
        setIsAdmin(false);
      }
    }

    checkAdmin();
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

  async function handleMarkFound(itemId) {
    try {
      await updateItemStatus(itemId, "Found");
      fetchItems();
    } catch (err) {
      console.log("Error updating item status:", err);
      alert("Failed to update item status.");
    }
  }

  async function handleDelete(itemId) {
    try {
      await deleteItemAdmin(itemId);
      fetchItems();
    } catch (err) {
      console.log("Error deleting item:", err);
      alert("Failed to delete item.");
    }
  }

  function formatReportedDate(timestamp) {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString();
  }
  const sortedItems = [...items].sort((a, b) => {
  const dateA = a.reportedAt || 0;
  const dateB = b.reportedAt || 0;

  if (sortOrder === "newest") {
    return dateB - dateA;
  }

  return dateA - dateB;
});

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

          <div style={{ marginTop: "20px", marginBottom: "12px" }}>
  <label style={{ marginRight: "8px", fontWeight: "600" }}>
    Sort by date:
  </label>

  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <option value="newest">Newest first</option>
    <option value="oldest">Oldest first</option>
  </select>
</div>
          <div className="search-results">
            {sortedItems.length === 0 ?(
                <p>No items found.</p>
            ) : (
                sortedItems.map((item) => (
                    <div key={item.id} className="search-card">
                     <h3>{highlight(item.name, filters.q)}</h3>
<p>{highlight(item.description, filters.q)}</p>
<p><strong>Location:</strong> {highlight(item.location, filters.q)}</p>
<p><strong>Category:</strong> {highlight(item.category, filters.q)}</p>
<p><strong>Color:</strong> {highlight(item.color, filters.q)}</p>
                      <p><strong>Status:</strong> {item.status}</p>
                      <p><strong>Reported:</strong> {formatReportedDate(item.reportedAt)}</p>

                      {isAdmin && (
                          <div className="search-buttons">
                            <button type="button" onClick={() => handleMarkFound(item.id)}>
                              Mark Found
                            </button>
                            <button type="button" onClick={() => handleDelete(item.id)}>
                              Delete
                            </button>
                          </div>
                      )}
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
  );
}