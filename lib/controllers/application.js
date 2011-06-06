(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  App.Controllers.Application = (function() {
    __extends(Application, Backbone.Controller);
    function Application() {
      Application.__super__.constructor.apply(this, arguments);
    }
    Application.prototype.routes = {
      test: 'test'
    };
    Application.prototype.test = function() {};
    return Application;
  })();
}).call(this);
