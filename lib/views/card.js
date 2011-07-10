(function() {
  var $;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  $ = jQuery;
  App.Views.Card = (function() {
    __extends(Card, Backbone.View);
    function Card() {
      Card.__super__.constructor.apply(this, arguments);
    }
    Card.prototype.className = 'card';
    Card.prototype.events = {
      click: 'triggerClick'
    };
    Card.prototype.render = function() {
      var SYMBOLS, symbol;
      SYMBOLS = {
        reverse: '\u2942',
        skip: '\u2717'
      };
      symbol = this.model.escape('symbol');
      if (SYMBOLS.hasOwnProperty(symbol)) {
        symbol = SYMBOLS[symbol];
      }
      $(this.el).addClass(this.model.escape('color')).html(symbol);
      return this;
    };
    Card.prototype.triggerClick = function() {
      return this.trigger('click');
    };
    Card.closedHtml = '<div class="card closed">?</div>';
    return Card;
  })();
}).call(this);
