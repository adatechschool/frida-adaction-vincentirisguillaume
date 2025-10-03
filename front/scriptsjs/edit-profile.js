import { getUserInfos } from "./UserInfos.js";

const locationInput = document.getElementById('location');
const associationInput = document.getElementById('association');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userId = localStorage.getItem("id");
const username = localStorage.getItem("username");

// Initial placeholders

locationInput.placeholder = 'Nouvelle localisation';
associationInput.placeholder = 'Nouvelle association';
emailInput.placeholder = 'Nouvel email';
passwordInput.placeholder = 'Nouveau mot de passe';


const fillPlaceholders = async () => {

const data = await getUserInfos();
console.log(data);
console.log(userId, username);
locationInput.placeholder = data[0].location || 'Non renseigné';
associationInput.placeholder = data[0].name || 'Non renseignée';
emailInput.placeholder = data[0].email || 'Non renseignée'; 
}

fillPlaceholders();