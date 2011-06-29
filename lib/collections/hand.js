(function() {
  var Card;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Card = App.Models.Card;
  App.Collections.Hand = (function() {
    __extends(Hand, Backbone.Collection);
    function Hand() {
      Hand.__super__.constructor.apply(this, arguments);
    }
    Hand.prototype.model = Card;
    Hand.prototype.comparator = function(card) {
      var colorIndex, symbolIndex;
      colorIndex = Card.colors.indexOf(card.get('color'));
      if (colorIndex === -1) {
        colorIndex = 10;
      }
      symbolIndex = Card.symbols.indexOf(card.get('symbol'));
      return colorIndex * 1000 + symbolIndex;
    };
    return Hand;
  })();
}).call(this);
