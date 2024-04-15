// game.mjs

import { question } from "readline-sync";
import clear from "clear";
import { readFile } from "fs";
import * as cards from "../lib/cards.mjs";

function game(config = null) {
    let deck, playerHand, computerHand, discardPile, nextPlay;
    if (config === null) {
        deck = cards.shuffle(cards.generateDeck());
        ({
            deck: deck,
            hands: [computerHand, playerHand],
        } = cards.deal(deck));
        nextPlay = { suit: "", rank: "8" }; // dummy card
        discardPile = [];
        while (nextPlay.rank === "8") {
            [deck, [nextPlay]] = cards.draw(deck);
            discardPile.push(nextPlay);
        }
    } else {
        deck = config.deck;
        playerHand = config.playerHand;
        computerHand = config.computerHand;
        discardPile = config.discardPile;
        nextPlay = config.nextPlay;
    }

    function displayState() {
        console.log("              CR🤪ZY 8's");
        console.log("-----------------------------------------------");
        console.log(
            "Next suit/rank to play: →  " +
                cards.handToString([nextPlay]) +
                "  ←"
        );
        console.log("-----------------------------------------------");
        console.log(
            "Top of discard pile: " +
                cards.handToString([discardPile[discardPile.length - 1]])
        );
        console.log("Number of cards left in deck: " + deck.length);
        console.log("-----------------------------------------------");
        console.log(
            "🤖✋ (computer hand): " + cards.handToString(computerHand)
        );
        console.log("😊✋ (player hand): " + cards.handToString(playerHand));
        console.log("-----------------------------------------------");
    }

    displayState();
    console.log("😊 Player's turn...");
    if (cards.playable(playerHand, nextPlay)) {
        console.log("Enter the number of the card you would like to play");
        let choice = question(
            cards.handToString(playerHand, "\n", true) + "\n> "
        );
        choice = parseInt(choice);
        if (
            choice > 0 &&
            choice < playerHand.length + 1 &&
            cards.playable([playerHand[choice - 1]], nextPlay)
        ) {
            console.log(
                "\nCard played: " +
                    cards.handToString([playerHand[parseInt(choice) - 1]])
            );
            nextPlay.rank = playerHand[parseInt(choice) - 1].rank;
            nextPlay.suit = playerHand[parseInt(choice) - 1].suit;
            discardPile.push(playerHand[parseInt(choice) - 1]);
            playerHand.splice(parseInt(choice) - 1, 1);
        } else {
            throw new Error("Invalid choice");
        }
    } else {
        console.log("😔 You have no playable cards");
        console.log(
            "Press ENTER to draw cards until matching: %s, %s, 8",
            nextPlay.rank,
            nextPlay.suit
        );
        question("");
        let drawn = [];
        [deck, drawn] = cards.drawUntilPlayable(deck, nextPlay);
        console.log("Cards drawn:" + cards.handToString(drawn));
        console.log(
            "Cards played:" + cards.handToString([drawn[drawn.length - 1]])
        );
        nextPlay.rank = drawn[drawn.length - 1].rank;
        nextPlay.suit = drawn[drawn.length - 1].suit;
        discardPile.push(drawn[drawn.length - 1]);
        playerHand.push(...drawn.slice(0, drawn.length - 1));
    }
    if (nextPlay.rank === "8") {
        console.log("\nCRAZY EIGHTS! You played an 8 - choose a suit\n");
        let choice = question("1: ♠️\n2: ❤️\n3: ♣️\n4: ♦️\n> ");
        choice = parseInt(choice);
        if (choice >= 1 && choice <= 4) {
            nextPlay.suit = ["♠️", "❤️", "♣️", "♦️"][choice - 1];
        } else {
            throw new Error("Invalid choice");
        }
    } else {
        question("Press ENTER to continue\n");
    }
    clear();
    displayState();
    console.log("🤖 Computer's turn...");
    if (cards.playable(computerHand, nextPlay)) {
        for (let i = 0; i < computerHand.length; i++) {
            // computer strategy: first found
            if (cards.playable([computerHand[i]], nextPlay)) {
                console.log(
                    "Card played: " + cards.handToString([computerHand[i]])
                );
                nextPlay.rank = computerHand[i].rank;
                nextPlay.suit = computerHand[i].suit;
                discardPile.push(computerHand[i]);
                computerHand.splice(i, 1);
                break;
            }
        }
    } else {
        console.log("Computer has no playable cards");
        let drawn = [];
        [deck, drawn] = cards.drawUntilPlayable(deck, nextPlay);
        console.log("Cards drawn:" + cards.handToString(drawn));
        console.log(
            "Cards played:" + cards.handToString([drawn[drawn.length - 1]])
        );
        nextPlay.rank = drawn[drawn.length - 1].rank;
        nextPlay.suit = drawn[drawn.length - 1].suit;
        discardPile.push(drawn[drawn.length - 1]);
        computerHand.push(...drawn.slice(0, drawn.length - 1));
    }
    if (nextPlay.rank === "8") {
        // computer crazy 8 strategy: do nothing
        console.log("CRAZY EIGHTS! Computer played an 8");
    }
    question("Press ENTER to continue\n");
    clear();
    displayState();
}

readFile(process.argv[2], "utf8", (err, data) => {
    if (err) {
        console.log("no config file found\n");
        game();
    } else {
        console.log("config file loaded\n");
        const config = JSON.parse(data);
        game(config);
    }
});
