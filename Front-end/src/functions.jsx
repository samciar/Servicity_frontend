import storage from "./Storage/storage";
import axios from './axios'

export const sendRequest = async(method, params, url, redir='', token=true) => {
    try {
        if(token){
            const authToken = storage.get('AuthToken');
            axios.defaults.headers.common['Authorization'] = 'Bearer '+authToken;
        }

        const response = await axios({method, url, data:params});
        
        // Handle successful response
        if (response?.data) {
            // if (method !== 'GET' && response.data.message) {
            // }
            
            if (redir) {
                setTimeout(() => window.location.href = redir, 2000);
            }
            
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        }

        return {
            success: false,
            error: 'Invalid response format',
            status: response.status
        };

    } catch (error) {
        let errorMessage = 'An error occurred';
        
        if (error.response) {
            // Server responded with error status
            const { data, status } = error.response;
            
            if (data?.errors) {
                // Handle multiple errors
                errorMessage = Object.values(data.errors).join(' ');
            } else if (data?.message) {
                // Handle single error message
                errorMessage = data.message;
            }
            
            return {
                success: false,
                error: errorMessage,
                status,
                data: data
            };
        } else if (error.request) {
            // Request was made but no response
            errorMessage = 'No response from server';
        } else {
            // Other errors
            errorMessage = error.message;
        }
        return {
            success: false,
            error: errorMessage
        };
    }
}
