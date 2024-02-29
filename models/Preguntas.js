const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug'); 
const shortid = require('shortid');

const preguntasSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: 'El titulo de la pregunta es obligatorio',
        trim: true 
    },
    respuesta: {
        type: String,
        trim: true
    },

    
    semestre: {
        type: String,
        trim: true      
    },

    autor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuarios',
        required: 'El autor es obligatorio'
    }
})



preguntasSchema.pre('save', function(next){

    // Crear la Url.
    const titulo = slug(this.titulo) // Si la url es React Developer el slug quita el espacio y pone: React-developer
    this.slug = `${titulo}-${shortid.generate()} `

    next();
})




// Crear un indice:
preguntasSchema.index({ titulo: 'text' })


module.exports = mongoose.model('Pregunta', preguntasSchema)