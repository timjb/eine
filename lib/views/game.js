(function() {
  var Card;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Card = App.Views.Card;
  App.Views.Game = (function() {
    __extends(Game, Backbone.View);
    function Game() {
      Game.__super__.constructor.apply(this, arguments);
    }
    Game.prototype.initialize = function() {
      _.bindAll(this, 'render');
      return this.model.bind('change:open', this.render);
    };
    Game.prototype.render = function() {
      var drawCard, openCardView;
      openCardView = new Card({
        model: this.model.get('open')
      });
      drawCard = __bind(function() {
        var current;
        current = this.model.currentPlayer();
        if (current.type === 'human') {
          return current.playCard(null);
        }
      }, this);
      $(this.el).append($('<div class="card closed" />').click(drawCard)).append($(openCardView.render().el).addClass('open'));
      return this;
    };
    return Game;
  })();
}).call(this);
