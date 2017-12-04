const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const un = require('underscore');
var fs = require('fs');
var app = express();
let urlBase = 'https://cinemex.com/partials/billboardPage?state_id=16&page=1&date=';
var id = 20171201;
function GeneraURL(){
  return new Promise((resolve,reject) =>{
    let arrayURLs = [];
    for(var i = id; i <= 20171201; i++){
      arrayURLs.push(urlBase+''+i);
    }
    //let urlBase = 'https://cinemex.com/partials/billboardPage?state_id=16&page=1&date=20171201';
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
                let array = [];
                var titulo, cine, fecha, funcion, tipo, precioLista, monto, complejo;
                  $('.billboard-block').map(function(){
                    var json = {cine : "",complejo : "", peliculas : []};
                    var data = $(this).find('.billboard-block-title');
                    json.cine = "Cinemex";
                    json.complejo = data[0]['children'][0].data;
                    $(this).find('.billboard-li').each(function(){
                      var pelicula = { titulo : "", funcion : []};
                      titulo = $(this).children().eq(2).text();
                      $(this).find('.avail-high').each(function(){
                        var fun ={hora :"", url :""}
                        var f = $(this).text();
                        var u = $(this).attr('href');
                        fun.hora = f;
                        fun.url = u;
                        //console.log(f);
                        //console.log(u);
                        pelicula.funcion.push(fun);
                      })
                      pelicula.titulo = titulo;
                      json.peliculas.push(pelicula);

                      //console.log(titulo);
                    })
                    array.push(json);
                  })
              /**  var $ = cheerio.load(html);
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
                })**/
                console.log(elementoArray);
                resolve(array);
              }
            })
          })
        })
        Promise.all(arrayPromise)
          .then(regresoPromise => {resolve(regresoPromise)})
      })
}
)}

function writePeliculas(jsonEscribir,res,name){
  return new Promise(function(resolve,reject){
    console.log('Scraper corrio correctamente');
    //console.log(jsonEscribir);
    fs.writeFile(name, JSON.stringify(jsonEscribir, null, 4), function(err){
      res.json(jsonEscribir);
      resolve();
      })
  })
}


function getUniquesInArrayByKey(array, key) {
  return un.uniq(array, (obj) => obj[key]);
}

app.get('/',function(req,res){
  readPeliculas().then(json => {
    var nombrePeliculas = 'CinemexJSONFINAL.json'
    var jsonTitulos = {titulosUnicos:[]};
    var peliculas = [];
    json = [].concat(...json);
    writePeliculas(json,res);
    json.map(complejo => peliculas.push(complejo.peliculas))
    peliculas = [].concat(...peliculas);
    const peliculasUnicas = getUniquesInArrayByKey(peliculas,'titulo');
    peliculasUnicas.map(pelicula =>{
      console.log(pelicula.titulo);
      jsonTitulos.titulosUnicos.push(pelicula.titulo);
    })
    var jsonT = 'TituloPeliculas.json'
    writePeliculas(jsonTitulos,res,jsonT);
    //console.log(peliculasUnicas.titulo);
    //getUniquesInArrayByKey(json,key);
  //__________________________________________________________________________________
    /**const peliculasRaw = json[0]
    var arrPeliculas = []

    peliculasRaw.map(complejo => { arrPeliculas.push(complejo.peliculas) })
    arrPeliculas = [].concat(...arrPeliculas)
    console.log(arrPeliculas)
    const uniqueTitlesMovies = getUniquesInArrayByKey(arrPeliculas, 'titulo')
    console.log(uniqueTitlesMovies.length)
    console.log(uniqueTitlesMovies)**/
    //----------------------------------------------------------------------------------
    // writePeliculas(json,res);
    // ABTransformation.uniques(json,res)
  })
  //readPeliculas().then(json2 =>{console.log(json2);
  //writePeliculas(json2,res)})
})
exports = module.exports = app;
