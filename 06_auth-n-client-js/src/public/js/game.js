const cardValue = {
    A: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
};

function newCard(suit, rank) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = suit + rank;
    return card;
}

function newDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
    ];
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(newCard(suit, rank));
        }
    }
    return deck;
}

function newHand(playerName) {
    const hand = document.createElement("div");
    hand.classList.add("hand");
    hand.appendChild(document.createElement("p"));
    hand.childNodes[0].textContent = `${playerName} Hand`;
    hand.appendChild(document.createElement("div"));
    hand.totalVal = 0;
    hand.addCard = (card, secret) => {
        hand.totalVal += cardValue[card.textContent.slice(1)];
        hand.childNodes[0].textContent = `${playerName} Hand - Total: ${hand.totalVal}`;
        if (secret) {
            card.classList.add("secret");
            hand.childNodes[0].textContent = `${playerName} Hand - Total: ?`;
        }
        hand.childNodes[1].appendChild(card);
    };
    hand.reveal = () => {
        hand.childNodes[0].textContent = `${playerName} Hand - Total: ${hand.totalVal}`;
        hand.childNodes[1].childNodes.forEach((card) => {
            card.classList.remove("secret");
        });
    };
    return hand;
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

let startValues;
const deck = shuffle(newDeck());

document.querySelector(".playBtn").addEventListener("click", (evt) => {
    evt.preventDefault();
    document.querySelector(".start").classList.add("hidden");
    startValues = document.getElementById("startValues").value;
    if (startValues !== "") {
        startValues = startValues.trim().split(",");
        console.log("Start values: ", startValues);
        for (let i = 0; i < startValues.length; i++) {
            for (let j = deck.length - 1; j >= 0; j--) {
                if (startValues[i] === deck[j].textContent.slice(1)) {
                    [deck[i], deck[j]] = [deck[j], deck[i]];
                    break;
                }
            }
        }
        deck.reverse();
    }

    const [computer, player] = [newHand("Computer"), newHand("Player")];
    document.querySelector("body").appendChild(computer);
    document.querySelector("body").appendChild(player);

    computer.addCard(deck.pop());
    player.addCard(deck.pop());
    computer.addCard(deck.pop(), true);
    player.addCard(deck.pop());

    const hitBtn = document.createElement("button");
    hitBtn.textContent = "Hit";
    hitBtn.classList.add("btns");
    hitBtn.addEventListener("click", () => {
        document.querySelectorAll(".btns").forEach((btn) => {
            btn.classList.add("hidden");
        });
        if (computer.totalVal < 18) {
            alert("💻Computer decides to hit!");
            computer.addCard(deck.pop(), true);
            if (computer.totalVal > 21) {
                alert("🎉Player wins!");
                computer.reveal();
                return;
            }
        }
        else {
            alert("💻Computer decides to stand.");
        }
        player.addCard(deck.pop());
        if (player.totalVal > 21) {
            alert("💻Computer wins!");
            computer.reveal();
            return;
        }
    });
    document.querySelector("body").appendChild(hitBtn);

    const stdBtn = document.createElement("button");
    stdBtn.textContent = "Stand";
    stdBtn.classList.add("btns");
    stdBtn.addEventListener("click", () => {
        document.querySelectorAll(".btns").forEach((btn) => {
            btn.classList.add("hidden");
        });
        if (computer.totalVal < 18) {
            alert("💻Computer decides to hit!");
            computer.addCard(deck.pop(), true);
            if (computer.totalVal > 21) {
                alert("🎉Player wins!");
                computer.reveal();
                return;
            }
        }
        else {
            alert("💻Computer decides to stand.");
        }
    });
    document.querySelector("body").appendChild(stdBtn);
});
