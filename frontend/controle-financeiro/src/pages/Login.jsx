import { useState } from "react";
import { login } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await login(email, password);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        setMessage("Login realizado com sucesso 🎉");
      } else if (data.detail) {
        setMessage(data.detail);
      }
    } catch (error) {
      setMessage("Erro ao fazer login");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkbg">
      <div className="bg-black p-10 rounded-2xl shadow-2xl shadow-cyberpink/40 w-96">
        <h2 className="text-3xl font-bold text-cyberpink text-center mb-6">
          LOGIN
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-darkbg text-white p-3 rounded-lg border border-cyberpink focus:outline-none focus:ring-2 focus:ring-cyberpink"
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-darkbg text-white p-3 rounded-lg border border-cyberpink focus:outline-none focus:ring-2 focus:ring-cyberpink"
          />

          <button
            type="submit"
            className="bg-cyberpink text-black font-bold py-3 rounded-lg hover:scale-105 transition duration-300 shadow-lg shadow-cyberpink/50"
          >
            Entrar
          </button>
        </form>

        {message && (
          <p className="text-center text-cyberpink mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Login;
