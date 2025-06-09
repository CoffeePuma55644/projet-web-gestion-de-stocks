import * as DOM from '../../domElements.js';
import { stock } from '../../state.js';
import { renderStockTable } from '../ui/renderer.js';

export const filterStockOnChange = () => {
    const searchTerm = DOM.searchInput.value.toLowerCase();
    const filteredStock = stock.filter(item =>
        item.name.toLowerCase().includes(searchTerm)
    );
    renderStockTable(filteredStock);
};