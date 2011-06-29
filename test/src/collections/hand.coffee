{Hand} = App.Collections
{Card} = App.Models

describe "Hand (collection)", ->
  it "is sorted: 1. normal cards, then special cards 2. cards are grouped by color 3. within each color numbers come first, in ascending order", ->
    hand = new Hand
    hand.add [
      a = new Card 'red', '9'
      b = new Card 'black', 'wish'
      c = new Card 'yellow', '+2'
      d = new Card 'red', '0'
    ]
    expect(hand.at 0).toBe d
    expect(hand.at 1).toBe a
    expect(hand.at 2).toBe c
    expect(hand.at 3).toBe b
