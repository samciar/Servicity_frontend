import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { sendRequest } from '../utils/sendRequest';
import storage from '../Storage/storage';
import servicityLogo from '../assets/servicity_logo.png';
import backgroundRegister from '../assets/garden_maintenance.webp';
import { rootAxios} from '../axios';
import { ToastContainer, showToast } from '../utils/Toast';

const RegisterTasker = () => {
  // Form state
  const [step, setStep] = useState(1);
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load departments on component mount
  React.useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const res = await sendRequest({method: 'GET', params: {}, url: '/departments', token: false});
        if (res.success) {
          setDepartments(res.data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        showToast('Error al cargar departamentos', 'error');
      }
      setLoadingDepartments(false);
    };
    fetchDepartments();
  }, []);

  // Load municipalities when department is selected
  React.useEffect(() => {
    if (selectedDepartment) {
      const fetchMunicipalities = async () => {
        setLoadingMunicipalities(true);
        setCity('');
        try {
          const res = await sendRequest({method: 'GET', params: {}, url: `/departments/${selectedDepartment}/municipalities`, token: false});
          if (res.success) {
            setMunicipalities(res.data);
          }
        } catch (error) {
          console.error('Error fetching municipalities:', error);
          showToast('Error al cargar municipios', 'error');
        }
        setLoadingMunicipalities(false);
      };
      fetchMunicipalities();
    }
  }, [selectedDepartment]);

  // Load categories on component mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await sendRequest({method: 'GET', params: {}, url: '/categories', token: false});
        if (res.success) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        showToast('Error al cargar categorías', 'error');
      }
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  const csrf = async () => {
    await rootAxios.get('/sanctum/csrf-cookie');
  };

  const handleNextStep = () => {
    if (step === 1 && city && category) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading === false && termsAccepted) {
      setLoading(true);
      try {
        await csrf();

        const form = { 
          name, 
          email, 
          password, 
          password_confirmation: passwordConfirmation,
          phone_number: phone,
          user_type: 'tasker',
          department_id: selectedDepartment,
          municipality_id: city,
          category,
          hourly_rate: 0 // Set to 0 since categories from API don't have rates
        };
        const res = await sendRequest({method: 'POST', params: form, url: '/register', token: false});

        if (res.success === true) {
          // Set authentication session similar to login
          storage.set('authToken', res.data.token);
          storage.set('authUser', res.data.user);
          
          showToast('Registro exitoso', 'success');
          setTimeout(() => {
            navigate('/tasker-dashboard');
          }, 1000);
        } else {
          showToast(res.data.message, 'error');
        }
      } catch (error) {
        console.error(error);
        showToast(error, 'error');
      }
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 to-indigo-100 flex items-center justify-center flex-row lg:items-stretch lg:content-stretch lg:justify-start gap-0'>
      <div className='flex items-center justify-center p-4 min-w-[400px] w-[50%] lg:justify-end'>
        <div className='p-8 lg:p-16 w-full max-w-md'>
          {/* Logo */}
          <div className='flex justify-center mb-8'>
            <div className='w-24 h-8 rounded-lg flex items-center justify-center'>
              <img src={servicityLogo} alt="Servicity Logo" />
            </div>
          </div>

          {/* Title */}
          <h1 className='text-2xl font-bold text-gray-900 text-center mb-10'>
            Regístrate como trabajador
          </h1>

          {/* Multi-step form */}
          {step === 1 ? (
            <div className='space-y-6'>
              <h2 className='text-lg font-semibold text-gray-800'>Paso 1: Información básica</h2>
              
              {/* Department Selection */}
              <div>
                <label htmlFor='department' className='block text-sm font-medium text-gray-700 mb-2'>
                  Departamento
                </label>
                <select
                  id='department'
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                  required
                  disabled={loadingDepartments}
                >
                  <option value="">Selecciona tu departamento</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {/* City Selection */}
              <div>
                <label htmlFor='city' className='block text-sm font-medium text-gray-700 mb-2'>
                  Municipio/Ciudad
                </label>
                <select
                  id='city'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                  required
                  disabled={!selectedDepartment || loadingMunicipalities}
                >
                  <option value="">Selecciona tu municipio</option>
                  {municipalities.map((mun) => (
                    <option key={mun.id} value={mun.id}>{mun.name}</option>
                  ))}
                </select>
              </div>

              {/* Category Selection */}
              <div>
                <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-2'>
                  Categoría de servicio
                </label>
                <select
                  id='category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                  required
                  disabled={loadingCategories}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>


              <button
                onClick={handleNextStep}
                disabled={!city || !category}
                className='w-full py-3 px-4 bg-amber-600 text-white rounded-md shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Siguiente
              </button>
            </div>
          ) : (
            <form className='space-y-6' onSubmit={handleSubmit}>
              <h2 className='text-lg font-semibold text-gray-800'>Paso 2: Información personal</h2>

              {/* Name Field */}
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                  Nombre completo
                </label>
                <input
                  id='name'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                  placeholder='Ingresa tu nombre completo'
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                  Correo electrónico
                </label>
                <input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                  placeholder='Ingresa tu correo electrónico'
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
                  Teléfono
                </label>
                <input
                  id='phone'
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                  placeholder='Ingresa tu número de teléfono'
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                    placeholder='Crea una contraseña segura'
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Password Confirmation Field */}
              <div>
                <label htmlFor='password_confirmation' className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    id='password_confirmation'
                    type={showPassword ? 'text' : 'password'}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                    placeholder='Vuelve a escribir tu contraseña'
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className='flex items-start'>
                <div className='flex items-center h-5'>
                  <input
                    id='terms'
                    type='checkbox'
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className='focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded'
                    required
                  />
                </div>
                <div className='ml-3 text-sm'>
                  <label htmlFor='terms' className='font-medium text-gray-700'>
                    Acepto los términos y condiciones
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              {loading ? (
                <button
                  className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 cursor-pointer transition duration-200'
                >
                  <svg aria-hidden="true" role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"></path>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
                  </svg>
                </button>
              ) : (
                <button
                  type='submit'
                  disabled={!termsAccepted}
                  className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200'
                >
                  Crear cuenta de Tasker
                </button>
              )}


              {/* Back Button */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mb-4 py-2 px-4 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 cursor-pointer transition duration-200"
              >
                Volver
              </button>

            </form>
          )}

          {/* Benefits Section */}
          <div className='mt-12 p-4 bg-amber-50 rounded-lg border border-amber-100'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Ventajas de prestar tus servicios</h3>
            <ul className='space-y-2 text-sm text-gray-700'>
              <li className='flex items-start'>
                <span className='mr-2 text-amber-600'>✓</span>
                <span>Sé tu propio jefe - trabaja cuando quieras</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-amber-600'>✓</span>
                <span>Fija tus propias tarifas y horarios</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-amber-600'>✓</span>
                <span>Haz crecer tu negocio con nuevos clientes</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-amber-600'>✓</span>
                <span>Recibe pagos seguros y puntuales</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='hidden bg-amber-900 w-[50%] lg:flex'>
        <img src={backgroundRegister} className='object-cover grayscale opacity-50 w-full h-full' alt="Background" />
      </div>
      <ToastContainer/>
    </div>
  );
};

export default RegisterTasker;
