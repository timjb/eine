(function() {
  var Card, Hand;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Card = App.Models.Card;
  Hand = App.Collections.Hand;
  App.Models.ClientLocalPlayer = (function() {
    __extends(ClientLocalPlayer, App.Models.Player);
    function ClientLocalPlayer() {
      ClientLocalPlayer.__super__.constructor.apply(this, arguments);
    }
    ClientLocalPlayer.prototype.initialize = function(attributes, options) {
      ClientLocalPlayer.__super__.initialize.call(this, attributes, options);
      this.bind('server:change:current', __bind(function(m, v) {
        return this.set({
          current: v
        });
      }, this));
      this.bind('server:change:didDraw', __bind(function(m, v) {
        return this.set({
          didDraw: v
        });
      }, this));
      this.bind('server:change:saidEine', __bind(function(m, v) {
        return this.set({
          saidEine: v
        });
      }, this));
      this.bind('server:change:hand', __bind(function(m, v) {
        return this.set({
          hand: new Hand(_.map(v, function(a) {
            return new Card(a);
          }))
        });
      }, this));
      this.socket = options.socket;
      return this.socket.on('receiveCards', __bind(function(cards) {
        return this.receiveCards(_.map(cards, function(c) {
          return new Card(c);
        }));
      }, this));
    };
    ClientLocalPlayer.prototype.eine = function() {
      return this.game.eine();
    };
    return ClientLocalPlayer;
  })();
}).call(this);
