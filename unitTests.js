/// <reference path="typings/angularjs/angular.d.ts"/>
/// <reference path="tsUnit.ts" />
/// <reference path="app.ts" />
/// <reference path="directives.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UnitTests;
(function (UnitTests) {
    var AdjustViewTests = (function (_super) {
        __extends(AdjustViewTests, _super);
        function AdjustViewTests() {
            _super.call(this);
            this.target = new DeckValue.Directives.ViewDirectiveController(null, null);
        }
        AdjustViewTests.prototype.setUp = function () {
            this.dimension = new DeckValue.ViewDimensions();
        };
        AdjustViewTests.prototype.CardContainerWidth_Always_FitsIntoViewableSpace = function () {
            this.dimension.WindowWidth = 2000;
            this.dimension.DeckWidth = 300;
            var result = this.target.GetViewDimensions(this.dimension);
            this.areIdentical(1660, result.CardContainerWidth);
        };
        return AdjustViewTests;
    })(tsUnit.TestClass);
    UnitTests.AdjustViewTests = AdjustViewTests;
})(UnitTests || (UnitTests = {}));
// new instance of tsUnit - pass in modules that contain test classes
var test = new tsUnit.Test(UnitTests);
// TAP output...
var result = test.run();
console.log(result);
