import { useState } from "react";
import { ArrowUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

  const [tipoGrafico, setTipoGrafico] = useState("pizza");

  return (
    <div className="min-h-screen bg-[#070710] text-white p-6">
      <h1 className="text-2xl font-semibold text-pink-500 mb-6">
        Dashboard Financeiro
      </h1>

      {/* Gráfico */}
      <div className="relative bg-[#0b0b15] p-6 rounded-2xl border border-pink-500/20 shadow-lg shadow-pink-500/10 mb-8">
        <h2 className="mb-4 text-lg text-gray-300">Distribuição de Despesas</h2>

        <div className="flex justify-end mb-4 gap-2">
          <button
            onClick={() => setTipoGrafico("pizza")}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              tipoGrafico === "pizza"
                ? "bg-[#9201CB] text-white shadow-lg shadow-purple-500/40"
                : "bg-[#0b0b15] border border-purple-500 text-gray-300"
            }`}
          >
            Pizza
          </button>

          <button
            onClick={() => setTipoGrafico("barra")}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              tipoGrafico === "barra"
                ? "bg-[#34EDF3] text-black shadow-lg shadow-cyan-400/40"
                : "bg-[#0b0b15] border border-cyan-400 text-gray-300"
            }`}
          >
            Barras
          </button>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          {tipoGrafico === "pizza" ? (
            <PieChart>
              <Pie
                data={despesas}
                dataKey="valor"
                nameKey="nome"
                cx="50%"
                cy="48%"
                innerRadius={80}
                outerRadius={115}
                activeOuterRadius={125}
                paddingAngle={4}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {despesas.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0b0b15",
                  border: "1px solid #9201CB",
                  borderRadius: "12px",
                }}
                formatter={(value, name) => [`R$ ${value}`, name]}
              />
            </PieChart>
          ) : (
            <BarChart data={despesas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="nome" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0b0b15",
                  border: "1px solid #34EDF3",
                  borderRadius: "12px",
                }}
                formatter={(value) => `R$ ${value}`}
              />
              <Bar dataKey="valor" radius={[10, 10, 0, 0]}>
                {despesas.map((entry, index) => (
                  <Cell
                    key={`cell-bar-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>

        {tipoGrafico === "pizza" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-[#34EDF3] text-2xl font-bold">
                R$ {total.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;
