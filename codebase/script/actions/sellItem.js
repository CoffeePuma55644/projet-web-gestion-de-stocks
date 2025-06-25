import { stock, updateStock, addSale, saveData, getItemToSellId, setItemToSellId } from '../../state.js';
import { renderStockTable, renderSalesSummary } from '../ui/renderer.js';
import { confirmSaleModal } from '../ui/modals.js';

export const confirmItemSale = () => {
    const itemId = getItemToSellId();
    if (itemId !== null) {
        const itemIndex = stock.findIndex(item => item.id === itemId);
        if (itemIndex !== -1 && stock[itemIndex].quantity > 0) {
            // Crée une nouvelle copie du tableau stock pour la mise à jour
            const updatedStockArray = stock.map((item, index) => {
                if (index === itemIndex) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
            updateStock(updatedStockArray); // Met à jour l'état avec le nouveau tableau

            const soldItem = stock[itemIndex]; // L'item original avant la décrémentation pour les détails de la vente
            addSale({
                itemId: soldItem.id,
                name: soldItem.name,
                price: soldItem.price, // Prix au moment de la vente
                timestamp: new Date().toISOString()
            });

            saveData();
            renderStockTable();
            renderSalesSummary();
            confirmSaleModal.hide();
            setItemToSellId(null); // Réinitialiser l'ID
        } else {
            alert("Erreur : Article non trouvé ou déjà en rupture de stock.");
            confirmSaleModal.hide();
            setItemToSellId(null); // Réinitialiser l'ID
        }
    }
};