import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import storage from '../Storage/storage'
import servicityLogo from '../assets/servicity_logo.png'
import axios from '../axios';

export default function HeaderBar() {

  const [menuIsVisible, setMenuVisible] = useState(false)

  const go = useNavigate();
  const logout = async(e) => {
    e.preventDefault();
    storage.remove('authToken');
    storage.remove('authUser');
    await axios.get('api/auth/logout', storage.get('authToken'));
    go('/login');
  }

  const showMenu = (event) => {
    event.preventDefault();

    if(menuIsVisible){
      setMenuVisible(false)
    }else{
      setMenuVisible(true)
    }
  }

  useEffect(() => {
    setMenuVisible(false)
  }, [])
  
  return (
    <header className='flex justify-center w-full h-15 p-2 border-b-1 border-gray-200'>
      <div className="flex items-center w-full justify-between xl:w-7xl xl:pl-10 xl:pr-10">
        <a href="#" className='block' onClick={showMenu}>
          <div className='flex size-10 flex-col items-center justify-center gap-1 p-1'>
            <div className='bg-amber-500 w-5 h-0.5'></div>
            <div className='bg-amber-500 w-5 h-0.5'></div>
            <div className='bg-amber-500 w-5 h-0.5'></div>
          </div>
        </a>
        <div className='h-full'>
          <img src={servicityLogo} className='block h-full' alt="Logo Servicity" />
        </div>
      </div>

      <div 
        className={menuIsVisible ? 'fixed w-full h-screen left-0 top-0 bg-black/60 z-10' : 'fixed w-full h-screen left-0 top-0 bg-white z-10 hidden'}
        onClick={(event) => {
        event.stopPropagation();
        setMenuVisible(false);
      }}
      >
        <div 
          className='w-2/3 h-full bg-white'
          onClick={(event) => {
              event.stopPropagation();
            }}
        >
          <div className='flex items-center justify-start w-full h-20 p-15'>
            <img src={servicityLogo} className='saturate-0 w-40' />
          </div>
            <ul>
              <li className='grid grid-flow-row pl-15'>
                <Link to='/home' className='p-3 text-2 font-bold border-b-2 border-b-amber-500'>Inicio</Link>
                <Link to='/search' className='p-3 text-2 font-bold border-b-2 border-b-amber-500'>Buscar servicio</Link>
                <Link to='/aboutUs' className='p-3 text-2 font-bold border-b-2 border-b-amber-500'>Sobre nosotros</Link>
                { storage.get('authUser') ? (
                  <>
                    <Link to='/profile' className='p-3 text-2 font-bold border-b-2 border-b-amber-500'>Mi perfil</Link>
                    <a href='#' onClick={logout} className='p-3 text-2 font-bold border-b-2 border-b-amber-500'>Cerrar sesión</a>
                  </>
                ): (
                  <Link to='/login' className='p-3 text-2 font-bold border-b-2 border-b-amber-500'>Acceder</Link>
                )}

              </li>
            </ul>
        </div>
      </div>
    </header>
  )
}