// --- ÉLÉMENTS DU DOM ---
export const stockTableBody = document.getElementById("stockTableBody");
export const searchInput = document.getElementById("searchInput");
export const stockForm = document.getElementById("stockForm");
export const addEditModalEl = document.getElementById("addEditStockModal");
export const modalTitle = document.getElementById("addEditStockModalLabel");
export const itemIdInput = document.getElementById("itemId");
export const itemNameInput = document.getElementById("itemName");
export const itemQuantityInput = document.getElementById("itemQuantity");
export const itemPriceInput = document.getElementById("itemPrice");
export const itemImageInput = document.getElementById("itemImage");
export const imagePreview = document.getElementById("imagePreview");
export const noResultsMsg = document.getElementById("noResults");

// --- ÉLÉMENTS POUR LES ACTIONS DE L'APP ---
export const confirmSaleModalEl = document.getElementById("confirmSaleModal");
export const saleItemNameEl = document.getElementById("saleItemName");
export const stockAfterSaleEl = document.getElementById("stockAfterSale");
export const confirmSaleButton = document.getElementById("confirmSaleButton");

export const confirmDeleteModalEl =
  document.getElementById("confirmDeleteModal");
export const deleteItemNameEl = document.getElementById("deleteItemName");
export const confirmDeleteButton = document.getElementById(
  "confirmDeleteButton"
);

// --- ÉLÉMENTS POUR LES FONCTIONS DE CALCUL ET D'EXPORT ---
export const totalSalesEl = document.getElementById("totalSales");
export const salesListUl = document.getElementById("salesList");
export const exportPdfButton = document.getElementById("export-pdf-btn");
export const exportExcelButton = document.getElementById("export-excel-btn");

// Bouton pour ouvrir la modale d'ajout
export const addItemButton = document.getElementById("add-item-btn");

// Initialiser l'année en cours
document.getElementById("currentYear").textContent = new Date()
  .getFullYear()
  .toString();
