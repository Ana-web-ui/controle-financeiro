import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro"
import Home from "./pages/Home"
import './index.css'

function App() {
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Registro/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
