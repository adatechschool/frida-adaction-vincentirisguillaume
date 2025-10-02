const form = document.getElementById('form');
const nameInput = document.querySelector('.name');
const cityInput = document.querySelector('.location');
const emailInput = document.querySelector('.email');
const associationSelect = document.querySelector('.choixAsso');
const btnRegister = document.getElementById('btnRegister');



form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = nameInput.value;
    const location = cityInput.value;
    const email = emailInput.value;
    // Ajoute d'autres champs si besoin

    if (!username || !location || !email) {
        alert("Merci de remplir tous les champs !");
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
                email
                // Ajoute d'autres champs si besoin
            })
        });

        if (response.ok) {
            alert("Inscription réussie !");
            // Redirection ou autre action
        } else {
            const errorData = await response.json();
            alert("Erreur : " + errorData.error);
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        alert("Erreur lors de l'inscription");
    }
});

//   btnRegister.addEventListener("submit", (e) => {
//     e.preventDefault();
    
//       window.location.href = "pageOrder.html";
    
//   });