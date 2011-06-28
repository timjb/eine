(function() {
  var Card, Player;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Player = App.Models.Player;
  Card = App.Models.Card;
  App.Models.Game = (function() {
    __extends(Game, Backbone.Model);
    function Game() {
      Game.__super__.constructor.apply(this, arguments);
    }
    Game.prototype.initialize = function() {
      this._players = [];
      this._clockwise = true;
      return this._open = null;
    };
    Game.prototype.createPlayer = function() {
      var player;
      player = new Player;
      this._players.push(player);
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
      this._current = 0;
      this._open = Card.random();
      return this.trigger('next', this.currentPlayer());
    };
    Game.prototype.currentPlayer = function() {
      return this._players[this._current] || null;
    };
    Game.prototype.putDown = function(card) {
      var currentOffset, isReverse, isSkip, n, _i, _len, _ref;
      if (!card.matches(this._open)) {
        throw new Error("invalid move");
      }
      this._open = card;
      isSkip = card.symbol === 'skip';
      isReverse = card.symbol === 'reverse';
      if (isReverse) {
        this._clockwise = !this._clockwise;
      }
      currentOffset = (this._clockwise ? 1 : -1) * (isSkip ? 2 : 1);
      this._current = (this._current + currentOffset + this._players.length) % this._players.length;
      _ref = [2, 4];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (card.symbol === ("+" + n)) {
          this._give(this.currentPlayer(), n);
        }
      }
      return this.trigger('next', this.currentPlayer());
    };
    return Game;
  })();
}).call(this);
