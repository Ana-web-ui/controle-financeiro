import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css'   // 👈 ESSA LINHA É OBRIGATÓRIA

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
