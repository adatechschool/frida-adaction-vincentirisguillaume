import { assoDropMenu, getAssolist } from "./fetchs-iris.js";

const form = document.getElementById('form');
const nameInput = document.querySelector('.name');
const cityInput = document.querySelector('.loc');
const emailInput = document.querySelector('.email');
const emailInput2 = document.getElementById('email2');
const associationSelect = document.querySelector('.choixAsso');
const passwordInput = document.querySelector('.pass');

let validCities = []; // <-- On garde ici la liste des villes valides

//menu deroulant des associations
assoDropMenu(await getAssolist(), associationSelect);


// Autocomplétion des villes via l'API geo.api.gouv.fr
const datalist = document.getElementById('communes');

cityInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) return;

    const response = await fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=departement&boost=population&limit=5`);
    const data = await response.json();

    console.log("data", data)

    if (!data || data.length === 0) {
        validCities = []; // aucune ville trouvée
        return;
    }
    datalist.innerHTML = '';

    validCities = data.map(commune => commune.nom); // stocke les noms valides

    data.forEach(commune => {
        const option = document.createElement('option');
        option.value = commune.nom;
        datalist.appendChild(option);
    });
    

});


// Validation du formulaire
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = nameInput.value;
    const location = cityInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const association_id = associationSelect.value;

    if (!username || !location || !email) {
        alert("Merci de remplir tous les champs !");
        return;
    }
    if (emailInput.value !== emailInput2.value) {
        alert("Les emails ne correspondent pas");
        return;
    }

    // 🔍 Vérifie que la ville saisie correspond à une ville valide
    if (!validCities.includes(location)) {
        alert("Veuillez sélectionner une ville valide depuis la liste proposée !");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/volunteer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                location,
                email,
                password,
                association_id

            })
        });

        if (response.ok) {
            alert("Inscription réussie !");
            window.location.href = "index.html";
        } else {
            const errorData = await response.json();
            alert("Erreur : " + errorData.error);
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        alert("Erreur lors de l'inscription");
    }
});



