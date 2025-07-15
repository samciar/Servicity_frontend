import Swal from 'sweetalert2'
import storage from "./Storage/storage";
import axios from './axios'

export const show_alert = (msg, icon) => {
    Swal.fire({title: msg, icon:icon, buttonsStyling:true});
}

export const sendRequest = async(method, params, url, redir='', token=true) => {
    try {
        if(token){
            const authToken = storage.get('AuthToken');
            axios.defaults.headers.common['Authorization'] = 'Bearer '+authToken;
        }

        const response = await axios({method, url, data:params});
        
        // Handle successful response
        if (response?.data) {
            if (method !== 'GET' && response.data.message) {
                show_alert(response.data.message, 'success');
            }
            
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
            
            show_alert(errorMessage, 'error');
            
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
        
        show_alert(errorMessage, 'error');
        return {
            success: false,
            error: errorMessage
        };
    }
}

export const confirmation = async(name, url, redir) => {

    const alert = Swal.mixin({buttonsStyling:true});
    alert.fire({
        title: `Estás seguro de eliminar ${name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText:'<i class="fa-solid fa-check">Si, Borrar</i>',
        cancelButtonText: '<i class="fa-solid fa-ban">No, Cerrar</i>'
    }).then( (result ) => {
        if(result.isConfirmed){
            sendRequest('DELETE', {}, url, redir);
        }
    })

}

export default show_alert;
