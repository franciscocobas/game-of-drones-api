var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
  name: { type: String, require: true, max: 100 },
  won: { type: Number, require: true, min: 0 }
});

PlayerSchema.virtual('url').get(function () {
  return '/api/player/' + this._id;
});

module.exports = mongoose.model('Player', PlayerSchema);