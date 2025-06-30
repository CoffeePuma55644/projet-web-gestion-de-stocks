# GSK ‑ Gestion de Stocks Web

## API & Component Reference

This document describes every public JavaScript API exposed by the project, the main UI components, and how to use or extend them.  All code samples are written in modern ES-modules style and assume that you are working inside the `codebase/` folder structure provided in this repository.

---

## Table of Contents

1. Quick Start
2. State Management (`state.js`)
3. DOM Element Handles (`domElements.js`)
4. Global Event Wiring (`eventListeners.js`)
5. UI Layer (`script/ui/*`)
   1. Modals (`modals.js`)
   2. Image Preview (`imagePreview.js`)
   3. Renderers (`renderer.js`)
6. Domain Actions (`script/actions/*`)
   1. Add / Edit Item (`handleItemForm.js`)
   2. Delete Item (`deleteItem.js`)
   3. Sell Item (`sellItem.js`)
   4. Search (`searchItem.js`)
7. Utilities (`script/utils/exportUtils.js`)
8. Extending the App

---

## 1. Quick Start

```html
<!-- index.html -->
<script type="module">
  import { renderStockTable } from './codebase/script/ui/renderer.js';
  import { initializeEventListeners } from './codebase/eventListeners.js';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();    // Global event wiring
    renderStockTable();            // Initial UI render
  });
</script>
```

Running the snippet above will bring the stock-management UI to life, initialise all modals and attach listeners for adding, editing, selling and deleting products.

---

## 2. State Management — `codebase/state.js`

Responsible for persisting **stock** and **sales** data inside `localStorage` and exposing helpers to mutate or query that state.

| Export | Type | Description |
| ------ | ---- | ----------- |
| `stock` | `Array<StockItem>` | Reactive (in-memory) list of all products available. Loaded from `localStorage` on app boot. |
| `salesToday` | `Array<Sale>` | Sales recorded since midnight (local time). |
| `saveData()` | `() => void` | Serialises `stock` and `salesToday` back to `localStorage`. Call this **after every mutation**. |
| `updateStock(newStock)` | `(Array<StockItem>) => void` | Replaces the entire `stock` array. Remember to call `saveData()`. |
| `addSale(sale)` | `(Sale) => void` | Pushes a new sale object into `salesToday`. |
| `setItemToSellId(id)` / `getItemToSellId()` | `(number) => void` / `() => number \| null` | Helper pair used by the *Sell* confirmation modal. |
| `setItemToDeleteId(id)` / `getItemToDeleteId()` | idem | Helper pair used by the *Delete* confirmation modal. |

### StockItem Interface
```ts
export interface StockItem {
  id: number;
  name: string;
  quantity: number;  // units currently in stock
  price: number;     // unit price in USD
  image?: string;    // optional image URL
}
```

### Example: programmatic stock update
```js
import { stock, updateStock, saveData } from './codebase/state.js';

// Decrement quantity of the first item
const updated = stock.map((p, i) => i === 0 ? { ...p, quantity: p.quantity - 1 } : p);
updateStock(updated);
saveData();
```

---

## 3. DOM Element Handles — `codebase/domElements.js`

This module exports *read-only* references to all important DOM nodes.  Import once and reuse instead of calling `document.getElementById` scattered around your code.

```js
import { stockTableBody, searchInput } from './codebase/domElements.js';

searchInput.addEventListener('input', (e) => {
  console.log('Searching:', e.target.value);
});
```

> **Tip :** these constants are lazily resolved at module load. If you dynamically create nodes with matching IDs afterwards, re-query the DOM manually.

---

## 4. Global Event Wiring — `codebase/eventListeners.js`

```js
initializeEventListeners(): void
```

Attaches *all* high-level listeners required by the application (form submission, search box, table buttons, export buttons, etc.).

Call exactly **once**, ideally right after `DOMContentLoaded`.

---

## 5. UI Layer — `codebase/script/ui`

### 5.1 Modals — `modals.js`

Bootstrap-powered modal windows that encapsulate all user interactions.

| Export | Type | Purpose |
| ------ | ---- | ------- |
| `addEditModal` | `bootstrap.Modal` | Underlying instance for add / edit form. |
| `confirmSaleModal` | `bootstrap.Modal` | Confirmation before decreasing stock. |
| `confirmDeleteModal` | `bootstrap.Modal` | Confirmation before deleting an item. |
| `openAddModal()` | `() => void` | Clears the form and shows `addEditModal` in *Add* mode. |
| `openEditModal(id)` | `(number) => void` | Prefills form with the item matching `id` and shows the modal in *Edit* mode. |
| `openSaleConfirmationModal(id)` | `(number) => void` | Shows confirmation dialogue if item is in stock. |
| `openDeleteConfirmationModal(id)` | `(number) => void` | Shows confirmation dialogue for deletion. |

Example — open the *Add* modal from an external button:
```js
import { openAddModal } from './codebase/script/ui/modals.js';

document.getElementById('myCustomAddBtn').addEventListener('click', openAddModal);
```

### 5.2 Image Preview — `imagePreview.js`

```js
updateImagePreview(): void
```

Reads the URL typed in the *image* field and immediately updates an `<img>` preview element.  Displays a placeholder if the URL 404s.

Usually bound to the `input` event of `itemImageInput` (already done in `eventListeners.js`).

### 5.3 Renderers — `renderer.js`

| Export | Signature | Description |
| ------ | --------- | ----------- |
| `renderStockTable(items = stock)` | `(?Array<StockItem>) => void` | (Re)renders the `<tbody>` of the main stock table. Supply a filtered array to show search results. |
| `renderSalesSummary()` | `() => void` | Refreshes the *Today* sales list and total. |

Both functions **mutate the DOM** directly and should be called whenever the underlying data changes.

---

## 6. Domain Actions — `codebase/script/actions`

Dedicated modules that perform a single user-driven action, mutate the state, then refresh the UI.  They are automatically bound by `eventListeners.js` but can be reused programmatically.

| Module | Export | Purpose |
| ------ | ------ | ------- |
| `handleItemForm.js` | `processItemForm(event)` | Handles *Add* or *Edit* form submission; validates inputs, updates `stock`, saves, rerenders. |
| `deleteItem.js` | `confirmItemDeletion()` | Removes the item whose ID has been previously stored via `setItemToDeleteId`. |
| `sellItem.js` | `confirmItemSale()` | Decrements quantity, records a sale, updates UI. |
| `searchItem.js` | `filterStockOnChange()` | Live-filters `stock` array based on `searchInput.value`, then calls `renderStockTable`. |

### Example: Manual sale confirmation
```js
import { setItemToSellId } from './codebase/state.js';
import { confirmItemSale } from './codebase/script/actions/sellItem.js';

setItemToSellId(42);   // Choose product
confirmItemSale();      // Execute sale programmatically
```

---

## 7. Utilities — `script/utils/exportUtils.js`

Currently stub functions that will eventually export `salesToday` to PDF or Excel.  They show an alert when called on an empty list.

| Export | Description |
| ------ | ----------- |
| `exportToPDF()` | Placeholder — integrate `jsPDF` or a server-side service. |
| `exportToExcel()` | Placeholder — integrate `SheetJS` (xlsx) or similar. |

---

## 8. Extending the App

1. **Add new fields to StockItem** — update the interface in `state.js`, extend the form (HTML) and adjust `processItemForm` to persist the new property.
2. **Persistent Back-End** — replace `localStorage` calls in `state.js` with fetch calls to your favourite REST or GraphQL API.
3. **Reporting** — implement `exportToPDF`/`Excel` inside `exportUtils.js` using third-party libraries.
4. **Authentication** — wrap the initial `DOMContentLoaded` callback with a login check.

Feel free to open an issue or a pull-request if you build something cool on top of *GSK* 🚀

---

© 2025 — CoffeePuma55644 🍃