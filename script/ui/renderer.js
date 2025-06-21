import * as DOM from '../../domElements';
import { stock, salesToday } from '../../state.js'; // Importer l'état actuel pour lecture

// Afficher / Mettre à jour le tableau des stocks
export const renderStockTable = (itemsToRender = stock) => {
    DOM.stockTableBody.innerHTML = '';
    DOM.noResultsMsg.style.display = itemsToRender.length === 0 ? 'block' : 'none';

    if (itemsToRender.length === 0 && stock.length > 0) {
        DOM.noResultsMsg.textContent = 'Aucun article ne correspond à votre recherche.';
    } else if (itemsToRender.length === 0 && stock.length === 0) {
        DOM.noResultsMsg.textContent = 'Votre stock est vide. Ajoutez un article pour commencer.';
    }

    itemsToRender.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image || 'https://via.placeholder.com/60/CCCCCC/FFFFFF?text=N/A'}" alt="${item.name}" class="stock-item-img"></td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toLocaleString('fr-CD')} $</td>
            <td>
                <button class="btn btn-success btn-sm me-1 sell-btn ${item.quantity <= 0 ? 'disabled' : ''}" data-id="${item.id}" title="Vendre">
                    <i class="bi bi-cart-dash-fill"></i>
                </button>
                <button class="btn btn-warning btn-sm me-1 edit-btn" data-id="${item.id}" title="Modifier">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}" title="Supprimer">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </td>
        `;
        DOM.stockTableBody.appendChild(row);
    });
};

// Afficher / Mettre à jour le récapitulatif des ventes
export const renderSalesSummary = () => {
    DOM.salesListUl.innerHTML = '';
    let total = 0;

    if (salesToday.length === 0) {
        DOM.salesListUl.innerHTML = '<li class="list-group-item text-muted">Aucune vente enregistrée pour le moment.</li>';
        DOM.exportPdfButton.disabled = true;
        DOM.exportExcelButton.disabled = true;
    } else {
        DOM.exportPdfButton.disabled = false;
        DOM.exportExcelButton.disabled = false;

        salesToday.forEach(sale => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                <span>${sale.name} (x${sale.quantitySold || 1})</span>
                <span class="badge bg-success rounded-pill">${sale.price.toLocaleString('fr-CD')} $</span>
            `;
            DOM.salesListUl.appendChild(listItem);
            total += sale.price * (sale.quantitySold || 1);
        });
    }

    DOM.totalSalesEl.textContent = `${total.toLocaleString('fr-CD')} $`;
    DOM.totalSalesEl.classList.add('updated');
    setTimeout(() => DOM.totalSalesEl.classList.remove('updated'), 500);
};