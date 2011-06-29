{Game, Card} = App.Models

describe "Game (model)", ->
  game = null
  beforeEach -> game = new Game

  it "should create players", ->
    expect(game.players).toEqual []
    tim = game.createPlayer()
    expect(tim.countCards()).toBe App.Settings.startCount
    tom = game.createPlayer()
    expect(tom.countCards()).toBe App.Settings.startCount
    expect(game.players.length).toBe 2

  it "should tell me who's turn it is", ->
    tim       = game.createPlayer()
    christian = game.createPlayer()
    julia     = game.createPlayer()
    
    nextPlayer = null
    game.bind 'next', (p) -> nextPlayer = p
    
    expect(nextPlayer).toBeNull()
    expect(game.currentPlayer()).toBeNull()
    
    game.start()
    expectPlayer = (p) ->
      expect(nextPlayer).toBe p
      expect(game.currentPlayer()).toBe p
    expectPlayer tim
    game.putDown(new Card('black', 'wish').wish('red'))
    expectPlayer christian
    game.putDown(new Card 'red', 'reverse')
    expectPlayer tim
    game.putDown(new Card 'red', '0')
    expectPlayer julia
    game.putDown(new Card 'red', 'skip')
    expectPlayer tim

  it "should give the next player some cards when I lay +2 or +4", ->
    me  = game.createPlayer()
    you = game.createPlayer()
    
    plus4 = new Card('black', '+4').wish('green')
    plus2 = new Card 'green', '+2'
    
    game.start()
    game.putDown plus4
    expect(you.countCards()).toBe App.Settings.startCount + 4
    game.putDown plus2
    expect(me.countCards()).toBe App.Settings.startCount + 2

  it "should uncover a random card at game start", ->
    expect(game.get 'open').not.toBeInstanceof(Card)
    game.start()
    expect(game.get 'open').toBeInstanceof(Card)

  it "should throw an exception if the move isn't allowed", ->
    game.putDown(new Card('black', 'wish').wish('green'))
    expect(-> game.putDown(new Card 'red',   '7')).toThrow()
    expect(-> game.putDown(new Card 'green', '3')).not.toThrow()

  # TODO: test if a move is invalid
