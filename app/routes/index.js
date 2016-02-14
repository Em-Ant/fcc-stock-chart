'use strict';

var path = process.cwd();
var fs = require('fs');

var StockHandler = require('../controllers/quandlHandler.js');

var allowedCodes = JSON.parse(fs.readFileSync( path + '/app/routes/codes.json', 'utf-8'));

module.exports = function (app) {

var stockHandler = new StockHandler();

var codes = ['FB', 'AAPL'];

	app.route('/api/test')
		.get(function (req, res) {
      //console.log(req);
      res.json({path: req.url});
		});

  app.route('/api/codes')
    .get(function(req, res){
      res.json({codes: codes});
    })

  app.route('/api/codes/:code')
    .post(function(req, res) {
      var c = req.params.code.toUpperCase();
      if(allowedCodes.codes.indexOf(c) !== -1) {
        if (codes.indexOf(c) === -1) {
          codes.push(c);
          res.json({newCode: c});
        } else {
          res.json({error: 'already added'});
        }
      } else {
        res.json({error: 'unknown code'});
      }
    })
    .delete(function(req, res){
      var c = req.params.code.toUpperCase();
      var i = codes.indexOf(c);
      if (i !== -1) {
        codes.splice(i,1);
        res.json({removed: c});
      } else {
        res.json({error: 'code not found'});
      }
    })

  app.route('/api/stock/:code')
    .get(stockHandler.getStockData);

  app.route('/*')
		.get(function (req, res) {
			res.sendFile(path + '/client/public/index.html');
	});
};
