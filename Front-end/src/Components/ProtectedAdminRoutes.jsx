import React from 'react'
import { Navigate, Outlet } from 'react-router'
import storage from '../Storage/storage'

export const ProtectedAdminRoutes = ({ children }) => {
  const authUser = storage.get('authUser');

  // Check if user is authenticated and is an admin
  if (!authUser) {
    return <Navigate to='/login' />
  }

  if (authUser.user_type !== 'admin') {
    return <Navigate to='/' />
  }

  return <Outlet />
}

export default ProtectedAdminRoutes
