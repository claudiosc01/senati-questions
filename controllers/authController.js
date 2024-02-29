const passport = require('passport')
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');


// exports.autenticarUsuario = passport.authenticate('local',{ // va a autenticar.
//     successRedirect: '/preguntas/nueva',
//     failureRedirect: '/', // si la autentifacion no es correcta nos lleva aqui
//     failureFlash: true,
//     badRequestMessage: 'Ambos campos son Obligatorios'
// })


exports.autenticarUsuario = passport.authenticate('local',{ // va a autenticar.
    successRedirect: '/preguntas/nueva',
    failureRedirect: '/iniciar-sesion', // si la autentifacion no es correcta nos lleva aqui
    failureFlash: true,
    badRequestMessage: 'Ambos campos son Obligatorios'
})


// Revisar si el usuario esta autenticado o no.
exports.verificarUsuario = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}



exports.cerrarSesion = (req, res, next) => {
    req.logout(function(err){
        if(err) {
            return next(err);
        }
        req.flash('correcto', 'Cerraste Sesion Correctamente')
        return res.redirect('/iniciar-sesion')
    });
}
