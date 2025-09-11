import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { sendRequest } from '../utils/sendRequest';
import { ToastContainer, showToast } from '../utils/Toast';
import HeaderBar from '../Components/HeaderBar';
import Footer from '../Components/Footer';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e);
    },
  });
  return null;
}

// Component to handle map center changes
function MapCenterHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const CreateTask = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        skill_ids: [],
        budget_type: 'fixed',
        budget_amount: '',
        location: '',
        latitude: '',
        longitude: '',
        preferred_date: '',
        preferred_time: '',
        deadline_at: ''
    });
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categorySkills, setCategorySkills] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState([4.710989, -74.072092]); // Default to Bogotá
    const [isLocating, setIsLocating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInitialData();
        getCurrentLocation();
    }, []);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            showToast('La geolocalización no es compatible con este navegador', 'warning');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMapCenter([latitude, longitude]);
                setSelectedPosition([latitude, longitude]);
                setFormData(prev => ({
                    ...prev,
                    latitude: latitude.toString(),
                    longitude: longitude.toString()
                }));
                showToast('Ubicación actual detectada', 'success');
                setIsLocating(false);
            },
            (error) => {
                setIsLocating(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        showToast('Permiso de ubicación denegado. Usando ubicación por defecto.', 'warning');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        showToast('Información de ubicación no disponible. Usando ubicación por defecto.', 'warning');
                        break;
                    case error.TIMEOUT:
                        showToast('Tiempo de espera agotado para obtener la ubicación. Usando ubicación por defecto.', 'warning');
                        break;
                    default:
                        showToast('Error desconocido al obtener la ubicación. Usando ubicación por defecto.', 'error');
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    const fetchInitialData = async () => {
        try {
            const categoriesRes = await sendRequest({method: 'GET', params: {}, url: '/categories', token: false});
            if (categoriesRes.success) {
                // Sort categories alphabetically by name
                const sortedCategories = categoriesRes.data.sort((a, b) => 
                    a.name.localeCompare(b.name)
                );
                setCategories(sortedCategories);
            }
        } catch (error) {
            showToast('Error loading initial data', 'error');
        }
    };

    const fetchSkillsByCategory = async (categoryId) => {
        try {
            const response = await sendRequest({method: 'GET', params: {}, url: `/categories/${categoryId}/skills`, token: false});
            if (response.success) {
                setCategorySkills(response.data);
            }
        } catch (error) {
            showToast('Error loading skills', 'error');
        }
    };

    const fetchMunicipalities = async (departmentId) => {
        try {
            const response = await sendRequest({method: 'GET', params: {}, url: `/departments/${departmentId}/municipalities`, token: false});
            if (response.success) {
                setMunicipalities(response.data);
            }
        } catch (error) {
            showToast('Error loading municipalities', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'category_id' && value) {
            fetchSkillsByCategory(value);
        }

        if (name === 'budget_type' && value === 'hourly') {
            // Reset budget amount when switching to hourly
            setFormData(prev => ({
                ...prev,
                budget_amount: ''
            }));
        }
    };

    const handleSkillToggle = (skillId) => {
        setFormData(prev => ({
            ...prev,
            skill_ids: prev.skill_ids.includes(skillId)
                ? prev.skill_ids.filter(id => id !== skillId)
                : [...prev.skill_ids, skillId]
        }));
    };

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        setSelectedPosition([lat, lng]);
        setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
        }));
        showToast('Ubicación seleccionada en el mapa', 'success');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate latitude and longitude ranges
            const lat = parseFloat(formData.latitude);
            const lng = parseFloat(formData.longitude);
            
            if (isNaN(lat) || lat < -90 || lat > 90) {
                showToast('La latitud debe estar entre -90 y 90', 'error');
                setLoading(false);
                return;
            }
            
            if (isNaN(lng) || lng < -180 || lng > 180) {
                showToast('La longitud debe estar entre -180 y 180', 'error');
                setLoading(false);
                return;
            }

            // Prepare data for API
            const apiData = {
                ...formData,
                budget_amount: formData.budget_amount ? parseFloat(formData.budget_amount) : 0,
                latitude: lat,
                longitude: lng
            };

            const response = await sendRequest({method: 'POST', params: apiData, url: '/tasks', token: true});
            
            if (response.success) {
                showToast('Tarea creada exitosamente', 'success');
                setTimeout(() => navigate('/client-dashboard'), 2000);
            } else {
                showToast(response.error || 'Error creating task', 'error');
            }
        } catch (error) {
            showToast('Error creating task', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeaderBar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear Nueva Tarea</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Título de la tarea *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Ej: Necesito un jardinero para podar árboles"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción detallada *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Describe en detalle lo que necesitas que se haga..."
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría *
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Skills */}
                            {categorySkills.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Habilidades requeridas
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {categorySkills.map(skill => (
                                            <label key={skill.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.skill_ids.includes(skill.id)}
                                                    onChange={() => handleSkillToggle(skill.id)}
                                                    className="mr-2 text-amber-600 focus:ring-amber-500"
                                                />
                                                <span className="text-sm text-gray-700">{skill.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Budget Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Presupuesto *
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="budget_type"
                                            value="fixed"
                                            checked={formData.budget_type === 'fixed'}
                                            onChange={handleInputChange}
                                            className="mr-2 text-amber-600 focus:ring-amber-500"
                                            required
                                        />
                                        <span className="text-sm text-gray-700">Precio Fijo</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="budget_type"
                                            value="hourly"
                                            checked={formData.budget_type === 'hourly'}
                                            onChange={handleInputChange}
                                            className="mr-2 text-amber-600 focus:ring-amber-500"
                                        />
                                        <span className="text-sm text-gray-700">Por Hora</span>
                                    </label>
                                </div>
                            </div>

                            {/* Budget Amount */}
                            <div>
                                <label htmlFor="budget_amount" className="block text-sm font-medium text-gray-700 mb-2">
                                    {formData.budget_type === 'hourly' ? 'Tarifa por Hora (COP)' : 'Presupuesto (COP)'} *
                                </label>
                                <input
                                    type="number"
                                    id="budget_amount"
                                    name="budget_amount"
                                    value={formData.budget_amount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder={formData.budget_type === 'hourly' ? 'Ej: 25000' : 'Ej: 50000'}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                    Ubicación *
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Dirección completa donde se realizará el trabajo"
                                    required
                                />
                            </div>

                            {/* Map for location selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selecciona la ubicación en el mapa *
                                </label>
                                <div className="h-64 rounded-md overflow-hidden border border-gray-300 relative">
                                    {isLocating && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                                            <div className="text-white text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                                <p>Detectando ubicación...</p>
                                            </div>
                                        </div>
                                    )}
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <MapCenterHandler center={mapCenter} />
                                        <MapClickHandler onMapClick={handleMapClick} />
                                        {selectedPosition && (
                                            <Marker position={selectedPosition} />
                                        )}
                                    </MapContainer>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Haz clic en el mapa para seleccionar la ubicación exacta
                                </p>
                            </div>

                            {/* Coordinates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                                        Latitud *
                                    </label>
                                    <input
                                        type="number"
                                        id="latitude"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Ej: 4.710989"
                                        step="any"
                                        min="-90"
                                        max="90"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                                        Longitud *
                                    </label>
                                    <input
                                        type="number"
                                        id="longitude"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Ej: -74.072092"
                                        step="any"
                                        min="-180"
                                        max="180"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Preferred Date */}
                            <div>
                                <label htmlFor="preferred_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha Preferida *
                                </label>
                                <input
                                    type="date"
                                    id="preferred_date"
                                    name="preferred_date"
                                    value={formData.preferred_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            {/* Preferred Time */}
                            <div>
                                <label htmlFor="preferred_time" className="block text-sm font-medium text-gray-700 mb-2">
                                    Hora Preferida *
                                </label>
                                <input
                                    type="time"
                                    id="preferred_time"
                                    name="preferred_time"
                                    value={formData.preferred_time}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    required
                                />
                            </div>

                            {/* Deadline */}
                            <div>
                                <label htmlFor="deadline_at" className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha Límite (Opcional)
                                </label>
                                <input
                                    type="date"
                                    id="deadline_at"
                                    name="deadline_at"
                                    value={formData.deadline_at}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    min={formData.preferred_date || new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/home')}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
                                >
                                    {loading ? 'Creando...' : 'Crear Tarea'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
};

export default CreateTask;
