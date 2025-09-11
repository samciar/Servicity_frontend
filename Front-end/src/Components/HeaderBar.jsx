import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import storage from '../Storage/storage'
import servicityLogo from '../assets/servicity_logo.png'
import { sendRequest } from '../utils/sendRequest';

export default function HeaderBar() {
  const [menuIsVisible, setMenuVisible] = useState(false)
  const go = useNavigate();

  const logout = async(e) => {
    e.preventDefault();
    const res = await sendRequest({method: 'POST', params: {}, url: '/logout', redir: '/home', token: true});
    if(res.success){
      storage.remove('authToken');
      storage.remove('authUser');
    }
  }

  const showMenu = (event) => {
    event.preventDefault();
    setMenuVisible(!menuIsVisible);
  }

  useEffect(() => {
    setMenuVisible(false)
  }, [])

  // Menu items component to avoid duplication
  const MenuItems = () => (
    <>
      <Link to='/home' className='p-3 text-sm font-medium hover:text-amber-600 transition-colors'>Inicio</Link>
      <Link to='/search' className='p-3 text-sm font-medium hover:text-amber-600 transition-colors'>Buscar servicio</Link>
      {storage.get('authUser')?.user_type === 'admin' ? (
        <Link to='/admin-dashboard' className='p-3 text-sm font-medium hover:text-amber-600 transition-colors'>Dashboard</Link>
      ) : storage.get('authUser')?.user_type === 'tasker' ? (
        <Link to='/tasker-dashboard' className='p-3 text-sm font-medium hover:text-amber-600 transition-colors'>Dashboard</Link>
      ) : storage.get('authUser')?.user_type === 'client' ? (
        <Link to='/client-dashboard' className='p-3 text-sm font-medium hover:text-amber-600 transition-colors'>Dashboard</Link>
      ) : (
        <Link to='/register-tasker' className='p-3 text-sm font-medium hover:text-amber-600 transition-colors'>Quiero ofrecer mis servicios</Link>
      )}
      <Link to='/about-us' className='p-3 text-sm font-medium hover:text-amber-600 transition-colors'>Sobre nosotros</Link>
      {storage.get('authUser') ? (
        <>
          <Link to='/profile' className='p-3 text-sm font-medium hover:text-amber-600 transition-colors'>Mi perfil</Link>
          <Link onClick={logout} className='p-3 text-sm font-medium text-orange-700 hover:text-amber-600 transition-colors'>Cerrar sesión</Link>
        </>
      ): (
        <Link to='/login' className='p-3 text-sm font-medium hover:text-amber-600 transition-colors'>Acceder</Link>
      )}
    </>
  )

  return (
    <header className='w-full bg-white shadow-sm'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className='flex-shrink-0'>
            <img src={servicityLogo} className='h-8' alt="Logo Servicity" />
          </div>

          {/* Desktop Menu (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-4">
            <MenuItems />
          </div>

          {/* Mobile menu button (hidden on desktop) */}
          <div className="md:hidden">
            <button 
              onClick={showMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-600 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (hidden on desktop) */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${menuIsVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={() => setMenuVisible(false)}
        ></div>
        <div 
          className={`absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${menuIsVisible ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <img src={servicityLogo} className='h-8' alt="Logo Servicity" />
              <button 
                onClick={() => setMenuVisible(false)}
                className="text-gray-500 hover:text-amber-600"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
              <MenuItems />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
