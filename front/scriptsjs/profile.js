const helloYou = document.getElementById("spanUser");



const userId = localStorage.getItem("id");
const username = localStorage.getItem("username");
console.log(userId, username);


helloYou.textContent = localStorage.getItem("username");

const getUserInfos = async () => {
    const response = await fetch(`http://localhost:3000/volunteer/profile/${userId}`);
    const data = await response.json();
    console.log(data);
    return data;
}

const displayUserInfos = async () => {
    const userInfos = await getUserInfos();
    document.getElementById("location").textContent = userInfos[0].location || "Non renseigné";
    document.getElementById("association").textContent = userInfos[0].name || "Non renseignée";
    document.getElementById("points").textContent = userInfos[0].points || "Non renseignée";

    document.getElementById("email").textContent = userInfos[0].email || "Non renseignée";
    document.getElementById("password").textContent = "*******" || "Non renseigné";
}

displayUserInfos();