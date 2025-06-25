import { getStock, getSalesToday, findItem } from "../state.js";
import {
  stockTableBody,
  noResultsMsg,
  salesListUl,
  totalSalesEl,
  exportPdfButton,
  exportExcelButton,
} from "../domElements.js";

// Afficher / Mettre à jour le tableau des stocks
export const renderStockTable = (items = getStock()) => {
  stockTableBody.innerHTML = ""; // Vider le tableau
  noResultsMsg.style.display = items.length === 0 ? "block" : "none";

  if (items.length === 0 && getStock().length > 0) {
    noResultsMsg.textContent = "Aucun article ne correspond à votre recherche.";
  } else if (items.length === 0 && getStock().length === 0) {
    noResultsMsg.textContent =
      "Votre stock est vide. Ajoutez un article pour commencer.";
  }

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td><img src="${
                item.image ||
                "https://via.placeholder.com/60/CCCCCC/FFFFFF?text=N/A"
              }" alt="${item.name}" class="stock-item-img"></td>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toLocaleString("fr-CD")} $</td>
              <td>
                  <button class="btn btn-success btn-sm me-1 sell-btn ${
                    item.quantity <= 0 ? "disabled" : ""
                  }" data-id="${item.id}" title="Vendre">
                      <i class="bi bi-cart-dash-fill"></i>
                  </button>
                  <button class="btn btn-warning btn-sm me-1 edit-btn" data-id="${
                    item.id
                  }" title="Modifier">
                      <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-danger btn-sm delete-btn" data-id="${
                    item.id
                  }" title="Supprimer">
                      <i class="bi bi-trash3-fill"></i>
                  </button>
              </td>
          `;
    stockTableBody.appendChild(row);
  });
};

// Regroupe les ventes par article
function getGroupedSales() {
  const grouped = {};
  getSalesToday().forEach((sale) => {
    if (!grouped[sale.itemId]) {
      grouped[sale.itemId] = {
        name: sale.name,
        price: sale.price,
        image: findItem(sale.itemId)?.image || "",
        quantitySold: 1,
      };
    } else {
      grouped[sale.itemId].quantitySold += 1;
    }
  });
  return Object.values(grouped);
}

// Modifie renderSalesSummary pour utiliser le regroupement
export const renderSalesSummary = () => {
  salesListUl.innerHTML = "";
  let total = 0;
  const groupedSales = getGroupedSales();

  if (groupedSales.length === 0) {
    salesListUl.innerHTML =
      '<li class="list-group-item text-muted">Aucune vente enregistrée pour le moment.</li>';
    exportPdfButton.disabled = true;
    exportExcelButton.disabled = true;
  } else {
    exportPdfButton.disabled = false;
    exportExcelButton.disabled = false;

    groupedSales.forEach((sale) => {
      const listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      listItem.innerHTML = `
      <span>
        <img src="${
          sale.image || "https://via.placeholder.com/40"
        }" alt="" style="width:32px;height:32px;object-fit:cover;border-radius:4px;margin-right:8px;">
        ${sale.name} (x${sale.quantitySold})
      </span>
      <span class="badge bg-success rounded-pill">${sale.price.toLocaleString(
        "fr-CD"
      )} $</span>
    `;
      salesListUl.appendChild(listItem);
      total += sale.price * sale.quantitySold;
    });
  }

  totalSalesEl.textContent = `${total.toLocaleString("fr-CD")} $`;
  totalSalesEl.classList.add("updated");
  setTimeout(() => totalSalesEl.classList.remove("updated"), 500);
};
