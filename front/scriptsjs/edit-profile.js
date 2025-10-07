import { getUserInfos, assoDropMenu, getAssolist } from "./fetchs-iris.js";

//éléments du DOM
const userName = document.getElementById('username');
const locationInput = document.getElementById('location');
const associationInput = document.getElementById('association');
const emailInput = document.getElementById('email');
const emailInput2 = document.getElementById('email2');
const editBtn = document.getElementById('edit-btn');
const userId = localStorage.getItem("id");

//variables globales
let points, nomasso;

// remplit les placeholders avec les infos actuelles du user
const fillPlaceholders = async () => {

    const data = await getUserInfos();
    console.log(data);
    userName.placeholder = data[0].username || 'Non renseigné';
    locationInput.placeholder = data[0].location || 'Non renseigné';
    emailInput.placeholder = data[0].email || 'Non renseignée';
    emailInput2.placeholder = data[0].email || 'Non renseignée';
    points = data[0].points || 'Non renseigné';
}
//appel de la fonction
fillPlaceholders();

// remplit le menu déroulant des associations
assoDropMenu(await getAssolist(), associationInput)

// envoie les updates au clic sur le bouton
const sendUpdates = async (event) => {
    event.preventDefault();

    //valeurs dans inputs
    const pseudo = userName.value;
    const location = locationInput.value;
    const email = emailInput.value;
    const email2 = emailInput2.value;
    const associationId = associationInput.value;

    //verif email transcription
    if (email !== email2) {
        alert("Les emails ne correspondent pas");
        return;
    }
    if (!associationId) {
        alert("pas d'association sélectionnée");
        return;
    }
    //check valeurs
    console.log(pseudo, location, email, associationId, nomasso, points);

    // on envoie dans la DB
    const response = await fetch(`http://localhost:3000/volunteer/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: pseudo,
            points: points,
            location: location,
            email: email,
            association_id: associationId
        }),
    });

    if (response.ok) {
        alert('Profile updated successfully!');
        window.location.href = "profile.html";
    } else {
        alert('Error updating profile. Please try again.');
    }
};

// appelle la fonction au clic
editBtn.addEventListener('click', sendUpdates);
