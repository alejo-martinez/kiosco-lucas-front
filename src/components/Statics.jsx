'use client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9f7aea', '#f56565'];

  const formatPaymentMethod = (data) => {
    switch (data) {
      case "eft":
        return "Efectivo"

      case "mp":
        return "Mercado Pago"

      case "td":
        return "Tarjeta de débito"
      case "tc":
        return "Tarjeta de crédito"
      default:
        break;
    }
  }

export default function Statics({ stats }) {
  if (!stats) return <p>No hay estadísticas disponibles.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Resumen general */}
      <div className="p-4 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Resumen general</h2>
        <ul className="space-y-2 text-sm">
          <li><strong>Producto más vendido:</strong> {stats.topProduct.title}</li>
          <li><strong>Producto más rentable:</strong> {stats.mostProfitable.title}</li>
          <li><strong>Ganancia total:</strong> ${stats.totalProfit}</li>
          <li><strong>Promedio por venta:</strong> ${stats.averageTicket}</li>
          <li><strong>Método de pago más usado:</strong> {formatPaymentMethod(stats.mostUsedPayment)}</li>
          <li><strong>Gasto total (con desc.):</strong> ${stats.totalExpensesWithDiscount}</li>
        </ul>
      </div>

      {/* Ventas por hora */}
      <div className="p-4 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Ventas por hora</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats.salesByHour}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Métodos de pago */}
      <div className="p-4 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Métodos de pago</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={stats.paymentMethods}
              dataKey="amount"
              nameKey="method"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {stats.paymentMethods.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 productos */}
      <div className="p-4 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Top 5 productos</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats.top5Products}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparación con jornada anterior */}
      {stats.comparisonWithPrevious && (
        <div className="p-4 bg-white rounded-xl shadow-md col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Comparación con jornada anterior</h2>
          <ul className="text-sm space-y-1">
            <li><strong>Ventas:</strong> {stats.comparisonWithPrevious.salesDiff}%</li>
            <li><strong>Ganancia:</strong> {stats.comparisonWithPrevious.profitDiff}%</li>
            <li><strong>Tickets:</strong> {stats.comparisonWithPrevious.ticketCountDiff}%</li>
          </ul>
        </div>
      )}
    </div>
  );
}
