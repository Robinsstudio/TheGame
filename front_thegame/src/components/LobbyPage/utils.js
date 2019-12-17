import $ from "jquery";
import cards from "./cards.js";

let deck;
let ascendantPile1, ascendantPile2, descendantPile1, descendantPile2;
let hands = [];

export function init() {
  //Tell the library which element to use for the table
  cards.init({ table: "#card-table" });
  //Create a new deck of cards
  deck = new cards.Deck();
  //By default it's in the middle of the container, put it slightly to the side
  deck.x -= 50;
  //cards.all contains all cards, put them all in the deck
  deck.addCards(cards.all);
  //No animation here, just get the deck onto the table.
  deck.render({ immediate: true });

  //Now lets create a couple of hands, one face down, one face up.
  let upperhand = new cards.Hand({
    faceUp: false,
    y: 60
  });
  let myHand = new cards.Hand({
    faceUp: true,
    y: 400
  });
  /* let righthand = new cards.Hand({
    faceUp: false,
    y: 400,
    x: 100
  }); */

  // Les piles de cartes
  ascendantPile1 = new cards.Deck({
    faceUp: true
  });
  ascendantPile2 = new cards.Deck({
    faceUp: true
  });
  descendantPile1 = new cards.Deck({
    faceUp: true
  });
  descendantPile2 = new cards.Deck({
    faceUp: true
  });
  // Le placement des piles de cartes
  ascendantPile1.x -= 150;
  ascendantPile2.x -= 250;
  descendantPile1.x += 50;
  descendantPile2.x += 150;

  //$("#deal").hide();
  deck.deal(7, [upperhand, myHand], function() {
    //This is a callback function, called when the dealing is done
    descendantPile1.addCard(deck.firstCard());
    descendantPile1.render();
    descendantPile2.addCard(deck.firstCard());
    descendantPile2.render();
    ascendantPile1.addCard(deck.firstCard());
    ascendantPile1.render();
    ascendantPile2.addCard(deck.firstCard());
    ascendantPile2.render();
  });
  /////////////////////////////////////////////////////////
  // Fonction finir le tour du joueur et piocher des cartes
  $("#buttonEndTurn").click(function() {
    // On retire toutes les bordures
    deleteBorderCards();
    deleteBorderPiles();
    while (myHand.length < 7) {
      myHand.addCard(deck.topCard());
      myHand.render();
    }
  });
  ////////////////////////////////////////////////////
  // Fonction pour sélectionner une carte dans notre main
  myHand.click(function(card) {
    let isSelected = false;
    // On regarde si la carte était déjà sélectionnée
    if (card.el.hasClass("borderCard")) {
      isSelected = true;
    }
    // On retire toutes les bordures
    deleteBorderCards();
    deleteBorderPiles();

    let cardValue = card.rank;
    // On regarde si la carte était déjà sélectionnée
    if (isSelected === false) {
      addBorderPilesAsc(ascendantPile1, cardValue);
      addBorderPilesAsc(ascendantPile2, cardValue);
      addBorderPilesDesc(descendantPile1, cardValue);
      addBorderPilesDesc(descendantPile2, cardValue);

      myHand.borderChange(card, true);
    }
  });
  ////////////////////////////////////////////////////////////
  // Fonction pour savoir si met des bordures à la pile ascendante
  function addBorderPilesAsc(pile, rankCard) {
    const ind = pile.length - 1;
    const rankPile = pile[ind].rank;
    const tenDiff = pile[ind].rank + 10;
    if (rankPile > rankCard) {
      pile.borderChange(true);
    }
    if (tenDiff === rankCard) {
      pile.borderChange(true);
    }
  }
  ////////////////////////////////////////////////////////////
  // Fonction pour savoir si met des bordures à la pile descendante
  function addBorderPilesDesc(pile, rankCard) {
    const ind = pile.length - 1;
    const rankPile = pile[ind].rank;
    const tenDiff = pile[ind].rank - 10;
    if (rankPile < rankCard) {
      pile.borderChange(true);
    }
    if (tenDiff === rankCard) {
      pile.borderChange(true);
    }
  }
  ///////////////////////////////////////////////////////////
  // Fonction pour supprimer les bordures des cartes
  function deleteBorderCards() {
    myHand.forEach(function(card) {
      myHand.borderChange(card, false);
    });
  }
  ////////////////////////////////////////////////////
  // Fonction pour supprimer les bordures des piles
  function deleteBorderPiles() {
    ascendantPile1.borderChange(false);
    ascendantPile2.borderChange(false);
    descendantPile1.borderChange(false);
    descendantPile2.borderChange(false);
  }
  /////////////////////////////////////////////////////////
  // Fonction pour mettre la carte sélectionné sur la pile
  ascendantPile1.click(function() {
    const ind = ascendantPile1.length - 1;
    if (ascendantPile1[ind].el.hasClass("borderPile")) {
      const cardSelected = getCardSelected(myHand);
      // On retire les bordures
      deleteBorderPiles();
      deleteBorderCards();

      ascendantPile1.addCard(cardSelected);
      ascendantPile1.render();
      myHand.render();
    }
  });
  ascendantPile2.click(function() {
    const ind = ascendantPile2.length - 1;
    if (ascendantPile2[ind].el.hasClass("borderPile")) {
      const cardSelected = getCardSelected(myHand);
      // On retire les bordures
      deleteBorderPiles();
      deleteBorderCards();

      ascendantPile2.addCard(cardSelected);
      ascendantPile2.render();
      myHand.render();
    }
  });
  descendantPile1.click(function() {
    const ind = descendantPile1.length - 1;
    if (descendantPile1[ind].el.hasClass("borderPile")) {
      const cardSelected = getCardSelected(myHand);
      // On retire les bordures
      deleteBorderPiles();
      deleteBorderCards();

      descendantPile1.addCard(cardSelected);
      descendantPile1.render();
      myHand.render();
    }
  });
  descendantPile2.click(function() {
    const ind = descendantPile2.length - 1;
    if (descendantPile2[ind].el.hasClass("borderPile")) {
      const cardSelected = getCardSelected(myHand);
      // On retire les bordures
      deleteBorderPiles();
      deleteBorderCards();

      descendantPile2.addCard(cardSelected);
      descendantPile2.render();
      myHand.render();
    }
  });
  ///////////////////////////////////////////////////////
  // Fonction pour récupérer la carte sélectionnée
  function getCardSelected(myHand) {
    let cardSelected = "";
    myHand.forEach(function(card) {
      if (card.el.hasClass("borderCard")) {
        cardSelected = card;
      }
    });
    return cardSelected;
  }
}
////////////////////////////////////////////////////////
// Fonction pour mettre une carte d'une main  d'un autre joueur sur une pile
export function playerAddCard(pile, main, carte) {
  pile.addCard(carte);
  pile.render();
  main.render();
}
////////////////////////////////////////////////////////
// Fonction pour qu'un autre joueur repioche des cartes à la fin
export function playerEndTurn(main) {
  while (main.length < 7) {
    main.addCard(deck.topCard());
    main.render();
  }
}

function pioche(main, carte) {
  main.addCard(deck.getCard(carte));
  main.render();
}

export default { init, playerEndTurn, playerAddCard, pioche };
