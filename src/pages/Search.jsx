import { useState } from "react";
import ".search.css";

                                                                                   

export default function Search() {
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    color: "",
     location: "",
    room_num: "",
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (filters.q.trim()) params.append("q", filters.q.trim());
      if (filters.category.trim()) params.append("category", filters.category.trim());
      if (filters.color.trim()) params.append("color", filters.color.trim());
      if (filters.location.trim()) params.append("location", filters.location.trim());
      if (filters.room_num.trim()) params.append("room_num", filters.room_num.trim());

      const response = await fetch(`/api/items/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFilters({
      q: "",
      category: "",
      color: "",
      location: "",
      room_num: "",
    });
    setItems([]);
    setError("");
  }

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSearch}>
        <h1 className="search-title">Search Reported Items</h1>

        <input
          className="search-input"
          type="text"
          name="q"
          placeholder="Search by name or description"
          value={filters.q}
          onChange={handleChange}
        />

        <input
          className="search-input"
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleChange}
        />

        <input
          className="search-input"
          type="text"
          name="color"
          placeholder="Color"
          value={filters.color}
          onChange={handleChange}
        />

        <input
          className="search-input"
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />

        <input
          className="search-input"
          type="text"
          name="room_num"
          placeholder="Room Number"
          value={filters.room_num}
          onChange={handleChange}
        />

        <div className="search-button-row">
          <button className="search-button" type="submit">
            Search
          </button>
          <button className="search-button reset-button" type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      <div className="search-results">
        {loading && <p>Loading...</p>}
        {error && <p className="search-error">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p>No matching items found.</p>
        )}

        {!loading &&
          !error &&
          items.map((item) => (
            <div className="search-card" key={item.id}>
              <h2>{item.name || "Unnamed Item"}</h2>
              <p><strong>Description:</strong> {item.description || "N/A"}</p>
              <p><strong>Category:</strong> {item.category || "N/A"}</p>
              <p><strong>Color:</strong> {item.color || "N/A"}</p>
              <p><strong>Location:</strong> {item.location || "N/A"}</p>
              <p><strong>Room Number:</strong> {item.room_num || "N/A"}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
