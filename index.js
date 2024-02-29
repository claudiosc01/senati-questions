const mongoose = require('mongoose')
require('./config/db');
const exphbs = require('express-handlebars');
const express = require('express')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const router = require('./routes');
const passport = require('./config/passport')
const createError = require('http-errors')

const handlebarsHelpers = require('handlebars-helpers')(['comparison', 'math']);
const customHelpers = require('./helpers/handlebars');

require('dotenv').config({
    path: 'variables.env'
})

const app = express()

// Habilitar bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Validacion de Campos - express-validator
app.use(expressValidator());

// Habilitar handlebars como view.
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'layout',
    helpers: require('./helpers/handlebars'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));


const helpers = { ...handlebarsHelpers, ...customHelpers };
const hbs = exphbs.create({
    // Opciones de configuración de Handlebars...
    helpers: helpers,
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
  });
  
  app.engine('handlebars', hbs.engine);


// Configuracion
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(cookieParser())

// Configuración de sesiones
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
         mongoUrl: process.env.DATABASE
    })
}));



// Inicializar Passport
app.use(passport.initialize())
app.use(passport.session())



// Alertas y Flash messages
app.use(flash());

// Crear middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
})


app.use('/', router())

// Manejo de errores
app.use((err, req, res, next) => {
    res.locals.mensaje = err.message;
    res.render('error')
})


// 404 pagina no existente
app.use((req,res,next) => {
    next(createError(404, 'No Encontrado'));
    
})

// Middleware para errores
app.use((err, req, res, next) => {
    // console.error(err.stack); // Registra detalles del error en la consola
  
    // Envia página de error personalizada
    res.status(err.status || 500);
    res.render('error', {
      mensaje: err.message,
      error: err.status,
      stack: err.stack
    });
  });



// Dejar que heroku asigne el puerto a nuestra app.
const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando.');
})
