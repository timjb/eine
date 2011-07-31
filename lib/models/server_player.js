(function() {
  var Card, Player;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  Player = require('./player').Player;
  Card = require('./card').Card;
  exports.ServerPlayer = (function() {
    __extends(ServerPlayer, Player);
    function ServerPlayer() {
      ServerPlayer.__super__.constructor.apply(this, arguments);
    }
    ServerPlayer.prototype.initialize = function(attributes, options) {
      var handleErrors;
      ServerPlayer.__super__.initialize.call(this, attributes, options);
      this.socket = options.socket;
      handleErrors = __bind(function(fn) {
        try {
          return fn();
        } catch (exc) {
          console.log("Error: " + exc.message);
          return this.socket.emit('error', exc.message);
        }
      }, this);
      this.socket.on('eine', __bind(function() {
        return handleErrors(__bind(function() {
          return this.eine();
        }, this));
      }, this));
      this.socket.on('start', __bind(function() {
        return handleErrors(__bind(function() {
          return this.start();
        }, this));
      }, this));
      this.socket.on('restart', __bind(function() {
        return handleErrors(__bind(function() {
          return this.restart();
        }, this));
      }, this));
      this.socket.on('draw', __bind(function() {
        return handleErrors(__bind(function() {
          return this.draw();
        }, this));
      }, this));
      this.socket.on('next', __bind(function() {
        return handleErrors(__bind(function() {
          return this.next();
        }, this));
      }, this));
      this.socket.on('playCard', __bind(function(card) {
        return handleErrors(__bind(function() {
          return this.playCard(new Card(card));
        }, this));
      }, this));
      this.socket.on('disconnect', __bind(function() {
        this.disconnected = true;
        this.trigger('disconnect');
        this.bind('change:current', __bind(function(m, isCurrent) {
          if (isCurrent) {
            return setTimeout(this.playAI, 1500);
          }
        }, this));
        return this._emitToOthers('msg', "Player " + (this.escape('name')) + " has disconnected and was replaced by the AI.");
      }, this));
      this.bind('change:hand', function(m, hand) {
        return this.socket.emit('trigger', this.id, 'change:hand', null, hand);
      });
      this.bind('change:numberOfCards', __bind(function(m, noc) {
        return this._emitToOthers('trigger', this.id, 'change:numberOfCards', null, noc);
      }, this));
      this.bind('change:didDraw', __bind(function(m, didShe) {
        return this.socket.emit('trigger', this.id, 'change:didDraw', null, didShe);
      }, this));
      return this.bind('change:saidEine', __bind(function(m, didHe) {
        return this.socket.emit('trigger', this.id, 'change:saidEine', null, didHe);
      }, this));
    };
    ServerPlayer.prototype.receiveCards = function(cards) {
      ServerPlayer.__super__.receiveCards.call(this, cards);
      return this.socket.emit('receiveCards', cards);
    };
    ServerPlayer.prototype._emitToOthers = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.game)._emitToAllExcept.apply(_ref, [this].concat(__slice.call(args)));
    };
    return ServerPlayer;
  })();
}).call(this);
