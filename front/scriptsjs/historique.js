import { getHistoInfo } from "./fetchs-iris.js";

const htmlContent = document.getElementById("histo-content");
// const histoCard = document.getElementById("histo-card"); a créer a chaque fois

const userId = localStorage.getItem("id");

console.log(userId)

const printCard = async () => {
    console.log(await getHistoInfo(userId));
}
printCard();