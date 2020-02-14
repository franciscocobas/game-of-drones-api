#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Player = require('./models/player')
var Move = require('./models/move')


var mongoose = require('mongoose');
var mongoDB = process.env.DATABASE_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var players = []
var moves = []

function moveCreate(move, kills, cb) {
  movedetail = {
    move: move,
    kills: kills
  }
  // if (players != false) movedetail.players = players;
  
  var move = new Move(movedetail);
  
  move.save(function (err) {
    if (err) {
      db(err, null);
    }
    console.log('New Move: ' + move);
    moves.push(move);
    cb(null, move);
  })
}

function playerCreate(name, won, move, cb) {
  playerdetail = { name: name, won: won }
  if (move != false) playerdetail.move = move;

  var player = new Player(playerdetail);

  player.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Player: ' + player);
    players.push(player)
    cb(null, player)
  });
}

function createMoves(cb) {
  async.parallel([
    function (callback) {
      moveCreate('paper', 'rock', callback);
    },
    function (callback) {
      moveCreate('rock', 'scissors', callback);
    },
    function (callback) {
      moveCreate('scissors', 'paper', callback);
    },
    function (callback) {
      moveCreate('string', 'dog', callback);
    },
    function (callback) {
      moveCreate('dog', 'paper', callback);
    },
  ], cb)
}
function createPlayers(cb) {
  async.series([
    function (callback) {
      playerCreate('Francisco', 0, [moves[0], moves[0],], callback)
    },
    function (callback) {
      playerCreate('Pepe', 0, false, callback)
    },
    function (callback) {
      playerCreate('Maria', 0, false, callback)
    },
  ], cb)
}


async.series([
  createPlayers,
  createMoves
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    else {
      console.log('Moves: ' + moves);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });