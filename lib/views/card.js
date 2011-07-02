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
      var symbolHtml;
      symbolHtml = '<span class="symbol">' + this.model.get('symbol') + '</span>';
      $(this.el).addClass(this.model.get('color')).html(symbolHtml + symbolHtml);
      return this;
    };
    Card.prototype.triggerClick = function() {
      return this.trigger('click');
    };
    return Card;
  })();
}).call(this);
