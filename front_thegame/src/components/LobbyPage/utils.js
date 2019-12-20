import $ from "jquery";
import cards from "./cards.js";

let deck;
let piles = [];
let playersHand = [];

let myHand;
let askWhichColumn;
let putCardOnPile;
export function init(playerId,ArrayPlayers, ArrayPiles,callbackAskColumn, callbackPutCardOnPile) {
  askWhichColumn=callbackAskColumn;
  putCardOnPile=callbackPutCardOnPile;
  //Tell the library which element to use for the table
  //cards.init({ table: "#card-table", piles: ArrayPiles.length });
  cards.init({ table: "#card-table", piles: ArrayPiles });
  //Create a new deck of cards
  deck = new cards.Deck();
  //By default it's in the middle of the container, put it slightly to the side
  deck.x -= 50;
  //cards.all contains all cards, put them all in the deck
  deck.addCards(cards.all);
  //No animation here, just get the deck onto the table.
  deck.render({ immediate: true });
  ArrayPlayers.filter(ele=>ele===playerId).map(ele=>{
    myHand = new cards.Hand({
      id: ele,
      faceUp: true,
      y: 400
    });
    playersHand.push(myHand);
  })
  ArrayPlayers.filter(ele=>ele!==playerId).map((ele,index)=>{
    let x;
    let y;
    switch(index){
      case 0 : 
        y=60;
        break;
      case 1 : 
        y=60;
        x=300;
        break;
      case 2 :
        y=400;
        x=200;
        break;
      case 3 :
        y=400;
        x=1000;
        break;   
    }
    let hand = new cards.Hand({
      id : ele,
      faceUp : false,
      y : y,
      x : x
    })
    playersHand.push(hand);
  })
  let nbAsc = 0;
  let nbDesc = 0;
  console.log(deck);
  for(let pile of ArrayPiles){
      let p = new cards.Deck({id : pile._id,faceUp : true});
      if(pile.orientation === "up"){
        p.x += 50 +100*nbDesc++;
        p.addCardPerso(deck.topCard(),1);
      }
      else if(pile.orientation === "down"){
        p.x -= 150 +100*nbAsc++;
        p.addCardPerso(deck.topCard(),0);
      }
      p.click(function() {
        const ind = p.length - 1;
        if (p[ind].el.hasClass("borderPile")) {
          const cardSelected = getCardSelected(myHand);
          // On retire les bordures
          deleteBorderPiles();
          deleteBorderCards();
          putCardOnPile(cardSelected.rank,p.id);
          //p.addCard(cardSelected);
          //p.render();
          //myHand.render();
        }
      });
      piles.unshift(p);
      console.log(piles);
  }

  // Fonction qui initialise les piles et mains des joueurs
  deck.deal(0, playersHand, function() {
    piles.forEach(element => {
      //element.addCard(deck.firstCard());
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
      askWhichColumn(cardValue)
      .then(res=>{
        piles.filter(pile=>res.includes(pile.id)).map(pile=>pile.borderChange(true));
      });
      myHand.borderChange(card, true);
    }
  });
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
    piles.map(pile=>pile.borderChange(false));
  }

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
export function putCard(idPlayer, cardValue, idPile) {
  let player;
  let carte;
  //console.log(playersHand);
  // On cherche la main du joueur à partir de son id
  playersHand.map(element => {
    if (element.id === idPlayer) {
      player = element;
      /* if (element[0].column === 1 && element[0].suit === "0") {
        carte = element[0];
      } else { */
        if(myHand.id!==idPlayer && element[0]!==undefined)
        {
          carte=element[0];
        }
        else{
        element.map(el => {
          if (el.rank === cardValue) {
            carte = el;
          }
        });
      }        
      //}
    }
  });
  console.log(carte);
  console.log(player);
  console.log({idPlayer,cardValue,idPile});
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
export function drawCard(idPlayer, cardValue) {
  console.log({idPlayer,cardValue});
  playersHand.map(element => {
    if (element.id === idPlayer) {
      element.addCardPerso(deck.topCard(), cardValue);
      element.render();
    }
  });
}

export default { init, putCard, drawCard };
