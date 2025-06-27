import { initializeEventListeners } from "./eventListeners.js";
import { renderStockTable, renderSalesSummary } from "./script/ui/renderer.js";
import "./script/utils/exportUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Initial render
  renderStockTable();
  renderSalesSummary();

  // Setup all event listeners
  initializeEventListeners();
});
