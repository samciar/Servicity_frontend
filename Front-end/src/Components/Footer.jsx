import React from 'react'

export default function Footer() {
  return (
    <div className='w-full h-auto px-10 py-15 grid grid-cols-3 gap-5 bg-gradient-to-r from-gray-950 to-gray-600'>
        <div className='text-white font-bold'>
            Servicity Co
        </div>
        <div className='text-white'>
            <h3>Nuestros servicios</h3>
            <ul>
                <li>Servicios de hogar</li>
                <li>Servicios empresariales</li>
                <li>Asesorias tecnicas</li>
                <li>Servicios en tecnologia e innovación</li>
            </ul>
        </div>
        <div className='text-white'>
            <h3>Enlaces de interes</h3>
            <ul>
                <li>
                    <a href="">red social x</a>
                </li>
                <li>
                    <a href="">red social y</a>
                </li>
                <li>
                    <a href="">red social z</a>
                </li>
            </ul>
        </div>
    </div>
  )
}
