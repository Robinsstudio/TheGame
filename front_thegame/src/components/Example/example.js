const nbJoueurs = 3
// Tell the library which element to use for the table
cards.init({ table: "#card-table" });

// Créer le deck avec toutes les cartes
deck = new cards.Deck();
// By default it's in the middle of the container, put it slightly to the side
deck.x -= 50;

//cards.all contains all cards, put them all in the deck
deck.addCards(cards.all);
//No animation here, just get the deck onto the table.
deck.render({ immediate: true });

// Now lets create a couple of hands, one face down, one face up.
upperhand = new cards.Hand({ faceUp: false, y: 60, x: 140});
myHand = new cards.Hand({ faceUp: true, y: 340 });
righthand = new cards.Hand({ faceUp: false, y: 340, x: 140 });

// Les piles de cartes
ascendantPile1 = new cards.Deck({ faceUp: true });
ascendantPile2 = new cards.Deck({ faceUp: true });
descendantPile1 = new cards.Deck({ faceUp: true });
descendantPile2 = new cards.Deck({ faceUp: true });
// Le placement des piles de cartes
ascendantPile1.x -= 150;
ascendantPile2.x -= 250;
descendantPile1.x += 50;
descendantPile2.x += 150;

// Fonction qui initialise les decks et mains des joueurs
deck.deal(7, [upperhand, myHand, righthand], 50, function() {
//This is a callback function, called when the dealing is done
  ascendantPile1.addCard(deck.topCard());
  ascendantPile1.render();
  ascendantPile2.addCard(deck.topCard());
  ascendantPile2.render();
  descendantPile1.addCard(deck.topCard());
  descendantPile1.render();
  descendantPile2.addCard(deck.topCard());
  descendantPile2.render();
});
/////////////////////////////////////////////////////////
// Fonction finir le tour du joueur et piocher des cartes
$("#buttonEndTurn").click(function() {
  // On retire toutes les bordures
  deleteBorderCards();
  deleteBorderPiles();
  while(myHand.length<7) {
      myHand.addCard(deck.topCard());
      myHand.render();
    }
});
////////////////////////////////////////////////////
// Fonction pour mettre une carte sur une pile
myHand.click(function(card) {

  // On retire toutes les bordures
  deleteBorderCards();
  deleteBorderPiles();

  ascendantPile1.borderChange(true);
  ascendantPile2.borderChange(true);

  myHand.borderChange(card, true);

  /*
  console.log(deck);
  console.log(ascendantPile1);
  console.log(myHand);
  */

  //ascendantPile1.addCard(card);
  //ascendantPile2.addCard(card);
});
///////////////////////////////////////////////////////////
// Fonction pour vérifier si une carte est déjà sélectionnée
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
  const ind = ascendantPile1.length -1;
  if(ascendantPile1[ind].el.hasClass("borderPile")) {
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
  const ind = ascendantPile2.length -1;
  if(ascendantPile2[ind].el.hasClass("borderPile")) {
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
  const ind = descendantPile1.length -1;
  if(descendantPile1[ind].el.hasClass("borderPile")) {
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
  const ind = descendantPile2.length -1;
  if(descendantPile2[ind].el.hasClass("borderPile")) {
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
    if(card.el.hasClass("borderCard")) {
      cardSelected = card;
    }
  });
  return cardSelected;
}

////////////////////////////////////////////////////////
// Fonction pour mettre une carte d'une main sur une pile
function playerAddCard(pile, main, carte) {
  pile.addCard(carte);
  pile.render();
  main.render();
}

////////////////////////////////////////////////////////
// Fonction pour qu'un autre joueur repioche
function playerEndTurn(main) {
    while(main.length<7) {
      main.addCard(deck.topCard());
      main.render();
    }
}