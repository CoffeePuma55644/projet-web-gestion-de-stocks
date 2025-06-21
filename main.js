import { renderStockTable, renderSalesSummary } from './script/ui/renderer';
import { initializeEventListeners } from './eventListeners';

console.log("Le fichier main.js est chargé !")

// S'assurer que le DOM est chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners(); // Configurer tous les écouteurs d'événements
    renderStockTable(); // Afficher le tableau initial des stocks
    renderSalesSummary(); // Afficher le récapitulatif initial des ventes
});