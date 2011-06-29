(function() {
  var $, CardV;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  $ = jQuery;
  CardV = App.Views.Card;
  App.Views.Hand = (function() {
    __extends(Hand, Backbone.View);
    function Hand() {
      Hand.__super__.constructor.apply(this, arguments);
    }
    Hand.prototype.tagName = 'ol';
    Hand.prototype.className = 'hand';
    Hand.prototype.initialize = function() {
      _.bindAll(this, 'render');
      return this.collection.bind('add', this.render).bind('remove', this.render).bind('refresh', this.render);
    };
    Hand.prototype.render = function() {
      var el;
      el = $(this.el);
      el.html('');
      this.collection.each(function(card) {
        return $('<li />').append(new CardV({
          model: card
        }).render().el).appendTo(el);
      });
      return this;
    };
    return Hand;
  })();
}).call(this);
