
let userLine = document.getElementById('collecte-rows');
const btnReturn = document.getElementById('btn-return');
const btnVolunteer = document.getElementById('btn-volunteer');
const locationFilter = document.getElementById('location-filter');


// Création de la barre de chargement progressive et centrée (styles dans CSS)
const loadingBarContainer = document.createElement('div');
loadingBarContainer.id = 'loading-bar-container';
const loadingBar = document.createElement('div');
loadingBar.id = 'loading-bar';
loadingBarContainer.appendChild(loadingBar);
document.body.appendChild(loadingBarContainer);

let loadingInterval = null;

function showLoading() {
    loadingBarContainer.style.display = 'block';
    loadingBarContainer.style.opacity = '1';
    loadingBar.style.width = '0%';
    let progress = 0;
    clearInterval(loadingInterval);
    loadingInterval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 10 + 5; // Avance de façon aléatoire
            if (progress > 90) progress = 90;
            loadingBar.style.width = progress + '%';
        }
    }, 200);
}
function hideLoading() {
    clearInterval(loadingInterval);
    loadingBar.style.width = '100%';
    setTimeout(() => {
        loadingBarContainer.style.opacity = '0';
        setTimeout(() => {
            loadingBarContainer.style.display = 'none';
            loadingBar.style.width = '0%';
        }, 300);
    }, 400);
}


const getVolunteer = async () => {
    // recuperation des données de chaque volontaire depuis la base de données
    showLoading();
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
                <td><button class="remove-btn">x</button></td>
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
    } finally {
        hideLoading();
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
    showLoading();
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
                <td><button class="remove-btn">x</button></td>
            `;
            userLine.appendChild(row);
        });
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        hideLoading();
    }
};
getVolunteersByAssociation(associationName);

// Ajout des villes dans le select
const populateLocationFilter = async () => {
    showLoading();
    try {
        const response = await fetch('http://localhost:3000/volunteers');
        const data = await response.json();
        const locations = data.map(volunteer => volunteer.location);
        const uniqueLocations = [];
        for (const location of locations) {
            if (!uniqueLocations.includes(location)) {
                uniqueLocations.push(location);
            }
        } // Remove duplicates
        console.log("locationData:", uniqueLocations);
        for (const location of uniqueLocations) {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        }
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        hideLoading();
    }
};

populateLocationFilter();

// fonction pour filtrer les volontaires par ville choisie
const filterVolunteersByLocation = async () => {
    const selectedLocation = locationFilter.value;
    showLoading();
    try {
        const response = await fetch('http://localhost:3000/volunteers');
        const data = await response.json();
        const filteredVolunteers = data.filter(volunteer => volunteer.location === selectedLocation);
        userLine.innerHTML = ''; // fais disparaitre les rangées précédentes
        filteredVolunteers.forEach(volunteer => {
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
    } finally {
        hideLoading();
    }
};

// lance la fonction de filtre a chaque changement dans le select
locationFilter.addEventListener('change', 
    filterVolunteersByLocation);

// redirection vers la page d'accueil
btnReturn.addEventListener("click", async () => {
    window.location.href = "index.html";
})