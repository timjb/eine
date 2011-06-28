Game = App.Models.Game
Card = App.Models.Card

describe "Game (model)", ->
  game = null
  beforeEach -> game = new Game

  it "should create players", ->
    expect(game._players).toEqual []
    tim = game.createPlayer()
    expect(tim._cards.length).toEqual App.Settings.startCount
    tom = game.createPlayer()
    expect(tom._cards.length).toEqual App.Settings.startCount
    expect(game._players.length).toBe 2

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
    game.putDown(new Card 'red', 'wish')
    expectPlayer christian
    game.putDown(new Card 'red', 'reverse')
    expectPlayer tim
    game.putDown(new Card 'red', '0')
    expectPlayer julia
    game.putDown(new Card 'red', 'skip')
    expectPlayer tim

  # TODO: test if a move is invalid
