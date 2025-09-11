import React, { useState, useEffect } from 'react';
import { sendRequest } from '../utils/sendRequest';
import { ToastContainer, showToast } from '../utils/Toast';
import HeaderBar from '../Components/HeaderBar';
import Footer from '../Components/Footer';

const TaskSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [budgetFilter, setBudgetFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchTasks();
        fetchCategories();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [searchTerm, categoryFilter, budgetFilter, locationFilter, tasks]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await sendRequest({method: 'GET', params: {}, url: '/tasks', token: false});
            
            if (response.success) {
                setTasks(response.data);
            } else {
                showToast('Error loading tasks', 'error');
            }
        } catch (error) {
            showToast('Error loading tasks', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await sendRequest({method: 'GET', params: {}, url: '/categories', token: false});
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const filterTasks = () => {
        let filtered = tasks;

        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(task => task.category_id === parseInt(categoryFilter));
        }

        if (budgetFilter) {
            const budget = parseInt(budgetFilter);
            filtered = filtered.filter(task => task.budget && task.budget <= budget);
        }

        if (locationFilter) {
            filtered = filtered.filter(task =>
                task.address?.toLowerCase().includes(locationFilter.toLowerCase()) ||
                task.municipality?.toLowerCase().includes(locationFilter.toLowerCase()) ||
                task.department?.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        setFilteredTasks(filtered);
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

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Sin categoría';
    };

    return (
        <>
            <HeaderBar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Header */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Buscar Tareas</h1>
                        
                        {/* Main Search */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Buscar tareas por título o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                            <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Filters Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center text-amber-600 hover:text-amber-700 mb-4"
                        >
                            <span className="mr-2">Filtros avanzados</span>
                            <svg className={`w-4 h-4 transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    >
                                        <option value="">Todas las categorías</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto máximo</label>
                                    <input
                                        type="number"
                                        placeholder="COP"
                                        value={budgetFilter}
                                        onChange={(e) => setBudgetFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                                    <input
                                        type="text"
                                        placeholder="Ciudad o dirección"
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="text-sm text-gray-600">
                            {filteredTasks.length} tarea{filteredTasks.length !== 1 ? 's' : ''} encontrada{filteredTasks.length !== 1 ? 's' : ''}
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
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                                            <p className="text-gray-600 mb-4">{task.description}</p>
                                            
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0V9m0 12H5m0 0H3m2 0V9m0 12h2m-2 0v-6m2 6v-6m0 0V9m0 6h2m-2 0H7m2 0v6m0-6V9" />
                                                    </svg>
                                                    {getCategoryName(task.category_id)}
                                                </div>
                                                
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
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                                            <button className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
                                                Ver detalles
                                            </button>
                                            <button className="px-4 py-2 border border-amber-600 text-amber-600 rounded-md hover:bg-amber-50">
                                                Hacer oferta
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mt-4">
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron tareas</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Intenta ajustar tus filtros de búsqueda o crear una nueva tarea.
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

export default TaskSearch;
