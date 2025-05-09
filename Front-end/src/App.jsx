// import reactLogo from './assets/vite.svg' // usar en src: {viteLogo}
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./Pages/home";
import Building from "./Pages/building";

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Building />} />
        <Route path='building' element={<Building />} />
        <Route path='home' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
