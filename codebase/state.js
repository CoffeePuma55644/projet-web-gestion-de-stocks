// --- DONNÉES (Simulation - Utiliser localStorage pour la persistance) ---
export let stock = JSON.parse(localStorage.getItem('stockData')) || [
    { id: Date.now() + 1, name: "PlayStation 5 Pro", quantity: 20, price: 799.99, image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-dualsense-image-block-01-en-16aug24" },
    { id: Date.now() + 2, name: "Xbox Series X", quantity: 15, price: 499.99, image: "https://static.actu.fr/uploads/2020/02/xbox-series-x-fond-blanc-1.jpg" },
    { id: Date.now() + 3, name: "Nintendo Switch 2", quantity: 30, price: 499.99, image: "https://static-images.lpnt.fr/cd-cw809/images/2025/01/16/27224744lpw-27224953-mega-une-jpg_10784927.jpg" }
];

export let salesToday = JSON.parse(localStorage.getItem('salesTodayData')) || [];

// Variables pour suivre l'ID de l'item en cours d'action
let currentItemToSellId = null;
let currentItemToDeleteId = null;

// --- FONCTIONS DE GESTION DE L'ÉTAT ---

// Sauvegarder les données dans localStorage
export const saveData = () => {
    localStorage.setItem('stockData', JSON.stringify(stock));
    localStorage.setItem('salesTodayData', JSON.stringify(salesToday));
};

// Mettre à jour le stock
export function updateStock(newStock) {
    stock = newStock;
}

// Ajouter une vente
export function addSale(sale) {
    salesToday.push(sale);
}

// Gérer l'ID de l'item à vendre
export function setItemToSellId(id) {
    currentItemToSellId = id;
}
export function getItemToSellId() {
    return currentItemToSellId;
}

// Gérer l'ID de l'item à supprimer
export function setItemToDeleteId(id) {
    currentItemToDeleteId = id;
}
export function getItemToDeleteId() {
    return currentItemToDeleteId;
}