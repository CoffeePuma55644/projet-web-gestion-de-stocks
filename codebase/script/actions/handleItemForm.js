import { addItem, updateItem, saveData } from "../state.js";
import { renderStockTable } from "../ui/renderer.js";
import { hideAddEditModal } from "../ui/modals.js";
import {
  stockForm,
  itemIdInput,
  itemNameInput,
  itemQuantityInput,
  itemPriceInput,
  itemImageInput,
  imagePreview,
} from "../domElements.js";

export function setupFormEventListener() {
  stockForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    const id = parseInt(itemIdInput.value);
    const name = itemNameInput.value.trim();
    const quantity = parseInt(itemQuantityInput.value);
    const price = parseFloat(itemPriceInput.value);
    const image = itemImageInput.value.trim();

    if (!name || isNaN(quantity) || quantity < 0 || isNaN(price) || price < 0) {
      alert(
        "Veuillez remplir correctement tous les champs obligatoires (Nom, Quantité >= 0, Prix >= 0)."
      );
      return;
    }

    if (id) {
      // Modification
      updateItem({ id, name, quantity, price, image });
    } else {
      // Ajout
      const newItem = {
        id: Date.now(), // ID unique simple
        name,
        quantity,
        price,
        image,
      };
      addItem(newItem);
    }

    saveData();
    renderStockTable();
    hideAddEditModal();
    stockForm.reset(); // Vider le formulaire après ajout/modif
    imagePreview.style.display = "none";
  });
}
