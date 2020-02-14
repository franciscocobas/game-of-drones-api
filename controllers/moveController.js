var Move = require('../models/move');
var Player = require('../models/player');

const { check, body, validationResult, sanitizeBody } = require('express-validator');

var async = require('async')

exports.move_list = function (req, res) {
  Move.find({}, 'move kills player')
    .populate('players')
    .exec(function (err, move_list) {
      if (err) { return next(err); }
      res.json({ move_list: move_list })
    })
};

exports.move_detail = function (req, res, next) {
  async.parallel({
    move: function (callback) {
      Move.findById(req.params.id).exec(callback);
    }
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.move == null) {
      var err = new Error('Move not found');
      err.status = 404;
      return next(err)
    }
    res.json({ status: 'ok', move: results.move })
  })
};

exports.move_create_post = [
  (req, res, next) => {
    if (!(req.body.players instanceof Array)) {
      req.body.players = typeof req.body.players === 'undefined' ? [] : new Array(req.body.players);
    }
    next();
  },
  body('move').isLength({ min: 1 }).trim().escape(),
  body('kills').isLength({ min: 1 }).trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    let move = new Move({
      move: req.body.move,
      kills: req.body.kills,
      player: req.body.players
    })
    if (!errors.isEmpty()) {
      res.json({ result: 'error', errors: errors.array() })
    } else {
      Move.findOne({ 'move': req.body.move, 'kills': req.body.kills }).exec(function (err, found_move) {
        if (err) { return next(err); }
        if (found_move) {
          res.json({ result: 'error', errors: [{ msg: 'There were another Move with this combination. Choose another combination.' }] })
        } else {
          move.save(function (err) {
            if (err) { return next(err); }
            res.json({ result: 'ok', url: move.url })
          })
        }
      })
    }
  }
]

exports.move_delete_post = function (req, res) {
  async.parallel({
    move: function (callback) {
      Move.findById(req.params.id).exec(callback);
    }
  }, function (err, results) {

    if (err) { return next(err); }

    Move.findByIdAndDelete(req.body.id, function (err) {
      if (err) { return next(err); }
      res.json({ result: 'ok' })
    })
  })
};

exports.move_update_post = [
  (req, res, next) => {
    if (!(req.body.players instanceof Array)) {
      req.body.players = typeof req.body.players === 'undefined' ? [] : new Array(req.body.players);
    }
    next();
  },
  body('move').isLength({ min: 1 }).trim().escape(),
  body('kills').isLength({ min: 1 }).trim().escape(),
  (req, res, next) => {
    const errors = validationResult();

    let move = new Move({
      move: req.body.move,
      kills: req.body.kills,
      player: req.body.players,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {

      res.json({ result: 'error', errors: errors, move: move })
    } else {
      Move.findById(req.params.id, function (err, move_found) {
        if (err) { return next(err); }
        if (move_found == null) {
          var err = new Error('Move not found');
          err.status = 404;
          return next(err);
        }

        move.move = req.body.move ? req.body.move : player.move;
        move.kills = req.body.kills ? req.body.kills : player.kills;
        move.player = req.body.players ? req.body.players : player.players;

        Move.findByIdAndUpdate(req.params.id, move, {}, function (err, m) {

          if (err) { return next(err); }
          res.json({ result: 'ok', url: move.url })
        })
      })
    }
  }
]