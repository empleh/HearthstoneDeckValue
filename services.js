/// <reference path="typings/angularjs/angular.d.ts"/>
var DeckValue;
(function (DeckValue) {
    var Services;
    (function (Services) {
        var BroadcastService = (function () {
            function BroadcastService($rootScope) {
                this.$rootScope = $rootScope;
                this.events = {};
                this.events.addCard = "addCard";
                this.events.filterChange = "filterChange";
                this.events.removeCard = "removeCard";
            }
            BroadcastService.prototype.publish = function (eventName, value) {
                this.$rootScope.$broadcast(eventName, value);
            };
            BroadcastService.prototype.subscribe = function (eventName, scope, handler) {
                scope.$on(eventName, handler);
            };
            return BroadcastService;
        })();
        Services.BroadcastService = BroadcastService;
        var DataService = (function () {
            function DataService($q, localStorageService, $http) {
                this.$q = $q;
                this.localStorageService = localStorageService;
                this.$http = $http;
            }
            DataService.prototype.GetCards = function () {
                var _this = this;
                var defer = this.$q.defer();
                var key = "cardsApi";
                var cached = this.localStorageService.get(key);
                var needsFetched = !cached || !cached.expireDate || new Date(cached.expireDate) < new Date();
                if (needsFetched) {
                    var config = { headers: {
                            'X-Mashape-Key': '1dzOiGVbMLmshMnlARnhVF6hVj4Xp1FLyGLjsn2Y9zElAP06ki'
                        },
                        cache: true
                    };
                    this.$http.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards", config)
                        .success(function (result) {
                        _this.localStorageService.set(key, {
                            expireDate: _this.addDays(new Date(), 7),
                            cards: result
                        });
                        defer.resolve(result);
                    });
                }
                else {
                    defer.resolve(cached.cards);
                }
                return defer.promise;
            };
            DataService.prototype.addDays = function (date, days) {
                var result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            };
            DataService.prototype.GetHeroes = function () {
                var heroes = new Array();
                heroes.push(new DeckValue.Hero("Warrior"));
                heroes.push(new DeckValue.Hero("Shaman"));
                heroes.push(new DeckValue.Hero("Rogue"));
                heroes.push(new DeckValue.Hero("Paladin"));
                heroes.push(new DeckValue.Hero("Hunter"));
                heroes.push(new DeckValue.Hero("Druid"));
                heroes.push(new DeckValue.Hero("Warlock"));
                heroes.push(new DeckValue.Hero("Mage"));
                heroes.push(new DeckValue.Hero("Priest"));
                return heroes;
            };
            return DataService;
        })();
        Services.DataService = DataService;
    })(Services = DeckValue.Services || (DeckValue.Services = {}));
})(DeckValue || (DeckValue = {}));
(function () {
    angular.module("app")
        .service("broadcastService", DeckValue.Services.BroadcastService)
        .service("dataService", DeckValue.Services.DataService);
})();
