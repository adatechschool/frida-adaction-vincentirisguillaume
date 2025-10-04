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

export { getUserInfos , getAssolist };