import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (products) => {
  const doc = new jsPDF();

  // Título centrado
  doc.setFontSize(18);
  doc.text("Lista de Productos", doc.internal.pageSize.width / 2, 15, { align: "center" });

  // Definir columnas y filas
  const headers = [["Producto", "Stock", "Stock Total", "Precio Venta", "Precio Costo"]];
  const data = products.map((p) => [
    p.title, 
    p.stock, 
    p.totalStock, 
    `$${p.sellingPrice.toFixed(2)}`, 
    `$${p.costPrice.toFixed(2)}`
  ]);

  // Agregar tabla con autoTable
  autoTable(doc, {
    startY: 25,
    head: headers,
    body: data,
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255], fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: "auto" },  // Producto
      1: { cellWidth: 25, halign: "center" },  // Stock
      2: { cellWidth: 30, halign: "center" },  // Stock Total
      3: { cellWidth: 35, halign: "right" },  // Precio Venta
      4: { cellWidth: 35, halign: "right" },  // Precio Costo
    },
    margin: { top: 30, left: 10, right: 10 },
    didDrawPage: function (data) {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber}`, 
        doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    },
  });

  // Descargar el PDF
  doc.save("productos.pdf");
};
