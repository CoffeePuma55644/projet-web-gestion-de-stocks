document.addEventListener("DOMContentLoaded", () => {
  // --- DOM VARIABLES AND ELEMENTS ---
  const stockTableBody = document.getElementById("stockTableBody");
  const searchInput = document.getElementById("searchInput");
  const stockForm = document.getElementById("stockForm");
  const addEditModalEl = document.getElementById("addEditStockModal");
  const addEditModal = new bootstrap.Modal(addEditModalEl);
  const modalTitle = document.getElementById("addEditStockModalLabel");
  const itemIdInput = document.getElementById("itemId");
  const itemNameInput = document.getElementById("itemName");
  const itemQuantityInput = document.getElementById("itemQuantity");
  const itemPriceInput = document.getElementById("itemPrice");
  const itemImageInput = document.getElementById("itemImage");
  const imagePreview = document.getElementById("imagePreview");
  const noResultsMsg = document.getElementById("noResults");

  // --- APP ACTION VARIABLES ---
  const confirmSaleModalEl = document.getElementById("confirmSaleModal");
  const confirmSaleModal = new bootstrap.Modal(confirmSaleModalEl);
  const saleItemNameEl = document.getElementById("saleItemName");
  const stockAfterSaleEl = document.getElementById("stockAfterSale");
  const confirmSaleButton = document.getElementById("confirmSaleButton");

  const confirmDeleteModalEl = document.getElementById("confirmDeleteModal");
  const confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl);
  const deleteItemNameEl = document.getElementById("deleteItemName");
  const confirmDeleteButton = document.getElementById("confirmDeleteButton");

  // --- CALCULATION AND EXPORT FUNCTIONS ---
  const totalSalesEl = document.getElementById("totalSales");
  const salesListUl = document.getElementById("salesList");
  const exportPdfButton = document.querySelector(
    'button[onclick="exportToPDF()"]'
  );
  const exportExcelButton = document.querySelector(
    'button[onclick="exportToExcel()"]'
  );

  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // --- DATA (Simulation - Use localStorage for persistence) ---
  let stock = JSON.parse(localStorage.getItem("stockData")) || [
    // Initial example data if localStorage is empty
    {
      id: Date.now() + 1,
      name: "PlayStation 5 Pro",
      quantity: 20,
      price: 799.99,
      image:
        "https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-dualsense-image-block-01-en-16aug24",
    },
    {
      id: Date.now() + 2,
      name: "Xbox Series X",
      quantity: 15,
      price: 499.99,
      image:
        "https://static.actu.fr/uploads/2020/02/xbox-series-x-fond-blanc-1.jpg",
    },
    {
      id: Date.now() + 3,
      name: "Nintendo Switch 2",
      quantity: 30,
      price: 499.99,
      image:
        "https://static-images.lpnt.fr/cd-cw809/images/2025/01/16/27224744lpw-27224953-mega-une-jpg_10784927.jpg",
    },
  ];

  let salesToday = JSON.parse(localStorage.getItem("salesTodayData")) || [];
  let itemToSellId = null;
  let itemToDeleteId = null;

  // --- FUNCTIONS ---

  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem("stockData", JSON.stringify(stock));
    localStorage.setItem("salesTodayData", JSON.stringify(salesToday));
  };

  // Display / Update stock table
  const renderStockTable = (items = stock) => {
    stockTableBody.innerHTML = ""; // Clear table
    noResultsMsg.style.display = items.length === 0 ? "block" : "none";

    if (items.length === 0 && stock.length > 0) {
      noResultsMsg.textContent =
        "No items match your search.";
    } else if (items.length === 0 && stock.length === 0) {
      noResultsMsg.textContent =
        "Your stock is empty. Add an item to get started.";
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
                <td>${item.price.toLocaleString("en-US")} $</td>
                <td>
                    <button class="btn btn-success btn-sm me-1 sell-btn ${
                      item.quantity <= 0 ? "disabled" : ""
                    }" data-id="${item.id}" title="Sell">
                        <i class="bi bi-cart-dash-fill"></i>
                    </button>
                    <button class="btn btn-warning btn-sm me-1 edit-btn" data-id="${
                      item.id
                    }" title="Edit">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${
                      item.id
                    }" title="Delete">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </td>
            `;
      stockTableBody.appendChild(row);
    });
  };

  // Group sales by item
  function getGroupedSales() {
    const grouped = {};
    salesToday.forEach((sale) => {
      if (!grouped[sale.itemId]) {
        grouped[sale.itemId] = {
          name: sale.name,
          price: sale.price,
          image: stock.find((item) => item.id === sale.itemId)?.image || "",
          quantitySold: 1,
        };
      } else {
        grouped[sale.itemId].quantitySold += 1;
      }
    });
    return Object.values(grouped);
  }

  // Modify renderSalesSummary to use grouping
  const renderSalesSummary = () => {
    salesListUl.innerHTML = "";
    let total = 0;
    const groupedSales = getGroupedSales();

    if (groupedSales.length === 0) {
      salesListUl.innerHTML =
        '<li class="list-group-item text-muted">No sales recorded yet.</li>';
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
          "en-US"
        )} $</span>
      `;
        salesListUl.appendChild(listItem);
        total += sale.price * sale.quantitySold;
      });
    }

    totalSalesEl.textContent = `${total.toLocaleString("en-US")} $`;
    totalSalesEl.classList.add("updated");
    setTimeout(() => totalSalesEl.classList.remove("updated"), 500);
  };

  // Prepare modal for adding
  window.prepareAddModal = () => {
    modalTitle.textContent = "Add an Item";
    stockForm.reset();
    itemIdInput.value = ""; // Make sure there's no ID
    imagePreview.style.display = "none"; // Hide preview
  };

  // Prepare modal for editing
  const prepareEditModal = (id) => {
    const item = stock.find((item) => item.id === id);
    if (item) {
      modalTitle.textContent = "Edit Item";
      itemIdInput.value = item.id;
      itemNameInput.value = item.name;
      itemQuantityInput.value = item.quantity;
      itemPriceInput.value = item.price;
      itemImageInput.value = item.image || "";
      if (item.image) {
        imagePreview.src = item.image;
        imagePreview.style.display = "block";
      } else {
        imagePreview.style.display = "none";
      }
      addEditModal.show();
    }
  };

  // Prepare sale confirmation modal
  const prepareSaleModal = (id) => {
    const item = stock.find((item) => item.id === id);
    if (item && item.quantity > 0) {
      itemToSellId = id;
      saleItemNameEl.textContent = item.name;
      stockAfterSaleEl.textContent = item.quantity - 1;
      confirmSaleModal.show();
    } else if (item) {
      alert(`The item "${item.name}" is out of stock.`);
    }
  };

  // Prepare deletion confirmation modal
  const prepareDeleteModal = (id) => {
    const item = stock.find((item) => item.id === id);
    if (item) {
      itemToDeleteId = id;
      deleteItemNameEl.textContent = item.name;
      confirmDeleteModal.show();
    }
  };

  // Handle form submission (Add/Edit)
  stockForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

    const id = parseInt(itemIdInput.value);
    const name = itemNameInput.value.trim();
    const quantity = parseInt(itemQuantityInput.value);
    const price = parseFloat(itemPriceInput.value);
    const image = itemImageInput.value.trim();

    if (!name || isNaN(quantity) || quantity < 0 || isNaN(price) || price < 0) {
      alert(
        "Please fill in all required fields correctly (Name, Quantity >= 0, Price >= 0)."
      );
      return;
    }

    if (id) {
      // Edit
      stock = stock.map((item) =>
        item.id === id ? { ...item, name, quantity, price, image } : item
      );
    } else {
      // Add
      const newItem = {
        id: Date.now(), // Simple unique ID
        name,
        quantity,
        price,
        image,
      };
      stock.push(newItem);
    }

    saveData();
    renderStockTable();
    addEditModal.hide();
    stockForm.reset(); // Clear form after add/edit
    imagePreview.style.display = "none";
  });

  // Handle sale confirmation
  confirmSaleButton.addEventListener("click", () => {
    if (itemToSellId !== null) {
      const itemIndex = stock.findIndex((item) => item.id === itemToSellId);
      if (itemIndex !== -1 && stock[itemIndex].quantity > 0) {
        stock[itemIndex].quantity -= 1;

        // Record the sale
        const soldItem = stock[itemIndex];
        salesToday.push({
          itemId: soldItem.id,
          name: soldItem.name,
          price: soldItem.price,
          timestamp: new Date().toISOString(), // Keep track of when the sale happened
        });

        saveData();
        renderStockTable();
        renderSalesSummary();
        confirmSaleModal.hide();
        itemToSellId = null;
      } else {
        alert("Error: Item not found or already out of stock.");
        confirmSaleModal.hide();
        itemToSellId = null;
      }
    }
  });

  // Handle deletion confirmation
  confirmDeleteButton.addEventListener("click", () => {
    if (itemToDeleteId !== null) {
      stock = stock.filter((item) => item.id !== itemToDeleteId);
      saveData();
      renderStockTable(); // Update table
      renderSalesSummary(); // Recalculate just in case (even if it doesn't change anything here)
      confirmDeleteModal.hide();
      itemToDeleteId = null;
    }
  });

  // Handle search/filtering
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredStock = stock.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    renderStockTable(filteredStock);
  });

  // Handle clicks on table buttons (Sell, Edit, Delete) via delegation
  stockTableBody.addEventListener("click", (e) => {
    const target = e.target.closest("button"); // Target the clicked button or its parent if icon clicked

    if (!target) return; // Exit if click wasn't on a button

    const buttonClasses = target.classList;
    const id = parseInt(target.getAttribute("data-id"));

    if (
      buttonClasses.contains("sell-btn") &&
      !buttonClasses.contains("disabled")
    ) {
      prepareSaleModal(id);
    } else if (buttonClasses.contains("edit-btn")) {
      prepareEditModal(id);
    } else if (buttonClasses.contains("delete-btn")) {
      prepareDeleteModal(id);
    }
  });

  // Image preview when entering URL
  itemImageInput.addEventListener("input", () => {
    const url = itemImageInput.value.trim();
    if (url) {
      imagePreview.src = url;
      imagePreview.style.display = "block";
      // Optional: check if image loads correctly
      imagePreview.onerror = () => {
        // imagePreview.style.display = 'none'; // Hide if error
        imagePreview.src =
          "https://via.placeholder.com/60/FF0000/FFFFFF?text=Error"; // Display error image
      };
    } else {
      imagePreview.style.display = "none";
    }
  });

  // --- EXPORT FUNCTIONS (Placeholders) ---
  window.exportToPDF = async () => {
    // Export daily sales to PDF
    // Check if there are sales to export
    const groupedSales = getGroupedSales();
    if (groupedSales.length === 0) return alert("No sales to export.");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Daily Sales Summary", 14, 14);

    // Prepare data for autotable
    const tableBody = await Promise.all(
      groupedSales.map(async (sale) => {
        // Convertir l'image en DataURL (si possible)
        let imgData = "";
        if (sale.image) {
          try {
            const res = await fetch(sale.image);
            const blob = await res.blob();
            imgData = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
          } catch {
            imgData = "";
          }
        }
        return [
          { content: "", img: imgData }, // image
          sale.name,
          sale.quantitySold,
          sale.price.toLocaleString("en-US") + " $",
          (sale.price * sale.quantitySold).toLocaleString("en-US") + " $",
        ];
      })
    );
    // Add empty line for spacing
    doc.autoTable({
      head: [["Image", "Item", "Quantity", "Unit Price", "Total"]],
      body: tableBody,
      startY: 20,
      didDrawCell: function (data) {
        if (data.column.index === 0 && data.cell.raw && data.cell.raw.img) {
          doc.addImage(
            data.cell.raw.img,
            "JPEG",
            data.cell.x + 2,
            data.cell.y + 2,
            12,
            12
          );
        }
      },
    });

    doc.save("daily_sales.pdf");
  };

  window.exportToExcel = () => {
    // Export daily sales to Excel
    const groupedSales = getGroupedSales();
    if (groupedSales.length === 0) return alert("No sales to export.");
    const ws_data = [
      ["Image (URL)", "Item", "Quantity", "Unit Price", "Total"],
      ...groupedSales.map((sale) => [
        sale.image,
        sale.name,
        sale.quantitySold,
        sale.price.toLocaleString("en-US") + " $",
        (sale.price * sale.quantitySold).toLocaleString("en-US") + " $",
      ]),
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, "daily_sales.xlsx");
  };

  // --- INITIALIZATION ---
  renderStockTable();
  renderSalesSummary();
});
