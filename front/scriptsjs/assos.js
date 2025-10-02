let userLine = document.getElementById('collecte-rows');



const getVolunteer = async () => {

    try {
        const response = await fetch('http://localhost:3000/volunteers');
        const data = await response.json();
        console.log(data);
        data.forEach(volunteer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${volunteer.id}</th>
                <td>${volunteer.username}</td>
                <td>${volunteer.points}</td>
                <td>${volunteer.location}</td>
                <td>${volunteer.email}</td>
            `;
            userLine.appendChild(row);
        });
    
}
    catch (error) {
        console.error('Error fetching volunteers:', error);
    }
   
}

getVolunteer();