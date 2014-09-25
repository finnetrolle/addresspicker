/**
 * Created by syachin on 25.09.2014.
 */
define([
    "dojo/_base/declare",
    "esri/Color",
    "esri/Symbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "Thresh/ListenersChain"
], function(declare, Color, Symbol, SimpleMarkerSymbol, SimpleLineSymbol, ListenersChain) {

    return declare(ListenersChain, {

        constructor: function () {
            this.selectedObject = null;
            var self = this;

            this.addListener('mouse-over', function(event) {
                if (self.selectedObject) {
                    self.selectedObject.setSymbol(new SimpleMarkerSymbol());
                }
                self.selectedObject = event.graphic;
                self.lastColor = self.selectedObject.symbol.color;
                self.selectedObject.setSymbol(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255,0,0]), 1),
                    new Color([0,255,0,0.25])));
            });

            this.addListener('mouse-out', function(event) {
                if (self.selectedObject) {
                    self.selectedObject.setSymbol(new SimpleMarkerSymbol());
                    self.selectedObject = null;
                }
            });
        }

    });
});