import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors({ origin: "http://127.0.0.1:5500"}))
app.use(express.json())


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Route test Neon DB : SELECT * FROM menu
app.get("/volunteers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM volunteers");
    res.json(result.rows);
  } catch (error) {
    // console.error("Erreur Neon DB:", error);
    res.status(500).json({ error: "impossible de récupérer les menus depuis la base Neon", details: error.message, code: error.code });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});