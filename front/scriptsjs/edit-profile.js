import { getUserInfos } from "./fetchs-user-assos.js";
import { getAssolist } from "./fetchs-user-assos.js";

const userName = document.getElementById('username');
const locationInput = document.getElementById('location');
const associationInput = document.getElementById('association');
const emailInput = document.getElementById('email');
const emailInput2 = document.getElementById('email2');
const editBtn = document.getElementById('edit-btn');
const userId = localStorage.getItem("id");


const fillPlaceholders = async () => {

    const data = await getUserInfos();
    console.log(data);
    userName.placeholder = data[0].username || 'Non renseigné';
    locationInput.placeholder = data[0].location || 'Non renseigné';
    associationInput.placeholder = data[0].name || 'Non renseignée';
    emailInput.placeholder = data[0].email || 'Non renseignée';
    emailInput2.placeholder = data[0].email || 'Non renseignée';
}
fillPlaceholders();

function assoDropMenu(array) {

    for (const el of array) {
        const option = document.createElement('option');
        option.textContent = el.name;
        associationInput.appendChild(option);
        option.value = el.id;
        option.id = el.id;
    }
}
assoDropMenu(await getAssolist())


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

    //check valeurs
    // console.log(pseudo, location, email, associationId);

    //on envoie dans la DB
        const response = await fetch(`http://localhost:3000/volunteer/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: pseudo,
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

editBtn.addEventListener('click', sendUpdates);
