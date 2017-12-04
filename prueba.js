const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
var fs = require('fs');
var app = express();
let urlBase = 'https://cinemex.com/partials/billboardPage?state_id=16&page=1&date=20171201';

function readPeliculas(){
//  return new Promise((resolve,reject)=>{
  /**  let arrayPromise = [];
    request(urlBase,function(error,response,html){
      if(!error){
        var $ = cheerio.load(html);
        var titulo, cine, complejo;
        $('.billboard-block').map(()=>{
          var json = {cine : "",complejo : "", peliculas : []};
          var data = $(this).find('.billboard-block-title');
          json.cine = "Cinemex";
          console.log(data['_root'][0]['children'][0]['children'])
          json.complejo = data[0]['children'][0].data;
          $(this).find('.billboard-li').map(()=>{
            var pelicula = { titulo : "", funcion : []};
            titulo = $(this).children().eq(2).text();
            pelicula.titulo = titulo;
            $(this).find('.avail-high').map(function(){
              var func ={hora :"", url :""}
              var hora = $(this).text();
              var url = $(this).attr('href');
              fun.hora = hora;
              fun.url = url;
              pelicula.funcion.push(fun);
            })
            json.peliculas.push(pelicula);
            console.log(json)
          })
        arrayPromise.push(json);
        })
      }
    })**/
    //resolve(arrayPromise);
  //})
            request(urlBase, function(error,request,html){
              if(!error){
                var $ = cheerio.load(html);
                var titulo, cine, fecha, funcion, tipo, precioLista, monto, complejo;

                $('.billboard-block').map(function(){
                  var json = {cine : "",complejo : "", peliculas : []};
                  var data = $(this).find('.billboard-block-title');


                  $(this).find('.billboard-li').each(function(){
                    var pelicula = { titulo : "", funcion : []};
                    titulo = $(this).children().eq(2).text();
                    $(this).find('.avail-high').each(function(){
                      var fun ={hora :"", url :""}
                      var f = $(this).text();
                      var u = $(this).attr('href');
                      fun.hora = f;
                      fun.url = u;
                      console.log(f);
                      console.log(u);
                      pelicula.funcion.push(fun);
                    })
                    pelicula.titulo = titulo;
                    json.peliculas.push(pelicula);
                    //console.log(titulo);
                  })

                  json.cine = "Cinemex";
                  json.complejo = data[0]['children'][0].data;
                  console.log(json)
                  console.log("------------------------------------------------------------------");
                });
              }
            })
/**
var data = $(this).find($('.billboard-block-title'));
var x =  $(this).filter('.mycinema-item-title');
console.log(data[0]['children'][0].data);
                $('.billboard-block').each(function(){
                  var data = $(this).each(function(){
                    var data2 = $(this).find($('.billboard-block-title'));
                    var data3 = $(this).find($('.mycinema-item-title')).each(()=>{
                      var z = $(this.find($('mycinema-item-title')));
                      var a = z[0]['children'][0].data;
                      console.log(a);
                    });
                    var x = data2[0]['children'][0].data;
                    var y = String(x);
                    var z = data3[0]['children'][0].data;
                    json.cine = "Cinemex";
                    json.complejo = y;
                    console.log(y);
                    console.log(z);
                  });


                })
            }

})***/
}
/**function writePeliculas(jsonEscribir){
  return new Promise(function(resolve,reject){
    console.log('Scraper corrio correctamente');
    console.log(jsonEscribir);
    fs.writeFile('CinemexJSONFINAL.json', JSON.stringify(jsonEscribir, null, 4), function(err){
      //res.json(jsonEscribir);
      resolve();
      })
  })
}**/
//app.get('/',function(req,res){
  readPeliculas()//.then(json => writePeliculas(json))
  //readPeliculas().then(json2 =>{console.log(json2);
  //writePeliculas(json2,res)})
//})
exports = module.exports = app;
