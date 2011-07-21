(function() {
  var Hand;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Hand = App.Collections.Hand;
  App.Models.Player = (function() {
    __extends(Player, Backbone.Model);
    function Player() {
      Player.__super__.constructor.apply(this, arguments);
    }
    Player.prototype.initialize = function(attributes, options) {
      this.hand = new Hand;
      this.hand.bind('all', __bind(function() {
        return this.set({
          numberOfCards: this.hand.length
        });
      }, this));
      return this.bind('current', __bind(function() {
        return this.set({
          didDraw: false
        });
      }, this));
    };
    Player.prototype.receive = function(card) {
      this.hand.add(card);
      return this.trigger('receive');
    };
    Player.prototype.countCards = function() {
      return this.hand.length;
    };
    Player.prototype.playCard = function(card) {
      card = this.hand.getByCid(card) || this.hand.get(card);
      if (!card) {
        throw new Error("Player doesn't have this card");
      }
      return this.game.putDown(card);
    };
    Player.prototype.draw = function() {
      this.game.draw();
      return this.set({
        didDraw: true
      });
    };
    Player.prototype.next = function() {
      if (!this.get('didDraw')) {
        throw new Error("You must draw a card before.");
      }
      return this.game.next();
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
      if (chosenCard = chooseColor(chooseCard())) {
        this.playCard(chosenCard);
      } else {
        this.draw();
        if (chosenCard = chooseColor(chooseCard())) {
          this.playCard(chosenCard);
        } else {
          this.next();
        }
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
