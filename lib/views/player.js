(function() {
  var $, Hand;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  Hand = App.Views.Hand;
  App.Views.Player = (function() {
    __extends(Player, Backbone.View);
    function Player() {
      Player.__super__.constructor.apply(this, arguments);
    }
    Player.prototype.className = 'player';
    Player.prototype.initialize = function(options, isHuman) {
      this.isHuman = isHuman;
      _.bindAll(this, '_updateNumberOfCards', 'render');
      if (this.isHuman) {
        this.handView = new Hand({
          collection: this.model.hand
        });
        this.handView.bind('click:card', __bind(function(card) {
          return this.model.playCard(card);
        }, this));
      }
      this.model.game.bind('next', __bind(function(current) {
        return $(this.el)[current === this.model ? 'addClass' : 'removeClass']('current');
      }, this));
      this.model.game.bind('winner', __bind(function(winner) {
        if (winner === this.model) {
          return $(this.el).addClass('winner');
        }
      }, this));
      return this.model.bind('change:numberOfCards', this._updateNumberOfCards);
    };
    Player.prototype._updateNumberOfCards = function() {
      return this.$('.number-of-cards').text(this.model.get('numberOfCards'));
    };
    Player.prototype.render = function() {
      $(this.el).html('');
      if (this.isHuman) {
        $(this.el).append(this.handView.render().el);
      } else {
        $('<span class="number-of-cards" />').text(this.model.get('numberOfCards')).appendTo(this.el);
      }
      return this;
    };
    return Player;
  })();
}).call(this);
