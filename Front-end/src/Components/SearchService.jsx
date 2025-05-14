import React from 'react'
import HeaderBar from './HeaderBar'
import Footer from './Footer'
import usuario1 from '../assets/imagenes_usuarios/usuario1.jpg'
import usuario2 from '../assets/imagenes_usuarios/usuario2.jpg'
import usuario3 from '../assets/imagenes_usuarios/usuario3.jpg'

export default function SearchService() {
    return (
        <>
            <HeaderBar />
            <div className="w-full h-24 px-5 py-5">
                <div className='relative'>
                    <input type="text" className='border border-gray-500 text-gray-950 rounded-full p-2 px-5 mt-4 w-full' placeholder='Necesito un servicio de jardinería para mañana"' value='Necesito un servicio de jardinería para mañana"'/>
                    <svg className='absolute top-6 right-2 fill-gray-700' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                        <path d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z"></path>
                    </svg>
                </div>
            </div>
            <div className='w-full h-12 flex gap-2 bg-gray-200 px-4 justify-center items-center'>
                <a href="#"><span className='inline-block bg-gray-600 text-white py-1 px-4 rounded-lg hover:bg-gray-500'>Jardinería</span></a>
                <a href="#"><span className='inline-block bg-gray-600 text-white py-1 px-4 rounded-lg hover:bg-gray-500'>Poda</span></a>
                <a href="#"><span className='inline-block bg-gray-600 text-white py-1 px-4 rounded-lg hover:bg-gray-500'>Arbolización</span></a>
                <a href="#"><span className='inline-block bg-gray-600 text-white py-1 px-4 rounded-lg hover:bg-gray-500'>Jardín</span></a>
            </div>

            <div className='w-full p-5'>
                <div className="grid grid-cols-3 gap-4 pb-10">
                    <div className=''>
                        <img src={usuario1} className='rounded-3xl size-40 object-cover' alt="" />
                    </div>
                    <div className=''>
                        <span className="font-bold">Carlos Sanchez R.</span>
                        <p className='text-sm'>Soy jardinero profesional con mas de 10 años de experiencia, tengo todas las herramientas para cumplir con las tareas necesarias.</p>
                        <p>Disponible  de 10am a 4pm</p>
                    </div>
                    <div className='flex flex-col justify-start items-center'>
                        <span className='text-3xl font-bold text-amber-600'>$25.000</span>
                        <span className='text-xl text-amber-800'>Por hora</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pb-10">
                    <div className=''>
                        <img src={usuario2} className='rounded-3xl size-40 object-cover' alt="" />
                    </div>
                    <div className=''>
                        <span className="font-bold">Leidy Cardenas V.</span>
                        <p className='text-sm'>Soy apasionada por las plantas y el diseño de jardines en el sector.</p>
                        <p>Disponible  de 2pm a 5pm</p>
                    </div>
                    <div className='flex flex-col justify-start items-center'>
                        <span className='text-3xl font-bold text-amber-600'>$18.000</span>
                        <span className='text-xl text-amber-800'>Por hora</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pb-10">
                    <div className=''>
                        <img src={usuario3} className='rounded-3xl size-40 object-cover' alt="" />
                    </div>
                    <div className=''>
                        <span className="font-bold">Manuel Restrepo C.</span>
                        <p className='text-sm'>trabajo como jardinero de medio tiempo, delicado y poulido con el cuidado de tus plarnas</p>
                        <p>Disponible  de 7am a 1pm</p>
                    </div>
                    <div className='flex flex-col justify-start items-center'>
                        <span className='text-3xl font-bold text-amber-600'>$15.000</span>
                        <span className='text-xl text-amber-800'>Por hora</span>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
