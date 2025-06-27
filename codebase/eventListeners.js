import * as DOM from "./domElements.js";
import { setItemToSellId, setItemToDeleteId } from "./state.js";

import {
  prepareAddModal,
  prepareEditModal,
  prepareSaleModal,
  prepareDeleteModal,
} from "./script/ui/modals.js";

import { setupFormEventListener } from "./script/actions/handleItemForm.js";
import { setupDeleteItemListener } from "./script/actions/deleteItem.js";
import { setupSellItemListener } from "./script/actions/sellItem.js";
import { setupSearchListener } from "./script/actions/searchItem.js";

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
      prepareSaleModal(id);
    } else if (buttonClasses.contains("edit-btn")) {
      prepareEditModal(id);
    } else if (buttonClasses.contains("delete-btn")) {
      setItemToDeleteId(id);
      prepareDeleteModal(id);
    }
  });

  // Bouton "Ajouter Article"
  const addItemBtn = document.getElementById("add-item-btn");
  if (addItemBtn) {
    addItemBtn.addEventListener("click", prepareAddModal);
  }
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

function setupExportListeners() {
  const exportPdfBtn = document.getElementById("export-pdf-btn");
  const exportExcelBtn = document.getElementById("export-excel-btn");

  if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", () => {
      if (window.exportToPDF) window.exportToPDF();
    });
  }

  if (exportExcelBtn) {
    exportExcelBtn.addEventListener("click", () => {
      if (window.exportToExcel) window.exportToExcel();
    });
  }
}

export function initializeEventListeners() {
  // Configurer tous les écouteurs d'événements
  setupFormEventListener();
  setupDeleteItemListener();
  setupSellItemListener();
  setupSearchListener();
  setupButtonEventListeners();
  setupImagePreviewListener();
  setupExportListeners();
}
