import { useState } from "react";
import {register} from "../services/api";

function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await register(email, password);

      if (data.message) {
        setMessage("Usuário criado com sucesso");
      } else if (data.detail) {
        setMessage(data.detail);
      }
    } catch (error) {
      setMessage("Erro ao registrar usuário");
    }
  }
  return (
    <div style={styles.container}>
      <h2>Registro</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Registro
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "100px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
  },
  button: {
    padding: "10px",
    cursor: "pointer",
  },
};

export default Registro;
