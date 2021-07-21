//VIEW: Handles the view that the user will see (CSS changes, boats appearing or water appearing);


var view = {
    displayMessage: function (msg) { // this function receives a message as parameter
        var msgArea = document.getElementById('messageArea'); // captures the HTML element that will show the message to the player
        msgArea.innerText = msg; // inserts the msg in the HTML element;
    },

    displayHit: function (location) { // this function receives a location as parameter
        var tile = document.getElementById(location); // captures the HTML element that reperesents the tile;
        tile.setAttribute("class", "hit"); // sets the attribute class as hit (CSS);
    },

    displayMiss: function (location) { // // this function also receives a location as a parameter;
        var tile = document.getElementById(location); // captures the HTML element which represents the tile;
        tile.setAttribute("class", "miss"); // sets the attribute class as hit(CSS);

    }

};


// MODEL: Handles the state of the game, generates the ships, handles hits and misses and score;


var model = {
    boardSize: 6,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    guesses: 0,
    finishedGame: false,
    ships: [{
            locations: [0,0,0],
            hits: ["","",""]
        },
        {
            locations: [0,0,0],
            hits: ["","",""]
        },
        {
            locations: [0,0,0],
            hits: ["","",""]
        }
    ],

    fire: function (guess) {    // the fire function, receives the player's guess as parameter
        this.guesses++;
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
               
            if (index >= 0){
                if(ship.hits[index] === "hit"){
                    alert("YOU'VE ALREADY HIT THIS PLACE!");
                    return false;
                }


                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if(this.isSunk(ship)){
                    view.displayMessage("YOU SANK 1 BATTLESHIP!")
                    this.shipsSunk++;
                    if(this.shipsSunk >= 3){
                        view.displayMessage("YOU SANK ALL BATTLESHIPS IN " + this.guesses + " GUESSES!");
                        var startNewGame = confirm("Would you like to play again?")
                        if(startNewGame){
                            this.guesses = 0;
                            this.shipsSunk = 0;
                            document.location.reload(true);
                        }
                        
                    }
                }
                console.log(ship.hits);
            
                return true;
            } 
        
        }
        view.displayMiss(guess);
        view.displayMessage("MISS!");
        return false;

    },

    isSunk: function (ship) { // checks if the boat is sunk
        for (var i =0 ; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;

    },

    generateShip: function(){ // generates the locations for each element (ship) in the ships object;
        var direction = Math.floor(Math.random()*2);
        var row;
        var col;
        var newLocations = [];
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));

           
        } else {
            row = Math.floor(Math.random()* (this.boardSize - this.shipLength));
            col = Math.floor(Math.random()* this.boardSize);
            
        }
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newLocations.push(row + "" + (col+i));
                
            } else {
                newLocations.push((row+i) + "" + col);
                
            }
        }
        return newLocations;
    },

    generateShipLocations: function() { // generates each element(ship) in the ships object;
          var newlocations;
          for (var i = 0 ; i < this.numShips; i++) {
              do {
                  newlocations = this.generateShip();
              } while (this.collision(newlocations));
              this.ships[i].locations = newlocations;
          }
    },

    collision: function(localizations) { // checks for collision (to avoid that a boat is generated above others)
     for(var i = 0; i< this.numShips; i++) {
         var ship = model.ships[i];
         for(var j = 0; j < localizations.length; j++){
             if(ship.locations.indexOf(localizations[j]) >= 0){
                 return true;
             }
         }
     }
     return false;
}

};

var controller = {
    processGuess: function(guess){
        var row = guess.substr(0,1).toUpperCase();
        console.log(row);
        
        var col = guess.substr(1,2);
        var alphabet = ["A", "B", "C", "D", "E", "F"];
        var convertedRow;
        var convertedString;
        
        if(alphabet.indexOf(row) >= 0 && col < 6) {
            convertedRow = alphabet.indexOf(row);
            convertedString = convertedRow +""+ col;
            console.log(convertedString);
            model.fire(convertedString);
            
        } else {
            alert("Please, enter a valid guess.")
        }
            

    }
    


};

function init() {
    model.finishedGame = false;
    var field = document.getElementById("field");
    var fireButton = document.getElementById("fire");
    
    fireButton.addEventListener('click', function(){
        var currentGuess = field.value;
        
        if(currentGuess.length != 2) {
            alert("Please, enter a valid guess!!");
        } else {
            controller.processGuess(currentGuess);
        }
        
    })
    
    if(!model.finishedGame){
        model.generateShipLocations();
    }
    

}
