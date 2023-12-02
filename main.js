// Função para gerar uma cartela de Bingo
function generateCard() {
    const playerName = document.getElementById('player-name').value;
    if (!playerName) {
        alert('Por favor, insira seu nome para gerar uma cartela.');
        return;
    }

    const card = generateRandomCard();
    displayCard(playerName, card);
    document.getElementById('player-name').value = '';
}

// Função para gerar uma cartela aleatória
function generateRandomCard() {
    const card = {
        'B': [],
        'I': [],
        'N': [],
        'G': [],
        'O': []
    };

    // Função para gerar números aleatórios sem repetição em um intervalo
    function generateUniqueRandomNumbers(start, end, count) {
        const numbers = new Set();
        while (numbers.size < count) {
            const randomNumber = Math.floor(Math.random() * (end - start + 1)) + start;
            numbers.add(randomNumber);
        }
        return Array.from(numbers);
    }

    card['B'] = generateUniqueRandomNumbers(1, 15, 5);
    card['I'] = generateUniqueRandomNumbers(16, 30, 5);
    card['N'] = generateUniqueRandomNumbers(31, 45, 4); // O espaço do meio será vazio
    card['G'] = generateUniqueRandomNumbers(46, 60, 5);
    card['O'] = generateUniqueRandomNumbers(61, 75, 5);

    // Inserir espaço vazio no meio da coluna N
    const middleIndex = Math.floor(card['N'].length / 2);
    card['N'].splice(middleIndex, 0, 'FREE');

    return card;
}


// Função para gerar números para uma coluna específica
// Função para gerar números para uma coluna específica
function generateColumnNumbers(columnIndex) {
    const columnStart = columnIndex * 15 + 1;
    const columnEnd = columnStart + 14;
    const numbers = [];

    for (let i = columnStart; i <= columnEnd; i++) {
        numbers.push(i);
    }

    return numbers;
}


// Função para exibir uma cartela na tela
function displayCard(playerName, card) {
    const cardsContainer = document.getElementById('bingo-cards');
    const cardTable = document.createElement('table');
    cardTable.classList.add('bingo-card');

    const columns = ['B', 'I', 'N', 'G', 'O'];

    const headerRow = document.createElement('tr');

    for (const column of columns) {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    }
    cardTable.appendChild(headerRow);

    for (let i = 0; i < 5; i++) {
        const row = document.createElement('tr');
        

        for (const column of columns) {
            const td = document.createElement('td');
            td.textContent = card[column][i];
            row.appendChild(td);
        }

        cardTable.appendChild(row);
    }

    const playerNameRow = document.createElement('tr');
    const playerNameCell = document.createElement('td');
    playerNameCell.classList.add('playerName');
    playerNameCell.setAttribute('colspan', '6');
    playerNameCell.textContent = playerName;
    playerNameRow.appendChild(playerNameCell);
    cardTable.appendChild(playerNameRow);

    cardsContainer.appendChild(cardTable);
}




// Variável para armazenar as cartelas geradas
let bingoCards = [];

// Função para iniciar o jogo
function startGame() {
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');   
    
    gameInProgress = true;
    const cards = document.querySelectorAll('.bingo-card');
    if (cards.length < 2) {
        alert('É necessário gerar pelo menos duas cartelas para iniciar o jogo.');
        return;
    }

    restartButton.style.display = 'inline-block';
    startButton.style.display = 'none';
    const gerarButton = document.getElementById('gerar-cartela');
    gerarButton.style.display = 'none';
    bingoCards = cards;

    const drawnNumbers = new Set();
    const maxNumbers = 75;
    const maxDraws = 75;

    const drawNextNumber = () => {
        if (!gameInProgress) {
            return;
        }
        const drawnNumber = Math.floor(Math.random() * maxNumbers) + 1;
        if (!drawnNumbers.has(drawnNumber)) {
            drawnNumbers.add(drawnNumber);
            updateDrawnNumbersList(drawnNumber);
            markNumberInCards(drawnNumber);
            checkWinner();
        }

        if (drawnNumbers.size < maxDraws) {
            setTimeout(drawNextNumber, 10); // Sorteia o próximo número a cada segundo
        } else {
            gameInProgress = false;
        }
    };

    drawNextNumber();
}

// Função para marcar o número sorteado nas cartelas
function markNumberInCards(number) {
    for (const card of bingoCards) {
        const tdElements = card.querySelectorAll('table td:not(.playerName)'); // Seleciona todas as células exceto a primeira coluna (nome do jogador)
        tdElements.forEach(td => {
            if (td.textContent === number.toString()) {
                td.classList.add('marked');
            }
        });
    }
}


// Função para verificar se há um vencedor
// Variável para controlar se o jogo está em andamento
let gameInProgress = true;

// Função para verificar se há um vencedor
function checkWinner() {
    for (const card of bingoCards) {
        const playerNameElement = card.querySelector('table tr:last-child td.playerName');
        if (playerNameElement) {
            const playerName = playerNameElement.textContent;
            const markedCells = card.querySelectorAll('.marked').length;
            if (markedCells === 24) { // Todas as células exceto a célula 'FREE'
                displayWinner(playerName);
                gameInProgress = false;
                break;
            }
        }
    }
}

// Função para exibir o vencedor na tela
function displayWinner(playerName) {
    const restartButton = document.getElementById('restart-button');
    restartButton.style.display = 'inline-block';

    const winnerDisplay = document.createElement('h2');
    winnerDisplay.textContent = `O jogador ${playerName} venceu!`;
    document.body.appendChild(winnerDisplay);
}



// Função para atualizar a lista de números sorteados na tela em uma tabela com 10 colunas
function updateDrawnNumbersList(number) {
    const drawnNumbersTable = document.getElementById('drawn-numbers');
    const lastRow = drawnNumbersTable.rows[drawnNumbersTable.rows.length - 1];

    if (!lastRow || lastRow.cells.length >= 10) {
        const newRow = drawnNumbersTable.insertRow();
        const newCell = newRow.insertCell();
        newCell.textContent = number;
    } else {
        const newCell = lastRow.insertCell();
        newCell.textContent = number;
    }
}

// Função para reiniciar o jogo
function restartGame() {
    const restartButton = document.getElementById('restart-button');
    restartButton.style.display = 'none';

    // Limpa a tela
    const winnerDisplay = document.querySelector('h2');
    if (winnerDisplay) {
        winnerDisplay.remove();
    }

    // Restaura o botão de iniciar
    const startButton = document.getElementById('start-button');
    startButton.style.display = 'inline-block';

    // Restaura o estado inicial do jogo
    resetGame();
}
// Função para reiniciar o jogo
function resetGame() {
    const bingoCardsContainer = document.getElementById('bingo-cards');
    bingoCardsContainer.innerHTML = '';

    const drawnNumbersList = document.getElementById('drawn-numbers');
    drawnNumbersList.innerHTML = '';

    const winnerDisplay = document.querySelector('h2');
    if (winnerDisplay) {
        winnerDisplay.remove();
    }

    const startButton = document.getElementById('start-button');
    startButton.style.display = 'inline-block';

    const gerarButton = document.getElementById('gerar-cartela');
    gerarButton.style.display = 'inline-block';

    const restartButton = document.getElementById('restart-button');
    restartButton.style.display = 'none';

    gameInProgress = false;
    bingoCards = [];
}

