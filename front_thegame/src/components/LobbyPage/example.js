import $ from "jquery";
import cards from "./cards.js";

export default function init() {
  //Tell the library which element to use for the table
  cards.init({ table: "#card-table" });

  //Create a new deck of cards
  let deck = new cards.Deck();
  //By default it's in the middle of the container, put it slightly to the side
  deck.x -= 50;

  //cards.all contains all cards, put them all in the deck
  deck.addCards(cards.all);
  //No animation here, just get the deck onto the table.
  deck.render({ immediate: true });

  //Now lets create a couple of hands, one face down, one face up.
  let upperhand = new cards.Hand({ faceUp: false, y: 60 });
  let lowerhand = new cards.Hand({ faceUp: true, y: 340 });
  let righthand = new cards.Hand({ faceUp: false, y: 340, x: 100 });

  //Lets add a discard pile
  let ascendantPile1 = new cards.Deck({ faceUp: true });
  let ascendantPile2 = new cards.Deck({ faceUp: true });
  ascendantPile1.x -= 150;
  ascendantPile2.x -= 250;

  let descendantPile1 = new cards.Deck({ faceUp: true });
  let descendantPile2 = new cards.Deck({ faceUp: true });
  descendantPile1.x += 50;
  descendantPile2.x += 150;

  //Let's deal when the Deal button is pressed:
  $("#deal").click(function() {
    //Deck has a built in method to deal to hands.
    $("#deal").hide();
    deck.deal(7, [upperhand, lowerhand, righthand], 50, function() {
      //This is a callback function, called when the dealing
      //is done.
      ascendantPile1.addCard(deck.topCard());
      ascendantPile1.render();
      ascendantPile2.addCard(deck.topCard());
      ascendantPile2.render();
      descendantPile1.addCard(deck.topCard());
      descendantPile1.render();
      descendantPile2.addCard(deck.topCard());
      descendantPile2.render();
    });
  });

  //When you click on the top card of a deck, a card is added
  //to your hand
  deck.click(function(card) {
    // Empêche le joueur d'avoir plus de 7 cartes en main
    if (lowerhand.length < 7) {
      if (card === deck.topCard()) {
        lowerhand.addCard(deck.topCard());
        lowerhand.render();
      }
    }
  });

  //Finally, when you click a card in your hand, if it's
  //the same suit or rank as the top card of the discard pile
  //then it's added to it
  lowerhand.click(function(card) {
    ascendantPile1.addCard(card);
    ascendantPile1.render();
    lowerhand.render();
  });
}
