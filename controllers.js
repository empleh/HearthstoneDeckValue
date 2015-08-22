/// <reference path="typings/angularjs/angular.d.ts"/>
var DeckValue;
(function (DeckValue) {
    var Controllers;
    (function (Controllers) {
        var DeckValueController = (function () {
            function DeckValueController($scope, dataService, broadcastService) {
                var _this = this;
                this.$scope = $scope;
                broadcastService.subscribe(broadcastService.events.filterChange, this.$scope, function (event, data) { _this.filterChanged(event, data); });
                broadcastService.subscribe(broadcastService.events.addCard, this.$scope, function (event, data) { _this.$scope.deck.addToDeck(data); });
                broadcastService.subscribe(broadcastService.events.removeCard, this.$scope, function (event, data) { _this.$scope.deck.removeFromDeck(data); });
                this.SetupScope(dataService);
            }
            DeckValueController.prototype.SetupScope = function (dataService) {
                var _this = this;
                this.$scope.allCards = new Array();
                this.$scope.cards = new Array();
                this.$scope.deck = new DeckValue.Deck();
                this.$scope.filterText = "";
                this.$scope.heroes = dataService.GetHeroes();
                this.$scope.heroSelected = false;
                this.$scope.filterCards = function (card) { return _this.filterCards(card); };
                this.$scope.selectHero = function (hero) { _this.SelectHero(hero); };
                dataService.GetCards().then(function (data) {
                    [].forEach.call(Object.keys(data), function (key) {
                        _this.ConvertCards(data[key]);
                    });
                });
            };
            DeckValueController.prototype.filterChanged = function (event, filterText) {
                this.$scope.filterText = filterText;
            };
            DeckValueController.prototype.filterCards = function (card) {
                return card.Name.toLowerCase().indexOf(this.$scope.filterText.toLowerCase()) >= 0;
            };
            DeckValueController.prototype.SelectHero = function (hero) {
                this.$scope.heroSelected = true;
                this.$scope.selectedHero = hero;
                this.filterByHero(hero.Name);
            };
            DeckValueController.prototype.filterByHero = function (name) {
                this.$scope.cards = this.$scope.allCards.filter(function (card) {
                    return card.PlayerClass === undefined || card.PlayerClass === name;
                });
            };
            DeckValueController.prototype.ConvertCards = function (cardSet) {
                var _this = this;
                cardSet.filter(function (card) {
                    return _this.IsValidCard(card);
                })
                    .forEach(function (card) {
                    _this.$scope.allCards.push(new DeckValue.Card(card.attack, card.health, card.cost, card.name, card.playerClass));
                });
            };
            DeckValueController.prototype.IsValidCard = function (card) {
                return card.collectible && card.type != "Hero";
            };
            return DeckValueController;
        })();
        Controllers.DeckValueController = DeckValueController;
    })(Controllers = DeckValue.Controllers || (DeckValue.Controllers = {}));
})(DeckValue || (DeckValue = {}));
(function () {
    angular.module("app")
        .controller("controller", DeckValue.Controllers.DeckValueController);
})();
