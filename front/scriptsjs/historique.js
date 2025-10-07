import { getHistoInfo, userId, nouvelleBalise, nouvelleBalise2 } from "./fetchs-iris.js";

const htmlContent = document.getElementById("histo-content");
// const histoCard = document.getElementById("histo-card"); a créer a chaque fois




console.log(userId)

const printCard = async (index, data) => {
    const container = nouvelleBalise2('container', htmlContent)
    container.className = "card"
    nouvelleBalise('div', `Location : ${data[index].location}`, container).id = `location${index}`
    nouvelleBalise('div', `Points : ${data[index].points}`, container).id = `points-collect${index}`
    nouvelleBalise('div', `Association : ${data[index].association_name}`, container).id = `association-collect${index}`
    nouvelleBalise('div', `Date : ${data[index].created_at}`, container).id = `date-collect${index}`
    htmlContent.innerHTML += "<br>"
}



const showHisto = async () => {

    console.log(await getHistoInfo(userId));

    const collect = await getHistoInfo(userId);
    for (let i = 0; i < collect.length; i++) {

        printCard(i, collect)
    }





    // });


}

showHisto();
