(function() {
  var HandView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  HandView = App.Views.Hand;
  App.Views.LocalPlayer = (function() {
    __extends(LocalPlayer, App.Views.Player);
    function LocalPlayer() {
      LocalPlayer.__super__.constructor.apply(this, arguments);
    }
    LocalPlayer.prototype.events = {
      'click .draw-or-next-button': '_clickDrawOrNextButton'
    };
    LocalPlayer.prototype.initialize = function(options) {
      LocalPlayer.__super__.initialize.call(this, options);
      _.bindAll(this, 'render');
      this._initHandView();
      this.model.bind('change:hand', __bind(function() {
        var oldEl;
        oldEl = this.handView.el;
        this._initHandView();
        return $(this.handView.render().el).replaceAll(oldEl);
      }, this));
      this._initDrawOrNextButton();
      return this._initEineButton();
    };
    LocalPlayer.prototype._initHandView = function() {
      this.handView = new HandView({
        collection: this.model.get('hand')
      });
      this.handView.bind('click:card', __bind(function(card) {
        return this.model.playCard(card);
      }, this));
      return this.model.bind('receive', __bind(function() {
        return this.highlightMatchingCards(this.model.game.get('open'));
      }, this));
    };
    LocalPlayer.prototype.highlightMatchingCards = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      (_ref = this.handView).highlightMatchingCards.apply(_ref, args);
      return this;
    };
    LocalPlayer.prototype._initDrawOrNextButton = function() {
      var buttonText, updateButtonText;
      this.drawOrNextButton = $('<a href="#" class="draw-or-next-button"></a>');
      buttonText = __bind(function() {
        switch (this.model.game.get('state')) {
          case 'pre-start':
            return "Start";
          case 'running':
            if (this.model.get('current')) {
              if (this.model.get('didDraw')) {
                return "Next Player";
              } else {
                return "Draw a card";
              }
            } else {
              return "";
            }
            break;
          case 'ended':
            return "Restart";
        }
      }, this);
      updateButtonText = __bind(function() {
        return this.drawOrNextButton.html(buttonText);
      }, this);
      this.model.game.bind('change:state', updateButtonText);
      this.model.bind('change:current', updateButtonText);
      this.model.bind('change:didDraw', updateButtonText);
      return updateButtonText();
    };
    LocalPlayer.prototype._clickDrawOrNextButton = function(event) {
      event.preventDefault();
      switch (this.model.game.get('state')) {
        case 'pre-start':
          this.model.start();
          return this.drawOrNextButton.html('');
        case 'running':
          if (this.model.get('didDraw')) {
            return this.model.next();
          } else {
            return this.model.draw();
          }
          break;
        case 'ended':
          return this.model.restart();
      }
    };
    LocalPlayer.prototype._initEineButton = function() {
      this.eineButton = $('<a href="#" class="eine-button">Eine!</a>').click(__bind(function(event) {
        event.preventDefault();
        return this.model.eine();
      }, this));
      return this.model.bind('change:saidEine', __bind(function(m, didShe) {
        return this.eineButton[didShe ? 'addClass' : 'removeClass']('active');
      }, this));
    };
    LocalPlayer.prototype.render = function() {
      $(this.el).append(this.handView.render().el).append(this.drawOrNextButton).append(this.eineButton);
      return this;
    };
    return LocalPlayer;
  })();
}).call(this);
