import { salesToday } from '../state.js';

export const exportToPDF = () => {
    if (salesToday.length === 0) {
        alert("Aucune vente à exporter en PDF.");
        return;
    }
    alert("Fonctionnalité d'exportation PDF non implémentée dans cette maquette.\nNécessite une librairie comme jsPDF.");
    // Implémentation réelle nécessiterait jsPDF ou une solution côté serveur
};

export const exportToExcel = () => {
    if (salesToday.length === 0) {
        alert("Aucune vente à exporter en Excel.");
        return;
    }
    alert("Fonctionnalité d'exportation Excel non implémentée dans cette maquette.\nNécessite une librairie comme SheetJS (xlsx).");
    // Implémentation réelle nécessiterait SheetJS ou une solution côté serveur
};