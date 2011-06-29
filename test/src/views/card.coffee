$ = jQuery

CardM = App.Models.Card
CardV = App.Views.Card

describe "Card (view)", ->
  it "has it's color as it's class and it's symbol as it's content", ->
    card = new CardM 'yellow', '6'
    view = new CardV(model:card).render()
    expect($(view.el).hasClass('yellow')).toBe yes
    expect($(view.el).text()).toMatch /6/
