const form = document.getElementById("loginForm");
const message = document.getElementById("message");
let idStorage;

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

            //Succès →
            const data = await response.json(); // recupere la reponse en json
            
            localStorage.clear() //efface le local storage
            localStorage.setItem("username", data.username); // ajoute username ds local storage
            localStorage.setItem("id", data.id); // ajoute son id ds local storage également

            // redirige vers profile.html
            window.location.href = "profile.html";

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
