$ = jQuery

{Card} = App.Models
HandC = App.Collections.Hand
HandV = App.Views.Hand

describe "Hand (view)", ->
  it "should display a list of cards", ->
    hand = new HandC
    hand.add [
      new Card 'red', '3'
      new Card 'black', '+4'
      new Card 'yellow', 'skip'
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
      new Card 'blue', 'reverse'
      new Card 'green', '1'
    ]
    view = new HandV collection:hand
    el = $(view.render().el)
    expect($('li .card', el).length).toBe 2
    hand.add(new Card 'red', '8')
    expect($('li .card', el).length).toBe 3
