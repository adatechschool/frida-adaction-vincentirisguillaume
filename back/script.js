import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();


app.use(cors({ origin: "http://127.0.0.1:5500" }));

//utilises et reconnais JSON
app.use(express.json());


// c'est a ca que tu te connectes pour acceder à la database
const sql = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

app.get("/volunteers", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM volunteers")
        res.json(result.rows)
    }
    catch (e) {
        res.status(500).json({ e : "impossible de recuperer volunteers depuis DB NEON" })

    }
    finally {
        console.log("test")
    }
});

app.listen(3000, () => {
    console.log("HELLO SERVER");
})


// app.post("/test", async (req, res) => {
//     const {username} = 
// })