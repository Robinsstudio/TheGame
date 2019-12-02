var cards = (function() {
  //The global options
  var opt = {
    cardSize: { width: 69, height: 106, padding: 20 },
    animationSpeed: 100,
    table: "body",
    cardback: "img/dos.png",
    acesHigh: false,
    cardsUrl: "img/carteSolo.png",
    pileAsc: "img/1.png",
    pileDsc: "img/100.png"
  };
  var zIndexCounter = 1;
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
    if (options) {
      for (var i in options) {
        if (opt.hasOwnProperty(i)) {
          opt[i] = options[i];
        }
      }
    }
    var start = 2;
    var end = 99;
    opt.table = $(opt.table)[0];
    if ($(opt.table).css("position") == "static") {
      $(opt.table).css("position", "relative");
    }
    // Création des 4 piles
    all.unshift(new Card("pileDsc1", 100, opt.table));
    all.unshift(new Card("pileDsc2", 100, opt.table));
    all.unshift(new Card("pileAsc1", 1, opt.table));
    all.unshift(new Card("pileAsc2", 1, opt.table));

    for (var i = start; i <= end; i++) {
      all.push(new Card(i, i, opt.table));
    }
    $(".card").click(mouseEvent);
  }

  function Card(suit, rank, table) {
    this.init(suit, rank, table);
  }

  Card.prototype = {
    init: function(suit, rank, table) {
      this.shortName = rank;
      this.suit = suit;
      this.rank = rank;
      this.name = "carte" + rank;
      this.faceUp = false;
      if (rank === 100) {
        this.el = $("<div/>")
          .css({
            width: opt.cardSize.width,
            height: opt.cardSize.height,
            "background-image": "url(" + opt.pileDsc + ")",
            position: "absolute",
            cursor: "pointer"
          })
          .addClass("card")
          .data("card", this)
          .appendTo($(table));
      }
      if (rank === 1) {
        this.el = $("<div/>")
          .css({
            width: opt.cardSize.width,
            height: opt.cardSize.height,
            "background-image": "url(" + opt.pileAsc + ")",
            position: "absolute",
            cursor: "pointer"
          })
          .addClass("card")
          .data("card", this)
          .appendTo($(table));
      }
      if (rank > 1 && rank < 100) {
        this.el = $("<div/>")
          .css({
            width: opt.cardSize.width,
            height: opt.cardSize.height,
            "background-image": "url(" + opt.cardsUrl + ")",
            position: "absolute",
            cursor: "pointer",
            color: "white"
          })
          .addClass("card")
          .data("card", this)
          .text(rank)
          .appendTo($(table));
      }
      this.showCard();
      this.moveToFront();
    },

    toString: function() {
      return this.name;
    },

    moveTo: function(x, y, callback) {
      var props = {
        top: y - opt.cardSize.height / 2,
        left: x - opt.cardSize.width / 2
      };
      $(this.el).animate(props, opt.animationSpeed, callback);
    },

    rotate: function(angle) {
      $(this.el)
        .css("-webkit-transform", "rotate(" + angle + "deg)")
        .css("-moz-transform", "rotate(" + angle + "deg)")
        .css("-ms-transform", "rotate(" + angle + "deg)")
        .css("transform", "rotate(" + angle + "deg)")
        .css("-o-transform", "rotate(" + angle + "deg)");
    },

    showCard: function() {
      var offsets = {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9
      };
      //var xpos, ypos;
      var rank = this.rank;
      //xpos = -rank * opt.cardSize.width;
      //ypos = -offsets[this.suit] * opt.cardSize.height;
      this.rotate(0);
      if (rank === 100) {
        $(this.el).css("background-image", "url(" + opt.pileDsc + ")");
      }
      if (rank === 1) {
        $(this.el).css("background-image", "url(" + opt.pileAsc + ")");
      }
      if (rank > 1 && rank < 100) {
        $(this.el).css("background-image", "url(" + opt.cardsUrl + ")");
        $(this.el).text(rank);
        //$(this.el).css('background-position', xpos + 'px ' + ypos + 'px');
      }
    },

    hideCard: function(position) {
      $(this.el).css("background-image", "url(" + opt.cardback + ")");
      $(this.el).text("");
      this.rotate(0);
    },

    moveToFront: function() {
      $(this.el).css("z-index", zIndexCounter++);
    }
  };

  function Container() {}

  Container.prototype = new Array();
  Container.prototype.extend = function(obj) {
    for (var prop in obj) {
      this[prop] = obj[prop];
    }
  };
  Container.prototype.extend({
    addCard: function(card) {
      this.addCards([card]);
    },

    addCards: function(cards) {
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (card.container) {
          card.container.removeCard(card);
        }
        this.push(card);
        card.container = this;
      }
    },

    removeCard: function(card) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == card) {
          this.splice(i, 1);
          return true;
        }
      }
      return false;
    },

    init: function(options) {
      options = options || {};
      this.x = options.x || $(opt.table).width() / 2;
      this.y = options.y || $(opt.table).height() / 2;
      this.faceUp = options.faceUp;
    },

    click: function(func, context) {
      this._click = { func: func, context: context };
    },

    mousedown: function(func, context) {
      this._mousedown = { func: func, context: context };
    },

    mouseup: function(func, context) {
      this._mouseup = { func: func, context: context };
    },

    render: function(options) {
      options = options || {};
      var speed = opt.animationSpeed;
      this.calcPosition(options);
      for (var i = 0; i < this.length; i++) {
        var card = this[i];
        zIndexCounter++;
        card.moveToFront();
        var top = parseInt($(card.el).css("top"));
        var left = parseInt($(card.el).css("left"));
        if (top != card.targetTop || left != card.targetLeft) {
          var props = {
            top: card.targetTop,
            left: card.targetLeft,
            queue: false
          };
          if (options.immediate) {
            $(card.el).css(props);
          } else {
            $(card.el).animate(props, speed);
          }
        }
      }
      var me = this;
      var flip = function() {
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
    topCard: function() {
      return this[this.length - 1];
    },

    // Retourne la première carte du deck (la carte en dessous du deck)
    firstCard: function() {
      return this[0];
    },

    toString: function() {
      return "Container";
    }
  });

  function Deck(options) {
    this.init(options);
  }

  Deck.prototype = new Container();
  Deck.prototype.extend({
    calcPosition: function(options) {
      options = options || {};
      var left = Math.round(this.x - opt.cardSize.width / 2, 0);
      var top = Math.round(this.y - opt.cardSize.height / 2, 0);
      var condenseCount = 6;
      for (var i = 0; i < this.length; i++) {
        if (i > 0 && i % condenseCount == 0) {
          top -= 1;
          left -= 1;
        }
        this[i].targetTop = top;
        this[i].targetLeft = left;
      }
    },

    toString: function() {
      return "Deck";
    },
    // Changement taille de la pile
    borderChange: function(boolean) {
      const ind = this.length - 1;
      if (boolean === false) {
        this[ind].el.removeClass("borderPile");
      } else {
        this[ind].el.addClass("borderPile");
      }
    },

    deal: function(count, hands, callback) {
      var me = this;
      var i = 0;
      // le nombre de joueurs x le nombre de cartes par joueurs
      var totalCount = count * hands.length;
      function dealOne() {
        if (me.length == 0 || i == totalCount) {
          if (callback) {
            callback();
          }
          return;
        }
        hands[i % hands.length].addCard(me.topCard());
        hands[i % hands.length].render({
          callback: dealOne,
          speed: opt.animationSpeed
        });
        i++;
      }
      dealOne();
    }
  });

  function Hand(options) {
    this.init(options);
  }
  Hand.prototype = new Container();
  Hand.prototype.extend({
    calcPosition: function(options) {
      options = options || {};
      var width = opt.cardSize.width + (this.length - 1) * opt.cardSize.padding;
      var left = Math.round(this.x - width / 2);
      var top = Math.round(this.y - opt.cardSize.height / 2, 0);
      for (var i = 0; i < this.length; i++) {
        this[i].targetTop = top;
        this[i].targetLeft = left + i * opt.cardSize.padding;
      }
    },
    // changement de taille pour la carte séléctionnée
    borderChange: function(card, boolean) {
      if (boolean === false) {
        card.el.removeClass("borderCard");
      } else {
        card.el.addClass("borderCard");
      }
    }
  });

  function Pile(options) {
    this.init(options);
  }

  Pile.prototype = new Container();
  Pile.prototype.extend({
    calcPosition: function(options) {
      options = options || {};
    },

    deal: function(count, hands) {
      if (!this.dealCounter) {
        this.dealCounter = count * hands.length;
      }
    }
  });

  return {
    init: init,
    all: all,
    options: opt,
    SIZE: opt.cardSize,
    Card: Card,
    Container: Container,
    Deck: Deck,
    Hand: Hand,
    Pile: Pile
  };
})();

if (typeof module !== "undefined") {
  module.exports = cards;
}
