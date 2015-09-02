/// <reference path="typings/angularjs/angular.d.ts"/>

module DeckValue.Filters{
	export function StackDoublesFilter(){
		return (cards) => {
			var output = new Array<Card>();
			
			cards.forEach((card) => {
				var existing = output.filter((c) => { return c.Name == card.Name})[0];
				
				console.log(existing);
				if(existing){
					existing.Count++;
				}else{
					output.push(angular.copy(card));	
				}
			});
			
			return output;
		}
	}
}

(() => {
	angular.module("app")
		.filter("stackDoubles", DeckValue.Filters.StackDoublesFilter);
})();