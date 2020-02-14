var Player = require('../models/player');
var Move = require('../models/move');

var async = require('async')

exports.index = function (req, res) {
  async.parallel({
    player_count: function (callback) {
      Player.countDocuments({}, callback)
    },
    move_count: function (callback) {
      Move.countDocuments({}, callback)
    }
  }, function (err, results) {
    res.render('index', { title: 'Game of Drones API', data: results, error: err })
  })
};

exports.player_list = function (req, res) {
  res.send('NOT Implemented');
};

exports.player_detail = function (req, res) {
  res.send('NOT Implemented: Player detail: ' + req.params.id);
};

exports.player_create_post = function (req, res) {
  res.send('NOT Implemented: Player create post');
};

exports.player_delete = function (req, res) {
  res.send('NOT Implemented: Player delete');
};

exports.player_update_post = function (req, res) {
  res.send('NOT Implemented: Player update');
};