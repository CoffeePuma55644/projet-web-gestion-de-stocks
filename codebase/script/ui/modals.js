import { findItem } from "../state.js";
import {
  modalTitle,
  stockForm,
  itemIdInput,
  imagePreview,
  itemNameInput,
  itemQuantityInput,
  itemPriceInput,
  itemImageInput,
  saleItemNameEl,
  stockAfterSaleEl,
  deleteItemNameEl,
  addEditModalEl,
  confirmSaleModalEl,
  confirmDeleteModalEl,
} from "../domElements.js";

const addEditModal = new bootstrap.Modal(addEditModalEl);
const confirmSaleModal = new bootstrap.Modal(confirmSaleModalEl);
const confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl);

let itemToSellId = null;
let itemToDeleteId = null;

export const getItemToSellId = () => itemToSellId;
export const getItemToDeleteId = () => itemToDeleteId;

export const resetItemToSellId = () => {
  itemToSellId = null;
};
export const resetItemToDeleteId = () => {
  itemToDeleteId = null;
};

// Préparer le modal pour l'ajout
export const prepareAddModal = () => {
  modalTitle.textContent = "Ajouter un Article";
  stockForm.reset();
  itemIdInput.value = ""; // Assurer qu'il n'y a pas d'ID
  imagePreview.style.display = "none"; // Cacher l'aperçu
  addEditModal.show();
};

// Préparer le modal pour la modification
export const prepareEditModal = (id) => {
  const item = findItem(id);
  if (item) {
    modalTitle.textContent = "Modifier l'Article";
    itemIdInput.value = item.id;
    itemNameInput.value = item.name;
    itemQuantityInput.value = item.quantity;
    itemPriceInput.value = item.price;
    itemImageInput.value = item.image || "";
    if (item.image) {
      imagePreview.src = item.image;
      imagePreview.style.display = "block";
    } else {
      imagePreview.style.display = "none";
    }
    addEditModal.show();
  }
};

// Préparer le modal de confirmation de vente
export const prepareSaleModal = (id) => {
  const item = findItem(id);
  if (item && item.quantity > 0) {
    itemToSellId = id;
    saleItemNameEl.textContent = item.name;
    stockAfterSaleEl.textContent = item.quantity - 1;
    confirmSaleModal.show();
  } else if (item) {
    alert(`L'article "${item.name}" est en rupture de stock.`);
  }
};

// Préparer le modal de confirmation de suppression
export const prepareDeleteModal = (id) => {
  const item = findItem(id);
  if (item) {
    itemToDeleteId = id;
    deleteItemNameEl.textContent = item.name;
    confirmDeleteModal.show();
  }
};

export const hideAddEditModal = () => {
  addEditModal.hide();
};

export const hideConfirmSaleModal = () => {
  confirmSaleModal.hide();
};

export const hideConfirmDeleteModal = () => {
  confirmDeleteModal.hide();
};
