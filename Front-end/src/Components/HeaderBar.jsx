import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import servicityLogo from '../assets/servicity_logo.png'


export default function HeaderBar() {

  const [menuIsVisible, setMenuVisible] = useState(false)

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
    <>
    <header className='flex items-center w-full h-15 justify-between p-2 border-b-1 border-gray-200'>
      <a href="#" onClick={showMenu}>
        <div className='flex size-10 flex-col items-center justify-center gap-1 p-1'>
          <div className='bg-amber-500 w-5 h-0.5'></div>
          <div className='bg-amber-500 w-5 h-0.5'></div>
          <div className='bg-amber-500 w-5 h-0.5'></div>
        </div>
      </a>

      <div className={menuIsVisible ? 'fixed w-full h-screen left-0 top-0 bg-white z-10' : 'fixed w-full h-screen left-0 top-0 bg-white z-10 hidden'}>
        <div className='flex items-center justify-start w-full h-20 p-10'>
          <img src={servicityLogo} className='saturate-0 w-40' />
        </div>
          <ul>
            <li className='grid grid-flow-row pl-15'>
              <Link to='/home' className='p-8 text-2xl font-bold border-b-4 border-b-amber-500'>Inicio</Link>
              <Link to='/search' className='p-8 text-2xl font-bold border-b-4 border-b-amber-500'>Buscar servicio</Link>
              <Link to='/profile' className='p-8 text-2xl font-bold border-b-4 border-b-amber-500'>Ingresar a mi cuenta</Link>
            </li>
          </ul>
      </div>




      <div className='flex justify-end w-40 h-10'>
        <img src={servicityLogo} className='h-full object-fill' alt="Logo Servicity" />
      </div>
    </header>
    </>
  )
}