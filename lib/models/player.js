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
    var Backbone, Card, Hand;
    Backbone = require('backbone') || window.Backbone;
    Card = (require('./card') || App.Models).Card;
    Hand = (require('../collections/hand') || App.Collections).Hand;
    return exports.Player = (function() {
      __extends(Player, Backbone.Model);
      function Player() {
        Player.__super__.constructor.apply(this, arguments);
      }
      Player.prototype.initialize = function() {
        this.hand = new Hand;
        this.hand.bind('all', __bind(function() {
          return this.set({
            numberOfCards: this.hand.length
          });
        }, this));
        return this.bind('change:current', __bind(function(m, isCurrent) {
          if (isCurrent) {
            return this.set({
              didDraw: false,
              saidEine: false
            });
          }
        }, this));
      };
      Player.prototype.receiveCards = function(cards) {
        this.hand.add(cards);
        return this.trigger('receive');
      };
      Player.prototype.countCards = function() {
        return this.hand.length;
      };
      Player.prototype._checkIfCurrent = function() {
        if (!this.get('current')) {
          throw new Error("It's not your turn.");
        }
      };
      Player.prototype.playCard = function(card) {
        this._checkIfCurrent();
        card = this.hand.getByCid(card) || this.hand.get(card);
        if (!card) {
          throw new Error("Player doesn't have this card");
        }
        return this.game.putDown(card);
      };
      Player.prototype.draw = function() {
        this._checkIfCurrent();
        this.game.draw();
        return this.set({
          didDraw: true
        });
      };
      Player.prototype.next = function() {
        this._checkIfCurrent();
        if (!this.get('didDraw')) {
          throw new Error("You must draw a card before.");
        }
        return this.game.next();
      };
      Player.prototype.playAI = function() {
        var chooseCard, chooseColor, chosenCard, hand, open, rand, randomElem;
        open = this.game.get('open');
        hand = this.hand;
        rand = function(n) {
          return Math.floor(Math.random() * n);
        };
        randomElem = function(arr) {
          return arr[rand(arr.length)];
        };
        chooseCard = function() {
          var possible;
          possible = hand.filter(function(card) {
            return card.matches(open);
          });
          if (possible.length) {
            return randomElem(possible);
          }
          return null;
        };
        chooseColor = function(card) {
          var color, max, wishColor, _i, _len, _ref;
          if (!(card != null ? card.get('special') : void 0)) {
            return card;
          }
          wishColor = 'green';
          max = 0;
          _ref = Card.colors;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            color = _ref[_i];
            if (_.filter(hand.models, function(card) {
              return card.get('color') === color;
            }).length > max) {
              wishColor = color;
            }
          }
          card.wish(wishColor);
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
        if (this.countCards() === 1 && Math.random() < 0.9) {
          return this.eine();
        }
      };
      Player.prototype.eine = function() {
        this.set({
          saidEine: true
        });
        return console.log("eine");
      };
      return Player;
    })();
  })(exports || App.Models);
}).call(this);
