document.addEventListener("DOMContentLoaded", () => {
  // --- VARIABLES ET ÉLÉMENTS DU DOM ---
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

  // --- VARIABLES POUR LES ACTIONS DE L'APP ---
  const confirmSaleModalEl = document.getElementById("confirmSaleModal");
  const confirmSaleModal = new bootstrap.Modal(confirmSaleModalEl);
  const saleItemNameEl = document.getElementById("saleItemName");
  const stockAfterSaleEl = document.getElementById("stockAfterSale");
  const confirmSaleButton = document.getElementById("confirmSaleButton");

  const confirmDeleteModalEl = document.getElementById("confirmDeleteModal");
  const confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl);
  const deleteItemNameEl = document.getElementById("deleteItemName");
  const confirmDeleteButton = document.getElementById("confirmDeleteButton");

  // --- FONCTIONS DE CALCUL ET D'EXPORT ---
  const totalSalesEl = document.getElementById("totalSales");
  const salesListUl = document.getElementById("salesList");
  const exportPdfButton = document.querySelector(
    'button[onclick="exportToPDF()"]'
  );
  const exportExcelButton = document.querySelector(
    'button[onclick="exportToExcel()"]'
  );

  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // --- DONNÉES (Simulation - Utiliser localStorage pour la persistance) ---
  let stock = JSON.parse(localStorage.getItem("stockData")) || [
    // Données d'exemple initiales si localStorage est vide
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

  // --- FONCTIONS ---

  // Sauvegarder les données dans localStorage
  const saveData = () => {
    localStorage.setItem("stockData", JSON.stringify(stock));
    localStorage.setItem("salesTodayData", JSON.stringify(salesToday));
  };

  // Afficher / Mettre à jour le tableau des stocks
  const renderStockTable = (items = stock) => {
    stockTableBody.innerHTML = ""; // Vider le tableau
    noResultsMsg.style.display = items.length === 0 ? "block" : "none";

    if (items.length === 0 && stock.length > 0) {
      noResultsMsg.textContent =
        "Aucun article ne correspond à votre recherche.";
    } else if (items.length === 0 && stock.length === 0) {
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

  // Modifie renderSalesSummary pour utiliser le regroupement
  const renderSalesSummary = () => {
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

  // Préparer le modal pour l'ajout
  window.prepareAddModal = () => {
    modalTitle.textContent = "Ajouter un Article";
    stockForm.reset();
    itemIdInput.value = ""; // Assurer qu'il n'y a pas d'ID
    imagePreview.style.display = "none"; // Cacher l'aperçu
  };

  // Préparer le modal pour la modification
  const prepareEditModal = (id) => {
    const item = stock.find((item) => item.id === id);
    if (item) {
      modalTitle.textContent = "Modifier l'Article";
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

  // Préparer le modal de confirmation de vente
  const prepareSaleModal = (id) => {
    const item = stock.find((item) => item.id === id);
    if (item && item.quantity > 0) {
      itemToSellId = id;
      saleItemNameEl.textContent = item.name;
      stockAfterSaleEl.textContent = item.quantity - 1;
      confirmSaleModal.show();
    } else if (item) {
      alert(`L'article "${item.name}" est en rupture de stock.`);
    }
  };

  // Préparer le modal de confirmation de suppression
  const prepareDeleteModal = (id) => {
    const item = stock.find((item) => item.id === id);
    if (item) {
      itemToDeleteId = id;
      deleteItemNameEl.textContent = item.name;
      confirmDeleteModal.show();
    }
  };

  // Gérer la soumission du formulaire (Ajout/Modification)
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
      stock = stock.map((item) =>
        item.id === id ? { ...item, name, quantity, price, image } : item
      );
    } else {
      // Ajout
      const newItem = {
        id: Date.now(), // ID unique simple
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
    stockForm.reset(); // Vider le formulaire après ajout/modif
    imagePreview.style.display = "none";
  });

  // Gérer la confirmation de vente
  confirmSaleButton.addEventListener("click", () => {
    if (itemToSellId !== null) {
      const itemIndex = stock.findIndex((item) => item.id === itemToSellId);
      if (itemIndex !== -1 && stock[itemIndex].quantity > 0) {
        stock[itemIndex].quantity -= 1;

        // Enregistrer la vente
        const soldItem = stock[itemIndex];
        salesToday.push({
          itemId: soldItem.id,
          name: soldItem.name,
          price: soldItem.price,
          timestamp: new Date().toISOString(), // Garder une trace de quand la vente a eu lieu
        });

        saveData();
        renderStockTable();
        renderSalesSummary();
        confirmSaleModal.hide();
        itemToSellId = null;
      } else {
        alert("Erreur : Article non trouvé ou déjà en rupture de stock.");
        confirmSaleModal.hide();
        itemToSellId = null;
      }
    }
  });

  // Gérer la confirmation de suppression
  confirmDeleteButton.addEventListener("click", () => {
    if (itemToDeleteId !== null) {
      stock = stock.filter((item) => item.id !== itemToDeleteId);
      saveData();
      renderStockTable(); // Mettre à jour le tableau
      renderSalesSummary(); // Recalculer au cas où (même si ça ne change rien ici)
      confirmDeleteModal.hide();
      itemToDeleteId = null;
    }
  });

  // Gérer la recherche/filtrage
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredStock = stock.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    renderStockTable(filteredStock);
  });

  // Gestion Clics sur les boutons du tableau (Vendre, Modifier, Supprimer) via délégation
  stockTableBody.addEventListener("click", (e) => {
    const target = e.target.closest("button"); // Cible le bouton cliqué ou son parent si icône cliquée

    if (!target) return; // Sortir si le clic n'était pas sur un bouton

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

  // Aperçu de l'image lors de la saisie de l'URL
  itemImageInput.addEventListener("input", () => {
    const url = itemImageInput.value.trim();
    if (url) {
      imagePreview.src = url;
      imagePreview.style.display = "block";
      // Optionnel: vérifier si l'image se charge correctement
      imagePreview.onerror = () => {
        // imagePreview.style.display = 'none'; // Cacher si erreur
        imagePreview.src =
          "https://via.placeholder.com/60/FF0000/FFFFFF?text=Erreur"; // Afficher image d'erreur
      };
    } else {
      imagePreview.style.display = "none";
    }
  });

  // --- FONCTIONS D'EXPORTATION (Placeholders) ---
  window.exportToPDF = async () => {
    // Exporter les ventes du jour en PDF
    // Vérifier s'il y a des ventes à exporter
    const groupedSales = getGroupedSales();
    if (groupedSales.length === 0) return alert("Aucune vente à exporter.");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Récapitulatif des ventes du jour", 14, 14);

    // Préparer les données pour autotable
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
          sale.price.toLocaleString("fr-CD") + " $",
          (sale.price * sale.quantitySold).toLocaleString("fr-CD") + " $",
        ];
      })
    );
    // Ajouter une ligne vide pour l'espacement
    doc.autoTable({
      head: [["Image", "Article", "Quantité", "Prix Unitaire", "Total"]],
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

    doc.save("ventes_du_jour.pdf");
  };

  window.exportToExcel = () => {
    // Exporter les ventes du jour en Excel
    const groupedSales = getGroupedSales();
    if (groupedSales.length === 0) return alert("Aucune vente à exporter.");
    const ws_data = [
      ["Image (URL)", "Article", "Quantité", "Prix Unitaire", "Total"],
      ...groupedSales.map((sale) => [
        sale.image,
        sale.name,
        sale.quantitySold,
        sale.price.toLocaleString("fr-CD") + " $",
        (sale.price * sale.quantitySold).toLocaleString("fr-CD") + " $",
      ]),
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Ventes");
    XLSX.writeFile(wb, "ventes_du_jour.xlsx");
  };

  // --- INITIALISATION ---
  renderStockTable();
  renderSalesSummary();
});
