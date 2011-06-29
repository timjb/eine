(function() {
  var Hand;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Hand = App.Collections.Hand;
  App.Models.Player = (function() {
    __extends(Player, Backbone.Model);
    function Player() {
      Player.__super__.constructor.apply(this, arguments);
    }
    Player.prototype.initialize = function(game) {
      this.game = game;
      return this.hand = new Hand;
    };
    Player.prototype.receive = function(card) {
      return this.hand.add(card);
    };
    Player.prototype.countCards = function() {
      return this.hand.length;
    };
    Player.prototype.playCard = function(card) {
      if (card) {
        card = this.hand.getByCid(card) || this.hand.get(card);
        if (!card) {
          throw "Player doesn't have this card";
        }
      }
      this.game.putDown(card);
      if (card) {
        return this.hand.remove(card);
      }
    };
    return Player;
  })();
}).call(this);
