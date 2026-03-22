import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import dotenv from "dotenv";
import { createRequire } from "module";
import { FieldValue } from "firebase-admin/firestore";

const require = createRequire(import.meta.url);
const credientials = require("/Users/munewerkiar/Desktop/App_Dev/credentials/serviceAccount.json");
dotenv.config();

const app = express();
const port = 3000;

admin.initializeApp({
  credential: admin.credential.cert(credientials),
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

app.use(express.static(path.join(__dirname, "../dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
