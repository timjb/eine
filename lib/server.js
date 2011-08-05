(function() {
  var Card, Player, ServerGame, app, broadcastGames, createGame, express, games, getGame, io, mainDir, openGamesInfo, path, socketIO, _;
  path = require('path');
  express = require('express');
  socketIO = require('socket.io');
  _ = require('underscore');
  Card = require('./models/card').Card;
  Player = require('./models/player').Player;
  ServerGame = require('./models/server_game').ServerGame;
  mainDir = path.join(__dirname, '..');
  app = express.createServer();
  app.configure(function() {
    app.use(express.static("" + mainDir + "/public"));
    app.use(express.static("" + mainDir + "/lib"));
    return app.use(express.static(mainDir));
  });
  io = socketIO.listen(app);
  games = {};
  createGame = function() {
    var game, id;
    id = _.uniqueId('game');
    game = new ServerGame({
      id: id
    });
    games[id] = game;
    game.bind('garbage', function() {
      return delete games[id];
    });
    return game;
  };
  getGame = function(id) {
    return games[id];
  };
  openGamesInfo = function() {
    return _(games).filter(function(game) {
      return !game.isRunning();
    }).map(function(game) {
      return {
        id: game.get('id'),
        players: game.get('players').map(function(player) {
          return player.escape('name');
        })
      };
    });
  };
  broadcastGames = function() {
    return io.sockets.emit('open-games', openGamesInfo());
  };
  io.sockets.on('connection', function(socket) {
    var handleErrors, join, sendGame;
    socket.emit('open-games', openGamesInfo());
    join = function(game, name) {
      var id, player;
      if (!name) {
        throw new Error("You must choose a name.");
      }
      id = _.uniqueId('player');
      player = game.createPlayer({
        name: name,
        id: id
      }, {
        socket: socket
      });
      socket.emit('create', 'player', player);
      if (game.get('players').length === 4) {
        return game.start();
      }
    };
    sendGame = function(game) {
      return socket.emit('create', 'game', game);
    };
    handleErrors = function(fn) {
      try {
        return fn();
      } catch (exc) {
        console.log("Error: " + exc.message);
        return socket.emit('error', exc.message);
      }
    };
    socket.on('new-game', function(name) {
      return handleErrors(function() {
        var game;
        game = createGame();
        sendGame(game);
        join(game, name);
        return broadcastGames();
      });
    });
    return socket.on('join-game', function(name, id) {
      return handleErrors(function() {
        var game;
        game = getGame(id);
        if (!game) {
          throw new Error("There's no game with this id.");
        }
        if (game.isRunning()) {
          throw new Error("You can't join a running game.");
        }
        sendGame(game);
        join(game, name);
        return broadcastGames();
      });
    });
  });
  process.on('uncaughtException', function(error) {
    return console.log(error);
  });
  app.listen(8000);
  console.log("Server is running on port 8000.");
}).call(this);
