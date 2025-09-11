import React, { useState, useEffect } from 'react';
import { sendRequest } from '../../utils/sendRequest';
import HeaderBar from '../../Components/HeaderBar';

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalTaskers: 0,
    totalTasks: 0,
    totalBids: 0,
    totalBookings: 0
  });
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStatistics();
    fetchUsers();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await sendRequest({method: 'GET', params: {}, url: '/users/statistics'});
      
      setStatistics({
        totalUsers: response.data.total_users,
        totalClients: response.data.total_clients,
        totalTaskers: response.data.total_taskers,
        totalTasks: response.data.total_tasks,
        totalBids: response.data.total_bids,
        totalBookings: response.data.total_bookings
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Error loading statistics');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await sendRequest({method: 'GET', params: {}, url: '/users'});
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await sendRequest({method: 'GET', params: {}, url: `/users?search=${searchTerm}`});
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Error searching users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await sendRequest({
        method: 'PUT', 
        params: { is_available: !currentStatus }, 
        url: `/users/${userId}`
      });
      

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_available: !currentStatus }
          : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Error updating user status');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStatistics(), fetchUsers()]);
    setRefreshing(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCards = [
    { title: 'Total Users', value: statistics.totalUsers, color: 'bg-blue-500' },
    { title: 'Clients', value: statistics.totalClients, color: 'bg-green-500' },
    { title: 'Taskers', value: statistics.totalTaskers, color: 'bg-orange-500' },
    { title: 'Tasks', value: statistics.totalTasks, color: 'bg-purple-500' },
    { title: 'Bids', value: statistics.totalBids, color: 'bg-red-500' },
    { title: 'Bookings', value: statistics.totalBookings, color: 'bg-cyan-500' }
  ];

  const getRoleBadgeClass = (userType) => {
    switch (userType) {
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'tasker': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (isAvailable) => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getVerificationBadgeClass = (isVerified) => {
    return isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderBar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((card, index) => (
          <div key={index} className={`${card.color} rounded-lg p-4 text-white`}>
            <h3 className="text-sm font-medium mb-2">{card.title}</h3>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Administración de usuarios</h2>
        
        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o correo electronico..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            onClick={handleSearch}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar
          </button>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Verificado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(user.user_type)}`}>
                        {user.user_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(user.is_available)}`}>
                        {user.is_available ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationBadgeClass(user.id_verified)}`}>
                        {user.id_verified ? 'Verificado' : 'No Verificado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{user.is_available ? 'Inhabilitar' : 'Habilitar'}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={user.is_available}
                            onChange={() => handleToggleUserStatus(user.id, user.is_available)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
