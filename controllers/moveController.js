var Move = require('../models/move');

exports.move_list = function (req, res) {
  Move.find({}, 'move kills players')
    .populate('players')
    .exec(function (err, move_list) {
      if (err) { return next(err); }
      res.json({ move_list: move_list })
    })
};

exports.move_detail = function (req, res) {
  res.send('NOT Implemented: Move detail: ' + req.params.id);
};

exports.move_create_post = function (req, res) {
  res.send('NOT Implemented: Move create post');
};

exports.move_delete_post = function (req, res) {
  res.send('NOT Implemented: Move delete');
};

exports.move_update_post = function (req, res) {
  res.send('NOT Implemented: Move update');
};