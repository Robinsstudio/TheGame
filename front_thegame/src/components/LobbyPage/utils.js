import cards from "./cards.js";

let deck;
let piles = [];
let playersHand = [];

let tableHeight = 0;
let tableWidth = 0;
let limitePioche = 8;

let myHand = new cards.Hand({
  id: "",
  faceUp: true,
  y: 400
});
let askWhichColumn;
let putCardOnPile;
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
  piles.map(pile => pile.borderChange(false));
}

export function init(ArrayPiles, callbackAskColumn, callbackPutCardOnPile) {
  while (piles.length > 0) piles.pop();
  while (playersHand.length > 0) playersHand.pop();
  askWhichColumn = callbackAskColumn;
  putCardOnPile = callbackPutCardOnPile;
  //Tell the library which element to use for the table
  cards.init({
    table: "#card-table",
    piles: ArrayPiles,
    widthScreen: document.getElementById("card-table").offsetWidth
  });
  //Create a new deck of cards
  deck = new cards.Deck();
  //By default it's in the middle of the container, put it slightly to the side
  deck.x -= 50;
  //cards.all contains all cards, put them all in the deck
  deck.addCards(cards.all);
  //No animation here, just get the deck onto the table.
  deck.render({ immediate: true });
  let nbAsc = 0;
  let nbDesc = 0;
  // Fonction pour savoir le nombre de cartes restantes
  deck.click(function() {
    deck.cardsLeft();
  });
  // en 150% width = 1263 px et height = 491 px
  // en 125% width = 1519 px et height = 614 px
  // en 100% width = 1903 px et height = 796 px
  tableHeight = document.getElementById("card-table").offsetHeight;
  tableWidth = document.getElementById("card-table").offsetWidth;

  for (let pile of ArrayPiles) {
    let p = new cards.Deck({
      id: pile._id,
      faceUp: true
    });
    if (pile.orientation === "up") {
      p.x += 75 + (tableWidth / 12) * nbDesc++;
      p.addCardPerso(deck.firstCard(), 1);
    } else if (pile.orientation === "down") {
      p.x -= 185 + (tableWidth / 12) * nbAsc++;
      p.addCardPerso(deck.firstCard(), 0);
    }
    // eslint-disable-next-line
    p.click(function() {
      const ind = p.length - 1;
      if (p[ind].el.hasClass("borderPile")) {
        const cardSelected = getCardSelected(myHand);
        // On retire les bordures
        deleteBorderPiles();
        deleteBorderCards();
        putCardOnPile(cardSelected.rank, p.id);
      }
    });
    piles.unshift(p);
  }
  piles.forEach(element => element.render());
  // Fonction qui initialise les piles et mains des joueurs
  deck.deal(0, playersHand, function() {
    piles.forEach(element => {
      element.render();
    });
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

export function start(playerId, ArrayPlayers) {
  ArrayPlayers.filter(ele => ele === playerId).map(ele => {
    myHand = new cards.Hand({
      id: ele,
      faceUp: true,
      y: tableHeight - 100
    });
    playersHand.push(myHand);
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
        askWhichColumn(cardValue).then(res => {
          piles
            .filter(pile => res.includes(pile.id))
            .map(pile => pile.borderChange(true));
        });
        myHand.borderChange(card, true);
      }
    });
    return null;
  });
  ArrayPlayers.filter(ele => ele !== playerId).map((ele, index) => {
    let x;
    let y;
    switch (index) {
      case 0:
        y = tableHeight / 7;
        break;
      case 1:
        y = tableHeight / 7;
        x = 300;
        break;
      case 2:
        y = tableHeight / 7;
        x = tableWidth - 300;
        break;
      case 3:
        y = tableHeight - 100;
        x = tableWidth - 300;
        break;
      default:
        break;
    }
    let hand = new cards.Hand({
      id: ele,
      faceUp: false,
      y: y,
      x: x
    });
    playersHand.push(hand);
    return null;
  });
  deck.deal(0, playersHand, function() {
    piles.forEach(element => {
      //element.addCard(deck.firstCard());
      element.render();
    });
  });
}
////////////////////////////////////////////////////////
// Fonction pour mettre une carte d'une main sur une pile
export function putCard(idPlayer, cardValue, idPile) {
  let player;
  let carte;
  // On cherche la main du joueur à partir de son id
  playersHand.map(element => {
    if (element.id === idPlayer) {
      player = element;
      if (myHand.id !== idPlayer && element[0] !== undefined) {
        carte = element[0];
      } else {
        element.map(el => {
          if (el.rank === cardValue) {
            carte = el;
            deleteBorderPiles();
            deleteBorderCards();
          }
          return null;
        });
      }
    }
    return null;
  });
  // On cherche la pile où mettre la carte
  piles.map(element => {
    if (element.id === idPile) {
      element.addCardPerso(carte, cardValue);
      element.render();
    }
    return null;
  });
  player.render();
}

////////////////////////////////////////////////////////
// Fonction pour faire piocher un joueur
export function drawCard(idPlayer, cardValue, nbPlayers) {
  if (nbPlayers > 2) {
    limitePioche = 6;
  } else if (nbPlayers === 2) {
    limitePioche = 7;
  } else if (nbPlayers === 1) {
    limitePioche = 8;
  }
  playersHand.map(element => {
    if (element.id === idPlayer && element.length < limitePioche) {
      element.addCardPerso(deck.topCard(), cardValue);
      element.render();
    }
    return null;
  });
}

export function CreateEndDiv() {
  cards.CreateEndDiv();
}

export default { init, start, putCard, drawCard, CreateEndDiv };
