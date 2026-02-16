import { useState } from "react";
import { register } from "../services/api";
import { Link } from "react-router-dom";

function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await register(email, password);

      if (data.message) {
        setMessage("Usuário criado com sucesso 🎉");
      } else if (data.detail) {
        setMessage(data.detail);
      }
    } catch (error) {
      setMessage("Erro ao registrar usuário");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkbg relative overflow-hidden">
      
      <div className="bg-black ">
        <h2 className="text-3xl font-bold text-white text-center mb-6 tracking-widest">
          BORA COMEÇAR? VAMOS CRIAR SUA CONTA!
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="text-gray-300 text-sm">E-mail</label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-2 p-3 bg-transparent text-white rounded-xl border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
        </div>

        <div>
           <label className="text-gray-300 text-sm">Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-2 p-3 bg-transparent text-white rounded-xl border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
        </div>
          <button
            type="submit"
            className="mt-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-600 to-pink-500 hover:scale-105 transition duration-300 shadow-lg shadow-pink-500/30"
          >
            Criar Conta
          </button>


        <div className="text-center mt-6 text-sm text-gray-300">
            Já tem uma conta?{" "}
            <Link
              to="/Login"
              className="text-pink-500 hover:text-pink-400 transition duration-300 font-medium"
            >
              entre aqui
            </Link>
          </div>
        </form>

        {message && (
          <p className="text-center text-cyberpink mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Registro;
