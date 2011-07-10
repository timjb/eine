$ = jQuery

CardM = App.Models.Card
CardV = App.Views.Card

describe "Card (view)", ->
  card = view = null
  beforeEach ->
    card = new CardM color:'yellow', symbol:'6'
    view = new CardV(model:card).render()

  it "has it's color as it's class and it's symbol as it's content", ->
    expect($(view.el).hasClass('yellow')).toBe yes
    expect($(view.el).text()).toMatch /6/

  it "should trigger the 'click' event when the user clicks it", ->
    triggered = no
    view.bind 'click', -> triggered = yes
    
    expect(triggered).toBe no
    $(view.el).click()
    expect(triggered).toBe yes

  it "should let the user choose the color of special cards", ->
    specialCard = new CardM color:'black', symbol:'wish'
    cardView    = new CardV model:specialCard
    el = cardView.render().el
    expect($('.color', el).length).toBe 4
    green = $('.green', el)
    green.click()
    expect(specialCard.get 'color').toBe 'green'
