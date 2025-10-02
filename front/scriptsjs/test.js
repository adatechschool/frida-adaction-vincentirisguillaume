const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            // Succès → redirige vers wip.html a changé of course
            window.location.href = "wip.html";
        } else {
            // Échec → message
            const data = await response.json();
            message.textContent = data.error || "Identifiant ou mot de passe incorrect";
        }
    } catch (err) {
        console.error("Erreur réseau", err);
        message.textContent = "Impossible de contacter le serveur";
    }
});