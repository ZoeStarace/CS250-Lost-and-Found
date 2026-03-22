import { useState } from "react";
import "./report.css";
import { addReportedItem } from "../firebase.js";

export default function Report() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [roomNum, setRoomNum] = useState("");

  return (
    <div className="report-container">
      <form className="report-form-container" onSubmit={addReportedItem}>
        <h1 className="report-title">Report Lost Item</h1>
        <input
          className="report-form-input"
          name="name"
          type="text"
          placeholder="Name"
          minLength="1"
          maxLength="25"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="report-form-desc"
          name="description"
          placeholder="Description"
          minLength="1"
          maxLength="200"
          wrap="hard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="report-form-input"
          name="category"
          type="text"
          placeholder="Category"
          minLength="1"
          maxLength="20"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        />
        <input
          className="report-form-input"
          name="color"
          type="text"
          placeholder="Color"
          minLength="1"
          maxLength="20"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
        <input
          className="report-form-input"
          name="location"
          type="text"
          placeholder="Location"
          minLength="1"
          maxLength="25"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          className="report-form-input"
          name="room_num"
          type="text"
          placeholder="Room Number"
          minLength="1"
          maxLength="25"
          value={roomNum}
          onChange={(e) => setRoomNum(e.target.value)}
          required
        />
        <input className="report-form-submit" type="submit" value="Report" />
      </form>
    </div>
  );
}
