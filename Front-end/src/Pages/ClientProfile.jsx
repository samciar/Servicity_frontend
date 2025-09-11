import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { sendRequest } from '../utils/sendRequest';
import { ToastContainer, showToast } from '../utils/Toast';
import HeaderBar from '../Components/HeaderBar';
import Footer from '../Components/Footer';

const ClientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        fetchClientProfile();
        fetchClientTasks();
        fetchClientReviews();
    }, [id]);

    const fetchClientProfile = async () => {
        try {
            const response = await sendRequest({method: 'GET', params: {}, url: `/users/${id}`, token: true});
            
            if (response.success) {
                setClient(response.data);
            } else {
                showToast('Error loading client profile', 'error');
            }
        } catch (error) {
            showToast('Error loading client profile', 'error');
        }
    };

    const fetchClientTasks = async () => {
        try {
            const response = await sendRequest({method: 'GET', params: {}, url: `/users/${id}/tasks`, token: true});
            if (response.success) {
                setTasks(response.data);
            }
        } catch (error) {
            console.error('Error loading client tasks:', error);
        }
    };

    const fetchClientReviews = async () => {
        try {
            const response = await sendRequest({method: 'GET', params: {}, url: `/reviews/user/${id}`, token: true});
            if (response.success) {
                setReviews(response.data);
            }
        } catch (error) {
            console.error('Error loading client reviews:', error);
        } finally {
            setLoading(false);
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

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    if (loading) {
        return (
            <>
                <HeaderBar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <svg className="animate-spin h-12 w-12 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <ToastContainer />
            </>
        );
    }

    if (!client) {
        return (
            <>
                <HeaderBar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Cliente no encontrado</h1>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                        >
                            Volver atrás
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </>
        );
    }

    return (
        <>
            <HeaderBar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0 mb-4 md:mb-0">
                                <img
                                    src={client.profile_picture_url || '/default-avatar.png'}
                                    alt={client.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-100"
                                />
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                                <p className="text-amber-600">{client.email}</p>
                                
                                <div className="flex items-center mt-4 space-x-6 text-sm text-gray-600">
                                    {client.phone_number && (
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {client.phone_number}
                                        </div>
                                    )}
                                    
                                    {reviews.length > 0 && (
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {calculateAverageRating()} ({reviews.length} reseñas)
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Miembro desde {formatDate(client.created_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'info'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Información
                            </button>
                            <button
                                onClick={() => setActiveTab('tasks')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'tasks'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Tareas ({tasks.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'reviews'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Reseñas ({reviews.length})
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-lg shadow p-6">
                        {activeTab === 'info' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900">Información del Cliente</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Contact Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-gray-900">Información de contacto</h3>
                                        
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {client.email}
                                            </div>
                                            
                                            {client.phone_number && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {client.phone_number}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Location Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-gray-900">Ubicación</h3>
                                        
                                        <div className="space-y-2 text-sm text-gray-600">
                                            {client.address && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {client.address}
                                                </div>
                                            )}
                                            
                                            {client.department && client.municipality && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {client.municipality.name}, {client.department.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                {client.bio && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-900">Biografía</h3>
                                        <p className="text-sm text-gray-600">{client.bio}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'tasks' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900">Tareas Publicadas</h2>
                                
                                {tasks.length > 0 ? (
                                    <div className="grid gap-4">
                                        {tasks.map(task => (
                                            <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        task.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {task.status === 'pending' ? 'Pendiente' :
                                                         task.status === 'in_progress' ? 'En progreso' :
                                                         task.status === 'completed' ? 'Completada' :
                                                         task.status === 'cancelled' ? 'Cancelada' :
                                                         'Desconocido'}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                                
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>{formatDate(task.created_at)}</span>
                                                    {task.budget && (
                                                        <span className="font-medium">{formatCurrency(task.budget)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">Este cliente no ha publicado tareas aún.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900">Reseñas del Cliente</h2>
                                
                                {reviews.length > 0 ? (
                                    <div className="grid gap-4">
                                        {reviews.map(review => (
                                            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <svg
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`}
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                                                </div>
                                                
                                                <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                                                
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <span>Por: {review.reviewer?.name || 'Usuario anónimo'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">Este cliente no tiene reseñas aún.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
};

export default ClientProfile;
