const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
var fs = require('fs');
var app = express();
let json2 = [];
app.get('/',function(req, res){
  for(var i = 21070622; i<=21070629;i++){
  url = 'https://cinemex.com/checkout/'+i;
  request(url, function(error, response, html){
  if(!error){
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
    json2.push(json);
    fs.writeFile('CinemexJSON.json', JSON.stringify(json, null, 4), function(err){
      console.log('Scraper corrio correctamente');
      res.json(json2);
      })
    }
  })
}
});
exports = module.exports = app;
