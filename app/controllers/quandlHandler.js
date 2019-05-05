'use strict';

var https = require('https');
if(!process.env.NODE_ENV === 'production') require('dotenv').load();

var request = require('request');
//var Users = require('../models/users.js');

var quandlUrl = 'https://www.quandl.com/api/v3/datasets/WIKI/';

function StockHandler () {
  this.getStockData = function(req, res) {
    var now = new Date();
    // hardcode dates. quandl data are not available anymore after 2018-03-27
    var month = '03'; //now.getMonth() + 1;
    var day = '04'; //now.getDate();
    var year = '2018'; //now.getFullYear();
    var url = quandlUrl
      + req.params.code
      + '.json'
      + '?column_index=4'
      + '&start_date=' + (year - 1) + '-' + month + '-' + day
      + '&end_date=' + year + '-' + month + '-' + day
      + '&collapse=weekly'
      + '&api_key=' + process.env.QUANDL_API_KEY;
    request(url, {json: true}, function(err, resp, data) {
      if (!err && resp.statusCode === 200) {
        res.json(data);
      } else {
        res.json(err);
      }
    });
  };

}

module.exports = StockHandler;
