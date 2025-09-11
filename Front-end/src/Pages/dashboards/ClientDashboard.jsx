import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { sendRequest } from '../../utils/sendRequest';
import { ToastContainer, showToast } from '../../utils/Toast';
import HeaderBar from '../../Components/HeaderBar';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        bio: '',
        profile_picture_url: '',
        department: null,
        municipality: null
    });
    const [stats, setStats] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        totalSpent: 0
    });
    const [latestTasks, setLatestTasks] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch user info
                const userRes = await sendRequest({method: 'GET', params: {}, url: '/user', token: true});
                if (userRes.success) {
                    setUserInfo({
                        name: userRes.data.name || '',
                        email: userRes.data.email || '',
                        phone_number: userRes.data.phone_number || '',
                        address: userRes.data.address || '',
                        bio: userRes.data.bio || '',
                        profile_picture_url: userRes.data.profile_picture_url || '',
                        department: userRes.data.department || null,
                        municipality: userRes.data.municipality || null
                    });
                }

                // Fetch user's tasks (client tasks)
                const tasksRes = await sendRequest({method: 'GET', params: {}, url: '/user/tasks', token: true});
                if (tasksRes.success) {
                    const allTasks = tasksRes.data;
                    setLatestTasks(allTasks.slice(0, 3));
                    
                    // Calculate stats
                    const pending = allTasks.filter(task => task.status === 'pending');
                    const completed = allTasks.filter(task => task.status === 'completed');
                    
                    setStats({
                        totalTasks: allTasks.length,
                        pendingTasks: pending.length,
                        completedTasks: completed.length,
                        totalSpent: completed.reduce((sum, task) => sum + (task.final_price || 0), 0)
                    });

                    setPendingTasks(pending);
                }

                // Fetch bids for user's tasks
                const bidsRes = await sendRequest({method: 'GET', params: {}, url: '/bids/pending', token: true});
                if (bidsRes.success) {
                    setBids(bidsRes.data.slice(0, 5));
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                showToast('Error loading dashboard data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleBidAction = async (bidId, action) => {
        try {
            let response;
            if (action === 'accept') {
                response = await sendRequest({
                    method: 'POST',
                    params: {},
                    url: `/bids/${bidId}/accept`,
                    token: true
                });
            } else if (action === 'reject') {
                response = await sendRequest({
                    method: 'POST',
                    params: {},
                    url: `/bids/${bidId}/reject`,
                    token: true
                });
            }

            if (response && response.success) {
                showToast(`Oferta ${action === 'accept' ? 'aceptada' : 'rechazada'} con éxito`, 'success');
                // Refresh bids
                const bidsRes = await sendRequest({method: 'GET', params: {}, url: '/bids/pending', token: true});
                if (bidsRes.success) {
                    setBids(bidsRes.data.slice(0, 5));
                }
            }
        } catch (error) {
            console.error('Error handling bid:', error);
            showToast('Error al procesar la oferta', 'error');
        }
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard del Cliente</h1>
                
                {/* User Info Card (Read-only) */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Información del Perfil</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Información personal (solo lectura)</p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <p className="mt-1 text-sm text-gray-900">{userInfo.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="mt-1 text-sm text-gray-900">{userInfo.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                <p className="mt-1 text-sm text-gray-900">{userInfo.phone_number || 'No proporcionado'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                                <p className="mt-1 text-sm text-gray-900">{userInfo.address || 'No proporcionada'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Biografía</label>
                                <p className="mt-1 text-sm text-gray-900">{userInfo.bio || 'No hay biografía'}</p>
                            </div>
                            {userInfo.department && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Departamento</label>
                                    <p className="mt-1 text-sm text-gray-900">{userInfo.department.name}</p>
                                </div>
                            )}
                            {userInfo.municipality && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Municipio</label>
                                    <p className="mt-1 text-sm text-gray-900">{userInfo.municipality.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Acciones Rápidas</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Gestiona tus tareas y servicios</p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/create-task')}
                                className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Crear Nueva Tarea
                            </button>
                            <button
                                onClick={() => navigate('/my-tasks')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                Ver Mis Tareas
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Tasks Card */}
                    <div className="p-5 bg-white rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Tareas</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stats.totalTasks}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Pending Tasks Card */}
                    <div className="p-5 bg-white rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Tareas Pendientes</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stats.pendingTasks}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Completed Tasks Card */}
                    <div className="p-5 bg-white rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Tareas Completadas</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stats.completedTasks}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Total Spent Card */}
                    <div className="p-5 bg-white rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Gastado</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {formatCurrency(stats.totalSpent)}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks and Bids Sections */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Latest Tasks */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Últimas Tareas</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {loading ? (
                                <div className="px-4 py-4 sm:px-6 text-center">
                                    <svg className="animate-spin h-5 w-5 text-amber-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : latestTasks.length > 0 ? (
                                latestTasks.map((task) => (
                                    <div key={task.id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-amber-600 truncate">{task.title}</p>
                                            <p className="text-sm text-gray-500">{new Date(task.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {task.status}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>{task.budget ? formatCurrency(task.budget) : 'Sin presupuesto'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                    No hay tareas recientes
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pending Bids */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Ofertas Pendientes</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {loading ? (
                                <div className="px-4 py-4 sm:px-6 text-center">
                                    <svg className="animate-spin h-5 w-5 text-amber-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : bids.length > 0 ? (
                                bids.map((bid) => (
                                    <div key={bid.id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-amber-600 truncate">
                                                {bid.task?.title || 'Tarea sin título'}
                                            </p>
                                            <p className="text-sm font-semibold text-green-600">
                                                {formatCurrency(bid.bid_amount)}
                                            </p>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Por: {bid.tasker?.name || 'Tasker desconocido'}
                                            </p>
                                            {bid.message && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    "{bid.message}"
                                                </p>
                                            )}
                                        </div>
                                        <div className="mt-3 flex space-x-2">
                                            <button
                                                onClick={() => handleBidAction(bid.id, 'accept')}
                                                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Aceptar
                                            </button>
                                            <button
                                                onClick={() => handleBidAction(bid.id, 'reject')}
                                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                    No hay ofertas pendientes
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pending Tasks Section */}
                {pendingTasks.length > 0 && (
                    <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Tareas Pendientes</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {pendingTasks.map((task) => (
                                <div key={task.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-amber-600 truncate">{task.title}</p>
                                        <p className="text-sm text-gray-500">{new Date(task.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {task.status}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>{task.budget ? formatCurrency(task.budget) : 'Sin presupuesto'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <ToastContainer />
        </div>
    );
};

export default ClientDashboard;
