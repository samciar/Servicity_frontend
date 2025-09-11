import React, { useState, useEffect } from 'react'
import HeaderBar from '../Components/HeaderBar'
import Footer from '../Components/Footer'
import usuario1 from '../assets/users/usuario1.jpg'
import usuario2 from '../assets/users/usuario2.jpg'
import usuario3 from '../assets/users/usuario3.jpg'

// Simulated taskers data
const mockTaskers = [
  {
    id: 1,
    name: 'Carlos Sanchez R.',
    image: usuario1,
    description: 'Soy jardinero profesional con mas de 10 años de experiencia, tengo todas las herramientas para cumplir con las tareas necesarias.',
    availability: 'Disponible de 10am a 4pm',
    rate: 25000,
    skills: ['jardinería', 'poda', 'diseño de jardines']
  },
  {
    id: 2,
    name: 'Leidy Cardenas V.',
    image: usuario2,
    description: 'Soy apasionada por las plantas y el diseño de jardines en el sector.',
    availability: 'Disponible de 2pm a 5pm',
    rate: 18000,
    skills: ['jardinería', 'diseño floral', 'mantenimiento']
  },
  {
    id: 3,
    name: 'Manuel Restrepo C.',
    image: usuario3,
    description: 'Trabajo como jardinero de medio tiempo, delicado y pulido con el cuidado de tus plantas',
    availability: 'Disponible de 7am a 1pm',
    rate: 15000,
    skills: ['jardinería', 'poda', 'riego']
  }
]

export default function SearchService() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTaskers, setFilteredTaskers] = useState(mockTaskers)
  const [popularSkills] = useState(['Jardinería', 'Poda', 'Arbolización', 'Jardín'])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTaskers(mockTaskers)
    } else {
      const filtered = mockTaskers.filter(tasker => 
        tasker.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      setFilteredTaskers(filtered)
    }
  }, [searchTerm])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <>
      <HeaderBar />
      <div className="w-full h-24 px-5 py-5">
        <div className='relative'>
          <input 
            type="text" 
            className='border border-gray-500 text-gray-950 rounded-full p-2 px-5 mt-4 w-full' 
            placeholder='Buscar servicios (ej: jardinería, poda)' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className='absolute top-6 right-2 fill-gray-700' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
            <path d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z"></path>
          </svg>
        </div>
      </div>
      
      <div className='w-full h-12 flex gap-2 bg-gray-200 px-4 justify-center items-center'>
        {popularSkills.map((skill, index) => (
          <button 
            key={index}
            onClick={() => setSearchTerm(skill.toLowerCase())}
            className='inline-block bg-gray-600 text-white py-1 px-4 rounded-lg hover:bg-gray-500'
          >
            {skill}
          </button>
        ))}
      </div>

      <div className='w-full p-5'>
        {filteredTaskers.length > 0 ? (
          filteredTaskers.map(tasker => (
            <div key={tasker.id} className="flex flex-col md:grid md:grid-cols-3 gap-4 pb-10 border-b border-gray-200 last:border-0">
              {/* Image */}
              <div className="flex justify-center md:justify-start">
                <img 
                  src={tasker.image} 
                  className='rounded-3xl w-32 h-32 md:w-40 md:h-40 object-cover' 
                  alt={tasker.name} 
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <span className="font-bold text-lg">{tasker.name}</span>
                <p className='text-sm mt-1'>{tasker.description}</p>
                <p className="mt-2 text-sm text-gray-600">{tasker.availability}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tasker.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rate & Contact */}
              <div className='flex flex-col items-center md:items-start mt-4 md:mt-0'>
                <div className="text-center md:text-left">
                  <span className='text-2xl md:text-3xl font-bold text-amber-600'>
                    {formatCurrency(tasker.rate)}
                  </span>
                  <span className='block text-lg md:text-xl text-amber-800'>
                    Por hora
                  </span>
                </div>
                <button 
                  className="mt-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 w-full md:w-auto"
                >
                  Contactar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No se encontraron taskers que coincidan con tu búsqueda</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
