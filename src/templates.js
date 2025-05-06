export function templates() {
    // Manejar cambio de pestañas
    $(document).on('click', '.tab', function() {
        const tab = $(this).data('tab');
        
        $('.tab').removeClass('active');
        $(this).addClass('active');
        
        $('.auth-form').removeClass('active');
        $(`#${tab}-form`).addClass('active');
    });
    
    // Manejar envío de formularios
    $('#login-form, #register-form').on('submit', function(e) {
        e.preventDefault();
        console.log('Formulario enviado:', $(this).attr('id'));
        // Aquí iría la lógica de autenticación/registro
    });
}
