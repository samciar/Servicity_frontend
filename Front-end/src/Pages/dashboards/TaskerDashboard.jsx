import React, { useState, useEffect } from 'react';
import { sendRequest } from '../../utils/sendRequest';
import { ToastContainer, showToast } from '../../utils/Toast';
import HeaderBar from '../../Components/HeaderBar';

const TaskerDashboard = () => {
    const [stats, setStats] = useState({
        hourlyRate: 0,
        completedTasks: 0,
        pendingTasks: 0,
        totalEarnings: 0
    });
    const [pendingTasks, setPendingTasks] = useState([]);
    const [offeredTasks, setOfferedTasks] = useState([]);
    const [bookedTasks, setBookedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBidModal, setShowBidModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [bidData, setBidData] = useState({
        bid_amount: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch user stats
                const userRes = await sendRequest({method: 'GET', params: {}, url: '/user', token: true});
                if (userRes.success) {
                    setStats(prev => ({
                        ...prev,
                        hourlyRate: userRes.data.hourly_rate || 0,
                        completedTasks: userRes.data.completed_tasks || 0,
                        totalEarnings: userRes.data.total_earnings || 0
                    }));
                }

                // Fetch user's tasks
                const tasksRes = await sendRequest({method: 'GET', params: {}, url: '/user/tasks', token: true});
                if (tasksRes.success) {
                    const allTasks = tasksRes.data;
                    setPendingTasks(allTasks.filter(task => task.status === 'pending'));
                }

                // Fetch offered tasks (tasks in user's category) with user bid status
                const categoryRes = await sendRequest({
                    method: 'GET', 
                    params: {with_user_bid_status: true}, 
                    url: '/tasks', 
                    token: true
                });
                if (categoryRes.success) {
                    setOfferedTasks(categoryRes.data.slice(0, 3));
                }

                // Fetch booked tasks (tasks where user's bid was accepted)
                const bookingsRes = await sendRequest({
                    method: 'GET',
                    params: {},
                    url: '/bookings/active',
                    token: true
                });
                if (bookingsRes.success) {
                    setBookedTasks(bookingsRes.data);
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

    const handleTaskAction = async (taskId, action, bidId = null, bookingId = null) => {
        if (action === 'bid') {
            const task = offeredTasks.find(t => t.id === taskId);
            if (task) {
                setSelectedTask(task);
                setBidData({
                    bid_amount: '',
                    message: ''
                });
                setShowBidModal(true);
            }
        } else if (action === 'withdraw' && bidId) {
            try {
                const response = await sendRequest({
                    method: 'POST',
                    params: {},
                    url: `/bids/${bidId}/withdraw`,
                    token: true
                });

                if (response.success) {
                    showToast('Oferta retirada con éxito', 'success');
                    // Refresh the offered tasks to update the UI
                    const categoryRes = await sendRequest({
                        method: 'GET', 
                        params: {with_user_bid_status: true}, 
                        url: '/tasks', 
                        token: true
                    });
                    if (categoryRes.success) {
                        setOfferedTasks(categoryRes.data.slice(0, 3));
                    }
                } else {
                    showToast(response.message || 'Error al retirar la oferta', 'error');
                }
            } catch (error) {
                console.error('Error withdrawing bid:', error);
                showToast('Error al retirar la oferta', 'error');
            }
        } else if (action === 'start' && bookingId) {
            try {
                const response = await sendRequest({
                    method: 'POST',
                    params: {},
                    url: `/bookings/${bookingId}/progress`,
                    token: true
                });

                if (response.success) {
                    showToast('Tarea iniciada con éxito', 'success');
                    // Refresh booked tasks
                    const bookingsRes = await sendRequest({
                        method: 'GET',
                        params: {},
                        url: '/bookings/active',
                        token: true
                    });
                    if (bookingsRes.success) {
                        setBookedTasks(bookingsRes.data);
                    }
                } else {
                    showToast(response.message || 'Error al iniciar la tarea', 'error');
                }
            } catch (error) {
                console.error('Error starting task:', error);
                showToast('Error al iniciar la tarea', 'error');
            }
        } else if (action === 'complete' && bookingId) {
            try {
                const response = await sendRequest({
                    method: 'POST',
                    params: {},
                    url: `/bookings/${bookingId}/complete`,
                    token: true
                });

                if (response.success) {
                    showToast('Tarea completada con éxito', 'success');
                    // Refresh booked tasks
                    const bookingsRes = await sendRequest({
                        method: 'GET',
                        params: {},
                        url: '/bookings/active',
                        token: true
                    });
                    if (bookingsRes.success) {
                        setBookedTasks(bookingsRes.data);
                    }
                } else {
                    showToast(response.message || 'Error al completar la tarea', 'error');
                }
            } catch (error) {
                console.error('Error completing task:', error);
                showToast('Error al completar la tarea', 'error');
            }
        } else {
            // Implement other task actions (accept, reject)
            console.log(`Action ${action} on task ${taskId}`);
            // You would typically call the API here to update task status
        }
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTask || !bidData.bid_amount) return;

        setSubmitting(true);
        try {
            const response = await sendRequest({
                method: 'POST',
                params: {
                    task_id: selectedTask.id,
                    bid_amount: parseFloat(bidData.bid_amount),
                    message: bidData.message
                },
                url: '/bids',
                token: true
            });

            if (response.success) {
                showToast('Oferta realizada con éxito', 'success');
                setShowBidModal(false);
                setSelectedTask(null);
                setBidData({ bid_amount: '', message: '' });
                
                // Remove the task from offered tasks after successful bid
                setOfferedTasks(prev => prev.filter(task => task.id !== selectedTask.id));
            } else {
                showToast(response.message || 'Error al realizar la oferta', 'error');
            }
        } catch (error) {
            console.error('Error submitting bid:', error);
            showToast('Error al realizar la oferta', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBidChange = (e) => {
        const { name, value } = e.target;
        setBidData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const closeBidModal = () => {
        setShowBidModal(false);
        setSelectedTask(null);
        setBidData({ bid_amount: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Hourly Rate Card */}
                    <div className="p-5 bg-white rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Tarifa por hora</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stats.hourlyRate.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">Tareas completadas</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stats.completedTasks}
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">Tareas pendientes</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {pendingTasks.length}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Total Earnings Card */}
                    <div className="p-5 bg-white rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Ganancias totales</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stats.totalEarnings.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks Sections */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Booked Tasks */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Tareas reservadas</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {loading ? (
                                <div className="px-4 py-4 sm:px-6 text-center">
                                    <svg className="animate-spin h-5 w-5 text-amber-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : bookedTasks.length > 0 ? (
                                bookedTasks.map((booking) => (
                                    <div key={booking.id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-amber-600 truncate">{booking.task?.title || 'Tarea sin título'}</p>
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {booking.status === 'scheduled' ? 'Programada' :
                                                 booking.status === 'in_progress' ? 'En progreso' :
                                                 booking.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {booking.start_time ? new Date(booking.start_time).toLocaleDateString() : 'Sin fecha'}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>{booking.agreed_price ? booking.agreed_price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : 'Sin precio'}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex space-x-2">
                                            {booking.status === 'scheduled' && (
                                                <button
                                                    onClick={() => handleTaskAction(null, 'start', null, booking.id)}
                                                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    Iniciar
                                                </button>
                                            )}
                                            {booking.status === 'in_progress' && (
                                                <button
                                                    onClick={() => handleTaskAction(null, 'complete', null, booking.id)}
                                                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Completar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                    No hay tareas reservadas
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Tareas pendientes</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {loading ? (
                                <div className="px-4 py-4 sm:px-6 text-center">
                                    <svg className="animate-spin h-5 w-5 text-amber-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : pendingTasks.length > 0 ? (
                                pendingTasks.map((task) => (
                                    <div key={task.id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-amber-600 truncate">{task.title}</p>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleTaskAction(task.id, 'accept')}
                                                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    Aceptar
                                                </button>
                                                <button
                                                    onClick={() => handleTaskAction(task.id, 'reject')}
                                                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                    No hay tareas pendientes
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Offered Tasks */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Tareas publicadas</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {loading ? (
                                <div className="px-4 py-4 sm:px-6 text-center">
                                    <svg className="animate-spin h-5 w-5 text-amber-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : offeredTasks.length > 0 ? (
                                offeredTasks.map((task) => (
                                    <div key={task.id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-amber-600 truncate">{task.title}</p>
                                            {(task.user_bid_status === 'accepted') ? (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                                    Oferta aceptada
                                                </span>
                                            ) : (task.user_has_bid || false) ? (
                                                <button
                                                    onClick={() => handleTaskAction(task.id, 'withdraw', task.user_bid_id || null)}
                                                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Retirar oferta
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleTaskAction(task.id, 'bid')}
                                                    className="px-2 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700"
                                                >
                                                    Realizar una oferta
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {task.category?.name || 'No category'}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>{task.budget ? task.budget.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : 'Sin presupuesto'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                    No hay tareas ofertadas
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Bid Modal */}
            {showBidModal && selectedTask && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Realizar oferta para: {selectedTask.title}
                            </h3>
                            
                            <form onSubmit={handleBidSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="bid_amount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Monto de la oferta *
                                    </label>
                                    <input
                                        type="number"
                                        id="bid_amount"
                                        name="bid_amount"
                                        value={bidData.bid_amount}
                                        onChange={handleBidChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mensaje (opcional)
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={bidData.message}
                                        onChange={handleBidChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="Escribe un mensaje para el cliente..."
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {bidData.message.length}/500 caracteres
                                    </p>
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeBidModal}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                        disabled={submitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
                                        disabled={submitting || !bidData.bid_amount}
                                    >
                                        {submitting ? 'Enviando...' : 'Enviar Oferta'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default TaskerDashboard;
