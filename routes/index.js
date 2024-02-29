const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const usuariosController = require("../controllers/usuariosController");
const preguntasController = require("../controllers/preguntasController");
const authController = require("../controllers/authController");

module.exports = () => {
  // Ruta Principal
  router.get("/", homeController.mostrarPreguntas);



  // Ruta Iniciar Sesion
  router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);



  // Ruta Crear Cuenta
  router.get("/crear-cuenta",
    authController.verificarUsuario,
    usuariosController.formCrearCuenta);
  router.post(
    "/crear-cuenta",
    authController.verificarUsuario,
    usuariosController.validarRegistro,
    usuariosController.crearUsuario
  );



  // Ruta Registrar Pregunta
  router.get(
    "/preguntas/nueva",
    authController.verificarUsuario, // NOT authController.autenticarUsuario
    preguntasController.formularioNuevaPregunta
  );
  router.post(
    "/preguntas/nueva",
    authController.verificarUsuario,
    preguntasController.validarPregunta,
    preguntasController.agregarPregunta
  );

    // Buscador de Vacantes
    router.post('/buscador', preguntasController.buscarPreguntas);

  return router;
};



// Ruta oAuth2
// router.get('/auth/google', (req, res) => {
//     res.send('Hiuu')
// })
