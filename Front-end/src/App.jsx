// import reactLogo from './assets/vite.svg' // usar en src: {viteLogo}
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import Building from "./Pages/Building";
import SearchService from "./Components/SearchService";

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Building />} />
        <Route path='building' element={<Building />} />
        <Route path='home' element={<Home />} />
        <Route path="search" element={<SearchService />}/>
        <Route path='*' element={<Building />} ></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
