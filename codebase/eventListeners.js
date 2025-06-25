import * as DOM from "./domElements.js";
import { setItemToSellId, setItemToDeleteId } from "./state.js";

import {
  openAddModal,
  openEditModal,
  openSaleConfirmationModal,
  openDeleteConfirmationModal,
} from "./script/ui/modals.js";
import { updateImagePreview } from "./script/ui/imagePreview.js";

import { processItemForm } from "./script/actions/handleItemForm.js";
import { confirmItemDeletion } from "./script/actions/deleteItem.js";
import { confirmItemSale } from "./script/actions/sellItem.js";
import { filterStockOnChange } from "./script/actions/searchItem.js";

import { exportToPDF, exportToExcel } from "./script/utils/exportUtils";

function setupButtonEventListeners() {
  DOM.stockTableBody.addEventListener("click", (e) => {
    const target = e.target.closest("button");

    if (!target) return;

    const buttonClasses = target.classList;
    const id = parseInt(target.getAttribute("data-id"));

    if (
      buttonClasses.contains("sell-btn") &&
      !buttonClasses.contains("disabled")
    ) {
      setItemToSellId(id);
      openSaleConfirmationModal(id);
    } else if (buttonClasses.contains("edit-btn")) {
      openEditModal(id);
    } else if (buttonClasses.contains("delete-btn")) {
      setItemToDeleteId(id);
      openDeleteConfirmationModal(id);
    }
  });

  document
    .querySelector('button[data-bs-target="#addEditStockModal"]')
    .addEventListener("click", openAddModal);
}

function setupImagePreviewListener() {
  DOM.itemImageInput.addEventListener("input", () => {
    const url = DOM.itemImageInput.value.trim();
    if (url) {
      DOM.imagePreview.src = url;
      DOM.imagePreview.style.display = "block";
      DOM.imagePreview.onerror = () => {
        DOM.imagePreview.src =
          "https://via.placeholder.com/60/FF0000/FFFFFF?text=Erreur";
      };
    } else {
      DOM.imagePreview.style.display = "none";
    }
  });
}

export function initializeEventListeners() {
  // Formulaire d'ajout/modification
  if (DOM.stockForm) DOM.stockForm.addEventListener("submit", processItemForm);

  // Bouton d'ajout d'article (si vous avez un bouton dédié pour ouvrir la modale en mode "ajout")
  if (DOM.addItemButton)
    DOM.addItemButton.addEventListener("click", openAddModal);

  // Boutons de confirmation dans les modales
  if (DOM.confirmSaleButton)
    DOM.confirmSaleButton.addEventListener("click", confirmItemSale);
  if (DOM.confirmDeleteButton)
    DOM.confirmDeleteButton.addEventListener("click", confirmItemDeletion);

  // Champ de recherche
  if (DOM.searchInput)
    DOM.searchInput.addEventListener("input", filterStockOnChange);

  setupButtonEventListeners();
  setupImagePreviewListener();

  // Boutons d'exportation
  if (DOM.exportPdfButton)
    DOM.exportPdfButton.addEventListener("click", exportToPDF);
  if (DOM.exportExcelButton)
    DOM.exportExcelButton.addEventListener("click", exportToExcel);
}
