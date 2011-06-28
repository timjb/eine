describe "Card (model)", ->
  Card = App.Models.Card

  it "allows me to lay 'normal' cards on top of others if the symbol or the number matches", ->
    greenNine = new Card('green', '9')
    expect(new Card('green', '7').matches(greenNine)).toBe yes
    expect(new Card('red', '9').matches(greenNine)).toBe yes
    expect(new Card('red', '7').matches(greenNine)).toBe no

  it "allows me to lay special (=wild) cards on every other card", ->
    wishCard = new Card('black', 'wish').wish('red')
    expect(wishCard.matches(new Card 'green', '9')).toBe yes

  it "validates cards", ->
    v = (args...) ->
      card = new Card(args...)
      not card.validate card.attributes
    
    # colors
    expect(v 'green', '5').toBe yes
    expect(v 'yellow', '5').toBe yes
    expect(v 'blue', '5').toBe yes
    expect(v 'red', '5').toBe yes
    expect(v 'purple', '5').toBe no
    
    # numbers
    expect(v 'red', '0').toBe yes
    expect(v 'red', '1').toBe yes
    expect(v 'red', '2').toBe yes
    expect(v 'red', '3').toBe yes
    expect(v 'red', '4').toBe yes
    expect(v 'red', '5').toBe yes
    expect(v 'red', '6').toBe yes
    expect(v 'red', '7').toBe yes
    expect(v 'red', '8').toBe yes
    expect(v 'red', '9').toBe yes
    expect(v 'red', '+2').toBe yes
    expect(v 'red', 'skip').toBe yes
    expect(v 'red', 'reverse').toBe yes
    
    # special
    expect(v 'black', '+4').toBe yes
    expect(v 'black', 'wish').toBe yes
    
    # nonsense
    expect(v 'red', '+42').toBe no
    expect(v 'lila', '+4').toBe no

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
      isEqual = card1.get('color')  is card2.get('color') and
                card1.get('symbol') is card2.get('symbol')
      notEqual += 1 unless isEqual
    expect(notEqual).toBeGreaterThan 50
