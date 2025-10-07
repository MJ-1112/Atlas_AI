// /api/ping.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    // Replace with your Render backend URL
    await axios.get("https://atlas-ai-33l9.onrender.com/health");
    res.status(200).json({ message: "Pinged backend successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ping failed" });
  }
}
