import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { sendRequest } from '../utils/sendRequest';
import { ToastContainer, showToast } from '../utils/Toast';
import servicityLogo from '../assets/servicity_logo.png';
import storage from '../Storage/storage';

const Profile = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        latitude: '',
        longitude: '',
        profile_picture_url: '',
        bio: '',
        hourly_rate: '',
        department: null,
        municipality: null,
        is_available: false,
        skill_ids: []
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
        // Get user role from storage
        const authUser = storage.get('authUser');
        if (authUser && authUser.user_type) {
            setUserRole(authUser.user_type);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await sendRequest({method: 'GET', params: {}, url: '/user', token: true});
            
            if (response.success) {
                setUserData({
                    name: response.data.name || '',
                    email: response.data.email || '',
                    phone_number: response.data.phone_number || '',
                    address: response.data.address || '',
                    latitude: response.data.latitude || '',
                    longitude: response.data.longitude || '',
                    profile_picture_url: response.data.profile_picture_url || '',
                    bio: response.data.bio || '',
                    hourly_rate: response.data.hourly_rate || '',
                    department: response.data.department || null,
                    municipality: response.data.municipality || null,
                    is_available: response.data.is_available || false,
                    skill_ids: response.data.skill_ids || []
                });
            } else {
                showToast('Error loading profile', 'error');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            showToast('Error loading profile data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await sendRequest({
                method: 'PUT',
                params: {
                    bio: userData.bio,
                    hourly_rate: userData.hourly_rate,
                    is_available: userData.is_available
                },
                url: '/user/profile',
                token: true
            });

            if (response.success) {
                showToast('Profile updated successfully', 'success');
                setEditing(false);
            } else {
                showToast(response.error || 'Error updating profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Error updating profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size should be less than 5MB', 'error');
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('profile_picture', file);

            const response = await sendRequest({
                method: 'POST',
                params: formData,
                url: '/user/profile/picture',
                token: true
            });
            
            if (response.success) {
                setUserData(prev => ({
                    ...prev,
                    profile_picture_url: response.data.profile_picture_url
                }));
                showToast('Profile picture updated successfully', 'success');
            } else {
                showToast(response.error || 'Error uploading image', 'error');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('Error uploading image', 'error');
        } finally {
            setUploading(false);
        }
    };

    const getCoordinatesLink = () => {
        if (userData.latitude && userData.longitude) {
            return `https://www.google.com/maps?q=${userData.latitude},${userData.longitude}`;
        }
        return '#';
    };

    // Tasker-specific form fields
    const renderTaskerForm = () => (
        <>
            {/* Bio */}
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Biografía
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={userData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Cuéntanos sobre ti y tus habilidades..."
                />
            </div>

            {/* Hourly Rate */}
            <div>
                <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-2">
                    Tarifa por hora (COP)
                </label>
                <input
                    type="number"
                    id="hourly_rate"
                    name="hourly_rate"
                    value={userData.hourly_rate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Ej: 25000"
                    min="0"
                />
            </div>

            {/* Availability Switch */}
            <div className="flex items-center">
                <label htmlFor="is_available" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            id="is_available"
                            name="is_available"
                            checked={userData.is_available}
                            onChange={handleInputChange}
                            className="sr-only"
                        />
                        <div className={`block w-14 h-7 rounded-full ${userData.is_available ? 'bg-amber-600' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${userData.is_available ? 'transform translate-x-7' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium">
                        Disponible para trabajar
                    </div>
                </label>
            </div>
        </>
    );

    // Client-specific form fields
    const renderClientForm = () => (
        <>
            {/* Bio */}
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Sobre mí
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={userData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Cuéntanos sobre ti..."
                />
            </div>
        </>
    );

    // Admin-specific form fields
    const renderAdminForm = () => (
        <>
            {/* Bio */}
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Información del administrador
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={userData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Información adicional del administrador..."
                />
            </div>
        </>
    );

    // Tasker-specific display fields
    const renderTaskerDisplay = () => (
        <>
            {/* Bio */}
            <div>
                <h3 className="text-sm font-medium text-gray-500">Biografía</h3>
                <p className="mt-1 text-gray-900">
                    {userData.bio || 'No hay biografía disponible'}
                </p>
            </div>

            {/* Hourly Rate */}
            <div>
                <h3 className="text-sm font-medium text-gray-500">Tarifa por hora</h3>
                <p className="mt-1 text-gray-900">
                    {userData.hourly_rate ? 
                        userData.hourly_rate.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : 
                        'No especificada'
                    }
                </p>
            </div>

            {/* Availability */}
            <div>
                <h3 className="text-sm font-medium text-gray-500">Disponibilidad</h3>
                <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userData.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {userData.is_available ? 'Disponible' : 'No disponible'}
                    </span>
                </p>
            </div>
        </>
    );

    // Client-specific display fields
    const renderClientDisplay = () => (
        <>
            {/* Bio */}
            <div>
                <h3 className="text-sm font-medium text-gray-500">Sobre mí</h3>
                <p className="mt-1 text-gray-900">
                    {userData.bio || 'No hay información disponible'}
                </p>
            </div>
        </>
    );

    // Admin-specific display fields
    const renderAdminDisplay = () => (
        <>
            {/* Bio */}
            <div>
                <h3 className="text-sm font-medium text-gray-500">Información del administrador</h3>
                <p className="mt-1 text-gray-900">
                    {userData.bio || 'No hay información adicional'}
                </p>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={servicityLogo} alt="Servicity Logo" className="h-8 w-auto" />
                        <h1 className="ml-3 text-2xl font-bold text-gray-900">Mi Perfil</h1>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/home')}
                            className="px-4 py-2 cursor-pointer text-amber-600 rounded-md hover:text-amber-700"
                        >
                            Inicio
                        </button>
                        {userRole === 'tasker' && (
                            <button
                                onClick={() => navigate('/tasker-dashboard')}
                                className="px-4 py-2 cursor-pointer bg-amber-600 text-white rounded-md hover:bg-amber-700"
                            >
                                Dashboard
                            </button>
                        )}
                        {userRole === 'client' && (
                            <button
                                onClick={() => navigate('/client-dashboard')}
                                className="px-4 py-2 cursor-pointer bg-amber-600 text-white rounded-md hover:bg-amber-700"
                            >
                                Dashboard
                            </button>
                        )}
                        {userRole === 'admin' && (
                            <button
                                onClick={() => navigate('/admin-dashboard')}
                                className="px-4 py-2 cursor-pointer bg-amber-600 text-white rounded-md hover:bg-amber-700"
                            >
                                Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <svg className="animate-spin h-12 w-12 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6">
                                {/* Profile Picture */}
                                <div className="text-center mb-6">
                                    <div className="relative inline-block">
                                        <img
                                            src={userData.profile_picture_url || '/src/assets/users/default-user-image.jpg'}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-amber-100"
                                        />
                                        <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-amber-600 text-white p-2 rounded-full cursor-pointer hover:bg-amber-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <input
                                                id="profile-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                    {uploading && (
                                        <div className="mt-2 text-sm text-amber-600">
                                            Subiendo imagen...
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                                        <p className="text-amber-600">{userData.email}</p>
                                    </div>

                                    {userData.phone_number && (
                                        <div>
                                            <p className="text-sm text-gray-500">Teléfono</p>
                                            <p className="text-gray-900">{userData.phone_number}</p>
                                        </div>
                                    )}

                                    {userData.address && (
                                        <div>
                                            <p className="text-sm text-gray-500">Dirección</p>
                                            <p className="text-gray-900">{userData.address}</p>
                                        </div>
                                    )}

                                    {userData.latitude && userData.longitude && (
                                        <div>
                                            <p className="text-sm text-gray-500">Coordenadas</p>
                                            <a
                                                href={getCoordinatesLink()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-amber-600 hover:text-amber-700 text-sm"
                                            >
                                                Ver en mapa
                                            </a>
                                        </div>
                                    )}

                                    {userData.department && (
                                        <div>
                                            <p className="text-sm text-gray-500">Departamento</p>
                                            <p className="text-gray-900">{userData.department.name || 'No especificado'}</p>
                                        </div>
                                    )}

                                    {userData.municipality && (
                                        <div>
                                            <p className="text-sm text-gray-500">Municipio</p>
                                            <p className="text-gray-900">{userData.municipality.name || 'No especificado'}</p>
                                        </div>
                                    )}

                                    {userData.skill_ids && userData.skill_ids.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500">Habilidades</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {userData.skill_ids.map((skill, index) => (
                                                    <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Información del Perfil</h2>
                                    {!editing ? (
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                                        >
                                            Editar
                                        </button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditing(false)}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleProfileUpdate}
                                                disabled={loading}
                                                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
                                            >
                                                {loading ? 'Guardando...' : 'Guardar'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {editing ? (
                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        {userRole === 'tasker' && renderTaskerForm()}
                                        {userRole === 'client' && renderClientForm()}
                                        {userRole === 'admin' && renderAdminForm()}
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        {userRole === 'tasker' && renderTaskerDisplay()}
                                        {userRole === 'client' && renderClientDisplay()}
                                        {userRole === 'admin' && renderAdminDisplay()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <ToastContainer />
        </div>
    );
};

export default Profile;
