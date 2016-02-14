
/**
* UNUSED
*/

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
  code: {type: String, required: true, unique: true}
});

module.exports = mongoose.model('Stock', Stock);
