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
    var Backbone, Card, Hand, _;
    _ = require('underscore') || window._;
    Backbone = require('backbone') || window.Backbone;
    Card = (require('./card') || App.Models).Card;
    Hand = (require('../collections/hand') || App.Collections).Hand;
    return exports.Player = (function() {
      __extends(Player, Backbone.Model);
      function Player() {
        Player.__super__.constructor.apply(this, arguments);
      }
      Player.prototype.initialize = function(attributes, options) {
        var initHand;
        _.bindAll(this, 'playAI');
        initHand = __bind(function() {
          this.set({
            numberOfCards: this.get('hand').length
          });
          return this.get('hand').bind('all', __bind(function() {
            return this.set({
              numberOfCards: this.get('hand').length
            });
          }, this));
        }, this);
        this.bind('change:hand', initHand);
        initHand();
        return this.bind('change:current', __bind(function(m, isCurrent) {
          if (isCurrent) {
            return this.set({
              didDraw: false,
              saidEine: false
            });
          }
        }, this));
      };
      Player.prototype.parse = function(resp, xhr) {
        var cards;
        cards = _.map(resp.hand, function(card) {
          return new Card(card);
        });
        resp.hand = new Hand(cards);
        return resp;
      };
      Player.prototype.start = function() {
        return this.game.start();
      };
      Player.prototype.restart = function() {
        return this.game.restart();
      };
      Player.prototype.receiveCards = function(cards) {
        this.get('hand').add(cards);
        return this.trigger('receive');
      };
      Player.prototype._checkIfCurrent = function() {
        if (!this.get('current')) {
          throw new Error("It's not your turn.");
        }
      };
      Player.prototype.playCard = function(cardClone) {
        var card;
        this._checkIfCurrent();
        card = this.get('hand').get(cardClone);
        if (!card) {
          throw new Error("Player doesn't have this card");
        }
        if (card.get('special') && card.get('color') !== cardClone.get('color')) {
          card.set({
            color: cardClone.get('color')
          });
        }
        if (!card.matches(this.game.get('open'))) {
          throw new Error("invalid move");
        }
        if (card.get('color') === Card.specialColor) {
          throw new Error("no color chosen");
        }
        this.get('hand').remove(card);
        return this.game.playCard(card);
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
      Player.prototype.eine = function() {
        return this.set({
          saidEine: true
        });
      };
      Player.prototype.playAI = function() {
        var chooseCard, chooseColor, chosenCard, hand, open, rand, randomElem;
        open = this.game.get('open');
        hand = this.get('hand');
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
        if (this.get('numberOfCards') === 1 && Math.random() < 0.9) {
          return this.eine();
        }
      };
      return Player;
    })();
  })(exports || App.Models);
}).call(this);
