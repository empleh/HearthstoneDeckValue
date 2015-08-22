/// <reference path="typings/angularjs/angular.d.ts"/>

module DeckValue.Services{
	export class BroadcastService{
		public events: any;
		
		constructor(private $rootScope) {
			this.events = {};
			this.events.addCard = "addCard";
			this.events.filterChange = "filterChange";
			this.events.removeCard = "removeCard";	
		}
		
		public publish(eventName: string, value: any){
			this.$rootScope.$broadcast(eventName, value);
		}
		
		public subscribe(eventName: string, scope: ng.IScope, handler: () => void){
			scope.$on(eventName, handler);
		}
	}
	
	export class DataService{
		constructor(private $q, private localStorageService, private $http) {
			
		}
		
		public GetCards(): ng.IPromise<any> {
			var defer = this.$q.defer();
			
			var key = "cardsApi";
			var cached = this.localStorageService.get(key);
			
			var needsFetched = !cached || !cached.expireDate || new Date(cached.expireDate) < new Date(); 
			if(needsFetched){
				var config = {headers:  {
	        		'X-Mashape-Key': '1dzOiGVbMLmshMnlARnhVF6hVj4Xp1FLyGLjsn2Y9zElAP06ki'
	    			},
					cache: true
				};

				this.$http.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards", config)
			 		.success((result) => {
			 		this.localStorageService.set(key, 
						 {
						 	expireDate: this.addDays(new Date(), 7),	
						 	cards: result
						 });
					 
					 defer.resolve(result);
				});	
			}else{
				defer.resolve(cached.cards);
			}
			
			return defer.promise;
		}
		
		private addDays(date, days) {
    		var result = new Date(date);
    		result.setDate(result.getDate() + days);
    		return result;
		}
		
		public GetHeroes(): Array<Hero>{
			var heroes = new Array<Hero>();
			
			heroes.push(new Hero("Warrior"));
			heroes.push(new Hero("Shaman"));
			heroes.push(new Hero("Rogue"));
			heroes.push(new Hero("Paladin"));
			heroes.push(new Hero("Hunter"));
			heroes.push(new Hero("Druid"));
			heroes.push(new Hero("Warlock"));
			heroes.push(new Hero("Mage"));
			heroes.push(new Hero("Priest"));
				
			return heroes;
		}
	}
}

(() => {
	angular.module("app")
		.service("broadcastService", DeckValue.Services.BroadcastService)
		.service("dataService", DeckValue.Services.DataService);
})();