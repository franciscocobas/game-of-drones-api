var Player = require('../models/player');
var Move = require('../models/move');

const { check, body, validationResult } = require('express-validator');

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
  Player.find({})
    .exec(function (err, player_list) {
      if (err) { return next(err); }
      res.json({ player_list: player_list })
    })
};

exports.player_detail = function (req, res) {
  async.parallel({
    player: function (callback) {
      Player.findById(req.params.id)
        .populate('move')
        .exec(callback)
    },
    player_moves: function(callback) {
      Move.find({'player': req.params.id}).exec(callback)
    }
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.player == null) {
      var err = new Error('Player not found');
      err.status = 404;
      return next(err);
    }
    res.json({ player: results.player, player_moves: results.player_moves })
  })
};

exports.player_create_post = [
  (req, res, next) => {
    if (req.body.won !== undefined) {
      let won = parseInt(req.body.won);
      req.body.won = isNaN(won) ? undefined : won;
    }
    next();
  },
  check('name', 'Name must not be empty').isLength({ min: 1 }).escape().trim(),
  check('won').isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req);

    let player = new Player({
      name: req.body.name,
      won: req.body.won,
      move: req.body.move
    })

    if (!errors.isEmpty()) {
      async.parallel({
        moves: function (callback) {
          Move.find(callback);
        }
      }, function (err, results) {
        if (err) { return next(err); }

        for (let i = 0; i < results.moves.lenght; i++) {
          if (player.move.indexOf(results.moves[i]._id) > -1) {
            results.moves[i].checked = 'true';
          }
        }
        res.json({ result: 'error', error: errors, moves: results.moves, player: player })
      })
    } else {
      player.save(function (err) {
        if (err) { return next(err); }
        res.json({ result: 'ok', url: player.url })
      })
    }
  }
]

exports.player_delete = function (req, res, next) {
  async.parallel({
    player: function (callback) {
      Player.findById(req.params.id).populate('genre').exec(callback);
    }
  }, function (err, results) {
    if (err) { return next(err); }
    Player.findByIdAndRemove(req.params.id, function deletePlayer(err) {
      if (err) { return next(err); }
      res.json({ result: 'ok' })
    })
  })
};

exports.player_update_post = [
  (req, res, next) => {
    if (!(req.body.move instanceof Array)) {
      req.body.move = typeof req.body.move === 'undefined' ? [] : new Array(req.body.move)
    }
    if (req.body.won !== undefined) {
      let won = parseInt(req.body.won);
      req.body.won = isNaN(won) ? undefined : won;
    }
    next();
  },
  body('name').isLength({ min: 1 }).escape().trim(),
  body('won').escape(),
  body('move.*').escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    let player = new Player({
      name: req.body.name,
      won: req.body.won,
      move: (typeof req.body.move === 'undefined') ? [] : req.body.move,
      _id: req.params.id
    })

    if (!errors.isEmpty()) {
      async.parallel({
        moves: function (callback) {
          Move.find(callback)
        }
      }, function (err, results) {
        if (err) { return next(err); }

        res.json({ result: 'error', errors: errors, moves: results.moves, player: player })
      })
    } else {
      Player.findById(req.params.id, function(err, player) {
        if (err) { return next(err); }
        if (player == null) {
          var err = new Error('Player not found');
          err.status = 404;
          return next(err);
        }

        player.name = req.body.name ? req.body.name : player.name;
        player.won = req.body.won ? req.body.won : player.won;
        player.move = req.body.move ? req.body.move : player.move;

        Player.findByIdAndUpdate(req.params.id, player, {}, function (err, p) {
          if (err) { return next(err); }
          res.json({ result: 'ok', url: player.url })
        })
      })

    }
  }
]
