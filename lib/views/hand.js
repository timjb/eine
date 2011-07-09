(function() {
  var $, CardV;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
      _.bindAll(this, '_addCard', '_removeCard', 'render');
      return this.collection.bind('add', this._addCard).bind('remove', this._removeCard).bind('reset', this.render);
    };
    Hand.prototype._addCard = function(card) {
      var cardEl, cardView, index;
      cardView = this._cardView(card);
      index = this.collection.models.indexOf(card);
      this.cardViews.splice(index, 0, cardView);
      cardEl = $('<li />').append(cardView.render().el).addClass('hidden');
      if (index === 0) {
        cardEl.prependTo(this.el);
      } else {
        cardEl.insertAfter(this.$('li:not(.hidden)').eq(index - 1));
      }
      return setTimeout((function() {
        return cardEl.removeClass('hidden');
      }), 10);
    };
    Hand.prototype._removeCard = function(card) {
      var cardView, i, li, _i, _len, _ref, _results;
      i = 0;
      _ref = this.cardViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cardView = _ref[_i];
        if (cardView.model === card) {
          this.cardViews.splice(i, 1);
          li = $(cardView.el).parent();
          li.addClass('hidden');
          setTimeout((function() {
            return li.remove();
          }), 500);
          break;
        }
        _results.push(i += 1);
      }
      return _results;
    };
    Hand.prototype._cardView = function(card) {
      var cardView;
      cardView = new CardV({
        model: card
      }).render();
      return cardView.bind('click', __bind(function() {
        return this.trigger('click:card', card);
      }, this));
    };
    Hand.prototype.render = function() {
      $(this.el).html('');
      this.cardViews = [];
      this.collection.each(__bind(function(card) {
        var cardView;
        cardView = this._cardView(card);
        this.cardViews.push(cardView);
        return $('<li />').append(cardView.el).appendTo(this.el);
      }, this));
      return this;
    };
    return Hand;
  })();
}).call(this);
