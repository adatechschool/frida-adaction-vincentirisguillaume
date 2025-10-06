
// function fetch sur table volunteers GET
const getUserInfos = async () => {
    const userId = localStorage.getItem("id");
    if (!userId) return null;
    const response = await fetch(`http://localhost:3000/volunteer/profile/${userId}`);
    return await response.json();
};

// function fetch sur table associations GET
const getAssolist = async () => {
    const response = await fetch('http://localhost:3000/associations');
    const data = await response.json();
    return (data);
}

// remplit le menu déroulant des associations
function assoDropMenu(array, input) {

    for (const el of array) {
        const option = document.createElement('option');
        option.textContent = el.name;
        input.appendChild(option);
        option.value = el.id;
        option.id = el.id;
    }
}

//constantes d'identification user
const username = localStorage.getItem("username");
const userId = localStorage.getItem("id");


// function import des points user
const fetchUserPoints = async (id) => {
    try {

        const response = await fetch(`http://localhost:3000/volunteer/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data[0].points;

    } catch (error) {
        console.error('Error fetching user points:', error);
        return null;
    }
}

export { getUserInfos , getAssolist, assoDropMenu, fetchUserPoints, username, userId };