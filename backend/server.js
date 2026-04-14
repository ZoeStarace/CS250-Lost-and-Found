import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import dotenv from "dotenv";
import { createRequire } from "module";
import { FieldValue } from "firebase-admin/firestore";

const require = createRequire(import.meta.url);
const credentials = require("./serviceAccountKey.json");
dotenv.config();

const app = express();
const port = 3000;

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();
const auth = admin.auth();

app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/api/signup", async (req, res) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const idToken = bearerToken.split(" ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const doc = await db.collection("users").doc(decodedToken.uid).set({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      items: [],
    });
    console.log("User doc created with UID: ", doc.id);
    console.log("User signed up with UID: ", decodedToken.uid);
    res.status(200).json({ message: "User signed up successfully" });
  } catch (error) {
    console.log("Error verifying ID token: ", error);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
});

app.post("/api/login", async (req, res) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const idToken = bearerToken.split(" ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log("User Logged in with UID:", decodedToken.uid);
    return res.status(200).json({
      message: "User logged in successfully",
      uid: decodedToken.uid,
    });
  } catch (error) {
    console.log("Error verifying ID token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
});

app.post("/api/user/add-item", async (req, res) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const idToken = bearerToken.split(" ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const timeNow = Date.now();
    await db
      .collection("users")
      .doc(decodedToken.uid)
      .update({
        items: FieldValue.arrayUnion({
          name: req.body.name,
          description: req.body.description,
          location: req.body.location,
          category: req.body.category,
          color: req.body.color,
          room_num: req.body.room_num,
          status: "Not Found",
          reportedAt: timeNow,
        }),
      });
    await db.collection("items").doc().set({
      uid: decodedToken.uid,
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      category: req.body.category,
      color: req.body.color,
      room_num: req.body.room_num,
      status: "Not Found",
      reportedAt: timeNow,
    });
    res.status(200).json({ message: "Added item to user successfully" });
  } catch (error) {
    console.log("Error adding item to user: ", error);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
});

app.get("/api/search", async (req, res) => {
  console.log("SEARCH ROUTE HIT", req.query);

  const q = (req.query.q || "").toLowerCase().trim();
  const category = (req.query.category || "").toLowerCase().trim();
  const color = (req.query.color || "").toLowerCase().trim();
  const location = (req.query.location || "").toLowerCase().trim();
  const status = (req.query.status || "").toLowerCase().trim();
  const date = (req.query.date || "").trim();

  try {
    const snapshot = await db.collection("items").get();
    console.log("Number of docs:", snapshot.size);

    const results = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      })
      .filter((item) => {
        const itemName = String(item.name || "").toLowerCase();
        const itemDescription = String(item.description || "").toLowerCase();
        const itemCategory = String(item.category || "").toLowerCase();
        const itemColor = String(item.color || "").toLowerCase();
        const itemLocation = String(item.location || "").toLowerCase();
        const itemStatus = String(item.status || "").toLowerCase();

        let itemDate = "";
        if (item.reportedAt) {
          const parsedDate = new Date(item.reportedAt);
          if (!isNaN(parsedDate.getTime())) {
            itemDate = parsedDate.toISOString().split("T")[0];
          }
        }

        const matchesQ =
          !q ||
          itemName.includes(q) ||
          itemDescription.includes(q) ||
          itemCategory.includes(q) ||
          itemColor.includes(q) ||
          itemLocation.includes(q);

        const matchesCategory = !category || itemCategory === category;
        const matchesColor = !color || itemColor.includes(color);
        const matchesLocation = !location || itemLocation.includes(location);
        const matchesStatus = !status || itemStatus === status;
        const matchesDate = !date || itemDate === date;

        return (
          matchesQ &&
          matchesCategory &&
          matchesColor &&
          matchesLocation &&
          matchesStatus &&
          matchesDate
        );
      });

    console.log("Search results count:", results.length);
    res.status(200).json(results);
  } catch (error) {
    console.log("Error searching items:", error);
    console.log("Error message:", error.message);
    console.log("Error stack:", error.stack);
    res.status(500).json({ message: "Search failed", error: error.message });
  }
});

app.use(express.static(path.join(__dirname, "../dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
