$ = jQuery

{Card} = App.Models
HandC = App.Collections.Hand
HandV = App.Views.Hand

describe "Hand (view)", ->
  it "should display a list of cards", ->
    hand = new HandC
    hand.add [
      new Card color:'red', symbol:'3'
      new Card color:'black', symbol:'+4'
      new Card color:'yellow', symbol:'skip'
    ]
    
    view = new HandV collection:hand
    el = $(view.render().el)
    cards = $('li .card', el)
    expect(cards.length).toBe 3
    expect(cards.eq(0).hasClass 'red').toBe yes
    expect(cards.eq(1).hasClass 'yellow').toBe yes
    expect(cards.eq(2).hasClass 'black').toBe yes

  it "should refresh automatically", ->
    hand = new HandC
    hand.add [
      new Card color:'blue', symbol:'reverse'
      new Card color:'green', symbol:'1'
    ]
    view = new HandV collection:hand
    el = $(view.render().el)
    expect($('li .card', el).length).toBe 2
    hand.add(new Card color:'red', symbol:'8')
    expect($('li .card', el).length).toBe 3

  it "should trigger 'click:card' when a user clicks a card", ->
    hand = new HandC
    hand.add [
      a = new Card color:'blue', symbol:'3'
      b = new Card color:'blue', symbol:'+2'
    ]
    view = new HandV(collection:hand).render()
    
    clickedCard = null
    view.bind 'click:card', (c) -> clickedCard = c
    
    expect(clickedCard).toBeNull()
    cardsEls = $ '.card', view.el
    cardsEls.eq(1).click()
    expect(clickedCard).toBe b
    cardsEls.eq(0).click()
    expect(clickedCard).toBe a
