const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
var fs = require('fs');
var app = express();
let urlBase = 'https://cinemex.com/checkout/';
var id = 21090015;
function GeneraURL(){
  return new Promise((resolve,reject) =>{
    let arrayURLs = [];
    for(var i = id; i <= 21090023; i++){
      arrayURLs.push(urlBase+''+i);
    }
    resolve(arrayURLs);
  })
}

function readPeliculas(){
  return new Promise(function(resolve,reject){
    GeneraURL()
      .then(respuestaURL =>{
        let arrayPromise = respuestaURL.map(elementoArray =>{
          return new Promise((resolve,reject) => {
            request(elementoArray,function(error,response,html){
              if(!error){
                var $ = cheerio.load(html);
                var titulo, cine, fecha, funcion, tipo, precioLista, monto, complejo;
                var json = { titulo : "", cine : "",complejo : "", precio : [], fecha : "", funcion : ""};
                var preciosMayores = { tipo : "", precioLista : "", monto : ""};
                var preciosAdultos = { tipo : "", precioLista : "", monto : ""};
                var preciosMenores = { tipo : "", precioLista : "", monto : ""};
                $('.movie-details-info').filter(function(){
                  var data = $(this);
                  titulo = data.children().eq(1).text();
                  cine = data.children().eq(11).text();
                  fecha = data.children().eq(7).text();
                  funcion = data.children().eq(13).text();
                  json.titulo = titulo;
                  json.cine = "Cinemex ";
                  json.complejo = cine.split(json.cine).pop();
                  json.fecha = fecha;
                  json.funcion = funcion;
                })
                $('.qty-selection').filter(function(){
                  var data = $(this);
                  mayores = data.children().children().children().eq(8).text();
                  adultos = data.children().children().children().eq(5).text();
                  menores = data.children().children().children().eq(11).text();
                  preciosMayores.tipo = "mayores";
                  preciosMayores.precioLista = mayores;
                  preciosMayores.monto = parseInt(mayores.substring(1, 3));
                  json.precio.push(preciosMayores);

                  preciosAdultos.tipo = "adultos";
                  preciosAdultos.precioLista = adultos;
                    preciosAdultos.monto = parseInt(adultos.substring(1, 3));
                  json.precio.push(preciosAdultos);

                  preciosMenores.tipo = "menores";
                  preciosMenores.precioLista = menores;
                    preciosMenores.monto = parseInt(menores.substring(1, 3));
                  json.precio.push(preciosMenores);
                })
                console.log(elementoArray);
                resolve(json);
              }
            })
          })
        })
        Promise.all(arrayPromise)
          .then(regresoPromise => {resolve(regresoPromise)})
      })
}
)}

function writePeliculas(jsonEscribir,res){
  return new Promise(function(resolve,reject){
    console.log('Scraper corrio correctamente');
    console.log(jsonEscribir);
    fs.writeFile('CinemexJSON.json', JSON.stringify(jsonEscribir, null, 4), function(err){
      res.json(jsonEscribir);
      resolve();
      })
  })
}
app.get('/',function(req,res){
  readPeliculas().then(json => writePeliculas(json,res))
  //readPeliculas().then(json2 =>{console.log(json2);
  //writePeliculas(json2,res)})
})
exports = module.exports = app;
