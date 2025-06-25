import { initializeEventListeners } from "./eventListeners.js";
import { setupFormEventListener } from "./script/actions/handleItemForm.js";
import { setupSellItemListener } from "./script/actions/sellItem.js";
import { setupDeleteItemListener } from "./script/actions/deleteItem.js";
import { setupSearchListener } from "./script/actions/searchItem.js";
import { renderStockTable, renderSalesSummary } from "./script/ui/renderer.js";
import "./script/utils/exportUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Initial render
  renderStockTable();
  renderSalesSummary();

  // Setup event listeners
  initializeEventListeners();
  setupFormEventListener();
  setupSellItemListener();
  setupDeleteItemListener();
  setupSearchListener();
});
