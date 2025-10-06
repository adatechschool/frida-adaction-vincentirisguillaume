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

// Fonction pour envoyer les données à la base Neon
async function sendToDatabase() {
  const payload = {
    date: document.getElementById('collecte-date')?.textContent?.trim(),
    location: document.getElementById('location-select')?.value,
    items: getAllCounts()
  };

  try {
    const response = await fetch('http://localhost:3000/api/postCollects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
  });
});

// Validation des inputs (empêcher valeurs négatives)
document.querySelectorAll('.count').forEach(input => {
  input.addEventListener('input', () => {
    let value = Number(input.value) || 0;
    if (value < 0) value = 0;
    input.value = value;
  });
});

// Gestion du bouton Enregistrer avec feedback visuel
document.getElementById('save-btn')?.addEventListener('click', async () => {
  const saveBtn = document.getElementById('save-btn');
  const originalText = saveBtn.textContent;
  
  try {
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Sauvegarde...';
    }
    await sendToDatabase();
    
    // Feedback succès
    saveBtn.textContent = '✓ Sauvegardé!';
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }, 2000);
  } catch (error) {
    // Feedback erreur
    saveBtn.textContent = '❌ Erreur';
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }, 2000);
  }
});

// --- Helpers d'accès global --- //
window.getValues = function getValues() {
  return getAllCounts().map(o => o.count); // [12, 3, 0, ...]
};

window.getLocation = function getLocation() {
  return document.getElementById('location-select')?.value ?? null;
};
// const values = getValues();   // tableau de tous tes nombres
// const location = getLocation(); // valeur du select
// console.log('Values:', values, 'Location:', location);