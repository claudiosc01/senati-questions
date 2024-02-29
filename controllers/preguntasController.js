const mongoose = require('mongoose');
const Pregunta = mongoose.model('Pregunta');

// const multer = require('multer')
// const shortid = require('shortid');


// Mostrar Formulario Para Crear una cuenta.
exports.formularioNuevaPregunta = (req,res) => {
    res.render('nueva-pregunta', {
        nombrePagina: 'Crear Nueva Pregunta',
        tagline: 'Llena el Formulario para publicar una Pregunta.'
    })
}

exports.validarPregunta = (req, res, next) => {

    //sanizar los campos
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('respuesta').escape();
    req.sanitizeBody('semestre').escape();

    //validar 
    req.checkBody('titulo', 'El titulo es obligatorio').notEmpty();
    req.checkBody('respuesta', 'La respuesta es obligatoria').notEmpty();
    req.checkBody('semestre', 'El semestre es obligatorio').notEmpty();


    const errores = req.validationErrors();

    if (errores) {
        // Recarga la vista con los errores
        req.flash('error', errores.map(error => error.msg));
        res.locals.errores = errores.map(error => error.msg);
        res.render('nueva-pregunta', {
            nombrePagina: 'Nueva Pregunta',
            tagline: 'Llena el Formulario y publica tu Pregunta.',
            cerrarSesion: true,
            nombre: req.user.nombre,
        });
        return;
    }
    next();
}


exports.agregarPregunta = async (req, res) => {


    const pregunta = new Pregunta(req.body)

    // usuario autor de la pregunta
    pregunta.autor = req.user._id;

    // almacenarlo en la base de datos
    await pregunta.save(); //guarda los cambios.
    res.redirect('/')
}




/* 

Lo que se hace aquí es dividir la entrada de búsqueda en palabras individuales 
y luego usarlas en la consulta de búsqueda de texto. Ten en cuenta que para 
buscar múltiples palabras independientes en MongoDB debemos poner cada palabra entre comillas dobles.

*/

exports.buscarPreguntas = async (req, res) => {
    let preguntas;
    
    if (req.body.q && req.body.q.trim() !== '') {
        // divide la consulta en palabras clave individuales
        const keywords = req.body.q.split(' ');

        // Crea una cadena de consulta formateada con todas las palabras clave
        const formattedSearch = keywords
            .map((keyword) => '\"' + keyword + '\"')
            .join(' ');

        preguntas = await Pregunta.find({
            $text: {
                $search: formattedSearch
            }
        });
    }

    else {
        preguntas = [];
    }

    res.render('home', {
        nombrePagina: `Resultados para la busqueda: ${req.body.q}`,
        barra: true,
        preguntas // no olvides enviar las preguntas a tu vista
    });
};