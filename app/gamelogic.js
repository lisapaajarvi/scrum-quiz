window.addEventListener('load', main)

function main() {
    addEventListeners()
}

function addEventListeners() {
    prepareTheGame()
    countdown()
    
}
// Globala variabler för spelaren

let playerName = localStorage.getItem("player-name")
let playerWins = parseInt(localStorage.getItem("player-wins"))
let playerGames = parseInt(localStorage.getItem("player-games"))
let playerGuesses = 0;
let playerWin = false;

const activeBot = document.querySelectorAll('.bot');
const theGameBotColor = document.querySelector('.figure-2');
const timeLeftP = document.querySelector('.time-left')
let count = 10;
console.log(count)

/**
 * Function that creates an random number between 1-20
 * use "randomNumber()" where you need an random number
*/
randomNumber()
function randomNumber() {
    const randomNr = Math.floor(Math.random() * 20 + 1);

    return randomNr
}

window.addEventListener("keydown", checkKeyPress, false);

function checkKeyPress(key) {    
    let inputControl  = document.querySelector('#number').value;
    console.log(inputControl)

    if (key.keyCode == "13") {
        if(inputControl == "") {
            return
        }
        checkUserInput()
    }    
}

/**
 * Function to prepare theGame with information from localstorage
 */
function prepareTheGame() {
    const botName = document.querySelector('.bot-name')
    const playerNameField = document.querySelector('.player-name')
    let fetchLSBotColor = JSON.parse(localStorage.getItem("bot"))
    playerNameField.innerText = playerName
   
    if (fetchLSBotColor.botColor == 1) {
        theGameBotColor.style.color = "#55a630";
        botName.innerText = "Lätt"
    }
    if (fetchLSBotColor.botColor == 2) {
        theGameBotColor.style.color = "#0072ce";
        botName.innerText = "Medium"
    }
    if (fetchLSBotColor.botColor == 3) {
        theGameBotColor.style.color = "#a4161a";
        botName.innerText = "Svår"
    }
}

/**
 * Function that counts down to zero then it goes over to the bot or back to the player
 */
function countdown() {
    const timeLeftText = timeLeftP.innerText = "Tid kvar: "
    setInterval(() => {
        const countDown = count--
        timeLeftP.innerText = timeLeftText + countDown

        if (countDown === 0) {
            count = 10
            switchPlayer()
           
        }
    }, 1000)
}



////// Globala variabler //////////////
const questionNum = randomNumber();
const answer = document.querySelector('.answer').textContent = " "
let activePlayer = 0;
document.querySelector(`.player--${activePlayer}`).classList.add('activeLight')

document.querySelector('#confirm').addEventListener('click', checkUserInput)

/**
 * Jämför användarens input
 */
function checkUserInput() {
    let input = Number(document.querySelector('#number').value);
    let clearInput = document.querySelector('#number');
    localStorage.setItem("player-answer", JSON.stringify(input))
    
    // console.log(questionNum)
    if (!input || input > 20) {
        document.querySelector('.answer').textContent = "Invalid nummer"
        clearInput.value = '';
    } else if (input === questionNum) {
        document.querySelector('.answer').textContent = "Rätt nummer"
        playerGuesses ++;
        playerWins ++;
        playerGames ++;
        playerWin = true;
        updatePlayerInfoInLS()
        updateBotScore('loss')
     
        console.log("Vunna spel: " + playerWins)
        clearInput.value = '';

        setTimeout(()=>{           
            const endingPage = "./endscreen.html"
            window.open(endingPage, "_self")
        },1000)

    } else if (input !== questionNum) {
        document.querySelector('.answer').textContent = input < questionNum ? "För lågt nummer" : "För högt"
        clearInput.value = '';
        // clearInput.readOnly = true;
        clearInput.classList.add("number-nofocus");
        document.querySelector('#player-bubble').textContent = `${input}`
        playerGuesses ++;
        switchPlayer()
    } else document.querySelector('.answer').textContent = "GAME OVER"
}

/**
 * Botlogic
 * Choose the right bot answer
 */
function BotCompairNum() {
    const clearInput = document.querySelector('#number');
    const botDifficulty = JSON.parse(localStorage.getItem("bot"))    

    if (activePlayer === 1) {

        if(botDifficulty.botColor === 1) {
            botEasy(clearInput)
        }

        else if(botDifficulty.botColor === 2) {
            botNormal(clearInput)
        }

        else if(botDifficulty.botColor === 3) {
            botHard(clearInput)
        }        
    }    
}

/**
 * Function that gives right answer
 * @param {Number} botNum 
 */
function botRightAnswer(botNum) {
    document.querySelector('.answer').textContent = "Boten gissade rätt nummer"
    playerGames ++;
    updatePlayerInfoInLS()
    updateBotScore('win')
    console.log('Comes here 1');
    setTimeout(()=>{           
        const endingPage = "./endscreen.html"
        window.open(endingPage, "_self")
    },1000)
}

/**
 * Function that gives wrong answer
 * @param {Number} botNum 
 * @param {Input} clearInput 
 */
function botWrongAnswer(botNum, clearInput) {
    document.querySelector('.answer').textContent = botNum > questionNum ? "För högt nummer" : "För lågt nummer"
    document.querySelector('#bot-bubble').textContent = ` ${botNum}`
    clearInput.focus();
    clearInput.classList.remove("number-nofocus");
    switchPlayer()
}

/**
 * Function for the easy player
 * @param {Input} clearInput 
 */
function botEasy(clearInput) {
    
        if (questionNum === botNum) {
            botWrongAnswer(botNum, clearInput)
        } else if (questionNum !== botNum) {
            botWrongAnswer(botNum, clearInput)
        } else console.log("gameOver")    
}

/**
 * Function for the normal bot
 * @param {Input} clearInput 
 */
function botNormal(clearInput) {
    let botNum = randomNumber()

    if (questionNum === botNum) {
        botRightAnswer(botNum)
    } else if (questionNum !== botNum) {
        botWrongAnswer(botNum, clearInput)
    } else console.log("gameOver")    
}

/**
 * Function for the hard bot
 * @param {Input} clearInput 
 */
function botHard(clearInput) {
    let textHighLow = document.querySelector('.answer').innerText;
    let playerInput = parseInt(localStorage.getItem("player-answer"))
    let topNumber = 20;
    let botLower = Math.floor(Math.random()*playerInput)+1
    let botHigher = Math.floor(Math.random()*topNumber)+playerInput
    

    if(textHighLow === "För högt") {
        
        if (questionNum === botLower) {
            botRightAnswer()
         }
        else if (questionNum !== botLower) {
            document.querySelector('.answer').textContent = botLower > questionNum ? "För högt nummer" : "För lågt nummer"
            document.querySelector('#bot-bubble').textContent = ` ${botLower}`
            clearInput.focus();
            clearInput.classList.remove("number-nofocus");
            switchPlayer()
        } else console.log("gameOver")    
    } 

    if(textHighLow === "För lågt nummer") {      
        if(botHigher>20) {
            botHard()
        }
        else if(botHigher <=20) {
            if (questionNum === botHigher) {
                botRightAnswer()
             }
            else if (questionNum !== botHigher) {
                document.querySelector('.answer').textContent = botHigher > questionNum ? "För högt nummer" : "För lågt nummer"
                document.querySelector('#bot-bubble').textContent = ` ${botHigher}`
                clearInput.focus();
                clearInput.classList.remove("number-nofocus");
                switchPlayer()
            } else console.log("gameOver")    
        }   
    }    
}

/**
 * tar bort och lägger till activeLight klassen samt kör BotcompairNum funktionen
 */
function switchPlayer() {
    let input = document.querySelector('#number');
    document.querySelector(`.player--${activePlayer}`).classList.remove('activeLight')
    activePlayer = activePlayer === 0 ? 1 : 0
    document.querySelector(`.player--${activePlayer}`).classList.add('activeLight')
    count = 10;
    if(input.readOnly === false) {
        input.readOnly = true;
        input.classList.add("number-nofocus");
    } else if (input.readOnly === true) {
        input.readOnly = false
        input.classList.remove("number-nofocus");
    }
    setTimeout(() => {
        BotCompairNum()
    }, 1000 * (Math.random() * 2 + 4));
}

                       ////////////
                //////////////////////////
//////////////// STANDARDBOT LOGIC SLUT ////////////////////
               //////////////////////////
                    /////////////

                    
// Toggle player speech-bubble
function toggleBubble() {
    let bubbles = document.getElementById("bubble")

    if (bubbles.style.visibility === "hidden") {
        bubbles.style.visibility = "visible";
    }
    else {
        bubbles.style.visibility = "hidden";
    }
}

function updatePlayerInfoInLS() {
    localStorage.setItem("player-wins", playerWins)
    localStorage.setItem("player-games", playerGames)
    localStorage.setItem("player-guesses", playerGuesses)
    localStorage.setItem("player-win",JSON.stringify(playerWin))
}

function updateBotScore(result) {
    let fetchLSBotColor = JSON.parse(localStorage.getItem("bot"))
    console.log('Comes here 3');
    if(result == 'win'){
        if (fetchLSBotColor.botColor == 1) {
            fetchLSBotColor.easyBot.wins += 1 
            fetchLSBotColor.easyBot.games += 1
        }
        if (fetchLSBotColor.botColor == 2) {
            fetchLSBotColor.mediBot.wins += 1 
            fetchLSBotColor.mediBot.games += 1
        }
        if (fetchLSBotColor.botColor == 3) {
            fetchLSBotColor.hardBot.wins += 1 
            fetchLSBotColor.hardBot.games += 1
        }

        localStorage.setItem("bot", JSON.stringify(fetchLSBotColor))

    }else{
        if (fetchLSBotColor.botColor == 1) {
   
            fetchLSBotColor.easyBot.games += 1
        }
        if (fetchLSBotColor.botColor == 2) {
           
            fetchLSBotColor.mediBot.games += 1
        }
        if (fetchLSBotColor.botColor == 3) {
           
            fetchLSBotColor.hardBot.games += 1
        }
        localStorage.setItem("bot", JSON.stringify(fetchLSBotColor))
    }
   
    
}
