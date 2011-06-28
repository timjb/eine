(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  App.Models.Player = (function() {
    __extends(Player, Backbone.Model);
    function Player() {
      Player.__super__.constructor.apply(this, arguments);
    }
    Player.prototype.initialize = function(game) {
      this.game = game;
      return this._cards = [];
    };
    return Player;
  })();
}).call(this);
