const todayCollect = document.getElementById('today');
const totalPoints = document.getElementById('total');
const btnReturn = document.getElementById('btnReturn');
const btnReturnIndex = document.getElementById('btnReturnIndex');




const displayToday = async () => {

    try {
        const response = await fetch('http://localhost:3000/collects');
        const data = await response.json();
        console.log(data);

        const ptsMegots = 10;
        const ptsCanne = 15;
        const ptsPlastique = 30;
        const ptsConserve = 15;
        const ptsCanette = 20;

        const row = document.createElement('div');

        data.forEach(waste => {
            const totalPointsMegots = (waste.megot * ptsMegots);
            const totalPointsCanne = (waste.canne * ptsCanne);
            const totalPointsPlastique = (waste.plastique * ptsPlastique);
            const totalPointsConserve = (waste.conserve * ptsConserve);
            const totalPointsCanette = (waste.canette * ptsCanette);

            row.innerHTML = `
            <h2> Collecte de la journée</h2>
            <h3>${waste.megot} Mégot(s) = ${totalPointsMegots} points</h3>
            <h3>${waste.canne} Canne(s) = ${totalPointsCanne} points</h3>
            <h3>${waste.plastique} Plastique(s) = ${totalPointsPlastique} points</h3>
            <h3>${waste.conserve} Conserve(s) = ${totalPointsConserve} points</h3>
            <h3>${waste.canette} Canette(s) = ${totalPointsCanette} points</h3>
            <h2>Points de la journée = ${totalPointsMegots + totalPointsCanne + totalPointsPlastique + totalPointsConserve} points</h2>
        </div>
            `;
            todayCollect.appendChild(row);
            
        });
        console.log("total", totalPointsMegots)

    }
    catch (error) {
        console.error('Error fetching collects:', error);
    }

}

displayToday();


btnReturn.addEventListener("click", async() => {
    window.location.href = "wip.html";
})

btnReturnIndex.addEventListener("click", async() => {
    window.location.href = "index.html";
})