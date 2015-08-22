/// <reference path="typings/angularjs/angular.d.ts"/>

module DeckValue.Controllers{
	interface IDeckValueControllerScope extends ng.IScope {
		allCards: Array<Card>;
        cards: Array<Card>;
        deck: Deck;
		filterText: string;
		heroes: Array<Hero>;
		heroSelected: boolean;
		selectedHero: Hero;
		
		filterCards: (card: Card) => boolean;
		selectHero: (hero: Hero) => void;
	}
	
	export class DeckValueController{
		constructor(private $scope: IDeckValueControllerScope, dataService, broadcastService) {
			broadcastService.subscribe(broadcastService.events.filterChange, this.$scope, (event, data) => {this.filterChanged(event, data);});
			broadcastService.subscribe(broadcastService.events.addCard, this.$scope, (event, data) => {this.$scope.deck.addToDeck(data);});
			broadcastService.subscribe(broadcastService.events.removeCard, this.$scope, (event, data) => {this.$scope.deck.removeFromDeck(data);});
			
			this.SetupScope(dataService);
		}

		private SetupScope(dataService){
			this.$scope.allCards = new Array<Card>();
			this.$scope.cards = new Array<Card>();
			this.$scope.deck = new Deck();
			this.$scope.filterText = "";
			this.$scope.heroes = dataService.GetHeroes();
			this.$scope.heroSelected = false;
			
			this.$scope.filterCards = (card) => {return this.filterCards(card);}
			this.$scope.selectHero = (hero) => {this.SelectHero(hero);};
			
			dataService.GetCards().then((data) => {
				[].forEach.call( Object.keys(data), ( key ) => {    
						this.ConvertCards(data[key]);
					});
			});
		}
				
		private filterChanged(event: any, filterText: string){
			this.$scope.filterText = filterText;
		}
		
		private filterCards(card: Card): boolean{
			return card.Name.toLowerCase().indexOf(this.$scope.filterText.toLowerCase()) >= 0;
		}
		
		private SelectHero(hero: Hero){
			this.$scope.heroSelected = true;
			this.$scope.selectedHero = hero;
			this.filterByHero(hero.Name);
		}
		
		private filterByHero(name:string){
			 this.$scope.cards = this.$scope.allCards.filter((card: Card) => {
			 	return card.PlayerClass === undefined || card.PlayerClass === name ; 
			 });
		}
		
		private ConvertCards(cardSet){
			cardSet.filter((card) => {
				return this.IsValidCard(card);
			})
			.forEach((card) => {
				this.$scope.allCards.push(new Card(card.attack, card.health, card.cost, card.name, card.playerClass));	
			});
		}
		
		private IsValidCard(card) : boolean{
			return card.collectible && card.type != "Hero";
		}
	}
}

(() => {
	angular.module("app")
		.controller("controller", DeckValue.Controllers.DeckValueController);
})();