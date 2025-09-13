import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { sendRequest } from '../utils/sendRequest';
import { ToastContainer, showToast } from '../utils/Toast';
import HeaderBar from '../Components/HeaderBar';
import Footer from '../Components/Footer';

const TaskerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tasker, setTasker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [completedTasks, setCompletedTasks] = useState(0);

    useEffect(() => {
        fetchTaskerProfile();
    }, [id]);

    const fetchTaskerProfile = async () => {
        try {
            const response = await sendRequest({
                method: 'GET', 
                params: {}, 
                url: `/taskers/${id}`, 
                token: true
            });
            
            console.log('API Response:', response);
            
            if (response.success) {
                setTasker(response.data.data.tasker);
                setReviews(response.data.data.reviews || []);
                setCompletedTasks(response.data.data.completed_tasks || 0);
            } else {
                console.log('API Error:', response.message);
                showToast('Error loading tasker profile', 'error');
            }
        } catch (error) {
            console.log('Fetch Error:', error);
            showToast('Error loading tasker profile', 'error');
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

    if (!tasker) {
        return (
            <>
                <HeaderBar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Tasker no encontrado</h1>
                        <button
                            onClick={() => navigate('/search-tasks')}
                            className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                        >
                            Volver a buscar tareas
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tasker Profile Header */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            <img
                                src={tasker.profile_picture_url || '/src/assets/users/default-user-image.jpg'}
                                alt={tasker.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-amber-100"
                            />
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">{tasker.name}</h1>
                                <div className="flex items-center mt-2 space-x-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="ml-1 text-sm font-medium text-gray-900">
                                            {calculateAverageRating()} ({reviews.length} reseñas)
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        {completedTasks} tareas completadas
                                    </div>
                                </div>
                                {tasker.bio && (
                                    <p className="mt-3 text-gray-600">{tasker.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tasker Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
                            <div className="space-y-3">
                                {tasker.email && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {tasker.email}
                                    </div>
                                )}

                                {tasker.phone_number && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {tasker.phone_number}
                                    </div>
                                )}

                                {tasker.hourly_rate && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Tarifa por hora: {formatCurrency(tasker.hourly_rate)}
                                    </div>
                                )}

                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className={`${tasker.is_available ? 'text-green-600' : 'text-red-600'}`}>
                                        {tasker.is_available ? 'Disponible para trabajar' : 'No disponible actualmente'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Habilidades</h2>
                            {tasker.skills && tasker.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {tasker.skills.map(skill => (
                                        <span key={skill.id} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No se han especificado habilidades</p>
                            )}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    {reviews.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reseñas ({reviews.length})</h2>
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{review.client_name}</h4>
                                                <div className="flex items-center mt-1">
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
                                        {review.comment && (
                                            <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {reviews.length === 0 && (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reseñas aún</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Este tasker aún no ha recibido reseñas.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
};

export default TaskerProfile;
