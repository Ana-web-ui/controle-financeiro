import { Menu, X, ArrowUp } from "lucide-react";
import avatar from "../assets/image.png";
import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="flex flex-col items-center text-center flex-1 justify-center">

        {/* Avatar */}
        <div className="mb-6">
          <div className="w-28 h-28 rounded-full border-2 border-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <img
              src={avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-white text-xl mb-2">Olá,</h2>
        <p className="text-gray-400">
          O que vamos resolver hoje?
        </p>
      </div>

      {/* Input inferior */}
      <div className="p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Adicione uma despesa ou receita..."
            className="w-full bg-transparent border border-pink-500 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />

          <button className="absolute right-3 bottom-3 bg-pink-500 text-black w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg shadow-pink-500/50">
            <ArrowUp size={18} />
          </button>
        </div>
      </div>

    </div>
  );
}

export default Home;
