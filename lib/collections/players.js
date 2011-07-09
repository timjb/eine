(function() {
  var Player;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Player = App.Models.Player;
  App.Collections.Players = (function() {
    __extends(Players, Backbone.Collection);
    function Players() {
      Players.__super__.constructor.apply(this, arguments);
    }
    Players.prototype.model = Player;
    Players.prototype.initialize = function() {
      this.current = 0;
      return this.direction = 1;
    };
    Players.prototype.reverseDirection = function() {
      return this.direction *= -1;
    };
    Players.prototype.next = function() {
      var normalize;
      normalize = __bind(function(n) {
        return (n + this.length) % this.length;
      }, this);
      return this.current = normalize(this.current + this.direction);
    };
    Players.prototype.currentPlayer = function() {
      return this.at(this.current);
    };
    Players.prototype.nextPlayers = function(player) {
      var i, index, _ref, _ref2, _results;
      index = this.models.indexOf(player);
      if (index === -1) {
        throw "No such player.";
      }
      _results = [];
      for (i = _ref = index + 1, _ref2 = index + this.length - 1; _ref <= _ref2 ? i <= _ref2 : i >= _ref2; _ref <= _ref2 ? i++ : i--) {
        _results.push(this.at(i % this.length));
      }
      return _results;
    };
    return Players;
  })();
}).call(this);
