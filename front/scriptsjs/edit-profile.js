import { getUserInfos } from "./UserInfos.js";

const locationInput = document.getElementById('location');
const associationInput = document.getElementById('association');
const emailInput = document.getElementById('email');
const emailInput2 = document.getElementById('email2');
const editBtn = document.getElementById('edit-profile-btn');

const fillPlaceholders = async () => {

    const data = await getUserInfos();
    console.log(data);

    locationInput.placeholder = data[0].location || 'Non renseigné';
    associationInput.placeholder = data[0].name || 'Non renseignée';
    emailInput.placeholder = data[0].email || 'Non renseignée';
    emailInput2.placeholder = data[0].email || 'Non renseignée';
}

fillPlaceholders();


const getAssolist = async () => {
    const response = await fetch('http://localhost:3000/associations');
    const data = await response.json();
    let assoNames = [];
    data.forEach(item => {
        assoNames.push(item.name)
    });  
    return (assoNames);
}


 function assoChoicesHTML(array){
   for (const el of array) {
    const option = document.createElement('option');
    option.textContent = el;       
    associationInput.appendChild(option);
  }
    
 }

 assoChoicesHTML(await getAssolist())


// const sendUpdates = async () => {

//     const update =
//     {
//         location: locationInput.value,
//         email: emailInput.value,
//         associationId: assocSelect.value, // par exemple, un id récupéré depuis un <select>
//     };

//     const response = await fetch(`/volunteer/${id}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(inforajzkhdkjh),
//     });

// }

// editBtn.addEventListener('click', sendUpdates);