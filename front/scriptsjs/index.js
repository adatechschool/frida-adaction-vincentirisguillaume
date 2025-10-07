const greenpeace = document.getElementById('greenpeace');
const petitsdebrouillard = document.getElementById('petitsdebrouillard');
const seashepherd = document.getElementById('seashepherd');
const wwf = document.getElementById('wwf');
const zerowaste = document.getElementById('zerowaste');

greenpeace.addEventListener('click', () => {
    window.location.href = "./assos.html?asso=Greenpeace";
});
petitsdebrouillard.addEventListener('click', () => {
    window.location.href = "./assos.html?asso=Les Petits Débrouillards";
});
seashepherd.addEventListener('click', () => {
    window.location.href = "./assos.html?asso=Sea Shepherd";
});
wwf.addEventListener('click', () => {
    window.location.href = "./assos.html?asso=WWF";
});
zerowaste.addEventListener('click', () => {
    window.location.href = "./assos.html?asso=Zero Waste";
});