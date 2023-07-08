const field = document.getElementById('field')
const chooseSymbolDiv = document.getElementById('chooseSymbol')
const resultDiv = document.getElementById('result')
const playerScore = document.getElementById('playerScore')
const computerScore = document.getElementById('computerScore')

let playerSymbol
let computerSymbol
let level = 'hard'

let playerCells = []
let computerCells = []
const score = [0,0]

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

function cleanDiv(div){
    while (div.firstChild){
        div.removeChild(div.firstChild)
    }
}

function newGame(){
    cleanDiv(resultDiv)
    cleanDiv(field)
    let h2 = document.createElement('h2')
    h2.textContent = 'Choose difficulty'
    chooseSymbolDiv.appendChild(h2)
    let select = document.createElement('select')
    select.id = 'difficulty'
    let option
    ['easy', 'hard'].forEach(choice => {
        option = document.createElement('option')
        option.textContent = choice
        option.value = choice
        select.appendChild(option)
    })
    chooseSymbolDiv.appendChild(select)

    h2 = document.createElement('h2')
    h2.textContent = 'Choose wich one to play'
    chooseSymbolDiv.appendChild(h2)
    let button
    ['X', 'O'].forEach(element => {
        button = document.createElement('button');
        button.classList.add("symbolButton");
        button.id = `button_${element}`;
        button.type = 'submit';
        button.textContent = element;
        chooseSymbolDiv.appendChild(button)
        button.addEventListener('click', (event) => startGame(element))
    });
}


function startGame(symb){
    let levelChoice = document.getElementById('difficulty')
    level = levelChoice.value
    playerCells = []
    computerCells = []
    playerSymbol = symb
    computerSymbol = playerSymbol === 'X' ? 'O': 'X' 
    cleanDiv(chooseSymbolDiv)
    newField()
    if (computerSymbol === 'X') {
        computerTurn()
    }
    for (i=0; i<9; i++){
        let cell = document.getElementById(`c${i}`)
        cell.addEventListener('click', playerTurn) 
    }
}

function newField(){
    cleanDiv(field)
    for (i=0; i<9; i++){
        let newDiv = document.createElement('div');
        newDiv.classList.add('cell')
        newDiv.id = `c${i}`
        field.appendChild(newDiv)
    }
}

function playerTurn(event){
    cellNum = Number(event.target.id[1])
    if (playerCells.includes(cellNum) || computerCells.includes(cellNum)) {
        return
    } else {
        playerCells.push(cellNum)
        let cell = document.getElementById(`c${cellNum}`)
        cell.textContent = playerSymbol
    }
    if (checkResult()) {return}
    computerTurn()
}

function computerTurnEasy(){
    let cellNum
    do{
        cellNum = Math.floor(Math.random() * 9) 
    } while (playerCells.includes(cellNum) || computerCells.includes(cellNum))
    return cellNum
}

function computerTurnHard(){
    let cellNum
    let combo
    // check if computer has 2 in line and last is empty
    for (combo of winCombos) {

        if (combo.filter(cell => computerCells.includes(cell)).length === 2){
            cellNum = combo.filter (cell => ! computerCells.includes(cell))[0]
            if (! playerCells.includes(cellNum)){
                return cellNum
            }
        }
    }


    // check if player has 2 in line and last is empty
    for (combo of winCombos) {
        if (combo.filter(cell => playerCells.includes(cell)).length === 2){
            cellNum = combo.filter (cell => ! playerCells.includes(cell))[0]
                if (! computerCells.includes(cellNum)){
                    return cellNum
                }
        }
    }

    // check center and corners

    for (let cell of [4,0,2,6,8]) {
        if (! (computerCells.includes(cell) || playerCells.includes(cell))) {
            return cell            
        }
    }

    return computerTurnEasy()

}


function computerTurn(){
    let cellNum
    if (level === "easy"){
        cellNum = computerTurnEasy()
    } else {
        cellNum = computerTurnHard()
    }
    computerCells.push(cellNum)
    let cell = document.getElementById(`c${cellNum}`)
    cell.textContent = computerSymbol
    checkResult()
}

function checkResult() {
    let message
    if (winCombos.some((combo) => combo.every((cell) => playerCells.includes(cell)))){
        message = 'You win!!!'
        score[0] += 1
        playerScore.textContent = score[0]
        
    } else if (winCombos.some((combo) => combo.every((cell) => computerCells.includes(cell)))) {
        message = 'You lose!!!'
        score[1] += 1
        computerScore.textContent = score[1]

    } else if (playerCells.length + computerCells.length > 8) {
        message = 'Draw!!!'

    } else {
        return false
    }

    removeListeners()
    let h1 = document.createElement('h1')
    h1.textContent = message
    resultDiv.appendChild(h1)
    let button = document.createElement('button')
    button.textContent = 'new game'
    button.id='newGame'
    button.addEventListener('click', newGame)
    resultDiv.appendChild(button)
    return true
}

function removeListeners(){
    for (i=0; i<9; i++){
        let cell = document.getElementById(`c${i}`)
        cell.removeEventListener('click', playerTurn)
    }
}

newGame()