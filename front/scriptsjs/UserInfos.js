const getUserInfos = async () => {
    const userId = localStorage.getItem("id");
    if (!userId) return null;
    const response = await fetch(`http://localhost:3000/volunteer/profile/${userId}`);
    return await response.json();
};

export { getUserInfos };