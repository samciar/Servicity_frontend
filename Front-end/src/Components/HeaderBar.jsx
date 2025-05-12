import React from 'react'
import { Link } from 'react-router'
import servicityLogo from '../assets/servicity_logo.png'

export function HeaderBar() {
  return (
    <>
    <header className='flex items-center w-full h-15 justify-between p-2 border-b-1 border-gray-200'>
      <a href="#">
        <div className='flex size-10 flex-col items-center justify-center gap-1 p-1'>
          <div className='bg-amber-500 w-5 h-0.5'></div>
          <div className='bg-amber-500 w-5 h-0.5'></div>
          <div className='bg-amber-500 w-5 h-0.5'></div>
        </div>
      </a>

      <div className='flex justify-end w-40 h-10'>
        <img src={servicityLogo} className='h-full object-fill' alt="Logo Servicity" />
      </div>
    </header>
    </>
  )
}