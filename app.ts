/// <reference path="typings/angularjs/angular.d.ts"/>

module DeckValue{
	export class Hero{
		Name: string;
		Style: string;

		constructor(name: string) {
			this.Name = name;
			this.Style = name.toLowerCase();
		}
	}
	
	export class Card{
		Attack: number;
		Health: number;
		Mana: number;
		Name: string;
		PlayerClass: string;
		
		constructor(attack: number, health: number, mana: number, name: string, playerClass: string) {
			this.Attack = attack || 0;
			this.Health = health || 0;
			this.Mana = mana || 0;
			this.Name = name;
			this.PlayerClass = playerClass;
		}
	}
	
	export class Deck{
		Attack: number;
		Curve: number;
		Health: number;
		Mana: number;
		PlayerClass: string;
		
		Cards: Array<Card>;

		constructor() {
			this.Cards = new Array<Card>();
		}
		
		public addToDeck(card){
			if(this.Cards.indexOf(card) > -1){
				card = angular.copy(card);	
			}
			this.Cards.push(card);
			this.calculateStats();
		}
		
		public removeFromDeck(card){
			var indexToRemove = this.Cards.indexOf(card);
			this.Cards.splice(indexToRemove, 1);
		}
		
		private calculateStats(){
			this.Health = 0;
			this.Attack = 0;
			this.Mana = 0;
			
			this.Cards.forEach((card) => {
				this.Health += card.Health || 0;
				this.Attack += card.Attack || 0;
				this.Mana += card.Mana || 0;
				this.Curve = this.Mana / 30;
			});
		}
	}
	
	export class ViewDimensions{
		public CardContainerWidth: number;
		public WindowWidth: number;
		public DeckWidth: number;
		 
		constructor(cardContainerWidth?: number,
					windowWidth?: number,
					deckWidth?: number) {
			this.CardContainerWidth = cardContainerWidth;
			this.WindowWidth = windowWidth;
			this.DeckWidth = deckWidth;
		}
	}
}

(() => {
	angular.module("app", ['LocalStorageModule']);
})();