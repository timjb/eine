beforeEach(function () {
  this.addMatchers({
    toBeInstanceof: function (constructor) {
      return this.actual instanceof constructor
    }
  })
})
