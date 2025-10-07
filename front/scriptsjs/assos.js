const userLine = document.getElementById('collecte-rows');
const rowsCount = document.getElementById('rows-count');

const getVolunteer = async () => {
  try {
    const response = await fetch('http://localhost:3000/volunteers');
    const data = await response.json();

    console.log("Volunteers:", data);

    // On met à jour le compteur
    rowsCount.textContent = `Nombre de collectes aujourd'hui : ${data.length}`;

    // On vide le tableau avant d’ajouter les lignes (au cas où)
    userLine.innerHTML = "";

    // On crée une ligne pour chaque bénévole
    data.forEach(volunteer => {
      const row = document.createElement('tr');

      // Utilisation de data-label pour le mode mobile
      row.innerHTML = `
        <td data-label="ID">${volunteer.id}</td>
        <td data-label="Nom d'utilisateur">${volunteer.username}</td>
        <td data-label="Points">${volunteer.points ?? 0}</td>
        <td data-label="Location">${volunteer.location || 'Non renseigné'}</td>
        <td data-label="Email">${volunteer.email}</td>
      `;

      userLine.appendChild(row);
    });

  } catch (error) {
    console.error('Erreur lors du chargement des bénévoles :', error);
    rowsCount.textContent = "⚠️ Erreur de connexion au serveur";
  }
};

// Appel de la fonction
getVolunteer();
