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
    var Backbone, Card, Hand, Player, Players, Settings, _;
    _ = require('underscore') || window._;
    Backbone = require('backbone') || window.Backbone;
    Settings = require('../settings') || App.Settings;
    Card = (require('./card') || App.Models).Card;
    Player = (require('./player') || App.Models).Player;
    Players = (require('../collections/players') || App.Collections).Players;
    Hand = (require('../collections/hand') || App.Collections).Hand;
    return exports.Game = (function() {
      __extends(Game, Backbone.Model);
      function Game() {
        Game.__super__.constructor.apply(this, arguments);
      }
      Game.prototype.defaults = function() {
        return {
          players: new Players,
          open: Card.randomNormal(),
          state: 'pre-start'
        };
      };
      Game.prototype.initialize = function() {
        this.bind('winner', function(winner) {
          return winner.trigger('winner');
        });
        return this.bind('change:current', __bind(function(m, player) {
          var previous, _ref;
          player.set({
            current: true
          });
          if ((_ref = this.get('previous')) != null) {
            _ref.set({
              saidEine: false
            });
          }
          if (previous = this.previous('current')) {
            previous.set({
              current: false
            });
            return this.set({
              previous: previous
            });
          }
        }, this));
      };
      Game.prototype.start = function() {
        this.set({
          current: this.get('players').currentPlayer()
        });
        return this.set({
          state: 'running'
        });
      };
      Game.prototype._newHand = function() {
        var i;
        return new Hand((function() {
          var _ref, _results;
          _results = [];
          for (i = 1, _ref = Settings.startCount; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
            _results.push(Card.random());
          }
          return _results;
        })());
      };
      Game.prototype.restart = function() {
        var players;
        this.get('players').each(__bind(function(player) {
          return player.set({
            hand: this._newHand()
          });
        }, this));
        players = this.get('players');
        players.next();
        this.set({
          current: players.currentPlayer()
        });
        this.unset('previous');
        this.set({
          state: 'running'
        });
        return this.set({
          open: Card.randomNormal()
        });
      };
      Game.prototype.isRunning = function() {
        return this.get('state') === 'running';
      };
      Game.prototype._createPlayer = function(Klass, attributes, options) {
        var player;
        attributes.hand || (attributes.hand = this._newHand());
        player = new Klass(attributes, options);
        player.game = this;
        this.get('players').add(player);
        this.trigger('add:player', player);
        return player;
      };
      Game.prototype.createPlayer = function(attributes, options) {
        return this._createPlayer(Player, attributes, options);
      };
      Game.prototype._give = function(player, n) {
        var i;
        return player.receiveCards((function() {
          var _results;
          _results = [];
          for (i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
            _results.push(Card.random());
          }
          return _results;
        })());
      };
      Game.prototype._checkIfLastPlayerSaidEine = function() {
        var previous;
        if (previous = this.get('previous')) {
          if (previous.get('numberOfCards') <= 1 && !previous.get('saidEine')) {
            return this._give(previous, Settings.einePenalty);
          }
        }
      };
      Game.prototype.playCard = function(card) {
        var current, n, newCurrent, players, _i, _len, _ref;
        this._checkIfLastPlayerSaidEine();
        players = this.get('players');
        current = this.get('current');
        this.set({
          open: card
        });
        if (current.get('numberOfCards') === 0) {
          current.set({
            current: false
          });
          this.trigger('winner', current);
          this.set({
            state: 'ended'
          });
          return;
        }
        if (card.get('symbol') === 'reverse') {
          players.reverseDirection();
        }
        if (card.get('symbol') === 'skip') {
          players.next();
        }
        players.next();
        newCurrent = players.currentPlayer();
        _ref = [2, 4];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          if (card.get('symbol') === ("+" + n)) {
            this._give(newCurrent, n);
          }
        }
        if (current === newCurrent) {
          console.log("foo");
          current.set({
            current: false
          });
          this.set({
            previous: current
          });
          return current.set({
            current: true
          });
        } else {
          return this.set({
            current: newCurrent
          });
        }
      };
      Game.prototype.draw = function() {
        this._checkIfLastPlayerSaidEine();
        return this._give(this.get('current'), 1);
      };
      Game.prototype.next = function() {
        this._checkIfLastPlayerSaidEine();
        this.get('players').next();
        return this.set({
          current: this.get('players').currentPlayer()
        });
      };
      return Game;
    })();
  })(exports || App.Models);
}).call(this);
