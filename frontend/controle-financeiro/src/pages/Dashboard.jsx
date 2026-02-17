import { useState } from "react";
import { ArrowUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Dashboard() {
  const [despesas, setDespesas] = useState([
    { nome: "Aluguel", valor: 1200 },
    { nome: "Mercado", valor: 600 },
    { nome: "Internet", valor: 120 },
  ]);

  const [novaDespesa, setNovaDespesa] = useState("");
  const [valorDespesa, setValorDespesa] = useState("");

  const adicionarDespesa = () => {
    if (!novaDespesa || !valorDespesa) return;

    const nova = {
      nome: novaDespesa,
      valor: parseFloat(valorDespesa),
    };

    setDespesas([...despesas, nova]);
    setNovaDespesa("");
    setValorDespesa("");
  };

  const total = despesas.reduce((acc, item) => acc + item.valor, 0);
  const COLORS = [
    "#0313A6", // Zaffre
    "#9201CB", // Dark Violet
    "#F715AB", // Pink neon
    "#34EDF3", // Cyan neon
    "#070F34", // Oxford blue
  ];

  return (
    <div className="min-h-screen bg-[#070710] text-white p-6">
      <h1 className="text-2xl font-semibold text-pink-500 mb-6">
        Dashboard Financeiro
      </h1>

      {/* Gráfico */}
      <div className="relative bg-[#0b0b15] p-6 rounded-2xl border border-pink-500/20 shadow-lg shadow-pink-500/10 mb-8">
        <h2 className="mb-4 text-lg text-gray-300">Distribuição de Despesas</h2>

        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={despesas}
              dataKey="valor"
              nameKey="nome"
              cx="50%"
              cy="45%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={4}
              activeOuterRadius={125}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {despesas.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    filter: "drop-shadow(0px 0px 8px rgba(255, 20, 147, 0.4))",
                  }}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#0b0b15",
                border: "1px solid #9201CB",
                borderRadius: "12px",
                boxShadow: "0 0 15px rgba(146,1,203,0.5)",
              }}
              itemStyle={{ color: "#fff" }}
              formatter={(value, name) => [`R$ ${value}`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Total no centro */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-pink-500 text-2xl font-bold">
              R$ {total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Adicionar despesa */}
      <div className="bg-[#0b0b15] p-6 rounded-2xl border border-pink-500/20 shadow-lg shadow-pink-500/10">
        <h2 className="mb-4 text-lg text-gray-300">Adicionar nova despesa</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Nome da despesa"
            value={novaDespesa}
            onChange={(e) => setNovaDespesa(e.target.value)}
            className="flex-1 bg-transparent border border-pink-500 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <input
            type="number"
            placeholder="Valor"
            value={valorDespesa}
            onChange={(e) => setValorDespesa(e.target.value)}
            className="w-full md:w-40 bg-transparent border border-pink-500 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <button
            onClick={adicionarDespesa}
            className="bg-pink-500 text-black px-6 py-3 rounded-xl flex items-center justify-center hover:scale-105 transition shadow-lg shadow-pink-500/40"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
