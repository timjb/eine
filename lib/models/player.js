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
          throw new Error("Player doesn't have this card");
        }
        return this.game.putDown(card);
      } else {
        return this.game.putDown(null);
      }
    };
    Player.prototype.playAI = function() {
      var chooseCard, chooseColor, chosenCard, hand, open;
      open = this.game.get('open');
      hand = this.hand;
      chooseCard = function() {
        var card, _i, _len, _ref;
        _ref = hand.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          card = _ref[_i];
          if (card.matches(open)) {
            return card;
          }
        }
        return null;
      };
      chooseColor = function(card) {
        if (card != null ? card.get('special') : void 0) {
          card.wish('green');
        }
        return card;
      };
      chosenCard = chooseColor(chooseCard());
      this.playCard(chosenCard);
      if (!chosenCard) {
        this.playCard(chooseColor(chooseCard()));
      }
      if (this.countCards() === 1) {
        return this.eine();
      }
    };
    Player.prototype.eine = function() {
      return this.game.eine();
    };
    return Player;
  })();
}).call(this);
