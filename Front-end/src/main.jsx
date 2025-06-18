import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css'

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
