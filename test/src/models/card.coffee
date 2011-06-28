describe "Card (model)", ->
  Card = App.Models.Card

  it "allows me to lay 'normal' cards on top of others if the symbol or the number matches", ->
    greenNine = new Card('green', '9')
    expect(new Card('green', '7').matches(greenNine)).toBeTruthy()
    expect(new Card('red', '9').matches(greenNine)).toBeTruthy()
    expect(new Card('red', '7').matches(greenNine)).toBeFalsy()

  it "allows me to lay special (=wild) cards on every other card", ->
    expect(new Card('red', 'wish', true).matches(new Card('green', '9'))).toBeTruthy()

  it "validates cards", ->
    v = (args...) -> new Card(args...).validate()
    
    # colors
    expect(v 'green', '5').toBeTruthy()
    expect(v 'yellow', '5').toBeTruthy()
    expect(v 'blue', '5').toBeTruthy()
    expect(v 'red', '5').toBeTruthy()
    expect(v 'purple', '5').toBeFalsy()
    
    # numbers
    expect(v 'red', '0').toBeTruthy()
    expect(v 'red', '1').toBeTruthy()
    expect(v 'red', '2').toBeTruthy()
    expect(v 'red', '3').toBeTruthy()
    expect(v 'red', '4').toBeTruthy()
    expect(v 'red', '5').toBeTruthy()
    expect(v 'red', '6').toBeTruthy()
    expect(v 'red', '7').toBeTruthy()
    expect(v 'red', '8').toBeTruthy()
    expect(v 'red', '9').toBeTruthy()
    expect(v 'red', '+2').toBeTruthy()
    expect(v 'red', 'skip').toBeTruthy()
    expect(v 'red', 'reverse').toBeTruthy()
    
    # special
    expect(v 'red', '+4', true).toBeTruthy()
    expect(v 'red', '+2', true).toBeFalsy()
    expect(v 'red', '+4').toBeFalsy()
    expect(v 'red', 'wish', true).toBeTruthy()
    expect(v 'red', 'wish').toBeFalsy()
    
    # nonsense
    expect(v 'red', '+42').toBeFalsy()

  it "creates a typical card deck", ->
    deck = Card.deck()
    expect(deck.length).toBe 110
    for card in deck
      expect(card).toBeInstanceof(Card)
      #expect(card.validate()).toBe true

  it "gives me a random card", ->
    notEqual = 0
    for i in [1..100]
      card1 = Card.random()
      card2 = Card.random()
      isEqual = card1.color is card2.color and card1.symbol is card2.symbol
      notEqual += 1 unless isEqual
    expect(notEqual).toBeGreaterThan(50)
