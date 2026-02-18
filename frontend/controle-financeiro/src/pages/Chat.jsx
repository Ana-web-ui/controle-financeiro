import { Menu, X, ArrowUp } from "lucide-react";
import avatar from "../assets/image.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getMe } from "../services/api";

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  // STATES (coloque no topo do componente)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  
  async function handleSend() {
  if (!message.trim()) return;

  const token = localStorage.getItem("token");

  if (!token) {
    setMessages((prev) => [
      ...prev,
      { type: "bot", text: "Usuário não autenticado. Faça login novamente." },
    ]);
    return;
  }

  // adiciona mensagem do usuário
  setMessages((prev) => [...prev, { type: "user", text: message }]);

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    // 🔥 se o token estiver inválido ou expirado
    if (response.status === 401) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Sessão expirada. Faça login novamente." },
      ]);
      return;
    }

    if (!response.ok) {
      throw new Error("Erro na resposta do servidor");
    }

    const data = await response.json();

    // adiciona resposta do bot
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        text: `${data.mensagem}\nSaldo atual: R$ ${data.saldo_atual}`,
      },
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        text: "Erro ao conectar com o servidor 😕",
      },
    ]);
  }

  setMessage("");
}


  return (
    <div className="min-h-screen bg-[#070710] flex flex-col justify-between relative overflow-hidden">
      {/* Overlay escuro */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0b0b15] border-r border-pink-500/30 z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Botão fechar */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-pink-500 hover:rotate-90 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col px-6 gap-6 mt-4">
          <Link
            to="/dashboard"
            className="text-pink-500 hover:text-pink-400 transition border-b border-pink-500/20 pb-2"
          >
            Dashboard
          </Link>

          <Link
            to="/relatorios"
            className="text-pink-500 hover:text-pink-400 transition border-b border-pink-500/20 pb-2"
          >
            Relatórios
          </Link>
        </nav>
      </div>

      {/* Menu superior */}
      <div className="p-6 z-20 relative">
        <div
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded-full border border-pink-500 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-black transition cursor-pointer"
        >
          <Menu size={20} />
        </div>
      </div>

      {/* Conteúdo central */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 flex flex-col">
        {messages.length === 0 ? (
          <>
            {/* Avatar inicial */}
            <div className="mb-6 flex justify-center mt-10">
              <div className="w-28 h-28 rounded-full border-2 border-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            </div>

            <h2 className="text-white text-xl text-center">Olá 👋</h2>
            <p className="text-gray-400 text-center">
              O que vamos resolver hoje?
            </p>
          </>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl max-w-xs whitespace-pre-line ${
                msg.type === "user"
                  ? "bg-pink-500 text-black self-end ml-auto"
                  : "bg-[#1a1a2e] text-white self-start"
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input inferior */}
      <div className="p-6">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Adicione uma despesa ou receita..."
            className="w-full bg-transparent border border-pink-500 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />

          <button
            onClick={handleSend}
            className="absolute right-3 bottom-3 bg-pink-500 text-black w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg shadow-pink-500/50"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
