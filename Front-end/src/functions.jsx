import Swal from 'sweetalert2'
import storage from "./Storage/storage";
import axios from './axios'

export const show_alert = (msg, icon) => {
    Swal.fire({title: msg, icon:icon, buttonsStyling:true});
}

export const sendRequest = async(method, params, url, redir='', token=true) => {

    if(token){
        const authToken = storage.get('AuthToken');
        axios.defaults.headers.common['Authorization'] = 'Bearer '+authToken;
    }

    let res;
    await axios({method:method, url:url, data:params}).then(
        response => {
            res = response,
            (method != 'GET') ? show_alert(response.data.message, 'success'):'',
            setTimeout( () => 
                (redir !== '') ? window.location.href = redir : '', 2000)
        }).catch( (errors) => {
            let desc='';
            res = errors.response.data.errors;

            let objKeys = Object.keys(res);
            for(let i=0; i< objKeys.length; i++){
                let objKey = objKeys[i];
                desc += ' '+res[objKey];
            }
            //errors.response.data.errors.map( (e) => {desc = desc + ' '+e})
            show_alert(desc, 'error')
        })

    return res;
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