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
      return this._clockwise = true;
    };
    Game.prototype.createPlayer = function() {
      var i, player, _ref;
      player = new Player;
      this._players.push(player);
      for (i = 1, _ref = App.Settings.startCount; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        player.receive(Card.random());
      }
      return player;
    };
    Game.prototype.start = function() {
      this._current = 0;
      return this.trigger('next', this.currentPlayer());
    };
    Game.prototype.currentPlayer = function() {
      return this._players[this._current] || null;
    };
    Game.prototype.putDown = function(card) {
      var currentOffset, isReverse, isSkip;
      isSkip = card.symbol === 'skip';
      isReverse = card.symbol === 'reverse';
      if (isReverse) {
        this._clockwise = !this._clockwise;
      }
      currentOffset = (this._clockwise ? 1 : -1) * (isSkip ? 2 : 1);
      this._current = ((this._current + currentOffset) + this._players.length) % this._players.length;
      return this.trigger('next', this.currentPlayer());
    };
    return Game;
  })();
}).call(this);
