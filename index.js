const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
var fs = require('fs');
var app = express();

app.get('/',function(req, res){
  url = 'https://inetvis.cineticket.com.mx/compra/visSelectTickets.aspx?tkn=&cinemacode=333&txtSessionId=79638';

  request(url, function(error, response, html){


  if(!error){
    // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
    var $ = cheerio.load(html);
    // Finally, we'll define the variables we're going to capture
    var titulo, cine, fecha, funcion, menores, adultos, mayores;
    var json = { titulo : "", cine : "", precio : {mayores: "", adultos: "", menores: ""}, fecha : "", funcion : ""};
    //Titulo
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
    fs.writeFile('cines.json', JSON.stringify(json, null, 4), function(err){
      console.log('Scraper corrio correctamente');
      })
    }
  })
});
app.listen('8888');
console.log("Servidor corriendo");
exports = module.exports = app;
