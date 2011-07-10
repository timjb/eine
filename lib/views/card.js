(function() {
  var $;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
    Card.prototype.initialize = function() {
      _.bindAll(this, 'render');
      return this.model.bind('set:color', this.render);
    };
    Card.prototype.render = function() {
      var color, symbol, _fn, _i, _len, _ref;
      symbol = this.model.escape('symbol');
      if (this.constructor.SYMBOLS.hasOwnProperty(symbol)) {
        symbol = this.constructor.SYMBOLS[symbol];
      }
      $(this.el).addClass(this.model.escape('color')).append($('<span />').html(symbol));
      if (this.model.get('special')) {
        _ref = App.Models.Card.colors;
        _fn = __bind(function(color) {
          var colorEl;
          colorEl = $('<div class="color" />').addClass(color);
          if (this.model.get('color') === App.Models.Card.specialColor) {
            colorEl.click(__bind(function(event) {
              this.model.set({
                color: color
              });
              event.stopPropagation();
              return this.triggerClick();
            }, this));
          } else if (this.model.get('color') === color) {
            colorEl.addClass('active');
          }
          return colorEl.appendTo(this.el);
        }, this);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          color = _ref[_i];
          _fn(color);
        }
      }
      return this;
    };
    Card.SYMBOLS = {
      reverse: '\u2942',
      skip: '\u2717',
      wish: ''
    };
    Card.prototype.triggerClick = function() {
      return this.trigger('click');
    };
    Card.closedHtml = '<div class="card closed"><span>?</span></div>';
    return Card;
  })();
}).call(this);
