//var cinemex = require('./Cinemex');
var express = require('express');
const cheerio = require('cheerio');
const request = require('request');
var app = express();
var router = express.Router();
router.route('/').get(function(peticion,respuesta){
  respuesta.json({ message: 'Hi, all the reports…!'});
});


router.route('/Cinemex').get(function(peticion,respuesta){
  url = 'https://cinemex.com/checkout/20979563/?ref=bb';
  request(url,function(peticion,response,html){
    var $ = cheerio.load(html);
    var titulo, cine, fecha, funcion, menores, adultos, mayores;
    var json = { titulo : "", cine : "", precio : {mayores: "", adultos: "", menores: ""}, fecha : "", funcion : ""};
    $('.movie-details-info').filter(function(){
      var data = $(this);
      titulo = data.children().eq(1).text();
      cine = data.children().eq(11).text();
      fecha = data.children().eq(7).text();
      funcion = data.children().eq(13).text();
      json.titulo = titulo;
      json.cine = cine
      json.fecha = fecha;
      json.funcion = funcion;
    })
    $('.qty-selection').filter(function(){
      var data = $(this);
      mayores = data.children().children().children().eq(8).text();
      adultos = data.children().children().children().eq(5).text();
      menores = data.children().children().children().eq(2).text();
      json.precio.mayores = mayores;
      json.precio.adultos = adultos;
      json.precio.menores = menores;
    })
    respuesta.json(json);
  });
});


router.route('/Cinepolis').get(function(peticion,respuesta){
  url = 'https://inetvis.cineticket.com.mx/compra/visSelectTickets.aspx?tkn=&cinemacode=333&txtSessionId=79954';
  request(url,function(error,response,html){
    var $ = cheerio.load(html);
    var titulo, cine, fecha, funcion, menores, adultos, mayores;
    var json = { titulo : "", cine : "", precio : {mayores: "", adultos: "", menores: ""}, fecha : "", funcion : ""};
    $('#visOrderTracker_txtMovieDetails').filter(function(){
      var data = $(this);
      titulo = data.text();
      json.titulo = titulo;
    })
    //Cine de la funcion
    $('#visOrderTracker_txtCinemaDetails').filter(function(){
      var data = $(this);
      cine = data.text();
      json.cine = cine;
    })
    //precio de la funcion de adultos mayores
    $('#rptAreaCategory__ctl0_rptTicketList__ctl1_TicketPrice0').filter(function(){
      var data = $(this);
      mayores = data.text();
      json.precio.mayores = mayores;
    })
    //precio de la funcion de adultos
    $('#rptAreaCategory__ctl0_rptTicketList__ctl2_TicketPrice1').filter(function(){
      var data = $(this);
      adultos = data.text();
      json.precio.adultos = adultos;
    })
    //precio de la funcion de lso menores
    $('#rptAreaCategory__ctl0_rptTicketList__ctl3_TicketPrice2').filter(function(){
      var data = $(this);
      menores = data.text();
      json.precio.menores = menores;
    })
    //fecha de la funcion
    $('#visOrderTracker_txtSessionDateDetails').filter(function(){
      var data = $(this);
      fecha = data.text();
      json.fecha = fecha;
    })
    //horario de la funcion
    $('#visOrderTracker_txtSessionTimeDetails').filter(function(){
      var data = $(this);
      funcion = data.text();
      json.funcion = funcion;
    })
    respuesta.json(json);
  });
});
module.exports = router;
