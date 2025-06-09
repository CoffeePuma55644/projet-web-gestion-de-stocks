import * as DOM from '../../domElements.js';
import { stock, updateStock, saveData } from '../../state.js';
import { renderStockTable } from '../ui/renderer.js';
import { addEditModal } from '../ui/modals.js';

export const processItemForm = (event) => {
    event.preventDefault();

    const id = parseInt(DOM.itemIdInput.value);
    const name = DOM.itemNameInput.value.trim();
    const quantity = parseInt(DOM.itemQuantityInput.value);
    const price = parseFloat(DOM.itemPriceInput.value);
    const image = DOM.itemImageInput.value.trim();

    if (!name || isNaN(quantity) || quantity < 0 || isNaN(price) || price < 0) {
        alert('Veuillez remplir correctement tous les champs obligatoires (Nom, Quantité >= 0, Prix >= 0).');
        return;
    }

    let newStockData;
    if (id) { // Modification
        newStockData = stock.map(item =>
            item.id === id ? { ...item, name, quantity, price, image } : item
        );
    } else { // Ajout
        const newItem = {
            id: Date.now(),
            name,
            quantity,
            price,
            image
        };
        newStockData = [...stock, newItem];
    }
    updateStock(newStockData);
    saveData();
    renderStockTable();
    addEditModal.hide();
    DOM.stockForm.reset();
    DOM.imagePreview.style.display = 'none';
    DOM.imagePreview.src = '#';
};