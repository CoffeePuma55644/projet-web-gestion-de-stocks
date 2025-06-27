import { deleteItem as deleteItemFromState, saveData } from "../../state.js";
import { renderStockTable, renderSalesSummary } from "../ui/renderer.js";
import {
  hideConfirmDeleteModal,
  resetItemToDeleteId,
  getItemToDeleteId,
} from "../ui/modals.js";
import { confirmDeleteButton } from "../../domElements.js";

export function setupDeleteItemListener() {
  confirmDeleteButton.addEventListener("click", () => {
    const itemToDeleteId = getItemToDeleteId();
    if (itemToDeleteId !== null) {
      deleteItemFromState(itemToDeleteId);
      saveData();
      renderStockTable(); // Mettre à jour le tableau
      renderSalesSummary(); // Recalculer au cas où (même si ça ne change rien ici)
      hideConfirmDeleteModal();
      resetItemToDeleteId();
    }
  });
}
