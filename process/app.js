'use strict';

var Q           = require('q');
var scraperjs   = require('scraperjs');


/**
 * getLabel - passes in the config object from the client.
 * This function MUST exist and MUST return a string.
 */
exports.getLabel = function(property, settings){

    // this is the object saved from your the /input portion of the slab.
    var searchTerm  = 'news';
    var siteUrl     = 'http://news.bbc.co.uk';

    if(settings && settings.searchTerm && settings.siteUrl){
        searchTerm  = settings.searchTerm;
        siteUrl     = settings.siteUrl;
    }

    if(property == 'mentions'){
        return searchTerm + ' on '+ siteUrl;
    }

    return 'bad property name';

};


/**
 * getData - passes in the config object from the client.
 * This function MUST exist and MUST return a promise.
 */
exports.getData = function(settings) {

  var deferred = Q.defer();

  var url = settings.siteUrl;
  var selector = settings.cssSelector;

  scraperjs.StaticScraper.create(url)
    .scrape(function($) {
      return $(selector).map(function() {
        return $(this).text();
      }).get();
    }, function(items) {

      // create an array of objects
      var data = [];
      items.map(function(item){
        data.push( {
          scrape:item
        });
      });

      // create a schema for the data
      var dataSchema = {
        scrape:{
          title : 'Scraped Content',
          type : 'text'
        }
      };

      // Return data in this format
      var returnObj = {
        dataSchema : dataSchema,
        data : data
      };

      deferred.resolve(returnObj);
    });

  return deferred.promise;

};
