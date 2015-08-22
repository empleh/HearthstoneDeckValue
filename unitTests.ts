    /// <reference path="typings/angularjs/angular.d.ts"/>
    /// <reference path="tsUnit.ts" />
    /// <reference path="app.ts" />
    /// <reference path="directives.ts" />

    module UnitTests {
        export class AdjustViewTests extends tsUnit.TestClass {
            private dimension: DeckValue.ViewDimensions;
            private target = new DeckValue.Directives.ViewDirectiveController(null, null);
            
            constructor() {
                super();
            }
            
            setUp(){
                this.dimension = new DeckValue.ViewDimensions();
            }
            
            CardContainerWidth_Always_FitsIntoViewableSpace(){
                this.dimension.WindowWidth = 2000;
                this.dimension.DeckWidth = 300;
                
                var result = this.target.GetViewDimensions(this.dimension);
                
                this.areIdentical(1660, result.CardContainerWidth);
            }
        }
    }
	
	// new instance of tsUnit - pass in modules that contain test classes
    var test = new tsUnit.Test(UnitTests);

    // TAP output...
    var result = test.run();

    console.log(result);