// import d'outils pour lire l'utilisateur connecté et ses points actuels
import { fetchUserPoints, userId } from './fetchs-iris.js';

// element du DOM pour injecter html et rediriger
const todayCollect = document.getElementById('today');
const btnReturnProfil = document.getElementById('btnReturnIndex');

// variables pour recuperer data flitrée pour injecter ds PUT de mise a jour par collect
let points, collectId, lastCollectAssoId;

// retourne les points et le html en dynamique
const displayToday = async () => {

    try {
        // récupère toutes les collectes
        const response = await fetch('http://localhost:3000/collects');
        const data = await response.json();
        // voir a quoi ca ressemble pour appels ult.
        console.log("collecte:", data);

        //correspondance de points
        const ptsMegots = 10;
        const ptsCanne = 15;
        const ptsPlastique = 30;
        const ptsConserve = 15;
        const ptsCanette = 20;

        // contiendra l'affichage
        const row = document.createElement('div');

        // filter les collects du user avec userId
        const userCollects = data.filter(collect => Number(collect.volunteer_id) === Number(userId));
        // dernier elment du filtre (donc dernière collecte du user)
        let lastCollect = userCollects.at(-1);

        // on recupere collect_id depuis le localstorage
        const idFromLS = localStorage.getItem('collect_id');

        // si quelque chose alors lastCollect devient ce quelque chose
        if (idFromLS) {
            const collectTarg = data.find(c => String(c.id) === String(idFromLS));
            if (collectTarg) lastCollect = collectTarg;
        }

        // recuperation des variables pour PUT la collect
        collectId = lastCollect.id;
        lastCollectAssoId = lastCollect.association_id;

        // calcul des points par type
        const totalPointsMegots = (lastCollect.megot * ptsMegots);
        const totalPointsCanne = (lastCollect.canne * ptsCanne);
        const totalPointsPlastique = (lastCollect.plastique * ptsPlastique);
        const totalPointsConserve = (lastCollect.conserve * ptsConserve);
        const totalPointsCanette = (lastCollect.canette * ptsCanette);
        // total points pour la collecte
        points = totalPointsMegots + totalPointsCanne + totalPointsPlastique + totalPointsConserve + totalPointsCanette;

        //html injecté
        row.innerHTML = `
            <h2> Collecte de la journée</h2>       
            <h3>${lastCollect.megot} Mégot(s) = ${totalPointsMegots} points</h3>
            <h3>${lastCollect.canne} Canne(s) = ${totalPointsCanne} points</h3>
            <h3>${lastCollect.plastique} Plastique(s) = ${totalPointsPlastique} points</h3>
             <h3>${lastCollect.conserve} Conserve(s) = ${totalPointsConserve} points</h3>
            <h3>${lastCollect.canette} Canette(s) = ${totalPointsCanette} points</h3>
            <h2>Points de la journée = ${totalPointsMegots + totalPointsCanne + totalPointsPlastique + totalPointsConserve + totalPointsCanette} points</h2>`;
        todayCollect.appendChild(row);

        // renvoie le total pour la suite du script
        return points;
    }
    catch (error) {
        console.error('Error fetching collects:', error); // suivi : signaler l'échec de récupération
    }

}


// envoie les infos ds la db
async function countUserPoints() {
    // récupère le total calculé par displayToday
    points = await displayToday();

    // check des points
    console.log("points:", points);

    // points déjà accumulés pour le bénévole
    const userPoints = await fetchUserPoints(userId);
    // voir a quoi ca ressemble pour appels ult.
    console.log("userPoints:", userPoints);

    // verifier si on a une valeur ds collectId, a quoi elle correspond?
    console.log("id de la collecte", collectId);

    // variable qui sert à envoyer un body Json "tout pret"
    let variableJson = {
        points: (points + userPoints),
        collect_points: points,
        collect_id: collectId
    }
    // on recupere depuis local storage
    const assoFromLS = localStorage.getItem('asso_id');
    const collectIdFromLS = localStorage.getItem('collect_id');

    // si collectIdFromLS existe on l'envoie ds le json
    if (collectIdFromLS) {
        variableJson.collect_id = collectIdFromLS;
    }

    //si asso_id existe on envoie l'id ds le json
    if (assoFromLS) {
        variableJson.association_id = assoFromLS;
        // sinon si lastCollectAssoId existe on lenvoi ds le json
    } else if (lastCollectAssoId) {
        variableJson.association_id = lastCollectAssoId; // mode COURANT
    }

    // ca part
    try {
        const res = await fetch(`http://localhost:3000/volunteer/points/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(variableJson)
        });

        // si ca s'est bien passé on efface les infos correspondant a une id de l'historique
        if (res.ok) {
            localStorage.removeItem('asso_id');
            localStorage.removeItem('collect_id');
        } else {
            // log status de la response et le message d'erreur associé si res pas ok
            const msg = await res.text();
            console.error('PUT /volunteer/points', res.status, msg);
        }


    } catch (error) {
        console.error('Error updating points:', error);
    }


}

countUserPoints() // lance automatiquement le calcul et l'update à l'ouverture de la page




btnReturnProfil.addEventListener("click", () => {

    window.location.href = "profile.html"; // redirection vers la page profil
})
