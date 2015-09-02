/// <reference path="typings/angularjs/angular.d.ts"/>
var DeckValue;
(function (DeckValue) {
    var Hero = (function () {
        function Hero(name) {
            this.Name = name;
            this.Style = name.toLowerCase();
        }
        return Hero;
    })();
    DeckValue.Hero = Hero;
    var Card = (function () {
        function Card(attack, health, mana, name, playerClass) {
            this.Attack = attack || 0;
            this.Health = health || 0;
            this.Mana = mana || 0;
            this.Name = name;
            this.PlayerClass = playerClass;
            this.Count = 1;
        }
        return Card;
    })();
    DeckValue.Card = Card;
    var Deck = (function () {
        function Deck() {
            this.Cards = new Array();
            this.DisplayCards = new Array();
        }
        Deck.prototype.addToDeck = function (card) {
            if (this.Cards.indexOf(card) > -1) {
                card = angular.copy(card);
            }
            var displayCard = this.DisplayCards.filter(function (c) {
                return c.Name === card.Name;
            })[0];
            if (displayCard) {
                displayCard.Count++;
            }
            else {
                this.DisplayCards.push(angular.copy(card));
            }
            this.Cards.push(card);
            this.calculateStats();
        };
        Deck.prototype.removeFromDeck = function (card) {
            var indexToRemove = this.Cards.indexOf(card);
            this.Cards.splice(indexToRemove, 1);
            var displayed = this.DisplayCards.filter(function (c) {
                return c.Name === card.Name;
            })[0];
            if (displayed.Count > 1) {
                displayed.Count--;
            }
            else {
                var indexDisplayedToRemove = this.DisplayCards.indexOf(displayed);
                this.DisplayCards.splice(indexDisplayedToRemove, 1);
            }
            this.calculateStats();
        };
        Deck.prototype.calculateStats = function () {
            var _this = this;
            this.Health = 0;
            this.Attack = 0;
            this.Mana = 0;
            this.Cards.forEach(function (card) {
                _this.Health += card.Health || 0;
                _this.Attack += card.Attack || 0;
                _this.Mana += card.Mana || 0;
                _this.Curve = _this.Mana / 30;
            });
        };
        return Deck;
    })();
    DeckValue.Deck = Deck;
    var ViewDimensions = (function () {
        function ViewDimensions(cardContainerWidth, windowWidth, deckWidth) {
            this.CardContainerWidth = cardContainerWidth;
            this.WindowWidth = windowWidth;
            this.DeckWidth = deckWidth;
        }
        return ViewDimensions;
    })();
    DeckValue.ViewDimensions = ViewDimensions;
})(DeckValue || (DeckValue = {}));
(function () {
    angular.module("app", ['LocalStorageModule']);
})();
