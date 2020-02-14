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

function moveCreate(move, kills, players, cb) {
  movedetail = {
    move: move,
    kills: kills
  }
  if (players != false) movedetail.player = players;
  
  var move = new Move(movedetail);
  
  move.save(function (err) {
    if (err) {
      db(err, null);
    }
    moves.push(move);
    cb(null, move);
  })
}

function playerCreate(name, won, cb) {
  playerdetail = { name: name, won: won }

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
      moveCreate('paper', 'rock', false, callback);
    },
    function (callback) {
      moveCreate('rock', 'scissors', false, callback);
    },
    function (callback) {
      moveCreate('scissors', 'paper', false, callback);
    },
    function (callback) {
      moveCreate('string', 'dog', [players[0],], callback);
    },
    function (callback) {
      moveCreate('dog', 'paper', [players[1],], callback);
    },
  ], cb)
}
function createPlayers(cb) {
  async.series([
    function (callback) {
      playerCreate('Francisco', 0, callback)
    },
    function (callback) {
      playerCreate('Pepe', 0, callback)
    },
    function (callback) {
      playerCreate('Maria', 0, callback)
    },
  ], cb)
}


async.series([
  createPlayers,
  createMoves,
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