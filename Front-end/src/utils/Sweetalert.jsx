import Swal from 'sweetalert2'

export const showAlert = (msg, icon) => {
    Swal.fire({title: msg, icon:icon, buttonsStyling:true});
}

export const confirmationAlert = async(name, url, redir) => {

    const alert = Swal.mixin({buttonsStyling:true});
    alert.fire({
        title: `Estás seguro de eliminar ${name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText:'<i class="fa-solid fa-check">Si, Borrar</i>',
        cancelButtonText: '<i class="fa-solid fa-ban">No, Cerrar</i>'
    }).then( (result ) => {
        if(result.isConfirmed){
            // sendRequest('DELETE', {}, url, redir);
        }
    })
}

export default showAlert;