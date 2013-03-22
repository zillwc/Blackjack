/*
**** Zill Christian
**** CMPT388
*/



/*
******* On Document Ready Function
*/

// Event to start on document loaded
$(function() {
	
	// Initlizing the deck
	Deck = new Stack();
	Dealer = new Stack();
	Hand = new Stack();
	hiddenCard = '<img src="./img/cards/b1fv.png" alt="hidden" class="cards" />';
	log("Stacks initilized");
	wins = 0;
	
	utility = 500;
	log("Player given $500");	
	
	handTotal = 0;
	dealerTotal = 0;
	
  	initDeck();
  	log("Deck Initilized");
  	
  	// Shuffle the deck to introduce randomification
  	shuffleDeck();
  	log("Deck Shuffled");
  	
  	// Show the intro modal
  	$('#init').modal('show');
  	
});





/*
******* Events
*/

// Start the dealing of the cards
$('#startBtn').on('click', function() {
	$('.container').show();
	$('#dealer, #hand').show();
	deal();
});
// The hit event is called
$('#hit').on('click', function() {
	var btnStatus = $(this).attr('disabled');
	if (btnStatus != "disabled") {
		Hand.push(Deck.pop());	
		$(Hand.peek().getHtml()).appendTo('#hand').show('slow');
		isAce(Hand.pop());
		log("Player chose to hit: "+handTotal);
		updateTotals();
	}
	checkMove("p");
});
// The stand event is called
$('#stand').on('click', function() {
	log("Player decided to Stand")
	checkMove("d");
});
var doubleDown = false;
// The double down event is called
$('#dd').on('click', function() {
	updateTotals();
	checkMove("p");
	doubleDown = true;
	log('Player chose Double Down');
	
	// Player gets one final card
	Hand.push(Deck.pop());
	$(Hand.peek().getHtml()).appendTo('#hand').show('slow');
	isAce(Hand.pop());
	
	checkMove("p");
	strategy();
	checkWinner();
	
});
// When the reset buttons are clicked
$('.resetBtn').on('click', function() {
	$('#utility').html(utility);
	log("Player money: "+utility);
	wins = 0;
	
	if (utility <= 0) {
		$('#poor').modal('show');
	}
	if (utility >= 1000) {
		$('#rich').modal('show');
	}

	$('#dealer').html('<legend class="muted">Dealer - <em class="dealerSecret score">?</em><em class="dealerTotal score"></em></legend>');
	$('#hand').html(' <legend class="muted" id="handTitle">Your Hand - <em class="handTotal score"></em></legend>');
	$('#dealerTotal').hide();
	$('.dealerSecret').show();

	Deck.emptyStack();
	Dealer.emptyStack();
	Hand.emptyStack();

	handTotal = 0;
	dealerTotal = 0;
	
	// Init the deck
  	initDeck();
  	log("Deck Initilized");
  	
  	// Shuffle the deck to introduce randomification
  	shuffleDeck();
  	log("Deck Shuffled");
  	
  	deal();
});
// Event to relocate table (reset page)
$('.relocate').click(function() {
	location.reload();
});
// Secret event to show the dealers value
$('.dealerSecret').on('click', function() {
	$(this).hide().delay(3000).fadeIn();
	$('.dealerTotal').fadeIn().delay(2000).fadeOut();
});





/*
******* Init Functions
*/

// Function to initlize the deck as elements
function initDeck() {
	Deck = new Stack();
	DeckVal = new Stack();
  	procFace('c');
  	procFace('h');
  	procFace('s');
  	procFace('d');
}
function procFace(x) {
	var f = getFace(x);
	Deck.push(new Card(1, '<img src="./img/cards/'+x+'1.png" alt="Ace of '+f+'" data-value="1" class="cards" />'));
	Deck.push(new Card(2, '<img src="./img/cards/'+x+'2.png" alt="2 of '+f+'" data-value="2" class="cards" />'));
	Deck.push(new Card(3,'<img src="./img/cards/'+x+'3.png" alt="3 of '+f+'" data-value="3" class="cards" />'));
	Deck.push(new Card(4, '<img src="./img/cards/'+x+'4.png" alt="4 of '+f+'" data-value="4" class="cards" />'));
	Deck.push(new Card(5, '<img src="./img/cards/'+x+'5.png" alt="5 of '+f+'" data-value="5" class="cards" />'));
	Deck.push(new Card(6, '<img src="./img/cards/'+x+'6.png" alt="6 of '+f+'" data-value="6" class="cards" />'));
	Deck.push(new Card(7, '<img src="./img/cards/'+x+'7.png" alt="7 of '+f+'" data-value="7" class="cards" />'));
	Deck.push(new Card(8, '<img src="./img/cards/'+x+'8.png" alt="8 of '+f+'" data-value="8" class="cards" />'));
	Deck.push(new Card(9, '<img src="./img/cards/'+x+'9.png" alt="9 of '+f+'" data-value="9" class="cards" />'));
	Deck.push(new Card(10, '<img src="./img/cards/'+x+'10.png" alt="10 of '+f+'" data-value="10" class="cards" />'));
	Deck.push(new Card(10, '<img src="./img/cards/'+x+'j.png" alt="Jack of '+f+'" data-value="10" class="cards" />'));
	Deck.push(new Card(10, '<img src="./img/cards/'+x+'q.png" alt="Queen of '+f+'" data-value="10" class="cards" />'));
	Deck.push(new Card(10, '<img src="./img/cards/'+x+'k.png" alt="King of '+f+'" data-value="10" class="cards" />'));
}
function getFace(face) {
  if (face == "c") {
    return "Clubs";
  }
  else if (face == "h") {
    return "Hearts";
  }
  else if (face == "s") {
    return "Spades";
  }
  else
    return "Diamonds";
}

// Start dealing the init cards
function deal() {
	log("Dealing Cards");	
	
	// Dealer gets two cards
	Dealer.push(Deck.pop());
	$(hiddenCard).appendTo('#dealer').show('slow');
	//$(Dealer.peek().getHtml()).appendTo('#dealer').show('slow');
	isDealerAce(Dealer.pop());
	
	Dealer.push(Deck.pop());
	$(Dealer.peek().getHtml()).appendTo('#dealer').show('slow');
	isDealerAce(Dealer.pop());
	
	updateTotals();
	
	// Player gets two cards
	Hand.push(Deck.pop());
	$(Hand.peek().getHtml()).appendTo('#hand').show('slow');
	isAce(Hand.pop());

	Hand.push(Deck.pop());	
	$(Hand.peek().getHtml()).appendTo('#hand').show('slow');
	isAce(Hand.pop());
	
	
	// Log both actions to console
	log("Dealer got 2 cards: "+dealerTotal);
	log("Player got 2 cards: "+handTotal);
	
	// Check next move
	checkMove("p");
}






/*
******* Game Core Processes
*/

// Checks if there is a next move
function checkMove(p) {
	updateTotals();
	
	if (p=="d") {
		log("Dealer's Turn");
		if (dealerTotal <= 21) {
				strategy();
				checkWinner();
		} else {
			$('#dealerbust').modal('show');
			utility += 100;
		}
	} else {
		if (handTotal <= 21) {
			log("Player's Turn");
			enableButtons(handTotal);
		} else {
			checkWinner();
		}
	}
}
// Function is the core strategy rule for the dealer
function strategy() {
	if (dealerTotal >= 17) {
		return false;
	}
	if (dealerTotal <= 16) {
		Dealer.push(Deck.pop());
		$(Dealer.peek().getHtml()).appendTo('#dealer').show('slow');
		isDealerAce(Dealer.pop());
		updateTotals();
		log("Dealer hit: "+dealerTotal);
		strategy();
	}
}
// Checks to see who won
function checkWinner() {
	var win = false;

	log("Checking for winner");
	if (dealerTotal > 21) {
		$('#dealerBust').modal('show');
		log("Dealer has bust");
		log("Player Wins.");
		win = true;
		wins++;
		doubleDown = false;
		utility += 100;
	}
	else if (handTotal > 21) {
		$('#youbust').modal('show');
		log("Player has bust");
		log("Dealer Wins.");
		utility -= 100;
		wins--;
	}
	else if (dealerTotal < handTotal) {
		$('#youWin').modal('show');
		log("Player > Dealer");
		log("Player Wins.");
		win = true;
		wins++;
		utility += 100;
	}
	else if (dealerTotal > handTotal) {
		$('#youLose').modal('show');
		log("Dealer > Player");
		log("Dealer Wins.");
		utility -= 100;
		wins--;
	}
	else {
		$('#draw').modal('show');
		log("Dealer = Player");
		log("Noone wins");
		doubleDown = false;
	}
	
	if (wins > 3) {
		log("Dealer = Desperate");
	}
	
	if (doubleDown && win) {
		utility += 100;
		win = false;
		doubleDown = false;
	}
	else if (doubleDown) {
		utility -= 100;
		doubleDown = false;
	}
	
	if (handTotal == 21) {
		utility += 100;
		log("Player got Blackjack");
	}
	
	$('.dealerSecret').hide();
	$('.dealerTotal').show();
}





/*
******* Ace side events
*/

// Function checks whether the card recieved is an Ace
function isAce(card) {
	var val = parseInt(card.getVal());
	if (val==1) {
		noty({
		  text: 'You have received an Ace. What value do you want to give this card?', 
		  buttons: [
		    {addClass: 'btn btn-primary', text: 'ONE', onClick: function($noty) {
			    	// User chose to set as 1
			    	log("Ace set as 1");
			    	Hand.push(card);
			    	updateTotals();
			    	logTotals();
			    	
		        $noty.close();
		      }
		    },
		    {addClass: 'btn btn-danger', text: 'ELEVEN', onClick: function($noty) {
		    		// User chose to set as 11
		    		log("Ace set as 11");
			        card.setVal(11);
			        Hand.push(card);
			        updateTotals();
			        logTotals();
		    
		        $noty.close();
		      }
		    }
		  ]
		});
	} else {
		Hand.push(card);
	}
	
	updateTotals();
}
// Function checks whether the card recieved is an Ace for the dealer
function isDealerAce(card) {
	updateTotals();
	var val = parseInt(card.getVal());
	if (val==1) {
		log("Dealer got an Ace");
		
		if (dealerTotal+11 > 21) {
			log("Ace set as 1");
			Dealer.push(card);
			updateTotals();
			logTotals();
		} else {
			log("Ace set as 11");
			card.setVal(11);
			Dealer.push(card);
			updateTotals();
			logTotals();				
		}
	} else {
		Dealer.push(card);
		updateTotals();
	}
}




/*
******* Minor Logging functions
*/

// Logs message to console
function log(x) {
	$('#console').append('<p>'+x+'</p>');
}
// Updates the hand totals to the console
function updateTotals() {
	handTotal = Hand.getTotal();
	dealerTotal = Dealer.getTotal();
	$('.handTotal').html(handTotal);
	$('.dealerTotal').html(dealerTotal);
	$('#utility').html(utility);
}
// Logs the hand totals to the console
function logTotals() {
	log("\nDealer Hand: "+dealerTotal);
	log("Player Hand: "+handTotal+"\n");		
}
// Enables the buttons
function enableButtons(x) {
	if (isDD(x))
		$('.actions').removeAttr('disabled');
	else
		$('#hit, #stand').removeAttr('disabled');
}
// Disables the buttons
function disableButtons() {
	$('.actions').attr('disabled', 'disabled');
}
// Function that returns true if the value allows Double Down
function isDD(x) {
	return false;
}
// Functions to shuffle the deck
function shuffleDeck() {
	var temp = new Array();
	for (var i=0;i<Deck.getLength();i++) { temp[i] = Deck.pop(); }
	
	temp = shuffle(temp);
	for (var i=0;i<temp.length;i++) { Deck.push(temp[i]); }
}
function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};




/*
******* Objects
*/

// Javascript Object for a card
function Card(val, html) {
	this.html = html;
	this.val = val;
	this.getHtml = function() {
		return this.html;
	}
	this.getVal = function() {
		return this.val;
	}
	this.setHtml = function(h) {
		this.html = h;
	}
	this.setVal = function(v) {
		this.val = v;
	}
}
// Javascript implementation for a stack
function Stack() {
 	this.stac = new Array();
 	this.pop = function() {
	 	return this.stac.pop();
	 }
	this.peek = function() {
		return this.stac[this.stac.length - 1];
	}	 
	this.push = function(item) {
		 this.stac.push(item);
	}
	this.emptyStack = function() {
		if (this.stac.length = 0)
			return
		else {
			for (var i=0;i<this.stac.length;i++)
				this.stac.pop();
		}
		return;
	}
	this.getTotal = function() {
		var total = 0;
		for (var i=0;i<this.stac.length;i++) {
			total += this.stac[i].getVal();
		}
		return total;
	}
	this.getLength = function() {
		return this.stac.length;
	}
}