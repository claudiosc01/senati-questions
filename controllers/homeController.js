const mongoose = require('mongoose');
const Pregunta = mongoose.model('Pregunta');

exports.mostrarPreguntas = async (req, res, next) => {
    // obtener el número de la página actual desde la consulta o establecerlo en 1 si no esta presente
    const paginaActual = parseInt(req.query.pagina) || 1;

    // establecer el límite de documentos por página
    const limit = 3;

    // calcular el offset
    const offset = (paginaActual - 1) * limit;

    try {
        const [preguntas, total] = await Promise.all([
            // buscar preguntas con limit y offset
            Pregunta.find().skip(offset).limit(limit),

            // contar total de preguntas
            Pregunta.countDocuments()
        ]);

        // calcular el total de páginas
        const paginas = Math.ceil(total / limit);

        const paginaStart = Math.max(1, paginaActual - 2);
        const paginaEnd = Math.min(paginas, paginaActual + 2);
        const prevPage = paginaActual > 1 ? paginaActual - 1 : null;
        const nextPage = paginaActual < paginas ? paginaActual + 1 : null;

        res.render('home', {
            nombrePagina: 'Senati Question All',
            tagline: 'Encuentra todas las preguntas y respuestas de Senati',
            barra: true,
            preguntas,
            paginas,
            paginaActual,
            total,
            prevPage,
            nextPage,
            paginaStart,
            paginaEnd
        });
    } catch (error) {
        console.log(error);
        next();
    }
};