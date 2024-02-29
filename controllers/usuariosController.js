const mongoose = require('mongoose');
const multer = require('multer');
const Usuarios = mongoose.model('Usuarios');
const shortid = require('shortid');



exports.formIniciarSesion = async (req, res) => {
    
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesion',
    })
}


exports.formCrearCuenta =  (req, res) => {
    res.render('crear-cuenta',{
        nombrePagina: 'Crear Cuenta',
        tagline: 'Create una cuenta para poder crear preguntas.'
    })
}


exports.validarRegistro = (req, res, next) => {


        // sanitizar los campos
        req.sanitizeBody('nombre').escape();
        req.sanitizeBody('email').escape();
        req.sanitizeBody('password').escape();
        req.sanitizeBody('confirmar').escape();
    
    
        // Validacion los campos
        req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
        req.checkBody('email', 'El email debe ser valido').isEmail();
        req.checkBody('password', 'El password no puede ir vacio').notEmpty();
        req.checkBody('confirmar', 'Confirmar Password no puede ir vacio').notEmpty();
        req.checkBody('confirmar', 'Las contraseñas no coinciden').equals(req.body.password);

        const errores = req.validationErrors();

        // Si no hay errores
        if(errores){

            req.flash('error', errores.map(error => error.msg)); //se asigna los mensajes a flash error.

            res.render('crear-cuenta',{
            nombrePagina: 'Crea Tu Cuenta en DevJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta.',
            mensajes: req.flash() // lo que tiene como errores el flash asignara aqui.
        });

        return;

    }

    // Si toda la validacion es correcta.
    next();

}


exports.crearUsuario = async (req, res, next) => {
    
    // Crear el Usuario.
    const usuario = new Usuarios(req.body); // Para que inserte todo lo obtenido al usuario. y crea ese objeto.

    // Otra forma para la creacion de usuario.
    try {
        await usuario.save();
        res.redirect('/iniciar-sesion') // en caso de que se haya creado redirecciona a iniciar-sesion

    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta')
    }
}
