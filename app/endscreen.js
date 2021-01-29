window.addEventListener('load', main)

function main() {
    showGameSummary();   
    comparePlayerWithHighscore();
    showHighscore();
    addHighscoreToLS();

}

// Global variables

let playerName = localStorage.getItem("player-name")
let playerWins = parseInt(localStorage.getItem("player-wins"))
let playerGames = parseInt(localStorage.getItem("player-games"))
let playerGuesses = parseInt(localStorage.getItem("player-guesses"))
let highscore = JSON.parse(localStorage.getItem("highscore"))
let playerWin = JSON.parse(localStorage.getItem("player-win"))

/**
 * Function that displays a summary of the game and player statistics
 */
function showGameSummary() {
    if (playerWin === true) {
        document.querySelector('#player').innerHTML = "Grattis " + playerName + "!"
        if (playerGuesses == 1) {
            document.querySelector('#guesses').innerHTML = "Du vann på " + playerGuesses + " gissning."
        }
        else {
        document.querySelector('#guesses').innerHTML = "Du vann på " + playerGuesses + " gissningar."
        }
    }
    else {
        document.querySelector('#player').innerHTML = "Tyvärr, du förlorade!"   
        if (playerGuesses == 1) {
            document.querySelector('#guesses').innerHTML = "Du gissade " + playerGuesses + " gång."
        }
        else {
            document.querySelector('#guesses').innerHTML = "Du gissade " + playerGuesses + " gånger."
        }
     
    }

    document.querySelector('#games').innerHTML = "Antal spelade spel: " + playerGames
    document.querySelector('#wins').innerHTML = "Antal vunna spel: " + playerWins    
}

/**
 * Function that compares the player's score to the highscore
 */
function comparePlayerWithHighscore() {
    let player = {
        name: playerName,
        wins: playerWins,
        games: playerGames,
    }
    
    if (highscore === null || undefined) {
        highscore = [];
        highscore.push(player);
        highscore.push({name: "ingenspelare", wins: 0, games: 0});
        highscore.push({name: "ingenspelare", wins: 0, games: 0});
    }
    else {
        for (let i = 0; i < 3; i++) {
            if (player.wins > highscore[i].wins) {
                if(player.name !== highscore[i].name) {
                    highscore.splice(i, 0, player);
                    if(player.name === highscore[i+2].name) {
                        highscore.splice(i+2, 1)
                    }               
                }
                else {
                    highscore[i].wins = player.wins;
                    highscore[i].games = player.games;
                }
            break;
            }
        }
    }    
}

/**
 * Function that displays highscore top 3
 */
function showHighscore() {
    document.querySelector('#top1').innerHTML = highscore[0].name + ", " + highscore[0].wins + " vunna spel, " + highscore[0].games + " spelade spel";
    if (highscore[1].name !== "ingenspelare") {
        document.querySelector('#top2').innerHTML = highscore[1].name + ", " + highscore[1].wins + " vunna spel, " + highscore[1].games + " spelade spel";
    }
    if (highscore[2].name !== "ingenspelare") {
    document.querySelector('#top3').innerHTML = highscore[2].name + ", " + highscore[2].wins + " vunna spel, " + highscore[2].games + " spelade spel";
    }
}

/**
 * Function that adds the new highscore to local storage
 */
function addHighscoreToLS() {
    localStorage.setItem('highscore',JSON.stringify(highscore));
}