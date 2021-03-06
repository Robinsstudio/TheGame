﻿import $ from "jquery";

let paddingCard = 40;

var cards = (function () {
  //The global options
  var opt = {
    cardSize: { width: 155.6, height: 238.6 },
    animationSpeed: 300,
    table: "body",
    cardback: "img/dos.png",
    acesHigh: false,
    cardsUrl: "img/cards.png",
  };
  var zIndexCounter = 100;
  var all = []; //All the cards created.

  function mouseEvent(ev) {
    var card = $(this).data("card");
    if (card.container) {
      var handler = card.container._click;
      if (handler) {
        handler.func.call(handler.context || window, card, ev);
      }
    }
  }

  function init(options) {
    paddingCard = options.widthScreen;
    if (paddingCard < 1450) {
      paddingCard = 45;
    } else if (paddingCard < 1800) {
      paddingCard = 60;
    } else {
      paddingCard = 100;
    }
    while (all.length !== 0) all.pop();
    if (options) {
      for (let i in options) {
        if (opt.hasOwnProperty(i)) {
          opt[i] = options[i];
        }
      }
    }

    opt.table = $(opt.table)[0];
    if ($(opt.table).css("position") === "static") {
      $(opt.table).css("position", "relative");
    }
    let piles = options.piles;
    for (let pile of piles) {
      if (pile.orientation === "down")
        all.unshift(new Card("0", 0, 100, opt.table));
      else all.unshift(new Card("0", 1, 1, opt.table));
    }

    let start = 2;
    let end = 99;

    let line = "0";
    let column = 1;
    for (var i = start; i <= end; i++) {
      all.push(new Card(line, column, i, opt.table));
    }
    $(".card").click(mouseEvent);
  }

  function Card(suit, column, rank, table) {
    this.init(suit, column, rank, table);
  }

  Card.prototype = {
    init: function (suit, column, rank, table) {
      this.shortName = rank;
      this.column = column;
      this.suit = suit;
      this.rank = rank;
      this.name = "carte" + rank;
      this.faceUp = false;
      if (rank >= 0) {
        this.el = $("<div/>")
          .css({
            width:
              this.rank === 1 || this.rank === 100
                ? opt.cardSize.width - 3
                : opt.cardSize.width,
            height: opt.cardSize.height,
            "background-image": "url(" + opt.cardsUrl + ")",
            position: "absolute",
            cursor: "pointer",
          })
          .addClass("card")
          .addClass("miniCard")
          .hover(
            function () {
              if ($(this).hasClass("Visible")) {
                $(this).removeClass("miniCard");
                $(this).addClass("cardHover");
              }
            },
            function () {
              if ($(this).hasClass("Visible")) {
                $(this).removeClass("cardHover");
                $(this).addClass("miniCard");
              }
            }
          )
          .data("card", this)
          .appendTo($(table));
      }
      this.showCard();
      this.moveToFront();
    },

    toString: function () {
      return this.name;
    },

    moveTo: function (x, y, speed, callback) {
      var props = {
        top: y - opt.cardSize.height / 2,
        left: x - opt.cardSize.width / 2,
      };
      $(this.el).animate(props, speed || opt.animationSpeed, callback);
    },

    rotate: function (angle) {
      $(this.el).css("transform", "rotate(" + angle + "deg)");
    },

    showCard: function () {
      var offsets = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
      };
      var xpos, ypos;
      var rank = this.rank;
      var column = this.column;
      xpos = -column * opt.cardSize.width;
      ypos = -offsets[this.suit] * opt.cardSize.height;
      this.rotate(0);
      if (rank >= 0) {
        // Si la carte est dans la main du joueur alors on ajoute la classe Visible pour qu'elle grossisse
        if (this.container instanceof Hand) {
          $(this.el).addClass("Visible");
        } else {
          $(this.el).removeClass("Visible");
        }
        $(this.el).css("background-image", "url(" + opt.cardsUrl + ")");
        $(this.el).css("background-position", xpos + "px " + ypos + "px");
      }
    },

    hideCard: function () {
      $(this.el).removeClass("Visible");
      $(this.el).css("background-image", "url(" + opt.cardback + ")");
      this.rotate(0);
    },

    moveToFront: function () {
      $(this.el).css("z-index", zIndexCounter++);
    },
  };

  function Container() {}

  Container.prototype = [];
  Container.prototype.extend = function (obj) {
    for (var prop in obj) {
      this[prop] = obj[prop];
    }
  };
  Container.prototype.extend({
    addCard: function (card) {
      this.addCards([card]);
    },

    addCardPerso: function (card, cardValue) {
      let line;
      let column;
      if (cardValue > 9) {
        line = cardValue.toString().substring(0, 1);
        column = cardValue % 10;
      } else {
        line = "0";
        column = cardValue;
      }
      card.suit = line;
      card.column = column;
      card.rank = cardValue;
      card.name = "carte" + cardValue;
      $(card.el).removeClass("Visible");
      $(card.el).removeClass("cardHover");
      this.addCards([card]);
    },

    addCards: function (cards) {
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (card.container) {
          card.container.removeCard(card.shortName);
        }
        this.push(card);
        card.container = this;
      }
    },

    removeCard: function (cardValue) {
      for (var i = 0; i < this.length; i++) {
        if (this[i].shortName === cardValue) {
          this.splice(i, 1);
          return true;
        }
      }
      return false;
    },

    init: function (options) {
      options = options || {};
      this.x = options.x || $(opt.table).width() / 2;
      this.y = options.y || $(opt.table).height() / 2;
      this.faceUp = options.faceUp;
      this.id = options.id;
    },

    click: function (func, context) {
      this._click = { func: func, context: context };
    },

    mousedown: function (func, context) {
      this._mousedown = { func: func, context: context };
    },

    mouseup: function (func, context) {
      this._mouseup = { func: func, context: context };
    },

    render: function (options) {
      options = options || {};
      var speed = opt.animationSpeed;
      this.calcPosition(options);
      for (var i = 0; i < this.length; i++) {
        var card = this[i];
        zIndexCounter++;
        card.moveToFront();
        var top = parseInt($(card.el).css("top"));
        var left = parseInt($(card.el).css("left"));
        if (top !== card.targetTop || left !== card.targetLeft) {
          var props = {
            top: card.targetTop,
            left: card.targetLeft,
            queue: false,
          };
          if (options.immediate) {
            $(card.el).css(props);
          } else {
            $(card.el).animate(props, speed);
          }
        }
      }
      var me = this;
      var flip = function () {
        for (var i = 0; i < me.length; i++) {
          if (me.faceUp) {
            me[i].showCard();
          } else {
            me[i].hideCard();
          }
        }
      };
      if (options.immediate) {
        flip();
      } else {
        setTimeout(flip, speed / 2);
      }

      if (options.callback) {
        setTimeout(options.callback, speed);
      }
    },

    // Retourne la carte sur le paquet (donc la dernière du tableau)
    topCard: function () {
      return this[this.length - 1];
    },

    // Retourne la première carte du deck (la carte en dessous du deck)
    firstCard: function () {
      return this[0];
    },
  });

  function Deck(options) {
    this.init(options);
  }

  Deck.prototype = new Container();
  Deck.prototype.extend({
    calcPosition: function (options) {
      options = options || {};
      var left = Math.round(this.x - opt.cardSize.width / 2, 0);
      var top = Math.round(this.y - opt.cardSize.height / 2, 0);
      var condenseCount = 6;
      for (var i = 0; i < this.length; i++) {
        if (i > 0 && i % condenseCount === 0) {
          top -= 1;
          left -= 1;
        }
        this[i].targetTop = top;
        this[i].targetLeft = left;
      }
    },
    // Changement taille de la pile
    borderChange: function (boolean) {
      const ind = this.length - 1;
      if (boolean === false) {
        this[ind].el.addClass("miniCard");
        this[ind].el.removeClass("borderPile");
      } else {
        this[ind].el.addClass("borderPile");
        this[ind].el.removeClass("miniCard");
      }
    },
    deal: function (count, hands, callback) {
      var me = this;
      var i = 0;
      var totalCount = count * hands.length;
      function dealOne() {
        if (me.length === 0 || i === totalCount) {
          if (callback) {
            callback();
          }
          return;
        }
        hands[i % hands.length].addCard(me.topCard());
        hands[i % hands.length].render({
          callback: dealOne,
          speed: opt.animationSpeed,
        });
        i++;
      }
      dealOne();
    },
  });

  function Hand(options) {
    this.init(options);
  }
  Hand.prototype = new Container();
  Hand.prototype.extend({
    // changement de taille pour la carte séléctionnée
    borderChange: function (card, boolean) {
      if (boolean === false) {
        card.el.addClass("miniCard");
        card.el.removeClass("borderCard");
      } else {
        card.el.addClass("borderCard");
        card.el.removeClass("miniCard");
      }
    },
    calcPosition: function (options) {
      options = options || {};
      var width = opt.cardSize.width + (this.length - 1) * paddingCard;
      var left = Math.round(this.x - width / 2);
      var top = Math.round(this.y - opt.cardSize.height / 2, 0);
      for (var i = 0; i < this.length; i++) {
        this[i].targetTop = top;
        this[i].targetLeft = left + i * paddingCard;
      }
    },
  });

  function Pile(options) {
    this.init(options);
  }

  Pile.prototype = new Container();
  Pile.prototype.extend({
    calcPosition: function (options) {
      options = options || {};
    },

    deal: function (count, hands) {
      if (!this.dealCounter) {
        this.dealCounter = count * hands.length;
      }
    },
  });

  function CreateEndDiv() {
    $(".App > div:nth-child(2)").append('<div id="three-container"></div>');
    $(".gameContainer").fadeOut(500, function () {
      $(this).empty();
    });
  }

  return {
    init: init,
    all: all,
    options: opt,
    SIZE: opt.cardSize,
    Card: Card,
    Container: Container,
    Deck: Deck,
    Hand: Hand,
    Pile: Pile,
    CreateEndDiv: CreateEndDiv,
  };
})();

export default cards;
