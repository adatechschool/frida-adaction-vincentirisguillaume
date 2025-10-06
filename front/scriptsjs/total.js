import { fetchUserPoints, userId } from './fetchs-user-assos.js';


const todayCollect = document.getElementById('today');
const totalPoints = document.getElementById('total');
const btnReturn = document.getElementById('btnReturn');
const btnReturnProfil = document.getElementById('btnReturnIndex');

let points;



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

        // Récupérer la dernière collecte
        const lastCollect = data.at(-1);

        const totalPointsMegots = (lastCollect.megot * ptsMegots);
        const totalPointsCanne = (lastCollect.canne * ptsCanne);
        const totalPointsPlastique = (lastCollect.plastique * ptsPlastique);
        const totalPointsConserve = (lastCollect.conserve * ptsConserve);
        const totalPointsCanette = (lastCollect.canette * ptsCanette);
        points = totalPointsMegots + totalPointsCanne + totalPointsPlastique + totalPointsConserve;
        row.innerHTML = `
            <h2> Collecte de la journée</h2>       
            <h3>${lastCollect.megot} Mégot(s) = ${totalPointsMegots} points</h3>
            <h3>${lastCollect.canne} Canne(s) = ${totalPointsCanne} points</h3>
            <h3>${lastCollect.plastique} Plastique(s) = ${totalPointsPlastique} points</h3>
             <h3>${lastCollect.conserve} Conserve(s) = ${totalPointsConserve} points</h3>
            <h3>${lastCollect.canette} Canette(s) = ${totalPointsCanette} points</h3>
            <h2>Points de la journée = ${totalPointsMegots + totalPointsCanne + totalPointsPlastique + totalPointsConserve} points</h2>`;
        todayCollect.appendChild(row);
        return points;
    }
    catch (error) {
        console.error('Error fetching collects:', error);
    }

}



async function logpoints() {
    points = await displayToday();
    console.log("points:", points);

    const userPoints = await fetchUserPoints(userId);
    console.log("userPoints:", userPoints);

    try {
        fetch(`http://localhost:3000/volunteer/points/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ points: points + userPoints})
        });

    } catch (error) {
        console.error('Error updating points:', error);
    }

}

logpoints()

btnReturn.addEventListener("click", async () => {
    window.location.href = "wip.html";
})

btnReturnProfil.addEventListener("click", async () => {
    window.location.href = "profile.html";
})