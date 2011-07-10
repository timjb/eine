{-# LANGUAGE OverloadedStrings #-}

import Language.CSS hiding (borderRadius, boxShadow, textShadow)
import Data.Text.Lazy (append)
import qualified Data.Text.Lazy.IO as LIO
import System (getArgs)

main = do
  [path] <- getArgs
  LIO.writeFile path style

style = renderCSS $ runCSS $ do
  reset
  layout
  cards
  game
  players
  hand
  eineButton


-- Rules
-- =====

reset = rule "*" $ do
  margin "0"
  padding "0"

layout = do
  rule "html, body, .game" $ do
    width "100%"
    height "100%"
    overflow "hidden"
  rule "body" $ do
    font "16px Ubuntu, Helvetica, sans-serif"
    background "#0d3502 url(\"background.png\")"
    color white

cardRule = rule . (".card" `append`)

colorCard className colorStr = cardRule ("." `append` className) $ do
  borderColor colorStr
  color colorStr

-- /* original dimensions * 60% */
-- .player .card { width: 60px; height: 90px; border-width: 6px; font-size: 14px; }

bigCard = do
  width "100px" >> height "150px"
  borderWidth "10px"
  fontSize "16px"

smallCard = do
  width "60px" >> height "90px"
  borderWidth "6px"
  fontSize "14px"

cards = do
  cardRule "" $ do
    borderStyle "solid" >> borderColor white >> borderRadius "10px"
    boxShadow "2px 2px 10px #0a2d00"
    background white
    position "relative"
    rule ".symbol" $ do
      display "block"
      position "absolute" >> left "5px" >> right "5px"
    rule ".symbol:first-child" (top    "5px" >> textAlign "left")
    rule ".symbol ~ .symbol"   (bottom "5px" >> textAlign "right")
  
  colorCard "yellow" yellow
  colorCard "green" green
  colorCard "blue" blue
  colorCard "red" red
  cardRule ".closed" $ do
    let grey = "#888"
    borderColor grey
    color grey
    background black

game = do
  rule ".open, .closed" $ do
    bigCard
    position "absolute" >> left "50%" >> top "50%"
    marginTop "-85px"
  rule ".open"   (marginLeft "-130px")
  rule ".closed" (marginLeft "10px")

players = do
  rule ".player" $ do
    minWidth   "150px"
    textAlign  "center"
    position   "absolute"
    fontSize   "18px" >> lineHeight "30px"
    padding    "0 10px"
    background "rgba(255,255,255,.1)"
    rule ".number-of-cards" $ do
      fontWeight "bold"
      color "#ff9"
      marginLeft "5px"
  rule ".player.current" $ background "rgba(255,255,255,.5)"
  rule ".player.winner"  $ background "#fff"
  rule ".player.left, .player.right" $ top "50%"
  rule ".player.left"   $ left "0" >> transform "rotate(90deg) translate(-15px, 70px)" >> margin "0 0 -70px"
  rule ".player.right"  $ right "0" >> transform "rotate(-90deg) translate(15px,  70px)" >> margin "0 0 -70px"
  rule ".player.top"    $ left "50%" >> top "0" >> marginLeft "-85px"
  rule ".player.bottom" $ bottom "0" >> left "50px" >> right "50px" >> padding "15px"

hand :: CSS Rule
hand = rule ".hand" $ do
  listStyle "none"
  rule "li" (float "left")
  rule "li .card" (smallCard >> margin "0" >> transform "rotate(2deg)" >> transition "all 0.3s ease")
  rule "li:nth-child(2n) .card" (transform "rotate(-4deg)")
  rule "li:nth-child(3n) .card" (transform "rotate(12deg)")
  rule "li .card:hover" (transform "rotate(0) translate(0, -10px)")
  rule "li.hidden .card" (margin "0 -36px" >> transform "translate(0, 150px)")

-- http://css3button.net/5232
eineButton = do
  rule ".eine-button" $ do
    position "absolute" >> top "30px" >> right "30px"
    color yellow >> fontSize "32px" >> textDecoration "none"
    padding "20px"
    border "3px solid #ffbf00" >> borderRadius "10px"
    boxShadow "0px 1px 3px rgba(000,000,000,0.5), inset 0px 0px 3px rgba(255,255,255,1)"
    textShadow "0px -1px 0px rgba(000,000,000,0.1), 0px 1px 0px rgba(255,255,255,1)"
    background "-moz-linear-gradient(top, #ffffff 0%, #ffffff 50%, #bbb)"
    background "-webkit-gradient(linear, left top, left bottom, from(#ffffff), color-stop(0.50, #ffffff), to(#bbb))"
  rule ".eine-button:active" $ do
    color white >> background black
    textShadow "none"


-- Colors
-- ======

white  = "#fff"
black  = "#000"

yellow = "#ffa200"
green  = "#089720"
blue   = "#0747ff"
red    = "#d50b00"


-- Helpers
-- =======

vendor name value = do
  prop ("-moz-" `append` name) value
  prop ("-webkit-" `append` name) value
  prop name value


-- Properties
-- ==========

-- CSS3
-- ----

borderRadius = vendor "border-radius"
transform    = vendor "transform"
transition   = vendor "transition"
boxShadow    = vendor "box-shadow"
textShadow   = vendor "text-shadow"
