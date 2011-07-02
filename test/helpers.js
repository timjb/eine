beforeEach(function () {
  this.addMatchers({
    toBeInstanceof: function (constructor) {
      return this.actual instanceof constructor
    },
    toHaveClass: function (className) {
      return $(this.actual).hasClass(className)
    }
  })
})
