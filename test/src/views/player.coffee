$ = jQuery

{Game,Card} = App.Models
{Hand} = App.Collections
LocalPlayerView = App.Views.LocalPlayer
RemotePlayerView = App.Views.RemotePlayer

describe "Player (view)", ->
  it "gives the current player the css class 'current' and the winner 'winner'", ->
    game = new Game
    p1   = game.createPlayer name:"P1"
    p1V  = new RemotePlayerView model:p1
    p2   = game.createPlayer name:"P2"
    p2.eine = ->
    p2V  = new RemotePlayerView model:p2
    
    wishCard = new Card color:'black', symbol:'wish'
    p1.receiveCards [wishCard]
    
    winner = null
    game.bind 'winner', (w) -> winner = w
    
    expect($(p1V.el).hasClass 'current').toBe no
    expect($(p2V.el).hasClass 'current').toBe no
    game.start()
    expect($(p1V.el).hasClass 'current').toBe yes
    expect($(p2V.el).hasClass 'current').toBe no
    p1.playCard(wishCard.wish('blue'))
    expect($(p1V.el).hasClass 'current').toBe no
    expect($(p2V.el).hasClass 'current').toBe yes
    game.get('current').playAI() until winner
    expect($(p1V.el).hasClass 'winner').toBe yes
    expect($(p2V.el).hasClass 'winner').toBe no

  it "shows the number of cards and the name if the player is not human", ->
    game    = new Game
    me      = game.createPlayer name:"Human"
    cp1     = game.createPlayer name:"Computer"
    meView  = new LocalPlayerView model:me
    cp1View = new RemotePlayerView model:cp1
    meView.render()
    cp1View.render()
    game.start()
    expect($('.name', meView.el).length).toBe 0
    expect($('.number-of-cards', meView.el).length).toBe 0
    expect($('.name', cp1View.el).text()).toBe "Computer"
    _.times 5, ->
      game.get('current').playAI()
      expect(+$('.number-of-cards', cp1View.el).text()).toBe cp1.get('numberOfCards')

  it "should say eine if the user clicks the 'Eine!' button", ->
    game   = new Game
    winner = game.createPlayer name:"I"
    loser  = game.createPlayer name:"You"
    view   = new LocalPlayerView model:winner
    game.start()
    expect(winner.get 'saidEine').toBe no
    $('.eine-button', view.render().el).click()
    expect(winner.get 'saidEine').toBe yes

  it "shows the player's hand if the player's human", ->
    game = new Game
    aiPlayer    = game.createPlayer name:"Computer"
    humanPlayer = game.createPlayer name:"Human"
    expect($('.card', new RemotePlayerView(model:aiPlayer).render().el).length).toBe 0
    expect($('.card', new LocalPlayerView(model:humanPlayer).render().el).length).not.toBe 0

  it "plays a card when the user clicks on it", ->
    game = new Game
    humanPlayer = game.createPlayer name:"human"
    humanPlayer.set hand:(new Hand)
    humanPlayer.get('hand').add [
      g5 = new Card color:'green', symbol:'5'
      g6 = new Card color:'green', symbol:'6'
      g7 = new Card color:'green', symbol:'7'
      g8 = new Card color:'green', symbol:'8'
      g9 = new Card color:'green', symbol:'9'
    ]
    aiPlayer = game.createPlayer name:"computer"
    game.start()
    game.set 'open':(new Card color:'green', symbol:'0')
    view = new LocalPlayerView model:humanPlayer
    $('.card', view.render().el).eq(1).click()
    expect(humanPlayer.get('hand').length).toBe 4
    expect(game.get 'open').toBe g6
