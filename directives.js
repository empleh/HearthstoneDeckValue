/// <reference path="typings/angularjs/angular.d.ts"/>
var DeckValue;
(function (DeckValue) {
    var Directives;
    (function (Directives) {
        var FilterDirectiveTemplate = (function () {
            function FilterDirectiveTemplate() {
            }
            FilterDirectiveTemplate.Get = function () {
                return "\n\t\t\t<div class=\"form-group push-down-20\">\n\t\t\t\t<input type=\"text\" placeholder=\"Search\" class=\"form-control\" ng-model=\"filterText\" ng-change=\"updateFilter()\"  />\n\t\t\t</div>\t\t\n\t\t\t";
            };
            return FilterDirectiveTemplate;
        })();
        var FilterDirectiveController = (function () {
            function FilterDirectiveController($scope, broadcastService) {
                var _this = this;
                this.$scope = $scope;
                this.$scope = $scope;
                this.$scope.filterText = "";
                this.$scope.updateFilter = function () { _this.updateFilter(broadcastService); };
            }
            FilterDirectiveController.prototype.updateFilter = function (broadcastService) {
                broadcastService.publish(broadcastService.events.filterChange, this.$scope.filterText);
            };
            return FilterDirectiveController;
        })();
        function FilterDirective() {
            return {
                template: FilterDirectiveTemplate.Get(),
                controller: FilterDirectiveController
            };
        }
        Directives.FilterDirective = FilterDirective;
        var MyDeckDirectiveTemplate = (function () {
            function MyDeckDirectiveTemplate() {
            }
            MyDeckDirectiveTemplate.Get = function () {
                return "\n\t\t\t<div id=\"myDeck\" class=\"col-lg-2 deck hero-{{selectedHero.Style}}\">\n            \t<h2>My {{selectedHero.Name}} Deck ({{deck.Cards.length}}/30)</h2>\n            \t<p ng-repeat=\"card in deck.Cards\">\n\t\t\t\t\t<hdv-card add=\"false\" card=\"card\"></hdv-card>\n\t            </p>\n\t        </div>\t\n\t\t\t";
            };
            return MyDeckDirectiveTemplate;
        })();
        var MyDeckDirectiveLink = (function () {
            function MyDeckDirectiveLink(scope, elem, attributes) {
                this.scope = scope;
                this.scope.myDeckElement = angular.element(document.querySelector("#myDeck"));
            }
            return MyDeckDirectiveLink;
        })();
        var MyDeckDirectiveController = (function () {
            function MyDeckDirectiveController($scope, $window) {
                var _this = this;
                this.$scope = $scope;
                this.topHeightBuffer = 50;
                this.bottomHeightBuffer = 40;
                this.deckElementLoaded = false;
                this.$scope.$watch(function () { return _this.$scope.myDeckElement; }, function () {
                    if (_this.deckElementLoaded)
                        return;
                    _this.deckElementLoaded = true;
                    _this.setupHeight($window);
                });
                angular.element($window).on('resize', function () {
                    _this.setupHeight($window);
                });
            }
            MyDeckDirectiveController.prototype.setupHeight = function ($window) {
                var newHeight = ($window.innerHeight + 10) - (this.topHeightBuffer + this.bottomHeightBuffer);
                this.$scope.myDeckElement.css({ "height": newHeight + "px" });
            };
            return MyDeckDirectiveController;
        })();
        function MyDeckDirective() {
            return {
                template: MyDeckDirectiveTemplate.Get(),
                controller: MyDeckDirectiveController,
                link: MyDeckDirectiveLink
            };
        }
        Directives.MyDeckDirective = MyDeckDirective;
        var CardDirectiveTemplate = (function () {
            function CardDirectiveTemplate() {
            }
            CardDirectiveTemplate.Get = function () {
                return "\n\t\t\t<div class=\"card\" ng-class=\"{ 'card-sm': !add }\">\n\t\t\t\t<span class=\"mana-cost btn nohover noradius\" title=\"Mana Cost\" ng-class=\"add ? 'btn-sm' : 'btn-xs'\">{{card.Mana}}</span>\n            \t{{card.Name}} \n                <span class=\"btn btn-success btn-sm pull-right noradius\" ng-click=\"addToDeck();\" ng-if=\"add\">+</span>\n\t\t\t\t<span class=\"btn btn-danger btn-xs pull-right\" ng-click=\"removeFromDeck();\" ng-if=\"!add\">-</span>\n\t\t\t\t\n\t\t\t\t<span class=\"card-health pull-right btn nohover\" title=\"Health\" ng-class=\"add ? 'btn-sm' : 'btn-xs'\">{{card.Health}}</span>\n\t\t\t\t<span class=\"card-attack pull-right btn nohover\" title=\"Attack\" ng-class=\"add ? 'btn-sm' : 'btn-xs'\">{{card.Attack}}</span>\n\t        </div>\t\n\t\t\t";
            };
            return CardDirectiveTemplate;
        })();
        var CardDirectiveController = (function () {
            function CardDirectiveController($scope, broadcastService) {
                var _this = this;
                this.$scope = $scope;
                this.$scope.addToDeck = function () {
                    broadcastService.publish(broadcastService.events.addCard, _this.$scope.card);
                };
                this.$scope.removeFromDeck = function () {
                    broadcastService.publish(broadcastService.events.removeCard, _this.$scope.card);
                };
            }
            return CardDirectiveController;
        })();
        function CardDirective() {
            return {
                template: CardDirectiveTemplate.Get(),
                controller: CardDirectiveController,
                scope: {
                    add: "=",
                    card: "="
                }
            };
        }
        Directives.CardDirective = CardDirective;
        var WelcomeDirectiveTemplate = (function () {
            function WelcomeDirectiveTemplate() {
            }
            WelcomeDirectiveTemplate.Get = function () {
                return "\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-lg-12\">\n\t\t\t\t\t<h1 class=\"page-header\">\n\t\t\t\t\t\tWelcome to Hearthstone Deck Value Calculator\n\t\t\t\t\t</h1>\n\t\t\t\t\t<p>\n\t\t\t\t\t\tCreate a deck to see how much value it has\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t";
            };
            return WelcomeDirectiveTemplate;
        })();
        function WelcomeDirective() {
            return {
                template: WelcomeDirectiveTemplate.Get()
            };
        }
        Directives.WelcomeDirective = WelcomeDirective;
        var ViewDirectiveController = (function () {
            function ViewDirectiveController($scope, $window, $timeout) {
                var _this = this;
                this.$scope = $scope;
                angular.element($window).on("resize", function () {
                    _this.adjustView($window);
                });
                $timeout(function () {
                    _this.adjustView($window);
                }, 100);
            }
            ViewDirectiveController.prototype.adjustView = function ($window) {
                var dimensions = this.GetViewDimensions(new DeckValue.ViewDimensions(this.$scope.cardContainer[0].offsetWidth, $window.innerWidth, this.$scope.myDeck[0].offsetWidth));
                this.adjustDimensions(dimensions);
            };
            ViewDirectiveController.prototype.adjustDimensions = function (dimensions) {
                this.$scope.cardContainer.css({ "width": dimensions.CardContainerWidth + "px" });
            };
            ViewDirectiveController.prototype.GetViewDimensions = function (input) {
                var output = new DeckValue.ViewDimensions();
                output.CardContainerWidth = input.WindowWidth - input.DeckWidth - 40;
                return output;
            };
            return ViewDirectiveController;
        })();
        Directives.ViewDirectiveController = ViewDirectiveController;
        var ViewDirectiveLink = (function () {
            function ViewDirectiveLink(scope, elem, attributes) {
                this.scope = scope;
                this.scope.cardContainer = angular.element(document.querySelector("#cardContainer"));
                this.scope.myDeck = angular.element(document.querySelector("#myDeck"));
                this.scope.loaded = true;
            }
            return ViewDirectiveLink;
        })();
        function ViewDirective() {
            return {
                controller: ViewDirectiveController,
                link: ViewDirectiveLink
            };
        }
        Directives.ViewDirective = ViewDirective;
    })(Directives = DeckValue.Directives || (DeckValue.Directives = {}));
})(DeckValue || (DeckValue = {}));
(function () {
    angular.module("app")
        .directive("hdvFilter", DeckValue.Directives.FilterDirective)
        .directive("hdvMyDeck", DeckValue.Directives.MyDeckDirective)
        .directive("hdvCard", DeckValue.Directives.CardDirective)
        .directive("hdvWelcome", DeckValue.Directives.WelcomeDirective)
        .directive("hdvView", DeckValue.Directives.ViewDirective);
})();
