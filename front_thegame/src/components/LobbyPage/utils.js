import $ from "jquery";
import cards from "./cards.js";

let deck;
let piles = [];
let playersHand = [];

let myHand, upperhandleft, upperhandright, righthand, lefthand;
let ascendantPile1,
  ascendantPile2,
  ascendantPile3,
  descendantPile1,
  descendantPile2,
  descendantPile3;

export function init(ArrayPlayers, ArrayPiles) {
  //Tell the library which element to use for the table
  cards.init({ table: "#card-table", piles: ArrayPiles.length });
  //Create a new deck of cards
  deck = new cards.Deck();
  //By default it's in the middle of the container, put it slightly to the side
  deck.x -= 50;
  //cards.all contains all cards, put them all in the deck
  deck.addCards(cards.all);
  //No animation here, just get the deck onto the table.
  deck.render({ immediate: true });

  switch (ArrayPlayers.length) {
    case 1:
      myHand = new cards.Hand({
        id: ArrayPlayers[0],
        faceUp: true,
        y: 400
      });
      playersHand.push(myHand);
      break;
    case 2:
      upperhandright = new cards.Hand({
        id: "baptiste",
        faceUp: false,
        y: 60
      });
      myHand = new cards.Hand({
        id: "moi",
        faceUp: true,
        y: 400
      });
      playersHand.push(myHand);
      playersHand.push(upperhandright);
      break;
    case 3:
      upperhandright = new cards.Hand({
        id: "baptiste",
        faceUp: false,
        y: 60,
        x: 900
      });
      myHand = new cards.Hand({
        id: "moi",
        faceUp: true,
        y: 400
      });
      upperhandleft = new cards.Hand({
        id: "Clément",
        faceUp: false,
        y: 60,
        x: 300
      });
      playersHand.push(myHand);
      playersHand.push(upperhandright);
      playersHand.push(upperhandleft);
      break;
    case 4:
      upperhandright = new cards.Hand({
        id: "baptiste",
        faceUp: false,
        y: 60,
        x: 900
      });
      myHand = new cards.Hand({
        id: "moi",
        faceUp: true,
        y: 400
      });
      upperhandleft = new cards.Hand({
        id: "Clément",
        faceUp: false,
        y: 60,
        x: 300
      });
      lefthand = new cards.Hand({
        id: "Dieu",
        faceUp: false,
        y: 400,
        x: 200
      });
      playersHand.push(myHand);
      playersHand.push(upperhandright);
      playersHand.push(upperhandleft);
      playersHand.push(lefthand);
      break;
    case 5:
      righthand = new cards.Hand({
        id: "baptiste",
        faceUp: false,
        y: 400,
        x: 1000
      });
      upperhandright = new cards.Hand({
        id: "tistbap",
        faceUp: false,
        y: 60,
        x: 900
      });
      myHand = new cards.Hand({
        id: "moi",
        faceUp: true,
        y: 400
      });
      lefthand = new cards.Hand({
        id: "Clément",
        faceUp: false,
        y: 400,
        x: 200
      });
      upperhandleft = new cards.Hand({
        id: "Dieu",
        faceUp: false,
        y: 60,
        x: 300
      });
      playersHand.push(myHand);
      playersHand.push(righthand);
      playersHand.push(lefthand);
      playersHand.push(upperhandleft);
      playersHand.push(upperhandright);
      break;
  }

  switch (ArrayPiles.length) {
    case 2:
      ascendantPile1 = new cards.Deck({ id: "id1", faceUp: true });
      descendantPile1 = new cards.Deck({ id: "id2", faceUp: true });
      ascendantPile1.x -= 150;
      descendantPile1.x += 50;
      //
      piles.unshift(ascendantPile1);
      piles.unshift(descendantPile1);
      break;
    case 4:
      // Les piles de cartes
      ascendantPile1 = new cards.Deck({ id: "id1", faceUp: true });
      ascendantPile2 = new cards.Deck({ id: "id2", faceUp: true });
      descendantPile1 = new cards.Deck({ id: "id3", faceUp: true });
      descendantPile2 = new cards.Deck({ id: "id4", faceUp: true });
      // Le placement des piles de cartes
      ascendantPile1.x -= 150;
      ascendantPile2.x -= 250;
      descendantPile1.x += 50;
      descendantPile2.x += 150;
      //
      piles.unshift(ascendantPile1);
      piles.unshift(ascendantPile2);
      piles.unshift(descendantPile1);
      piles.unshift(descendantPile2);
      break;
    case 6:
      // Les piles de cartes
      ascendantPile1 = new cards.Deck({ id: "id1", faceUp: true });
      ascendantPile2 = new cards.Deck({ id: "id2", faceUp: true });
      ascendantPile3 = new cards.Deck({ id: "id3", faceUp: true });
      descendantPile1 = new cards.Deck({ id: "id4", faceUp: true });
      descendantPile2 = new cards.Deck({ id: "id5", faceUp: true });
      descendantPile3 = new cards.Deck({ id: "id6", faceUp: true });
      // Le placement des piles de cartes
      ascendantPile1.x -= 150;
      ascendantPile2.x -= 250;
      ascendantPile3.x -= 350;
      descendantPile1.x += 50;
      descendantPile2.x += 150;
      descendantPile3.x += 250;
      //
      piles.unshift(ascendantPile1);
      piles.unshift(ascendantPile2);
      piles.unshift(ascendantPile3);
      piles.unshift(descendantPile1);
      piles.unshift(descendantPile2);
      piles.unshift(descendantPile3);
      break;
  }

  // Fonction qui initialise les decks et mains des joueurs
  deck.deal(0, playersHand, function() {
    piles.forEach(element => {
      element.addCard(deck.firstCard());
      element.render();
    });
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
// Fonction pour mettre une carte d'une main sur une pile
function putCard(idPlayer, cardValue, idPile) {
  let player;
  let carte;

  // On cherche la main du joueur à partir de son id
  playersHand.map(element => {
    if (element.id === idPlayer) {
      player = element;
      if (element[0].column === 1 && element[0].suit === "0") {
        carte = element[0];
      } else {
        element.map(el => {
          if (el.rank === cardValue) {
            carte = element;
          }
        });
      }
    }
  });
  // On cherche la pile où mettre la carte
  piles.map(element => {
    if (element.id === idPile) {
      element.addCardPerso(carte, cardValue);
      element.render();
    }
  });
  player.render();
}

////////////////////////////////////////////////////////
// Fonction pour faire piocher un joueur
function drawCard(idPlayer, cardValue) {
  let hand;

  playersHand.map(element => {
    if (element.id === idPlayer) {
      hand = element;
    }
  });
  hand.addCardPerso(deck.topCard(), cardValue);
  hand.render();
}

console.log(playersHand);

export default { init, putCard, drawCard };
