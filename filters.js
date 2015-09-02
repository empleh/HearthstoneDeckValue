/// <reference path="typings/angularjs/angular.d.ts"/>
var DeckValue;
(function (DeckValue) {
    var Filters;
    (function (Filters) {
        function StackDoublesFilter() {
            return function (cards) {
                var output = new Array();
                cards.forEach(function (card) {
                    var existing = output.filter(function (c) { return c.Name == card.Name; })[0];
                    console.log(existing);
                    if (existing) {
                        existing.Count++;
                    }
                    else {
                        output.push(angular.copy(card));
                    }
                });
                return output;
            };
        }
        Filters.StackDoublesFilter = StackDoublesFilter;
    })(Filters = DeckValue.Filters || (DeckValue.Filters = {}));
})(DeckValue || (DeckValue = {}));
(function () {
    angular.module("app")
        .filter("stackDoubles", DeckValue.Filters.StackDoublesFilter);
})();
