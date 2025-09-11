import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { sendRequest } from '../utils/sendRequest';
import { ToastContainer, showToast } from '../utils/Toast';
import HeaderBar from '../Components/HeaderBar';
import Footer from '../Components/Footer';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [statusFilter, tasks]);

    const fetchUserTasks = async () => {
        try {
            setLoading(true);
            const response = await sendRequest({method: 'GET', params: {}, url: '/user/tasks', token: true});
            
            if (response.success) {
                setTasks(response.data);
            } else {
                showToast('Error loading your tasks', 'error');
            }
        } catch (error) {
            showToast('Error loading your tasks', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = () => {
        if (statusFilter === 'all') {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(tasks.filter(task => task.status === statusFilter));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-CO');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            open: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Abierta' },
            assigned: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Asignada' },
            in_progress: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'En progreso' },
            completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completada' },
            canceled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
            disputed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'En disputa' }
        };

        const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Desconocido' };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const handleTaskAction = async (taskId, action) => {
        try {
            const response = await sendRequest({
                method: 'PUT', 
                params: { status: action }, 
                url: `/tasks/${taskId}/status`, 
                token: true
            });
            
            if (response.success) {
                showToast(`Tarea ${getActionLabel(action)} exitosamente`, 'success');
                fetchUserTasks(); // Refresh the list
            } else {
                showToast(response.error || `Error ${getActionLabel(action)} tarea`, 'error');
            }
        } catch (error) {
            showToast(`Error ${getActionLabel(action)} tarea`, 'error');
        }
    };

    const getActionLabel = (action) => {
        const actions = {
            completed: 'completada',
            canceled: 'cancelada',
            in_progress: 'marcada como en progreso'
        };
        return actions[action] || 'actualizada';
    };

    return (
        <>
            <HeaderBar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Gestiona todas las tareas que has creado
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/create-task')}
                                className="mt-4 md:mt-0 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                            >
                                Crear Nueva Tarea
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="mt-6 flex flex-wrap gap-4">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    statusFilter === 'all'
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Todas ({tasks.length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('open')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    statusFilter === 'open'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Abiertas ({tasks.filter(t => t.status === 'open').length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('assigned')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    statusFilter === 'assigned'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Asignadas ({tasks.filter(t => t.status === 'assigned').length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('in_progress')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    statusFilter === 'in_progress'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                En Progreso ({tasks.filter(t => t.status === 'in_progress').length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('completed')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    statusFilter === 'completed'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Completadas ({tasks.filter(t => t.status === 'completed').length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('canceled')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    statusFilter === 'canceled'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Canceladas ({tasks.filter(t => t.status === 'canceled').length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('disputed')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    statusFilter === 'disputed'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                En Disputa ({tasks.filter(t => t.status === 'disputed').length})
                            </button>
                        </div>
                    </div>

                    {/* Tasks List */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <svg className="animate-spin h-12 w-12 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : filteredTasks.length > 0 ? (
                        <div className="grid gap-6">
                            {filteredTasks.map(task => (
                                <div key={task.id} className="bg-white rounded-lg shadow p-6">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                                        {/* Task Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                                                {getStatusBadge(task.status)}
                                            </div>
                                            
                                            <p className="text-gray-600 mb-4">{task.description}</p>
                                            
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                {task.budget && (
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {formatCurrency(task.budget)}
                                                    </div>
                                                )}
                                                
                                                {task.deadline && (
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDate(task.deadline)}
                                                    </div>
                                                )}
                                                
                                                {task.address && (
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {task.address}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bids Count */}
                                            {task.bids_count > 0 && (
                                                <div className="mt-3 text-sm text-amber-600">
                                                    {task.bids_count} oferta{task.bids_count !== 1 ? 's' : ''} recibida{task.bids_count !== 1 ? 's' : ''}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                                            <button
                                                onClick={() => navigate(`/task/${task.id}`)}
                                                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                                            >
                                                Ver detalles
                                            </button>
                                            
                                            {task.status === 'open' && (
                                                <>
                                                    <button
                                                        onClick={() => handleTaskAction(task.id, 'in_progress')}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                    >
                                                        En progreso
                                                    </button>
                                                    <button
                                                        onClick={() => handleTaskAction(task.id, 'canceled')}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}
                                            
                                            {task.status === 'in_progress' && (
                                                <button
                                                    onClick={() => handleTaskAction(task.id, 'completed')}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                >
                                                    Completar
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Urgent Badge */}
                                    {task.is_urgent && (
                                        <div className="mt-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Urgente
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes tareas</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {statusFilter === 'all' 
                                    ? 'Comienza creando tu primera tarea.'
                                    : `No tienes tareas ${getStatusLabel(statusFilter)}.`
                                }
                            </p>
                            {statusFilter === 'all' && (
                                <button
                                    onClick={() => navigate('/create-task')}
                                    className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                                >
                                    Crear primera tarea
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
};

const getStatusLabel = (status) => {
    const labels = {
        open: 'abiertas',
        assigned: 'asignadas',
        in_progress: 'en progreso',
        completed: 'completadas',
        canceled: 'canceladas',
        disputed: 'en disputa',
        all: ''
    };
    return labels[status] || '';
};

export default MyTasks;
