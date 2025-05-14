import React from 'react'
import { Link } from 'react-router'
import HeaderBar from '../Components/HeaderBar'
import Footer from '../Components/Footer'

import imgCategoria1 from '../assets/imagenes_categorias/cat_1.jpg'
import imgCategoria2 from '../assets/imagenes_categorias/cat_2.jpg'
import imgCategoria3 from '../assets/imagenes_categorias/cat_3.jpg'
import imgCategoria4 from '../assets/imagenes_categorias/cat_4.jpg'
import imgCategoria5 from '../assets/imagenes_categorias/cat_5.jpg'
import imgCategoria6 from '../assets/imagenes_categorias/cat_6.jpg'
import start from '../assets/star.svg'

export default function Home() {
  return (
    <>
      <HeaderBar/>

      <div className="w-full h-60 px-5 py-15">
        <h2 className='text-4xl font-bold'>Necesito ayuda con</h2>
        <div className='relative'>
          <input type="text" className='border border-gray-300 rounded-full p-2 px-5 mt-4 w-full' placeholder='Prueba "Montar un tv" o "pintar un cuarto"'/>
          <svg className='absolute top-6 right-2 fill-gray-500' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
            <path d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z"></path>
          </svg>
        </div>
      </div>

      <div className='grid max-sm:grid-cols-2 sm:grid-cols-3 gap-2 mb-15 px-5'>
        <a href="" className='p-2 rounded-2xl transition hover:bg-gray-200/50 animate-slide-up-fade animate-delay-0'>
        <div className="flex flex-col items-center">
          <img src={imgCategoria1} className='size-35 object-cover rounded-3xl' alt="imagen categoria ensamblaje" />
          <span className='text-amber-600 font-bold mt-2'>Ensamblaje</span>
        </div>
        </a>
        <a href="" className='p-2 rounded-2xl transition hover:bg-gray-200/50 animate-slide-up-fade animate-delay-100'>
          <div className="flex flex-col items-center">
            <img src={imgCategoria2} className='size-35 object-cover rounded-3xl' alt="imagen categoria ensamblaje" />
            <span className='text-amber-600 font-bold mt-2'>Limpieza</span>
          </div>
        </a>
        <a href="" className='p-2 rounded-2xl transition hover:bg-gray-200/50 animate-slide-up-fade animate-delay-200'>
          <div className="flex flex-col items-center">
            <img src={imgCategoria3} className='size-35 object-cover rounded-3xl' alt="imagen categoria ensamblaje" />
            <span className='text-amber-600 font-bold mt-2'>Mudanza</span>
          </div>
        </a>
        <a href="" className='p-2 rounded-2xl transition hover:bg-gray-200/50 animate-slide-up-fade animate-delay-300'>
          <div className="flex flex-col items-center">
            <img src={imgCategoria4} className='size-35 object-cover rounded-3xl' alt="imagen categoria ensamblaje" />
            <span className='text-amber-600 font-bold mt-2'>Pintura</span>
          </div>
        </a>
        <a href="" className='p-2 rounded-2xl transition hover:bg-gray-200/50 animate-slide-up-fade animate-delay-400'>
          <div className="flex flex-col items-center">
            <img src={imgCategoria5} className='size-35 object-cover rounded-3xl' alt="imagen categoria ensamblaje" />
            <span className='text-amber-600 font-bold mt-2'>jardinería</span>
          </div>
        </a>
        <a href="" className='p-2 rounded-2xl transition hover:bg-gray-200/50 animate-slide-up-fade animate-delay-500'>
          <div className="flex flex-col items-center">
            <img src={imgCategoria6} className='size-35 object-cover rounded-3xl' alt="imagen categoria ensamblaje" />
            <span className='text-amber-600 font-bold mt-2'>Plomería</span>
          </div>
        </a>
      </div>

      <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-2 px-5 py-12 text-center bg-gradient-to-r from-red-500 to-yellow-500">
        <div className='grid grid-rows-2 gap-8'>
          <div className='flex flex-col items-center text-white text-2xl font-bold'>
            <span>Tareas finalizadas</span>
            <span className='text-6xl'>+4.500</span>
          </div>
          <div className='flex flex-col items-center text-white text-2xl font-bold'>
            <span>Hogares aseados</span>
            <span className='text-6xl'>+1.100</span>
          </div>
        </div>
        <div className='grid grid-rows-2 gap-8'>
        <div className='flex flex-col items-center text-white text-2xl font-bold'>
            <span>mudanzas</span>
            <span className='text-6xl'>+520</span>
          </div>
          <div className='flex flex-col items-center text-white text-2xl font-bold'>
            <span>Trabajadores disponibles</span>
            <span className='text-6xl'>+245</span>
          </div>
        </div>
      </div>

      <div className='p-10'>
        <h1 className='text-3xl text-balance text-amber-600 font-bold mb-10'>Conoce los que dicen nuestros clientes sobre Servicity</h1>

        <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-10">
          <div>
            <div className="flex justify-between">
              <span className='font-bold'>Andrea C.</span>
              <div className='flex flex-row'>
                <img className='fill-yellow-400 max-sm:size-6' src={start} alt="" />
                <img className='fill-yellow-400 max-sm:size-6' src={start} alt="" />
                <img className='fill-yellow-400 max-sm:size-6' src={start} alt="" />
                <img className='fill-yellow-400 max-sm:size-6' src={start} alt="" />
                <img className='fill-yellow-400 max-sm:size-6' src={start} alt="" />
              </div>
            </div>
            <p>Era justo lo que necesitaba para mis tareas en el hogar. Ahora tengo mas tiempo para compartir con mi familia.</p>
          </div>
          <div>
            <div className="flex justify-between">
              <span className='font-bold'>Maria Pa.</span>
              <div className='flex flex-row'>
                <img className='fill-yellow-400 max-sm:size-6' src={start} alt="" />
                <img className='fill-yellow-400 max-sm:size-6' src={start} alt="" />
                <img className='fill-yellow-400 max-sm:size-6' src={start} alt="" />
                <img className='fill-yellow-400 max-sm:size-6' src={start} alt="" />
                <img className='fill-yellow-400 max-sm:size-6' src={start} alt="" />
              </div>
            </div>
            <p>Sin duda, es un servicio recomendado, Llegan en la hora acordada y conocen del tema.</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
