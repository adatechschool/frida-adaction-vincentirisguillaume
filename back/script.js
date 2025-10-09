import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";

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
    // console.log("GET /volunteers");
    try {
        const result = await sql.query("SELECT * FROM volunteers")
        res.json(result.rows)
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer volunteers depuis DB NEON" })
    }
});

// Route pour afficher un bénévole par son id
app.get("/volunteer/:id", async (req, res) => {

    const { id } = req.params;
    // console.log(id);

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
    if (!username || !email || !location || !password) {
        return res.status(400).json({ error: "Champs manquants" });
    }
    try {
        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = nombre de tours (valeur standard)
        const result = await sql.query(
            `INSERT INTO volunteers (username, password, points, association_id, location, email)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [username, hashedPassword, points, association_id, location, email]
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
            "DELETE FROM volunteers WHERE id = $1 RETURNING *   ",
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
    const { username, points, association_id, location, email } = req.body;
    try {
        const result = await sql.query(
            "UPDATE volunteers SET username = $1,  points = $2, association_id = $3, location = $4, email = $5 WHERE id=$6 RETURNING *",
            [username, points, association_id, location, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Bénévole non trouvé" });
        }
        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: "Impossible de mettre à jour le bénévole" });
    }
});

//Route pour ajouter des points a un benevole apres une collecte
app.put("/volunteer/points/:id", async (req, res) => {
    const { id } = req.params;
    const { points, collect_points, collect_id, association_id } = req.body;
    try {
        const result = await sql.query(
            `WITH collecte AS (
            UPDATE collects
            SET collect_points = $1,
                association_id = COALESCE($5, association_id)
            WHERE id = $2
            AND volunteer_id = $3
            RETURNING collect_points
   )
   UPDATE volunteers
   SET points = $4
   FROM collecte
   WHERE volunteers.id = $3
   RETURNING volunteers.*`,

            [collect_points, collect_id, id, points, association_id]);


        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Bénévole non trouvé" });
        }
        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: "Impossible de mettre à jour le bénévole" });
    }
});




// Route JOIN infos profil + nom asso --> mais PAS le mdp !!!
app.get("/volunteer/profile/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query(
            `SELECT 
                volunteers.id,
                volunteers.username,
                volunteers.points,
                volunteers.association_id,
                volunteers.location,
                volunteers.email,
                associations.name AS association_name
             FROM volunteers
             JOIN associations ON volunteers.association_id = associations.id
             WHERE volunteers.id = $1`,
            [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ Error: "il n'y a pas/plus de volunteer avec cet id" });
        }

        res.json(result.rows);
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer volunteers depuis DB NEON" })

    }
});

// Route pour afficher les associations
app.get("/associations", async (req, res) => {
    // console.log("GET /associations");
    try {
        const result = await sql.query("SELECT * FROM associations")
        res.json(result.rows)
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer associations depuis DB NEON" })
    }
});

// Route pour ajouter des dechets
app.post("/postCollects", async (req, res) => {
    const { location, megot, canne, plastique, conserve, canette, volunteer_id, created_at, updated_at, association_id } = req.body;

    if (!location || megot == null || canne == null || plastique == null || conserve == null || canette == null || !volunteer_id || !association_id) {
        return res.status(400).json({ error: "Champs manquants" });
    }
    try {
        const result = await sql.query(
            `INSERT INTO collects (location, megot, canne, plastique, conserve, canette, volunteer_id, created_at, updated_at, association_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [location, megot, canne, plastique, conserve, canette, volunteer_id, created_at, updated_at, association_id]

        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: "impossible d'ajouter les dechets" });
    }
});

// Route pour modifier une collecte
app.put("/collects/:id", async (req, res) => {
    const { id } = req.params;
    const { location, megot, canne, plastique, conserve, canette, volunteer_id, updated_at, association_id } = req.body;
    try {
        const result = await sql.query(
            `UPDATE collects 
            SET location = $1, megot = $2, canne = $3,
            plastique = $4, conserve = $5, canette = $6,
            volunteer_id = $7, updated_at = $8,
            association_id = COALESCE($9, association_id)
            WHERE id=$10 AND volunteer_id = $7 RETURNING *`,
            [location, megot, canne, plastique, conserve, canette, volunteer_id, updated_at, association_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Collecte non trouvée" });
        }
        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: "Impossible de mettre à jour la collecte" });
    }
});

// Route pour supprimer une collecte
app.delete("/collects/:id", async (req, res) => {
    const { id } = req.params;
    const {volunteer_id} = req.body
    try {
        const result = await sql.query(
            `DELETE FROM collects
            WHERE id = $1 AND volunteer_id = $2
            RETURNING *`,
            [id, volunteer_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Collecte non trouvée" });
        }
        res.json({ message: "Collecte supprimée", collect: result.rows[0] });
    } catch (e) {
        res.status(500).json({ error: "Impossible de supprimer la collecte" });
    }
});


//________________________________________________________________________________
// Route pour le login TEST
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Cherche l'utilisateur par username
        const result = await sql.query(
            "SELECT * FROM volunteers WHERE username=$1",
            [username]
        );
        if (result.rows.length === 0) {
            // Utilisateur non trouvé
            return res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
        }
        const user = result.rows[0];
        // Vérifie le mot de passe avec bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            // Succès → renvoie message + renvoie user.username et user.id
            return res.status(200).json({
                message: "Connexion réussie",
                id: user.id,
                username: user.username
            });
        } else {
            // Échec
            return res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

app.listen(3000, () => {
    // console.log("HELLO SERVER");
})



//________________________________________________________________________________
//Ajouter route vers Collects

app.get("/collects", async (req, res) => {
    // console.log("GET /collects");
    try {
        const result = await sql.query("SELECT * FROM collects ORDER BY ID")
        res.json(result.rows)
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer collects depuis DB NEON" })
    }
});

//________________________________________________________________________________
//test ajout route pour les associations

app.get("/volunteers/:asso", async (req, res) => {

    const { asso } = req.params;
    // console.log(asso);

    try {
        const result = await sql.query("SELECT volunteers.*, associations.name AS association_name FROM volunteers LEFT JOIN associations ON volunteers.association_id = associations.id WHERE associations.name = $1", [asso]);
        if (result.rows.length === 0) {
            throw new Error(res.status(404).json({ Error: "il n'y a pas/plus de volunteer avec cette association" }));
        }
        res.json(result.rows);
    }
    catch (e) {
        res.status(500).json({ e: "impossible de recuperer volunteers lié a cette association depuis DB NEON" })

    }
});
// Route pour afficher un bénévole par son id

app.get("/volunteer/:id", async (req, res) => {

    const { id } = req.params;
    // console.log(id);

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

// route pour affichage de l'historique des collectes d'un benevole
app.get("/collects/volunteer/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query(
            `SELECT 
            collects.id AS collect_id, 
            collects.association_id,
            collects.collect_points,
            collects.location,
            collects.created_at,
            volunteers.username,
            volunteers.points,
            associations.name AS association_name
            FROM collects
            JOIN volunteers on collects.volunteer_id = volunteers.id
            JOIN associations ON collects.association_id = associations.id
            WHERE volunteers.id = $1
            ORDER BY collects.id DESC`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ Error: "il n'y a pas/plus de collects pour ce benevole" });
        }
        res.json(result.rows);
    }
    catch (e) {
        res.status(500).json({ e: 'impossible de recuperer collects et volunteers infos from DB' })
    }
});