(function() {
  var Game, ServerPlayer, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  _ = require('underscore');
  Game = require('./game').Game;
  ServerPlayer = require('./server_player').ServerPlayer;
  exports.ServerGame = (function() {
    __extends(ServerGame, Game);
    function ServerGame() {
      ServerGame.__super__.constructor.apply(this, arguments);
    }
    ServerGame.prototype.initialize = function() {
      ServerGame.__super__.initialize.call(this);
      _.bindAll(this, '_close', '_resetCloseTimeout');
      this._resetCloseTimeout();
      this.bind('change', this._resetCloseTimeout);
      this.bind('add:player', __bind(function(newPlayer) {
        return this.get('players').each(__bind(function(player) {
          if (player !== newPlayer) {
            return player.socket.emit('trigger', this.id, 'add:player', newPlayer);
          }
        }, this));
      }, this));
      this.bind('change:state', __bind(function(m, state) {
        return this._emitToAll('trigger', this.id, 'change:state', null, state);
      }, this));
      this.bind('change:current', __bind(function(m, current) {
        return this._emitToAll('trigger', this.id, 'change:current', null, current.id);
      }, this));
      this.bind('change:open', __bind(function(m, open) {
        return this._emitToAll('trigger', this.id, 'change:open', null, open);
      }, this));
      return this.bind('winner', __bind(function(w) {
        return this._emitToAll('trigger', this.id, 'winner', w.id);
      }, this));
    };
    ServerGame.prototype._close = function() {
      var player, _i, _len, _ref;
      this._emitToAll('msg', "The game was closed because it was inactive for too long.");
      _ref = this.get('players').models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        player.unbind('disconnect');
        player.socket.disconnect();
      }
      return this.trigger('garbage');
    };
    ServerGame.prototype._resetCloseTimeout = function() {
      clearTimeout(this.closeTimeout);
      return this.closeTimeout = setTimeout(this._close, 1 * 60 * 1000);
    };
    ServerGame.prototype._emitToAll = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.get('players').each(function(player) {
        var _ref;
        return (_ref = player.socket).emit.apply(_ref, args);
      });
    };
    ServerGame.prototype._emitToAllExcept = function() {
      var args, excludedPlayer;
      excludedPlayer = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.get('players').each(function(player) {
        var _ref;
        if (player !== excludedPlayer) {
          return (_ref = player.socket).emit.apply(_ref, args);
        }
      });
    };
    ServerGame.prototype._allPlayersDisconnected = function() {
      var player, _i, _len, _ref;
      _ref = this.get('players').models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (!player.disconnected) {
          return false;
        }
      }
      return true;
    };
    ServerGame.prototype.createPlayer = function(attributes, options) {
      var player;
      player = this._createPlayer(ServerPlayer, attributes, options);
      player.bind('disconnect', __bind(function() {
        if (this._allPlayersDisconnected()) {
          return this._close();
        }
      }, this));
      return player;
    };
    return ServerGame;
  })();
}).call(this);
