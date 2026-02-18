import { useState } from "react";
import { login } from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await login(email, password);
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);

        // 🔥 Redireciona para Home
        navigate("/chat");
      } else {
        alert(data.detail);
      }
    } catch {
      alert("Erro ao fazer login");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#070710]">
      <div className="w-80">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-2xl text-white-300 mb-2">Olá!</h1>
          <h2 className="text-4xl font-bold text-white tracking-wide">
            BEM-VINDO
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 p-3 bg-transparent text-white rounded-xl border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="text-gray-300 text-sm">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 p-3 bg-transparent text-white rounded-xl border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="mt-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-600 to-pink-500 hover:scale-105 transition duration-300 shadow-lg shadow-pink-500/30"
          >
            Login
          </button>
          <div className="text-center mt-6 text-sm text-gray-300">
            Não tem conta?{" "}
            <Link
              to="/"
              className="text-pink-500 hover:text-pink-400 transition duration-300 font-medium"
            >
              crie uma aqui
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
