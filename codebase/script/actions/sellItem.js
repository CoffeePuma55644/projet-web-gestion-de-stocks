import { findItem, addSale, saveData } from "../../state.js";
import { renderStockTable, renderSalesSummary } from "../ui/renderer.js";
import {
  hideConfirmSaleModal,
  resetItemToSellId,
  getItemToSellId,
} from "../ui/modals.js";
import { confirmSaleButton } from "../../domElements.js";

export function setupSellItemListener() {
  confirmSaleButton.addEventListener("click", () => {
    const itemToSellId = getItemToSellId();
    if (itemToSellId !== null) {
      const item = findItem(itemToSellId);
      if (item && item.quantity > 0) {
        item.quantity -= 1;

        // Enregistrer la vente
        addSale({
          itemId: item.id,
          name: item.name,
          price: item.price,
          timestamp: new Date().toISOString(), // Garder une trace de quand la vente a eu lieu
        });

        saveData();
        renderStockTable();
        renderSalesSummary();
        hideConfirmSaleModal();
        resetItemToSellId();
      } else {
        alert("Erreur : Article non trouvé ou déjà en rupture de stock.");
        hideConfirmSaleModal();
        resetItemToSellId();
      }
    }
  });
}
