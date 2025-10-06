const getUserInfos = async () => {
    const userId = localStorage.getItem("id");
    if (!userId) return null;
    const response = await fetch(`http://localhost:3000/volunteer/profile/${userId}`);
    return await response.json();
};


const getAssolist = async () => {
    const response = await fetch('http://localhost:3000/associations');
    const data = await response.json();
    return (data);
}

function assoDropMenu(array, input) {

    for (const el of array) {
        const option = document.createElement('option');
        option.textContent = el.name;
        input.appendChild(option);
        option.value = el.id;
        option.id = el.id;
    }
}

export { getUserInfos , getAssolist, assoDropMenu };