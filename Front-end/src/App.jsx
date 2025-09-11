// import reactLogo from './assets/vite.svg' // usar en src: {viteLogo}
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import Building from "./Pages/Building";
import SearchService from "./Pages/SearchService";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import RegisterTasker from "./Pages/RegisterTasker";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import ProtectedAdminRoutes from "./Components/ProtectedAdminRoutes";
import TaskerDashboard from "./Pages/dashboards/TaskerDashboard";
import ClientDashboard from "./Pages/dashboards/ClientDashboard";
import Profile from "./Pages/Profile";
import CreateTask from "./Pages/CreateTask";
import TaskSearch from "./Pages/TaskSearch";
import TaskDetails from "./Pages/TaskDetails";
import MyTasks from "./Pages/MyTasks";
import ClientProfile from "./Pages/ClientProfile";
import AdminDashboard from "./Pages/dashboards/AdminDashboard";

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Building />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/register-tasker' element={<RegisterTasker />}/>
        <Route path='building' element={<Building />} />
        <Route path='home' element={<Home />} />
        <Route path="search" element={<SearchService />}/>
        <Route path='*' element={<Building />} ></Route>

        <Route element={<ProtectedRoutes />}>
          {/* Rutas protegidas */}
          <Route path='/tasker-dashboard' element={<TaskerDashboard />}/>
          <Route path='/client-dashboard' element={<ClientDashboard />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/create-task' element={<CreateTask />}/>
          <Route path='/search-tasks' element={<TaskSearch />}/>
          <Route path='/task/:id' element={<TaskDetails />}/>
          <Route path='/my-tasks' element={<MyTasks />}/>
          <Route path='/client/:id' element={<ClientProfile />}/>
        </Route>

        <Route element={<ProtectedAdminRoutes />}>
          {/* Rutas protegidas para administradores */}
          <Route path='/admin-dashboard' element={<AdminDashboard />}/>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
