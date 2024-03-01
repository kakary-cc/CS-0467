// cards.mjs

const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function range(...args) {
    let start = 0, end, inc = 1;
    switch(args.length) {
        case 1:
            end = args[0];
            break;
        case 2:
            start = args[0];
            end = args[1];
            break;
        case 3:
            start = args[0];
            end = args[1];
            inc = args[2];
            break;
        default:
            throw new Error('Invalid number of arguments');
    }
    const arr = [];
    for (let i = start; i < end; i += inc) {
        arr.push(i);
    }
    return arr;
}

function generateDeck() {
    const deck = [];
    for (const i in suits) {
        for (const j in range(13)) {
            deck.push({'suit': suits[i], 'rank': ranks[j]});
        }
    }
    return deck;
}

function shuffle(deck) {
    const shuffledDeck = [...deck];
    // shuffling algorithm references:
    // https://github.com/DavidSint/card-deck
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
}

function draw(cardsArray, n = 1) {
    const newCardsArray = [...cardsArray], drawn = [];
    for (let i = 0; i < n; i++) {
        drawn.push(newCardsArray.pop());
    }
    return [newCardsArray, drawn];
}

function deal(cardsArray, numHands = 2, cardsPerHand = 5) {
    const ret = {deck: [...cardsArray], hands: []};
    for (let i = 0; i < numHands; i++) {
        let hand = [];
        [ret.deck, hand] = draw(ret.deck, cardsPerHand);
        ret.hands.push(hand);
    }
    return ret;
}

function handToString(hand, sep = '  ', numbers = false) {
    let ret = '';
    hand.forEach((card, i) => {
        ret += (numbers ? (i + 1) + ': ' : '') + card.rank + card.suit;
        if (i !== hand.length - 1) {
            ret += sep;
        }
    });  
    return ret;
}

function matchesAnyProperty(obj, matchObj) {
    for (const i in obj) {
        for (const j in matchObj) {
            if (obj[i] === matchObj[j]) {
                return true;
            }
        }
    }
    return false;
}

function playable(hand, matchObject) {
    for (let i = hand.length - 1; i >= 0; i--) {
        if (matchesAnyProperty(hand[i], matchObject) || hand[i].rank === '8') {
            return true;
        }
    }
    return false;
}

function drawUntilPlayable(deck, matchObject) {
    for (let i = deck.length - 1; i >= 0; i--) {
        if (matchesAnyProperty(deck[i], matchObject) || deck[i].rank === '8') {
            return [deck.slice(0, i), deck.slice(i, deck.length).reverse()];
        }
    }
    return [[], deck.reverse()];
}

export {
    range,
    generateDeck,
    shuffle,
    draw,
    deal,
    handToString,
    matchesAnyProperty,
    playable,
    drawUntilPlayable,
};