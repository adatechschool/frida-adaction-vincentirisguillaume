import { getUserInfos } from "./fetchs-iris.js";

// recuperatiion des variables asso user et collect
const volunteer = localStorage.getItem("id");
const assoIdLS = localStorage.getItem("association_edit_id")
const collectIdLS = localStorage.getItem("collecte_edit_id");
console.log("volunteer_id:", volunteer);
console.log("asso_id:", assoIdLS);
console.log("collect_id:", collectIdLS);


// ? = si collectIdFromLS existe (valeur “vraie”), alors le  mode = 'EDIT', sinon mode = 'CREATE'.
const mode = collectIdLS ? 'EDIT' : 'CREATE';
// Ça s’appelle l’opérateur ternaire, chat gpt l'a suggeré mais je trouve ca stylé
// voir le mode actuel :
console.log("mode:", mode);


// Utilitaire pour récupérer les valeurs de tous les compteurs
function getAllCounts() {
  const results = [];
  document.querySelectorAll('.item').forEach(item => {
    const titleEl = item.querySelector('.item-title');
    const input = item.querySelector('.count');
    const monthlyEl = item.querySelector('.monthly');
    if (!input || !titleEl) return;

    results.push({
      name: titleEl.textContent.trim(),
      count: Number(input.value) || 0,
      monthly: Number(monthlyEl?.textContent) || 0,
    });
  });
  return results;
}

// Fonction pour envoyer les données vers la base Neon
async function sendToDatabase() {

  //fetch sur les infos actuelles du user
  const userInfos = await getUserInfos()

  //compteur numeros deux uniquement//
  const location = document.getElementById('location-select').value;
  const megot = getAllCounts().map(o => o.count)[0];
  const plastique = getAllCounts().map(o => o.count)[1];
  const canette = getAllCounts().map(o => o.count)[2];
  const canne = getAllCounts().map(o => o.count)[3];
  const conserve = getAllCounts().map(o => o.count)[4];

  const total = megot + plastique + canette + canne + conserve;



  if (total === 0)
    return;

  const now = new Date().toISOString();

  //_________________________//



  try {
    const response = await fetch('http://localhost:3000/postCollects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location: location,
        megot: megot,
        plastique: plastique,
        canette: canette,
        canne: canne,
        conserve: conserve,
        volunteer_id: volunteer,
        created_at: now,
        association_id: userInfos[0].association_id
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Sauvegarde réussie:', result);
    return result;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    throw error;
  }
}

// // Fonction pour modifier la collecte ds la base neon
async function updateDatabase() {

  //fetch sur les infos actuelles du user
  const userInfos = await getUserInfos()

  //compteur numeros deux uniquement//
  const location = document.getElementById('location-select').value;
  const megot = getAllCounts().map(o => o.count)[0];
  const plastique = getAllCounts().map(o => o.count)[1];
  const canette = getAllCounts().map(o => o.count)[2];
  const canne = getAllCounts().map(o => o.count)[3];
  const conserve = getAllCounts().map(o => o.count)[4];

  const total = megot + plastique + canette + canne + conserve;

  if (total === 0)
    return;

  const now = new Date().toISOString();

  const bodyJson = {
    location: location,
    megot: megot,
    plastique: plastique,
    canette: canette,
    canne: canne,
    conserve: conserve,
    volunteer_id: volunteer,
    updated_at: now
  }
  if (assoIdLS) { bodyJson.association_id = assoIdLS; }


  try {
    const response = await fetch(`http://localhost:3000/collects/${collectIdLS}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyJson)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Sauvegarde réussie:', result);
    return result;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    throw error;
  }
}

// Gestion des boutons + et -
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('.count');
    if (!input) return;

    let value = Number(input.value) || 0;
    if (btn.classList.contains('plus')) {
      value++;
    } else if (btn.classList.contains('minus')) {
      value = Math.max(0, value - 1);
    }
    input.value = value;
    //_____________//
    console.log("input.value:", input.value)
    console.log("compteur uniquement:", getAllCounts().map(o => o.count), "array des compteurs", getAllCounts())
  });
});

// Validation des inputs (empêcher valeurs négatives)
document.querySelectorAll('.count').forEach(input => {
  input.addEventListener('input', () => {
    let value = Number(input.value) || 0;
    if (value < 0) value = 0;
    input.value = value;
    console.log("input.value", input.value)
  });
});


// Gestion du bouton Enregistrer avec feedback visuel
document.getElementById('save-btn')?.addEventListener('click', async () => {
  const saveBtn = document.getElementById('save-btn');

  if (!saveBtn) return;

  const originalText = saveBtn.textContent;
  const counts = getAllCounts().map(o => o.count);
  const hasItems = counts.some(value => value > 0);

  if (!hasItems) {
    saveBtn.textContent = 'Ajoutez un élément';
    setTimeout(() => {
      saveBtn.textContent = originalText;
    }, 2000);
    return;
  }
  
  try {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Sauvegarde...';

    // MODIF ICI selon le mode
    if (mode === 'EDIT') {

      //PUT edit dataB
      const res = await updateDatabase();

      // on envoie pour total.js
      localStorage.setItem("collect_id", collectIdLS);
      if (assoIdLS) localStorage.setItem('asso_id', String(assoIdLS));

      // si ca s'est bien passé on efface les infos correspondant a une id de l'historique
      localStorage.removeItem('association_edit_id');
      localStorage.removeItem('collecte_edit_id');

    }
    // mode === 'CREATE'
    else {
      const create = await sendToDatabase();
      if (!create) return;

      // on envoie pour total.js
      localStorage.setItem('collect_id', create.id);
      if (create.association_id != null) {
      localStorage.setItem('asso_id', create.association_id);
      }
    }

    // Feedback succès
    saveBtn.textContent = '✓ Sauvegardé!';
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }, 2000);

    //userInfos[0].association_name

    window.location.href = "total.html";
  } catch (error) {
    console.error('Erreur Lors de la sauvegarde:', error);
    // Feedback erreur
    saveBtn.textContent = '❌ Erreur';
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }, 2000);
  }
});
