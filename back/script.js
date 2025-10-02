import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";

const { Pool } = pkg;
dotenv.config();
const app = express();
app.use(cors());
//utilises et reconnais JSON
app.use(express.json());

// c'est a ca que tu te connectes pour acceder à la database
const sql = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.get("/volunteers", async (req, res) => {
    console.log("GET /volunteers");
    try {
        const result = await sql.query("SELECT * FROM volunteers")
        res.json(result.rows)
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer volunteers depuis DB NEON" })
    }
});

app.get("/volunteer/:id", async (req, res) => {

    const { id } = req.params;
    console.log(id);

    try {
        const result = await sql.query("SELECT * FROM volunteers WHERE id=$1", [id])
        if (result.rows.length === 0) {
            throw new Error (res.status(404).json({ Error:"il n'y a pas/plus de volunteer avec cet id"}));
        }
        res.json(result.rows)
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer volunteers depuis DB NEON" })

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
            `INSERT INTO volunteers (username, email, location)
             VALUES ($1, $2, $3)`,
            [username, email, location]

        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: "Impossible de créer le bénévole" });
    }
});


// Route pour supprimer un bénévole
app.delete("/volunteer/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query(
            "DELETE FROM volunteers WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Bénévole non trouvé" });
        }
        res.json({ message: "Bénévole supprimé", volunteer: result.rows[0] });
    } catch (e) {
        res.status(500).json({ error: "Impossible de supprimer le bénévole" });
    }
});

// Route pour mettre à jour un bénévole
app.put("/volunteer/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password, points, collect_id, location, email } = req.body;
    try {
        const result = await sql.query(
            "UPDATE volunteers SET username = $1, password = $2, points = $3, collect_id = $4, location = $5, email = $6 WHERE id=$7 RETURNING *",
            [username, password, points, collect_id, location, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Bénévole non trouvé" });
        }
        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: "Impossible de mettre à jour le bénévole" });
    }
});

// Route pour ajouter des dechets
app.post("/postypes", async (req, res) => {
    const { megot, canne, plastique, conserve, cannette } = req.body;

    if (!megot || !canne || !plastique || !conserve || !cannette) {
        return res.status(400).json({ error: "Champs manquants" });
    }
    try {
        const result = await sql.query(
            `INSERT INTO types (megot, canne, plastique, conserve, cannette)
             VALUES ($1, $2, $3, $4, $5)`,
            [megot, canne, plastique, conserve, cannette]

        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: "impossible d'ajouter les dechets" });
    }
});
// route pour lire les types de dechets
app.get("/types", async (req, res) => {
    console.log("GET /types");
    try {
        const result = await sql.query("SELECT * FROM types")
        res.json(result.rows)
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer les types de dechets depuis DB NEON" })
    }
});

//route pour lire les collectes
app.get("/collects", async (req, res) => {
    console.log("GET /collects");
    try {
        const result = await sql.query("SELECT * FROM collects")
        res.json(result.rows)
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer les collectes depuis DB NEON" })
    }
});
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
