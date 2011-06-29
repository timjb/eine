(function() {
  var Card, Player, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  _ref = App.Models, Player = _ref.Player, Card = _ref.Card;
  App.Models.Game = (function() {
    __extends(Game, Backbone.Model);
    function Game() {
      Game.__super__.constructor.apply(this, arguments);
    }
    Game.prototype.initialize = function() {
      this.players = [];
      return this.bind('next', __bind(function() {
        return this._didDraw = false;
      }, this));
    };
    Game.prototype.createPlayer = function() {
      var player;
      player = new Player(this);
      this.players.push(player);
      this._give(player, App.Settings.startCount);
      return player;
    };
    Game.prototype._give = function(player, n) {
      var i, _results;
      _results = [];
      for (i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
        _results.push(player.receive(Card.random()));
      }
      return _results;
    };
    Game.prototype.start = function() {
      this.set({
        current: 0
      });
      this.set({
        clockwise: true
      });
      this.set({
        open: Card.random()
      });
      return this.trigger('next', this.currentPlayer());
    };
    Game.prototype.currentPlayer = function() {
      return this.players[this.get('current')] || null;
    };
    Game.prototype.eine = function() {
      return this.saidEine = true;
    };
    Game.prototype.putDown = function(card) {
      var currentOffset, isReverse, isSkip, n, _i, _len, _ref2, _ref3;
      if (((_ref2 = this.lastPlayer) != null ? _ref2.countCards() : void 0) === 1 && !this.saidEine) {
        this._give(this.lastPlayer, App.Settings.einePenalty);
      }
      if (!(card || this._didDraw)) {
        this._give(this.currentPlayer(), 1);
        this._didDraw = true;
        return;
      }
      if (card) {
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
        isSkip = card.get('symbol') === 'skip';
        isReverse = card.get('symbol') === 'reverse';
        if (isReverse) {
          this.set({
            clockwise: !this.get('clockwise')
          });
        }
      }
      if (this.currentPlayer().countCards() === 0) {
        return this.trigger('winner', this.currentPlayer());
      } else {
        this.lastPlayer = this.currentPlayer();
        this.saidEine = false;
        currentOffset = (this.get('clockwise') ? 1 : -1) * (isSkip ? 2 : 1);
        this.set({
          current: (this.get('current') + currentOffset + this.players.length) % this.players.length
        });
        if (card) {
          _ref3 = [2, 4];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            n = _ref3[_i];
            if (card.get('symbol') === ("+" + n)) {
              this._give(this.currentPlayer(), n);
            }
          }
        }
        return this.trigger('next', this.currentPlayer());
      }
    };
    return Game;
  })();
}).call(this);
