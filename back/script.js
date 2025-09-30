import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();


app.use(cors());

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


// Route pour créer un bénévole
app.post("/volunteer", async (req, res) => {
    const { username, email, location } = req.body;
   console.log(username);
    
    if (!username || !email || !location) {
        return res.status(400).json({ error: "Champs manquants" });
    }
    try {
        const result = await sql.query(
             `INSERT INTO volunteers (username, location, email)
             VALUES ($1, $2, $3)`,
            [username, location, email]
        
        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: "Impossible de créer le bénévole" });
    }
});


// app.post("/test", async (req, res) => {
//     const {username} = 
// })

// // Route pour supprimer un bénévole
// app.delete("/volunteer/:id", async (req, res) => {
//     const { id } = req.params;
//     try {
//         const result = await sql.query(
//             "DELETE FROM volunteers WHERE id = $1 RETURNING *",
//             [id]
//         );
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: "Bénévole non trouvé" });
//         }
//         res.json({ message: "Bénévole supprimé", volunteer: result.rows[0] });
//     } catch (e) {
//         res.status(500).json({ error: "Impossible de supprimer le bénévole" });
//     }
// });

// Route pour mettre à jour un bénévole
// app.put("/volunteer/:id", async (req, res) => {
//     const { id } = req.params;
//     const { username, email, location } = req.body;
//     try {
//         const result = await sql.query(
//             "UPDATE volunteers SET username = $1, email = $2, location = $3 WHERE id = $4 RETURNING *",
//             [username, email, location, id]
//         );
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: "Bénévole non trouvé" });
//         }
//         res.json(result.rows[0]);
//     } catch (e) {
//         res.status(500).json({ error: "Impossible de mettre à jour le bénévole" });
//     }
// });
// // Route pour lire les bénévoles par localisation
// app.get("/volunteer/location/:location", async (req, res) => {
//     const { location } = req.params;
//     try {
//         const result = await sql.query(
//             "SELECT * FROM volunteers WHERE location = $1",
//             [location]
//         );
//         res.json(result.rows);
//     } catch (e) {
//         res.status(500).json({ error: "Impossible de récupérer les bénévoles par localisation" });
//     }
// });

app.listen(3000, () => {
    console.log("HELLO SERVER");
})
