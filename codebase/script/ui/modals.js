import * as DOM from '../../domElements.js';
import { stock } from '../../state.js'; // Uniquement pour lire les données de l'item

// Initialiser les instances de Modales Bootstrap
export const addEditModal = new bootstrap.Modal(DOM.addEditModalEl);
export const confirmSaleModal = new bootstrap.Modal(DOM.confirmSaleModalEl);
export const confirmDeleteModal = new bootstrap.Modal(DOM.confirmDeleteModalEl);

// Préparer le modal pour l'ajout
export const openAddModal = () => {
    DOM.modalTitle.textContent = 'Ajouter un Article';
    DOM.stockForm.reset();
    DOM.itemIdInput.value = '';
    DOM.imagePreview.style.display = 'none';
    DOM.imagePreview.src = '#'; // Réinitialiser src pour éviter d'afficher l'ancienne image brièvement
    addEditModal.show();
};

// Préparer le modal pour la modification
export const openEditModal = (id) => {
    const item = stock.find(item => item.id === id);
    if (item) {
        DOM.modalTitle.textContent = 'Modifier l\'Article';
        DOM.itemIdInput.value = item.id;
        DOM.itemNameInput.value = item.name;
        DOM.itemQuantityInput.value = item.quantity;
        DOM.itemPriceInput.value = item.price;
        DOM.itemImageInput.value = item.image || ''; // Utiliser item.image directement
        if (item.image) {
            DOM.imagePreview.src = item.image;
            DOM.imagePreview.style.display = 'block';
        } else {
            DOM.imagePreview.style.display = 'none';
            DOM.imagePreview.src = '#';
        }
        addEditModal.show();
    }
};

// Préparer le modal de confirmation de vente
export const openSaleConfirmationModal = (id) => {
    const item = stock.find(item => item.id === id);
    if (item && item.quantity > 0) {
        DOM.saleItemNameEl.textContent = item.name;
        DOM.stockAfterSaleEl.textContent = item.quantity - 1;
        confirmSaleModal.show();
    } else if (item) {
        alert(`L'article "${item.name}" est en rupture de stock.`);
    }
};

// Préparer le modal de confirmation de suppression
export const openDeleteConfirmationModal = (id) => {
    const item = stock.find(item => item.id === id);
    if (item) {
        DOM.deleteItemNameEl.textContent = item.name;
        confirmDeleteModal.show();
    }
};