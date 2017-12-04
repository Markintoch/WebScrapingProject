//libraries
const express = require('express');
var cinemex = require('./CinemexFunciones');
var cinepolis = require('./Cinepolis');
var rutas = require('./Rutas')
const puerto = 8888;
//init app
var app = express();
app.use('/Cinemex',cinemex);
app.use('/Cinepolis',cinepolis);
app.use('/api',rutas);
app.listen(puerto);
console.log('Servidor corriendo en el puerto: '+puerto);
