var express = require('express');
var router = express.Router();

var move_controller = require('../controllers/moveController');
var player_controller = require('../controllers/playerController');

/// PLAYER ROUTES ///
router.get('/', player_controller.index);
router.get('/players', player_controller.player_list);
router.get('/player/:id', player_controller.player_detail);
router.post('/player/create', player_controller.player_create_post);
router.post('/player/:id/delete', player_controller.player_delete);
router.post('/player/:id/update', player_controller.player_update_post);

/// MOVE ROUTES ///
router.get('/moves', move_controller.move_list);
router.get('/move/:id', move_controller.move_detail);
router.post('/move/create', move_controller.move_create_post)
router.post('/move/:id/delete', move_controller.move_delete_post);
router.post('/move/:id/update', move_controller.move_update_post);

module.exports = router;