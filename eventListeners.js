import * as DOM from './domElements.js';
import { setItemToSellId, setItemToDeleteId } from './state.js';

import { openAddModal, openEditModal, openSaleConfirmationModal, openDeleteConfirmationModal } from './script/ui/modals.js';
import { updateImagePreview } from './script/ui/imagePreview.js';

import { processItemForm } from './script/actions/handleItemForm.js';
import { confirmItemDeletion } from './script/actions/deleteItem.js';
import { confirmItemSale } from './script/actions/sellItem.js';
import { filterStockOnChange } from './script/actions/searchItem.js';

import { exportToPDF, exportToExcel } from './script/utils/exportUtils';

export function initializeEventListeners() {
    // Formulaire d'ajout/modification
    if(DOM.stockForm) DOM.stockForm.addEventListener('submit', processItemForm);

    // Bouton d'ajout d'article (si vous avez un bouton dédié pour ouvrir la modale en mode "ajout")
    if(DOM.addItemButton) DOM.addItemButton.addEventListener('click', openAddModal);

    // Boutons de confirmation dans les modales
    if(DOM.confirmSaleButton) DOM.confirmSaleButton.addEventListener('click', confirmItemSale);
    if(DOM.confirmDeleteButton) DOM.confirmDeleteButton.addEventListener('click', confirmItemDeletion);

    // Champ de recherche
    if(DOM.searchInput) DOM.searchInput.addEventListener('input', filterStockOnChange);

    // Clics sur les boutons du tableau (Vendre, Modifier, Supprimer) via délégation d'événements
    if(DOM.stockTableBody) DOM.stockTableBody.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const buttonClasses = target.classList;
        const id = parseInt(target.getAttribute('data-id'));

        if (buttonClasses.contains('sell-btn') && !buttonClasses.contains('disabled')) {
            setItemToSellId(id);
            openSaleConfirmationModal(id);
        } else if (buttonClasses.contains('edit-btn')) {
            openEditModal(id);
        } else if (buttonClasses.contains('delete-btn')) {
            setItemToDeleteId(id);
            openDeleteConfirmationModal(id);
        }
    });

    // Aperçu de l'image
    if(DOM.itemImageInput) DOM.itemImageInput.addEventListener('input', updateImagePreview);

    // Boutons d'exportation
    if(DOM.exportPdfButton) DOM.exportPdfButton.addEventListener('click', exportToPDF);
    if(DOM.exportExcelButton) DOM.exportExcelButton.addEventListener('click', exportToExcel);
}