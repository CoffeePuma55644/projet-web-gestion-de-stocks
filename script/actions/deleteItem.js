import { stock, updateStock, saveData, getItemToDeleteId, setItemToDeleteId } from '../../state.js';
import { renderStockTable, renderSalesSummary } from '../ui/renderer.js';
import { confirmDeleteModal } from '../ui/modals.js';

export const confirmItemDeletion = () => {
    const itemId = getItemToDeleteId();
    if (itemId !== null) {
        const newStockData = stock.filter(item => item.id !== itemId);
        updateStock(newStockData);
        saveData();
        renderStockTable();
        renderSalesSummary(); // Au cas où, bien que non directement impacté.
        confirmDeleteModal.hide();
        setItemToDeleteId(null); // Réinitialiser l'ID
    }
};