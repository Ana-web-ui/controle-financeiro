import { useState } from "react";
import { register } from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


 async function handleSubmit(e) {
  e.preventDefault();

  try {
    const data = await register(email, password);

    console.log("Resposta do backend:", data);

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      navigate("/chat");
    }

  } catch (error) {
    setMessage(error.message);
  }
}


  return (
    <div className="flex items-center justify-center min-h-screen bg-[#070710] px-4">
      <div className="bg-[#070710] w-full max-w-sm p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-8 leading-snug">
          BORA COMEÇAR?
          <br />
          VAMOS CRIAR SUA CONTA!
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-gray-400 text-sm">E-mail</label>
            <input
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 p-3 bg-transparent text-white rounded-xl border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Senha</label>
            <input
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 p-3 bg-transparent text-white rounded-xl border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>

          <button
            type="submit"
            className="mt-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-600 to-pink-500 hover:scale-105 transition duration-300 shadow-lg shadow-pink-500/30"
          >
            Criar
          </button>

          <div className="text-center mt-4 text-sm text-gray-400">
            Já tem conta?{" "}
            <Link
              to="/Login"
              className="text-pink-500 hover:text-pink-400 transition duration-300 font-medium"
            >
              Clique aqui
            </Link>
          </div>
        </form>

        {message && <p className="text-center text-pink-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}

export default Registro;
