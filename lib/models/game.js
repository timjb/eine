(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  (function(exports) {
    var Backbone, Card, Player, Players, Settings;
    Backbone = require('backbone') || window.Backbone;
    Settings = require('../settings') || App.Settings;
    Card = (require('./card') || App.Models).Card;
    Player = (require('./player') || App.Models).Player;
    Players = (require('../collections/players') || App.Collections).Players;
    return exports.Game = (function() {
      __extends(Game, Backbone.Model);
      function Game() {
        Game.__super__.constructor.apply(this, arguments);
      }
      Game.prototype.initialize = function() {
        this.players = new Players;
        this.bind('next', __bind(function() {
          var _ref;
          if ((_ref = this.lastPlayer) != null) {
            _ref.trigger('not:current');
          }
          return this.currentPlayer().trigger('current');
        }, this));
        return this.set({
          open: Card.randomNormal()
        });
      };
      Game.prototype.start = function() {
        this._saidEine = false;
        return this.trigger('next', this.currentPlayer());
      };
      Game.prototype.createPlayer = function(attributes) {
        var player;
        player = new Player(attributes);
        player.game = this;
        this._give(player, Settings.startCount);
        this.players.add(player);
        return player;
      };
      Game.prototype.currentPlayer = function() {
        return this.players.currentPlayer();
      };
      Game.prototype._give = function(player, n) {
        var i, _results;
        _results = [];
        for (i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
          _results.push(player.receive(Card.random()));
        }
        return _results;
      };
      Game.prototype.eine = function() {
        return this._saidEine = true;
      };
      Game.prototype._checkIfLastPlayerSaidEine = function() {
        var _ref;
        if (((_ref = this.lastPlayer) != null ? _ref.countCards() : void 0) === 1 && !this._saidEine) {
          null;
          this._give(this.lastPlayer, Settings.einePenalty);
        }
        return this._saidEine = false;
      };
      Game.prototype.putDown = function(card) {
        var n, _i, _len, _ref;
        this._checkIfLastPlayerSaidEine();
        if (!card.matches(this.get('open'))) {
          throw new Error("invalid move");
        }
        if (card.get('color') === Card.specialColor) {
          throw new Error("no color chosen");
        }
        this.currentPlayer().hand.remove(card);
        this.set({
          open: card
        });
        if (this.currentPlayer().countCards() === 0) {
          this.trigger('winner', this.currentPlayer());
          return;
        }
        this.lastPlayer = this.currentPlayer();
        if (card.get('symbol') === 'reverse') {
          this.players.reverseDirection();
        }
        if (card.get('symbol') === 'skip') {
          this.players.next();
        }
        this.players.next();
        _ref = [2, 4];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          if (card.get('symbol') === ("+" + n)) {
            this._give(this.currentPlayer(), n);
          }
        }
        return this.trigger('next', this.currentPlayer());
      };
      Game.prototype.draw = function() {
        this._checkIfLastPlayerSaidEine();
        return this._give(this.currentPlayer(), 1);
      };
      Game.prototype.next = function() {
        this._checkIfLastPlayerSaidEine();
        this.lastPlayer = this.currentPlayer();
        this.players.next();
        return this.trigger('next', this.currentPlayer());
      };
      return Game;
    })();
  })(exports || App.Models);
}).call(this);
