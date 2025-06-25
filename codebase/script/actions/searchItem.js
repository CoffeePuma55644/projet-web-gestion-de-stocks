import { getStock } from "../state.js";
import { renderStockTable } from "../ui/renderer.js";
import { searchInput } from "../domElements.js";

export function setupSearchListener() {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredStock = getStock().filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    renderStockTable(filteredStock);
  });
}
