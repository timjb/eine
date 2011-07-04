$ = jQuery

{Game,Card} = App.Models
{Hand} = App.Collections
PlayerV = App.Views.Player

describe "Player (view)", ->
  it "gives the current player the css class 'current' and the winner 'winner'", ->
    game = new Game
    p1   = game.createPlayer()
    p1V  = new PlayerV model:p1
    p2   = game.createPlayer()
    p2.eine = ->
    p2V  = new PlayerV model:p2
    winner = null
    game.bind 'winner', (w) -> winner = w
    expect($(p1V.el).hasClass 'current').toBe no
    expect($(p2V.el).hasClass 'current').toBe no
    game.start()
    expect($(p1V.el).hasClass 'current').toBe yes
    expect($(p2V.el).hasClass 'current').toBe no
    p1.playAI()
    expect($(p1V.el).hasClass 'current').toBe no
    expect($(p2V.el).hasClass 'current').toBe yes
    game.currentPlayer().playAI() until winner
    expect($(p1V.el).hasClass 'winner').toBe yes
    expect($(p2V.el).hasClass 'winner').toBe no

  it "shows the numbe of cards a player has if the player is not human", ->
    game = new Game
    me   = game.createPlayer 'human'
    cp1  = game.createPlayer 'computer'
    meView = new PlayerV model:me
    cp1View = new PlayerV model:cp1
    cp1View.render()
    game.start()
    expect($('.count', meView.render().el).length).toBe 0
    _.times 5, ->
      game.currentPlayer().playAI()
      expect(+$('.count', cp1View.el).text()).toBe cp1.countCards()

  it "shows the player's hand if the player's human", ->
    game = new Game
    aiPlayer    = game.createPlayer 'computer'
    humanPlayer = game.createPlayer 'human'
    expect($('.card', new PlayerV(model:aiPlayer).render().el).length).toBe 0
    expect($('.card', new PlayerV(model:humanPlayer).render().el).length).not.toBe 0

  it "plays a card when the user clicks on it", ->
    game = new Game
    game = new Game
    humanPlayer = game.createPlayer 'human'
    humanPlayer.hand = new Hand
    humanPlayer.hand.add [
      g5 = new Card color:'green', symbol:'5'
      g6 = new Card color:'green', symbol:'6'
      g7 = new Card color:'green', symbol:'7'
      g8 = new Card color:'green', symbol:'8'
      g9 = new Card color:'green', symbol:'9'
    ]
    aiPlayer = game.createPlayer 'computer'
    game.start()
    game.set 'open':(new Card color:'green', symbol:'0')
    view = new PlayerV model:humanPlayer
    $('.card', view.render().el).eq(1).click()
    expect(humanPlayer.hand.length).toBe 4
    expect(game.get 'open').toBe g6
