Game = App.Models.Game
Card = App.Models.Card

describe "Game (model)", ->
  game = null
  beforeEach -> game = new Game

  it "should create players", ->
    expect(game._players).toEqual []
    tim = game.createPlayer()
    #expect(tim._cards.length).toEqual 7
    tom = game.createPlayer()
    #expect(tom._cards.length).toEqual 7
    expect(game._players.length).toBe 2

  it "should tell me who's turn it is", ->
    tim       = game.createPlayer()
    christian = game.createPlayer()
    julia     = game.createPlayer()
    expect(game.currentPlayer()).toBe tim
    game.putDown(new Card 'red', 'wish', true)
    expect(game.currentPlayer()).toBe christian
    game.putDown(new Card 'red', 'reverse')
    expect(game.currentPlayer()).toBe tim
    game.putDown(new Card 'red', '0')
    expect(game.currentPlayer()).toBe julia
    game.putDown(new Card 'red', 'skip')
    expect(game.currentPlayer().toBe tim

  # TODO: test if a move is invalid
