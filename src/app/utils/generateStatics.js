export default function generateStats(resume) {
  const productStats = {};
  let totalProfit = 0;
  let totalTickets = resume.tickets.length;
  let totalAmount = 0;
  let paymentStats = {};
  let salesByHour = Array(24).fill(0).map((_, i) => ({ hour: `${i}:00`, total: 0 }));

  // Tickets
  resume.tickets.forEach(({ ticket }) => {
    if (!ticket) return;

    const createdAt = new Date(ticket.created_at);
    const hour = createdAt.getHours();
    salesByHour[hour].total += ticket.amount;

    totalAmount += ticket.amount;
    paymentStats[ticket.payment_method] = (paymentStats[ticket.payment_method] || 0) + ticket.amount;

    ticket.products.forEach(p => {
      const key = p.product.id;
      if (!productStats[key]) {
        productStats[key] = {
          title: p.product.title,
          quantity: 0,
          total: 0,
          profit: 0
        };
      }
      productStats[key].quantity += p.quantity;
      productStats[key].total += p.totalPrice;
      const gain = (p.product.sellingPrice - p.product.costPrice) * p.quantity;
      productStats[key].profit += gain;
      totalProfit += gain;
    });
  });

  // Producto más vendido y más rentable
  const sortedProducts = Object.values(productStats).sort((a, b) => b.quantity - a.quantity);
  const topProduct = sortedProducts[0];
  const mostProfitable = Object.values(productStats).sort((a, b) => b.profit - a.profit)[0];

  // Gastos
  let totalExpensesWithDiscount = 0;
  resume.expenses.forEach(({ expense }) => {
    if (!expense?.product) return;
    const discount = expense.product.costPrice * expense.quantity * 0.2;
    totalExpensesWithDiscount += discount;
  });

  return {
    topProduct,
    mostProfitable,
    totalProfit,
    averageTicket: (totalAmount / totalTickets).toFixed(2),
    paymentMethods: Object.entries(paymentStats).map(([method, amount]) => ({ method, amount })),
    mostUsedPayment: Object.entries(paymentStats).sort((a, b) => b[1] - a[1])[0]?.[0],
    salesByHour,
    totalExpensesWithDiscount: totalExpensesWithDiscount.toFixed(2),
    top5Products: sortedProducts.slice(0, 5),
    // Podés incluir esto si pasás el resumen anterior:
    comparisonWithPrevious: resume.comparisonWithPrevious || null
  };
}