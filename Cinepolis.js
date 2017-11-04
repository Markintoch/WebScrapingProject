const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
var fs = require('fs');
var app = express();
var id = 80260;
let urlBase = 'https://inetvis.cineticket.com.mx/compra/visSelectTickets.aspx?tkn=&cinemacode=333&txtSessionId=';
function GeneraURL(){
  return new Promise((resolve,reject) =>{
    let arrayURLs = [];
    for(var i = id; i <= 80270; i++){
      arrayURLs.push(urlBase+''+i);
    }
    resolve(arrayURLs);
  })
}

function readPeliculas(){
  return new Promise(function(resolve,reject){
    GeneraURL()
      .then(respuestaURL =>{
        let arrayPromise = respuestaURL.map(elementoArray => {
          return new Promise((resolve,reject) => {
            request(elementoArray,(error,response,html) =>{
              if(!error){
                var $ = cheerio.load(html);
                var titulo, cine, fecha, funcion, menores, adultos, mayores, complejo, precioLista, monto;
                var json = { titulo : "", cine : "",complejo : "", precio : [], fecha : "", funcion : ""};
                var preciosMayores = { tipo : "", precioLista : "", monto : ""};
                var preciosAdultos = { tipo : "", precioLista : "", monto : ""};
                var preciosMenores = { tipo : "", precioLista : "", monto : ""};
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
                  json.cine = "Cinepolis ";
                    json.complejo = cine.split(json.cine).pop();
                })
                //precio de la funcion de adultos mayores
                $('#rptAreaCategory__ctl0_rptTicketList__ctl1_TicketPrice0').filter(function(){
                  var data = $(this);
                    mayores = data.text();
                    preciosMayores.tipo = "mayores";
                    preciosMayores.precioLista = mayores;
                    preciosMayores.monto = parseInt((mayores.substring(1, 3)));
                    json.precio.push(preciosMayores);
                })
                //precio de la funcion de adultos
                $('#rptAreaCategory__ctl0_rptTicketList__ctl2_TicketPrice1').filter(function(){
                  var data = $(this);
                  adultos = data.text();
                    preciosAdultos.tipo = "adultos";
                    preciosAdultos.precioLista = adultos;
                    preciosAdultos.monto = parseInt((adultos.substring(1, 3)));
                  json.precio.push(preciosAdultos);
                })
                //precio de la funcion de lso menores
                $('#rptAreaCategory__ctl0_rptTicketList__ctl3_TicketPrice2').filter(function(){
                  var data = $(this);
                  menores = data.text();
                    preciosMenores.tipo = "menores";
                    preciosMenores.precioLista = menores;
                    preciosMenores.monto = parseInt((menores.substring(1, 3)));
                    json.precio.push(preciosMenores);
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
                resolve(json);
              }
            })
          })
        })
        Promise.all(arrayPromise)
          .then(regresoPromise => {resolve(regresoPromise)})
      })
  })
}

function writePeliculas(jsonEscribir,res){
  return new Promise((resolve,reject)=>{
    console.log('Scraper corrio correctamente');
    console.log(jsonEscribir);
    fs.writeFile('CinepolisJSON.json', JSON.stringify(jsonEscribir, null, 4), function(err){
      res.json(jsonEscribir);
      resolve();
      })
  })
}

app.get('/',function(req,res){
  readPeliculas().then(json => writePeliculas(json,res))
})
exports = module.exports = app;
