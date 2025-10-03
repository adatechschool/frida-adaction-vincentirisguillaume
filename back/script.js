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
            throw new Error(res.status(404).json({ Error: "il n'y a pas/plus de volunteer avec cet id" }));
        }
        res.json(result.rows);
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer volunteers depuis DB NEON" })

    }
});

// Route pour créer un bénévole
app.post("/volunteer", async (req, res) => {
    const { username, password, points, association_id, location, email } = req.body;
    console.log(username);

    if (!username || !email || !location) {
        return res.status(400).json({ error: "Champs manquants" });
    }
    try {
        const result = await sql.query(
            `INSERT INTO volunteers (username, password, points, association_id, location, email)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [username, password, points, association_id, location, email]

        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        console.error(e);
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
    const { username, password, points, association_id, location, email } = req.body;
    try {
        const result = await sql.query(
            "UPDATE volunteers SET username = $1, password = $2, points = $3, association_id = $4, location = $5, email = $6 WHERE id=$7 RETURNING *",
            [username, password, points, association_id, location, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Bénévole non trouvé" });
        }
        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: "Impossible de mettre à jour le bénévole" });
    }
});


// Route pour afficher les infos du profil + nom association
app.get("/volunteer/profile/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query(
            `SELECT * 
             FROM volunteers
             JOIN associations ON volunteers.association_id = associations.id
             WHERE volunteers.id = $1`,
            [id]);
        res.json(result.rows);
        if (result.rows.length === 0) {
            throw new Error(res.status(404).json({ Error: "il n'y a pas/plus de volunteer avec cet id" }));
        }
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer volunteers depuis DB NEON" })

    }
});

// Route pour ajouter des dechets
app.post("/postypes", async (req, res) => {
    const { megot, canne, plastique, conserve, canette } = req.body;

    if (!megot || !canne || !plastique || !conserve || !canette) {
        return res.status(400).json({ error: "Champs manquants" });
    }
    try {
        const result = await sql.query(
            `INSERT INTO types (megot, canne, plastique, conserve, canette)
             VALUES ($1, $2, $3, $4, $5)`,
            [megot, canne, plastique, conserve, canette]

        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: "impossible d'ajouter les dechets" });
    }
});
//________________________________________________________________________________
// Route pour le login TEST
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Vérifie si un user correspond dans ta table volunteers
        const result = await sql.query(
            "SELECT * FROM volunteers WHERE username=$1 AND password=$2",
            [username, password]
        );

        console.log(result.rows[0]);

        if (result.rows.length > 0) {

            // met la ligne resultat ds user
            const user = result.rows[0];

            // Succès → renvoie message + renvoie user.username et user.id
            return res.status(200).json({
                message: "Connexion réussie",
                id: user.id,
                username: user.username
            });
        }
        else {
            // Échec
            return res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

app.listen(3000, () => {
    console.log("HELLO SERVER");
})
