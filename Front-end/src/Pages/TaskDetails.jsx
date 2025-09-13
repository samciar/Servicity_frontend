import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { sendRequest } from '../utils/sendRequest';
import { ToastContainer, showToast } from '../utils/Toast';
import HeaderBar from '../Components/HeaderBar';
import Footer from '../Components/Footer';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidLoading, setBidLoading] = useState(false);
    const [showBidForm, setShowBidForm] = useState(false);
    const [bidAmount, setBidAmount] = useState('');
    const [bidMessage, setBidMessage] = useState('');

    useEffect(() => {
        fetchTaskDetails();
    }, [id]);

    const fetchTaskDetails = async () => {
        try {
            const response = await sendRequest({method: 'GET', params: {}, url: `/tasks/${id}`, token: true});
            
            if (response.success) {
                setTask(response.data);
                // Bids are already included in the task response
                setBids(response.data.bids || []);
            } else {
                showToast('Error loading task details', 'error');
            }
        } catch (error) {
            showToast('Error loading task details', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitBid = async (e) => {
        e.preventDefault();
        setBidLoading(true);

        try {
            const response = await sendRequest({
                method: 'POST',
                params: {
                    task_id: id,
                    bid_amount: parseFloat(bidAmount),
                    message: bidMessage
                },
                url: '/bids',
                token: true
            });

            if (response.success) {
                showToast('Oferta enviada exitosamente', 'success');
                setShowBidForm(false);
                setBidAmount('');
                setBidMessage('');
                // Refresh the task details to get the updated bids
                fetchTaskDetails();
            } else {
                showToast(response.error || 'Error submitting bid', 'error');
            }
        } catch (error) {
            showToast('Error submitting bid', 'error');
        } finally {
            setBidLoading(false);
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

    if (!task) {
        return (
            <>
                <HeaderBar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Tarea no encontrada</h1>
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
                    {/* Task Details */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
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
                                    {task.is_urgent && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Urgente
                                        </span>
                                    )}
                                </div>
                            </div>
                            {task.budget && (
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-amber-600">
                                        {formatCurrency(task.budget)}
                                    </div>
                                    <div className="text-sm text-gray-600">Presupuesto</div>
                                </div>
                            )}
                        </div>

                        <div className="prose prose-sm max-w-none mb-6">
                            <p className="text-gray-700">{task.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Task Details */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-900">Detalles de la tarea</h3>
                                
                                {task.category && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0V9m0 12H5m0 0H3m2 0V9m0 12h2m-2 0v-6m2 6v-6m0 0V9m0 6h2m-2 0H7m2 0v6m0-6V9" />
                                        </svg>
                                        {task.category.name}
                                    </div>
                                )}

                                {task.deadline && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Fecha límite: {formatDate(task.deadline)}
                                    </div>
                                )}

                                {task.address && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {task.address}
                                    </div>
                                )}

                                {task.department && task.municipality && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {task.municipality.name}, {task.department.name}
                                    </div>
                                )}
                            </div>

                            {/* Client Info */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-900">Información del cliente</h3>
                                
                                {task.client && (
                                    <>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {task.client.name}
                                        </div>

                                        {task.client.phone_number && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {task.client.phone_number}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        {task.skills && task.skills.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Habilidades requeridas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {task.skills.map(skill => (
                                        <span key={skill.id} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bid Button */}
                        {task.status === 'pending' && (
                            <button
                                onClick={() => setShowBidForm(!showBidForm)}
                                className="w-full md:w-auto px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                            >
                                {showBidForm ? 'Cancelar oferta' : 'Hacer oferta'}
                            </button>
                        )}
                    </div>

                    {/* Bid Form */}
                    {showBidForm && (
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Realizar oferta</h2>
                            <form onSubmit={handleSubmitBid} className="space-y-4">
                                <div>
                                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                        Monto de la oferta (COP)
                                    </label>
                                    <input
                                        type="number"
                                        id="bidAmount"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Ej: 45000"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bidMessage" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mensaje para el cliente
                                    </label>
                                    <textarea
                                        id="bidMessage"
                                        rows="4"
                                        value={bidMessage}
                                        onChange={(e) => setBidMessage(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Explica por qué eres la mejor opción para esta tarea..."
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowBidForm(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={bidLoading}
                                        className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
                                    >
                                        {bidLoading ? 'Enviando...' : 'Enviar oferta'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Bids List */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Ofertas ({bids.length})
                        </h2>
                        
                        {bids.length > 0 ? (
                            <div className="space-y-4">
                                {bids.map(bid => (
                                    <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center">
                                                {bid.tasker?.profile_picture_url && (
                                                    <img
                                                        src={bid.tasker.profile_picture_url}
                                                        alt={bid.tasker.name}
                                                        className="w-8 h-8 rounded-full mr-3"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{bid.tasker?.name}</h4>
                                                    <p className="text-sm text-gray-600">{formatCurrency(bid.bid_amount)}</p>
                                                    {bid.tasker?.bio && (
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{bid.tasker.bio}</p>
                                                    )}
                                                    <a
                                                        href={`/tasker/${bid.tasker_id}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            navigate(`/tasker/${bid.tasker_id}`);
                                                        }}
                                                        className="text-xs text-amber-600 hover:text-amber-700 mt-1 inline-block"
                                                    >
                                                        Ver perfil completo →
                                                    </a>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                bid.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {bid.status === 'pending' ? 'Pendiente' :
                                                 bid.status === 'accepted' ? 'Aceptada' :
                                                 bid.status === 'rejected' ? 'Rechazada' :
                                                 bid.status === 'withdrawn' ? 'Retirada' :
                                                 'Desconocido'}
                                            </span>
                                        </div>
                                        
                                        {bid.message && (
                                            <p className="text-sm text-gray-600 mt-2">{bid.message}</p>
                                        )}
                                        
                                        <div className="flex items-center text-xs text-gray-500 mt-2">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formatDate(bid.created_at)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ofertas aún</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Sé el primero en hacer una oferta para esta tarea.
                                </p>
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

export default TaskDetails;
