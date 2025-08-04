 import { ToastContainer, toast } from 'react-toastify';

const showToast = (message, type = '') => {

    let options = {
        position: 'bottom-center',
        hideProgressBar: true
    }

    switch (type) {
        case 'info':
                toast.info(message, options);
            break;
        case 'success':
                toast.success(message, options);
            break;
        case 'warning':
                toast.warn(message, options);
            break;
        case 'error':
                toast.error(message, options);
            break;
        default:
            toast(message, options);
            break;
    }
 }

export { ToastContainer, showToast }
