import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router';
import { sendRequest } from '../functions'
import storage from '../Storage/storage';
import servicityLogo from '../assets/servicity_logo.png';
import backgroundLogin from '../assets/work_balance.jpg';
import axios from '../axios';
 import { ToastContainer, showToast } from '../utils/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const go = useNavigate();

  const csrf = async () => {
    await axios.get('/sanctum/csrf-cookie')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(loading == false) {
      setLoading(true);
      try {
        console.log('Login attempt:', { email, password, rememberMe });
        await csrf();
        const form = { email: email, password: password };
        const res = await sendRequest('POST', form, '/api/login', '', false);
        
        console.log(res);
        
        if (res.success == true) {
          storage.set('authToken', res.data.token);
          storage.set('authUser', res.data.user);
          
          showToast('Acceso exitoso', 'success');
          setTimeout(() => {
            go('/Home');
          }, 2000);
        }else{
          showToast(res.data.message, 'error');
        }
      } catch (error) {
        console.log(error);
        showToast('Ha ocurrido un error', 'error');
      }
      setLoading(false);
    }

  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleGitHubLogin = () => {
    console.log('GitHub login clicked');
  };



  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 to-indigo-100 flex items-center justify-center flex-row lg:items-stretch lg:content-stretch lg:justify-start gap-0'>
      <div className='flex items-center justify-center p-4 min-w-[400px] w-[50%] lg:justify-end'>
        <div className='p-8 lg:p-16 w-full max-w-md'> {/* bg-white rounded-lg shadow-xl */}
          {/* Logo */}
          <div className='flex justify-center mb-8'>
            <div className='w-24 h-8 rounded-lg flex items-center justify-center'>
              <img src={servicityLogo}/>
            </div>
          </div>

          {/* Title */}
          <h1 className='text-2xl font-bold text-gray-900 text-center mb-2'>
            Accede a tu cuenta
          </h1>

          {/* Subtitle */}
          <p className='text-gray-600 text-center mb-8'>
            ¿No tienes una?{' '}
            <Link to='/register' className='text-amber-600 hover:text-amber-500 font-medium'>
                Crea tu cuenta ahora mismo
            </Link>
          </p>

          {/* Form */}
          <form className='space-y-6' onSubmit={handleSubmit}>
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
                autoComplete='mail'
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Contraseña
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                placeholder='Ingresa tu contraseña de usuario'
                autoComplete='current-password'
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded'
                />
                <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-700'>
                  Recordar mi cuenta
                </label>
              </div>
              <a href='#' className='text-sm text-amber-600 hover:text-amber-500'>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Login In Button */}

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
                onClick={handleSubmit}
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 cursor-pointer transition duration-200'
              >
                Ingresar
              </button>
            )}

          </form>

          {/* Divider */}
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-[#f0f2f5] text-gray-500'>O accede con</span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className='mt-6 grid grid-cols-2 gap-3'>
            <button
              onClick={handleGoogleLogin}
              className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer transition duration-200'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24'>
                <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
              </svg>
              <span className='ml-2'>Google</span>
            </button>

            <button
              onClick={handleGitHubLogin}
              className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer transition duration-200'
            >
              <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='20' height='20' viewBox='0 0 48 48'>
                <linearGradient id='Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1' x1='9.993' x2='40.615' y1='9.993' y2='40.615' gradientUnits='userSpaceOnUse'><stop offset='0' stopColor='#2aa4f4'></stop><stop offset='1' stopColor='#007ad9'></stop></linearGradient><path fill='url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)' d='M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z'></path><path fill='#fff' d='M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z'></path>
              </svg>
              <span className='ml-2'>Facebook</span>
            </button>
          </div>
        </div>
      </div>
      <div className='hidden bg-amber-900 w-[50%] lg:flex'>
        <img src={backgroundLogin} className='object-cover grayscale opacity-50 w-full h-full'/>
      </div>

      <ToastContainer/>
    </div>
  )
}

export default Login