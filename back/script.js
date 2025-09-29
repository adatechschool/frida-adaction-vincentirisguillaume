import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config();

const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
});

const app = express();

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("Accueil");
});


app.get("/volunteers", async (req, res) => {
    try {
        const volunteers = await sql`SELECT * FROM volunteers`;
        console.log(volunteers);
        res.json(volunteers);
    }
    catch (err) {
        console.error('connexion échouée', err);
    }

});



app.listen(3000, () => { console.log("Serveur lancé sur http://localhost:3000"); });