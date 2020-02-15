var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MoveSchema = new Schema({
  move: { type: String, required: true, max: 100 },
  kills: { type: String, required: true, max: 100 },
  player: [{ type: Schema.Types.ObjectId, ref: 'Move' }]
});

MoveSchema.virtual('url').get(function () {
  return '/api/move/' + this._id;
});

module.exports = mongoose.model('Move', MoveSchema)