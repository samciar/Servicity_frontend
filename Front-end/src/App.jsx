// import reactLogo from './assets/vite.svg' // usar en src: {viteLogo}
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import Building from "./Pages/Building";
import SearchService from "./Pages/SearchService";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedRoutes from "./Components/ProtectedRoutes";

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Building />} />
        <Route path='/login' element={<Login />}/>
        <Route element={<ProtectedRoutes />}>
          {/* Rutas protegidas */}
        </Route>
        <Route path='/register' element={<Register />}/>
        <Route path='building' element={<Building />} />
        <Route path='home' element={<Home />} />
        <Route path="search" element={<SearchService />}/>
        <Route path='*' element={<Building />} ></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
