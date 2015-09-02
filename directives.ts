/// <reference path="typings/angularjs/angular.d.ts"/>

module DeckValue.Directives{
	class FilterDirectiveTemplate{
		public static Get(): string{ 
			return `
			<div class="form-group push-down-20">
				<input type="text" placeholder="Search" class="form-control" ng-model="filterText" ng-change="updateFilter()"  />
			</div>		
			`;
		}
	}
	
	interface IFilterDirectiveScope extends ng.IScope {
		filterText: string;
		updateFilter: () => void;
	}
	
	class FilterDirectiveController{
		constructor(private $scope: IFilterDirectiveScope, broadcastService) {
			this.$scope = $scope;
			this.$scope.filterText = "";
			this.$scope.updateFilter = () => {this.updateFilter(broadcastService);}
		}
		
		private updateFilter(broadcastService){
			broadcastService.publish(broadcastService.events.filterChange, this.$scope.filterText);
		}
	}
	
	export function FilterDirective() : ng.IDirective {
		return {
			template: FilterDirectiveTemplate.Get(),
			controller: FilterDirectiveController
		}
	}
	
	
	class MyDeckDirectiveTemplate{
		public static Get(): string{ 
			return `
			<div id="myDeck" class="col-lg-2 deck hero-{{selectedHero.Style}}">
            	<h2>My {{selectedHero.Name}} Deck ({{deck.Cards.length}}/30)</h2>
            	<p ng-repeat="card in deck.DisplayCards | orderBy:['Mana', 'Name']">
					<hdv-card add="false" card="card"></hdv-card>
	            </p>
	        </div>	
			`;
		}
	}
	
	interface IMyDeckDirectiveScope extends ng.IScope {
		myDeckElement: ng.IAugmentedJQuery
	}
		
	class MyDeckDirectiveLink{
		constructor(private scope: IMyDeckDirectiveScope, elem: ng.IAugmentedJQuery, attributes: ng.IAttributes) {
			this.scope.myDeckElement = angular.element(document.querySelector("#myDeck"));
		}
	}
	
	class MyDeckDirectiveController{
		private topHeightBuffer: number = 50;
		private bottomHeightBuffer: number = 40;
		private deckElementLoaded: boolean = false;
		
		constructor(private $scope: IMyDeckDirectiveScope, $window: ng.IWindowService) {
			this.$scope.$watch(
				() => this.$scope.myDeckElement,
				() => {
						if(this.deckElementLoaded) return;
						
						this.deckElementLoaded = true;
						this.setupHeight($window); 
					} 	
			);
			
			angular.element($window).on('resize', () => {
            	this.setupHeight($window);
        	});
		}
		
		private setupHeight($window: ng.IWindowService): void {
			var newHeight: number = ($window.innerHeight + 10) - (this.topHeightBuffer + this.bottomHeightBuffer);
			
			this.$scope.myDeckElement.css({"height" : newHeight + "px" });
		}
	}
	
	export function MyDeckDirective() : ng.IDirective {
		return{
			template: MyDeckDirectiveTemplate.Get(),
			controller: MyDeckDirectiveController,
			link: MyDeckDirectiveLink
		}
	}
	
	
	class CardDirectiveTemplate{
		public static Get(): string{ 
			return `
			<div class="card" ng-class="{ 'card-sm': !add }">
				<span class="mana-cost btn nohover noradius" title="Mana Cost" ng-class="add ? 'btn-sm' : 'btn-xs'">{{card.Mana}}</span>
            	{{card.Name}} 
				<span ng-if="!add" class="card-count pull-right btn nohover" title="Count" ng-class="add ? 'btn-sm' : 'btn-xs'">x{{card.Count}}</span>
                <span class="btn btn-success btn-sm pull-right noradius" ng-click="addToDeck();" ng-if="add">+</span>
				<span class="btn btn-danger btn-xs pull-right" ng-click="removeFromDeck();" ng-if="!add">-</span>
				
				<span class="card-health pull-right btn nohover" title="Health" ng-class="add ? 'btn-sm' : 'btn-xs'">{{card.Health}}</span>
				<span class="card-attack pull-right btn nohover" title="Attack" ng-class="add ? 'btn-sm' : 'btn-xs'">{{card.Attack}}</span>
	        </div>	
			`;
		}
	}
	
	interface ICardDirectiveScope extends ng.IScope {
		add: boolean;
		card: Card;
		
		addToDeck: () => void;
		removeFromDeck: () => void;
	}
	
	class CardDirectiveController{
		constructor(private $scope: ICardDirectiveScope, broadcastService) {
			this.$scope.addToDeck = () => {
				broadcastService.publish(broadcastService.events.addCard, this.$scope.card);
			}
			this.$scope.removeFromDeck = () => {
				broadcastService.publish(broadcastService.events.removeCard, this.$scope.card);
			}
		}
	}
	
	export function CardDirective() : ng.IDirective {
		return{
			template: CardDirectiveTemplate.Get(),
			controller: CardDirectiveController,
			scope: {
				add: "=",
				card: "="
			}
		}
	}
	
	class WelcomeDirectiveTemplate{
		public static Get(): string{ 
			return `
			<div class="row">
				<div class="col-lg-12">
					<h1 class="page-header">
						Welcome to Hearthstone Deck Value Calculator
					</h1>
					<p>
						Create a deck to see how much value it has
					</p>
				</div>
			</div>
			`;
		}
	}
	
	export function WelcomeDirective() : ng.IDirective {
		return{
			template: WelcomeDirectiveTemplate.Get()
		}
	}
	
	interface IViewDirectiveScope extends ng.IScope {
		cardContainer: ng.IAugmentedJQuery,
		myDeck: ng.IAugmentedJQuery,
		loaded: boolean
	}
	
	export class ViewDirectiveController{
		constructor(private $scope: IViewDirectiveScope, $window: ng.IWindowService, $timeout: ng.ITimeoutService) {
			angular.element($window).on("resize", () => {				
				this.adjustView($window);
        	});
			
			$timeout(() => {
				this.adjustView($window);
			}, 100);
		}
		
		private adjustView($window){
			var dimensions = this.GetViewDimensions(
				new ViewDimensions(
					this.$scope.cardContainer[0].offsetWidth,
					$window.innerWidth,
					this.$scope.myDeck[0].offsetWidth
					)
				);
			
			this.adjustDimensions(dimensions);
		}
		
		private adjustDimensions(dimensions: ViewDimensions){
			this.$scope.cardContainer.css({"width" : dimensions.CardContainerWidth + "px" });
		}
		
		public GetViewDimensions(input: ViewDimensions) : ViewDimensions{
			var output: ViewDimensions = new ViewDimensions();
			
			output.CardContainerWidth = input.WindowWidth - input.DeckWidth - 40;

			return output;
		}
	}
	
	class ViewDirectiveLink{
		constructor(private scope: IViewDirectiveScope, elem: ng.IAugmentedJQuery, attributes: ng.IAttributes) {
			this.scope.cardContainer = angular.element(document.querySelector("#cardContainer"));
			this.scope.myDeck = angular.element(document.querySelector("#myDeck"));
			this.scope.loaded = true;
		}
	}
	
	export function ViewDirective() : ng.IDirective {
		return{
			controller: ViewDirectiveController,
			link: ViewDirectiveLink
		}
	}	
}

(() => {
	angular.module("app")
		.directive("hdvFilter", DeckValue.Directives.FilterDirective)
		.directive("hdvMyDeck", DeckValue.Directives.MyDeckDirective)
		.directive("hdvCard", DeckValue.Directives.CardDirective)
		.directive("hdvWelcome", DeckValue.Directives.WelcomeDirective)
		.directive("hdvView", DeckValue.Directives.ViewDirective);	
})();