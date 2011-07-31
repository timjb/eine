{Game, Card} = App.Models
{Hand} = App.Collections

describe "Game (model)", ->
  game = null
  beforeEach -> game = new Game

  it "should create players", ->
    expect(game.get('players').length).toBe 0
    tim = game.createPlayer name:"Tim"
    expect(tim.get 'numberOfCards').toBe App.Settings.startCount
    deepBlue = game.createPlayer name:"Deep Blue"
    expect(deepBlue.get 'numberOfCards').toBe App.Settings.startCount
    expect(game.get('players').length).toBe 2

  it "should tell me who's turn it is", ->
    tim       = game.createPlayer name:"Tim"
    christian = game.createPlayer name:"Christian"
    julia     = game.createPlayer name:"Julia"
    
    current = null
    game.bind 'change:current', (m, p) -> current = p
    
    expectPlayer = (p) ->
      expect(current).toBe p
      expect(game.get 'current').toBe p
    
    wishCard = new Card(color:'black', symbol:'wish')
    redReverseCard = new Card color:'red', symbol:'reverse'
    red0Card = new Card color:'red', symbol:'0'
    redSkipCard = new Card color:'red', symbol:'skip'
    
    tim.receiveCards [wishCard, red0Card]
    christian.receiveCards [redReverseCard]
    julia.receiveCards [redSkipCard]
    
    game.start()
    expectPlayer tim
    tim.playCard wishCard.wish('red')
    expectPlayer christian
    christian.playCard redReverseCard
    expectPlayer tim
    tim.playCard red0Card
    expectPlayer julia
    julia.playCard redSkipCard
    expectPlayer tim

  it "should give the next player some cards when I lay +2 or +4", ->
    me  = game.createPlayer name:"Tim"
    you = game.createPlayer name:"You"
    
    plus4 = new Card(color:'black', symbol:'+4').wish('green')
    plus2 = new Card color:'green', symbol:'+2'
    
    me.receiveCards [plus4] # has now 8 cards
    you.receiveCards [plus2] # has now 8 cards
    
    game.start()
    me.playCard plus4 # has now 7 cards
    expect(you.get 'numberOfCards').toBe App.Settings.startCount + 4 + 1
    you.playCard plus2
    expect(me.get 'numberOfCards').toBe App.Settings.startCount + 2

  it "should uncover a numbered, random card", ->
    _.times 25, ->
      game = new Game
      game.start()
      expect(game.get 'open').toBeInstanceof(Card)
      expect((game.get 'open').get 'symbol').toMatch /^[0-9]$/

  it "should throw an exception if the move isn't allowed", ->
    p1 = game.createPlayer name:"P1"
    p2 = game.createPlayer name:"P2"
    
    wishCard = new Card(color:'black', symbol:'wish')
    red7Card = new Card color:'red', symbol:'7'
    green3Card = new Card color:'green', symbol:'3'
    
    p1.receiveCards [wishCard]
    p2.receiveCards [red7Card, green3Card]
    
    game.start()
    p1.playCard wishCard.wish('green')
    expect(-> p2.playCard red7Card).toThrow()
    expect(-> p2.playCard green3Card).not.toThrow()
