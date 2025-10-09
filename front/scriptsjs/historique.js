// outils pour recuperer les infos user, afficher l'historique, créer des balises
import { getHistoInfo, userId, nouvelleBalise, nouvelleBalise2 } from "./fetchs-iris.js";

// elements du DOM
const htmlContent = document.getElementById("histo-content");
const textBtn = "edit collect"
const returnBtnTxt = "retour profil"
const deleteBtnTxt = "Supprimer"

// fonction qui affiche la date version humains
function dateFormat(date) {

    return date.slice(0, 10);

}

// imprimer le resultat du fetch dans une "carte"
const printCard = async (index, data) => {

    // recuperation de la date de la collecte
    const date = data[index].created_at

    // creation d'un container par carte, class = "card"
    const container = nouvelleBalise2('container', htmlContent)
    container.className = "card"

    // creation et affichage de location, points, nom de l'asso, date de la collecte, bouton editer collecte
    nouvelleBalise('div', `Location : ${data[index].location}`, container).id = `location${index}`
    nouvelleBalise('div', `Points : ${data[index].collect_points}`, container).id = `points-collect${index}`
    nouvelleBalise('div', `Association : ${data[index].association_name}`, container).id = `association-collect${index}`
    nouvelleBalise('div', `Date : ${dateFormat(date)}`, container).id = `date-collect${index}`
    const modifBtn = nouvelleBalise('button', textBtn, container);
    const deleteBtn = nouvelleBalise('button', deleteBtnTxt, container)

    //parametres du btn : id, value 
    modifBtn.value = data[index].association_id
    modifBtn.id = `btn-modifier${index}`

    // au clic sur ce btn:
    modifBtn.addEventListener('click', (e) => {
        e.preventDefault()
        // console.log(modifBtn.value)
        // console.log(data[index].collect_id);

        // stocker dans le local storage l'id de l'asso et de la collecte selectionée
        localStorage.setItem("association_edit_id", modifBtn.value)
        localStorage.setItem("collecte_edit_id", data[index].collect_id);

        // direction page edition collecte
        window.location.href = "./wip.html"
    });

    // bouton delete collect
    deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // si clic par erreur
        const ok = confirm('Supprimer cette collecte ?');
        // retourne au clic sur annuler
        if (!ok) return;

        // j'ai besoin de l'id de la collect selectionnée pour le delete
        const collectId = data[index].collect_id;

        // action de delete via route delete
        try {
            const res = await fetch(`http://localhost:3000/collects/${collectId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ volunteer_id: userId })
            });
            
            // si ca se passe mal message d'erreur
            if (!res.ok) {
                const msg = await res.text();
                console.error('DELETE /collects failed', res.status, msg);
                alert('Suppression impossible.');
                return;
            }

            // Retire la carte du DOM
            container.remove();
            // window.location.reload();
            
        } catch (err) {
            console.error('Erreur de suppression:', err);
            alert('Erreur lors de la suppression');
        }
    });
}


// afficher l'historique des collectes du user dans le DOM
const showHisto = async () => {

    // voir la data
    console.log("getHistoInfo:", await getHistoInfo(userId));

    // recuperer l'historique des collectes users (ordre de la derniere a la premiere)
    const collect = await getHistoInfo(userId);

    // affiche un carte par collecte
    for (let i = 0; i < collect.length; i++) {
        printCard(i, collect)
    }

}
// affiche 
showHisto();

// creer un bouton revenir au profil
nouvelleBalise("button", returnBtnTxt, htmlContent).id = "profil-redirect";
const profilReturn = document.getElementById("profil-redirect")
profilReturn.addEventListener('click', () => {
    window.location.href = "profile.html"
})
