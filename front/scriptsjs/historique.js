import { getHistoInfo, userId, nouvelleBalise, nouvelleBalise2 } from "./fetchs-iris.js";


const htmlContent = document.getElementById("histo-content");
// const histoCard = document.getElementById("histo-card"); a créer a chaque fois

function dateFormat(date) {

    return date.slice(0,10);
    
}


const printCard = async (index, data) => {
    const container = nouvelleBalise2('container', htmlContent)
    container.className = "card"
    nouvelleBalise('div', `Location : ${data[index].location}`, container).id = `location${index}`
    nouvelleBalise('div', `Points : ${data[index].collect_points}`, container).id = `points-collect${index}`
    nouvelleBalise('div', `Association : ${data[index].association_name}`, container).id = `association-collect${index}`
    const date = data[index].created_at
    nouvelleBalise('div', `Date : ${dateFormat(date)}`, container).id = `date-collect${index}`
    nouvelleBalise('button', 'editer', container).id = `btn-modifier${index}`
    htmlContent.innerHTML += "<br>";
}



const showHisto = async () => {

    console.log(await getHistoInfo(userId));

    const collect = await getHistoInfo(userId);
    dateFormat(collect[0].created_at)
    for (let i = 0; i < collect.length; i++) {

        printCard(i, collect)
    }





    // });


}

showHisto();
