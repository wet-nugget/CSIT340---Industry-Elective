// ==========================================
// CONSTANTS & CONSTANT DATA
// ==========================================
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = [
                { name: 'Hearts', symbol: '♥' },
                { name: 'Diamonds', symbol: '♦' },
                { name: 'Clubs', symbol: '♣' },
                { name: 'Spades', symbol: '♠' }
            ];

// Globally cached DOM elements matching lab spec IDs/classes
const drawBtn = document.querySelector('#draw-btn');
const p1CardElements = document.querySelectorAll('.p1-card');
const p2CardElements = document.querySelectorAll('.p2-card');
const p1ScoreEl = document.querySelector('#p1-score');
const p2ScoreEl = document.querySelector('#p2-score');
const resultMsgEl = document.querySelector('#result-message');

// ==========================================
// APPLICATION STATE TRACKING
// ==========================================
const gameState = {
  p1Hand: [],
  p2Hand: [],
  p1Score: 0,
  p2Score: 0,
  isDealing: false
};

// ==========================================
// REQUIRED CORE FUNCTIONS (SPEC COMPLIANT)
// ==========================================

/**
 * 1. getRandomCard()
 * Returns a random card object matching the required model structure.
 */
const getRandomCard = () => {
    const randomRankIdx = Math.floor(Math.random() * RANKS.length);
    const randomSuitIdx = Math.floor(Math.random() * SUITS.length);

    const rank = RANKS[randomRankIdx];
    const suitObj = SUITS[randomSuitIdx];

    return {
        rank: rank,
        suit: suitObj.name,
        value: randomRankIdx + 1, // Ace=1, 2-10=value, J=11, Q=12, K=13
        display: `${rank}${suitObj.symbol}`
    };
};

/**
 * 2. generateHand(existingCards)
 * Builds 3 unique cards ensuring no duplicate suit/rank in a round.
 */
const generateHand = (existingCards = []) => {
    const hand = [];
    const drawnSignatures = new Set(existingCards.map(c => `${c.rank}-${c.suit}`));

    while (hand.length < 3) {
        const card = getRandomCard();
        const signature = `${card.rank}-${card.suit}`;

        if (!drawnSignatures.has(signature)) {
        drawnSignatures.add(signature);
        hand.push(card);
        }
    }

    return hand;
};

/**
 * 3. calculateHandValue(hand)
 * Computes pure total using Array.prototype.reduce (matching prof's reference).
 */
const calculateHandValue = hand =>
    hand.reduce((total, card) => total + card.value, 0);

/**
 * 4. determineWinner(value1, value2)
 * Compares total score sums and outputs match state string.
 */
const determineWinner = (value1, value2) => {
    if (value1 > value2) return 'PLAYER_1';
    if (value2 > value1) return 'PLAYER_2';
    return 'DRAW';
};

/**
 * 5. renderHand(hand, cardElements)
 * Display logic updating DOM element text content from card hand data.
 */
const renderHand = (hand, cardElements) => {
    hand.forEach((card, index) => {
        if (cardElements[index]) {
        const cardEl = cardElements[index];
        cardEl.textContent = card ? card.display : '';

        // Color hearts and diamonds red for UI polish
        if (card && (card.suit === 'Hearts' || card.suit === 'Diamonds')) {
            cardEl.classList.add('red-suit');
        } else {
            cardEl.classList.remove('red-suit');
        }
        }
    });
};

/**
 * Helper function to clear cards and reset message status before dealing.
 */
const resetBoardUI = () => {
    p1CardElements.forEach(el => {
        el.textContent = '';
        el.classList.remove('red-suit');
    });
    p2CardElements.forEach(el => {
        el.textContent = '';
        el.classList.remove('red-suit');
    });
    resultMsgEl.textContent = 'Dealing cards...';
};

/**
 * 6. playRound()
 * Coordinates gameplay state, sequential timeouts, calculations, and UI updates.
 */
const playRound = () => {
    if (gameState.isDealing) return;

    // Step 1: Lock button state
    gameState.isDealing = true;
    drawBtn.disabled = true;

    // Step 2: Clear screen
    resetBoardUI();

    // Step 3: Generate hands (guaranteeing 6 unique cards across both players)
    const p1Hand = generateHand();
    const p2Hand = generateHand(p1Hand);

    gameState.p1Hand = p1Hand;
    gameState.p2Hand = p2Hand;

    // Step 4: Map sequential order (P1-C1 -> P1-C2 -> P1-C3 -> P2-C1 -> P2-C2 -> P2-C3)
    const dealQueue = [
        { card: p1Hand[0], element: p1CardElements[0] },
        { card: p1Hand[1], element: p1CardElements[1] },
        { card: p1Hand[2], element: p1CardElements[2] },
        { card: p2Hand[0], element: p2CardElements[0] },
        { card: p2Hand[1], element: p2CardElements[1] },
        { card: p2Hand[2], element: p2CardElements[2] }
    ];

    const DELAY_MS = 250; // Spec requires delay between 100ms - 400ms

    // Sequential visual deal loop
    dealQueue.forEach((step, index) => {
        setTimeout(() => {
        // Render card display
        step.element.textContent = step.card.display;
        if (step.card.suit === 'Hearts' || step.card.suit === 'Diamonds') {
            step.element.classList.add('red-suit');
        }

        // Step 5: Wrap up round on last card deal
        if (index === dealQueue.length - 1) {
            finalizeRound();
        }
        }, (index + 1) * DELAY_MS);
    });
};

/**
 * Calculates results, updates state persistent scores, and re-enables controls.
 */
const finalizeRound = () => {
    const p1Value = calculateHandValue(gameState.p1Hand);
    const p2Value = calculateHandValue(gameState.p2Hand);
    const result = determineWinner(p1Value, p2Value);

    if (result === 'PLAYER_1') {
        gameState.p1Score += 1;
        resultMsgEl.textContent = `Player 1 Wins! (${p1Value} vs ${p2Value})`;
    } else if (result === 'PLAYER_2') {
        gameState.p2Score += 1;
        resultMsgEl.textContent = `Player 2 Wins! (${p2Value} vs ${p1Value})`;
    } else {
        resultMsgEl.textContent = `It's a Draw! (${p1Value} vs ${p2Value})`;
    }

    // Update Scoreboard UI
    p1ScoreEl.textContent = gameState.p1Score;
    p2ScoreEl.textContent = gameState.p2Score;

    // Step 6: Re-enable draw action button
    gameState.isDealing = false;
    drawBtn.disabled = false;
};

// Event Binding
drawBtn.addEventListener('click', playRound);