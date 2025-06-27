import { getSalesToday, getStock } from "../../state.js";

window.exportToPDF = async () => {
  const groupedSales = getGroupedSales();
  if (groupedSales.length === 0) return alert("Aucune vente à exporter.");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Récapitulatif des ventes du jour", 14, 14);

  const tableBody = await Promise.all(
    groupedSales.map(async (sale) => {
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
        { content: "", img: imgData },
        sale.name,
        sale.quantitySold,
        sale.price.toLocaleString("fr-CD") + " $",
        (sale.price * sale.quantitySold).toLocaleString("fr-CD") + " $",
      ];
    })
  );

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

function getGroupedSales() {
  const grouped = {};
  getSalesToday().forEach((sale) => {
    if (!grouped[sale.itemId]) {
      grouped[sale.itemId] = {
        name: sale.name,
        price: sale.price,
        image: getStock().find((item) => item.id === sale.itemId)?.image || "",
        quantitySold: 1,
      };
    } else {
      grouped[sale.itemId].quantitySold += 1;
    }
  });
  return Object.values(grouped);
}
