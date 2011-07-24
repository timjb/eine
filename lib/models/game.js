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
        this.set({
          open: Card.randomNormal()
        });
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
        return this.set({
          current: this.players.currentPlayer()
        });
      };
      Game.prototype.createPlayer = function(attributes) {
        var player;
        player = new Player(attributes);
        player.game = this;
        this._give(player, Settings.startCount);
        this.players.add(player);
        return player;
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
          if (previous.get('numberOfCards') === 1 && !previous.get('saidEine')) {
            return this._give(previous, Settings.einePenalty);
          }
        }
      };
      Game.prototype.putDown = function(card) {
        var current, n, newCurrent, _i, _len, _ref;
        this._checkIfLastPlayerSaidEine();
        if (!card.matches(this.get('open'))) {
          throw new Error("invalid move");
        }
        if (card.get('color') === Card.specialColor) {
          throw new Error("no color chosen");
        }
        current = this.get('current');
        current.hand.remove(card);
        this.set({
          open: card
        });
        if (current.get('numberOfCards') === 0) {
          this.trigger('winner', current);
          return;
        }
        if (card.get('symbol') === 'reverse') {
          this.players.reverseDirection();
        }
        if (card.get('symbol') === 'skip') {
          this.players.next();
        }
        this.players.next();
        newCurrent = this.players.currentPlayer();
        _ref = [2, 4];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          if (card.get('symbol') === ("+" + n)) {
            this._give(newCurrent, n);
          }
        }
        return this.set({
          current: newCurrent
        });
      };
      Game.prototype.draw = function() {
        this._checkIfLastPlayerSaidEine();
        return this._give(this.get('current'), 1);
      };
      Game.prototype.next = function() {
        this._checkIfLastPlayerSaidEine();
        this.players.next();
        return this.set({
          current: this.players.currentPlayer()
        });
      };
      return Game;
    })();
  })(exports || App.Models);
}).call(this);
