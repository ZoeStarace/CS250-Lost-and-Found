import { useState } from "react";
import "./report.css";
import { clientAuth } from "../firebase.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Report() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [roomNum, setRoomNum] = useState("");
  const navigate = useNavigate();

  async function handleReportSubmit(e) {
    e.preventDefault();

    try {
      await axios({
        method: "post",
        url: "/api/user/add-item",
        headers: {
          Authorization: `Bearer ${await clientAuth.currentUser.getIdToken()}`,
          "Content-Type": "application/json",
        },
        data: {
          name,
          description,
          location,
          category,
          color,
          room_num: roomNum,
        },
      });

      navigate("/", {
        state: {
          message: "Your item has been reported successfully.",
        },
      });
    } catch (error) {
      console.log("Error reporting item:", error);
      alert("There was a problem submitting your report.");
    }
  }

  return (
    <div className="report-container">
      <form className="report-form-container" onSubmit={handleReportSubmit}>
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

        <select
          className="report-form-select"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="documents">Documents</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>

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
          placeholder="Room Number (optional)"
          maxLength="25"
          value={roomNum}
          onChange={(e) => setRoomNum(e.target.value)}
        />

        <input className="report-form-submit" type="submit" value="Report" />
      </form>
    </div>
  );
}