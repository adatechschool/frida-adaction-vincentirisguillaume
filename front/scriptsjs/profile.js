import { getUserInfos } from "./fetchs-user-assos.js";

const helloYou = document.getElementById("spanUser");
const editBtn = document.getElementById("edit-profile-btn");
const collectBtn = document.getElementById("new-collect-btn");


//on va chercher le username et id ds localStorage

const username = localStorage.getItem("username");
// console.log(userId, username);


//fonction majuscule sur le prénom
const majuscule = (str) => {
const str2 = str.split("");
str2[0]= str2[0].toUpperCase();
return str2.join("");
}

//affiche le prenom dans le titre
helloYou.textContent = majuscule(username);


//affiche les infos user dans la page
const displayUserInfos = async () => {
    const userInfos = await getUserInfos();
    document.getElementById("location").textContent = userInfos[0].location || "Non renseigné";
    document.getElementById("association").textContent = userInfos[0].name || "Non renseignée";
    document.getElementById("points").textContent = userInfos[0].points || "Non renseignée";

    document.getElementById("email").textContent = userInfos[0].email || "Non renseignée";
    document.getElementById("password").textContent = "*******" || "Non renseigné";
}

displayUserInfos();

addEventListener("load", () => {
    editBtn.addEventListener("click", () => {
        window.location.href = "edit-profile.html";
    })

    collectBtn.addEventListener("click", () => {
        window.location.href = "./wip.html";
    })
});

// Note: Pour la gestion des mots de passe, le hachage doit être fait côté serveur pour des raisons de sécurité.