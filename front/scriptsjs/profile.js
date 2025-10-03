const helloYou = document.getElementById("spanUser");
//on va chercher le username et id ds localStorage
const userId = localStorage.getItem("id");
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

//fetch infos user
const getUserInfos = async () => {
    const response = await fetch(`http://localhost:3000/volunteer/profile/${userId}`);
    const data = await response.json();
    console.log(data);
    return data;
}

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