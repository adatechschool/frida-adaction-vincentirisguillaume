let userLine = document.getElementById('collecte-rows');
const btnReturn = document.getElementById('btn-return');
const btnVolunteer = document.getElementById('btn-volunteer');


const getVolunteer = async () => {
// recuperation des données de chaque volontaire depuis la base de données
    try {
        const response = await fetch('http://localhost:3000/volunteers');
        const data = await response.json();
        console.log(data);
        data.forEach(volunteer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row" id=idVolunteer>${volunteer.id}</th>
                <td>${volunteer.username}</td>
                <td>${volunteer.points}</td>
                <td>${volunteer.location}</td>
                <td>${volunteer.email}</td>
                <td><button class="remove-btn">X</button></td>
            `;
            userLine.appendChild(row);
            console.log("volunteer.id:", volunteer.id)
            let idVolunteer = volunteer.id;

// suppression d'un volontaire au choix

            let btnRemove = row.querySelector('.remove-btn');
            btnRemove.addEventListener('click', async () => {
                try {
                    const deleteResponse = await fetch(`http://localhost:3000/volunteer/${idVolunteer}`, {
                        method: 'DELETE'
                    });
                    if (deleteResponse.ok) {
                        alert('Volontaire supprimé avec succes');
                        row.remove();
                    } else {
                        alert('Erreur lors de la suppression du volontaire');
                    }
                } catch (error) {
                    console.error('Erreur lors de la suppression du volontaire:', error);
                    alert('Erreur lors de la suppression du volontaire');
                }
            });
        });
    } catch (error) {
        console.error('Erreur:', error);
    }
};

// function pour afficher tous les volontaires
btnVolunteer.addEventListener("click", async () => {
    userLine.innerHTML = ''; // faire disparaitre les autres volontaires
    getVolunteer();
})

//____________________________________________________________
const urlParams = new URLSearchParams(window.location.search);
const associationName = urlParams.get('asso');
console.log("associationName:", associationName);
// function pour afficher les voluntaire d'une asso
const getVolunteersByAssociation = async (associationName) => {
    try {
        const response = await fetch(`http://localhost:3000/volunteers/${associationName}`);
        const data = await response.json();
        console.log("data:", data);
        userLine.innerHTML = ''; // faire disparaitre les autres volontaires
        data.forEach(volunteer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row" id=idVolunteer>${volunteer.id}</th>
                <td>${volunteer.username}</td>
                <td>${volunteer.points}</td>
                <td>${volunteer.location}</td>
                <td>${volunteer.email}</td>
                <td><button class="remove-btn">X</button></td>
            `;
            userLine.appendChild(row);
        });
    } catch (error) {
        console.error('Erreur:', error);
    }
};
getVolunteersByAssociation(associationName);


// redirection vers la page d'accueil
btnReturn.addEventListener("click", async () => {
    window.location.href = "index.html";
})