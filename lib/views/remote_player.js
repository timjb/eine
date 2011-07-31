(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  App.Views.RemotePlayer = (function() {
    __extends(RemotePlayer, App.Views.Player);
    function RemotePlayer() {
      RemotePlayer.__super__.constructor.apply(this, arguments);
    }
    RemotePlayer.prototype.initialize = function(options) {
      RemotePlayer.__super__.initialize.call(this, options);
      _.bindAll(this, '_updateNumberOfCards', 'render');
      return this.model.bind('change:numberOfCards', this._updateNumberOfCards);
    };
    RemotePlayer.prototype._updateNumberOfCards = function() {
      return this.$('.number-of-cards').text(this.model.get('numberOfCards'));
    };
    RemotePlayer.prototype.render = function() {
      $(this.el).html("<span class=\"name\">" + (this.model.escape('name')) + "</span>\n<span class=\"number-of-cards\">" + (this.model.escape('numberOfCards')) + "</span>");
      return this;
    };
    return RemotePlayer;
  })();
}).call(this);
