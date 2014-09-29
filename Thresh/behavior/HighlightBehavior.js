/**
 * Created by syachin on 26.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/behavior/Behavior",
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/Color",
    "esri/Symbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol"
], function(declare, Behavior, Map, FeatureLayer, Color, Symbol, SimpleMarkerSymbol, SimpleLineSymbol) {

    return declare(Behavior, {

        constructor: function (editLayer) {
            this.layer = editLayer;
            this.selectedGraphic = null,
            this.lastSymbol = null;
            this.highlightedSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                    new Color([0,0,0]), 2),
                new Color([0,255,0,0.25]));
            var self = this;

            var _removeHighlight = function() {
                if (self.selectedGraphic) {
                    self.selectedGraphic.setSymbol(self.lastSymbol);
                    self.selectedGraphic = null;
                }
            };

            this._addHandler('mouse-over', function(event) {
                _removeHighlight();
                self.selectedGraphic = event.graphic;
                self.lastSymbol = self.selectedGraphic.symbol;
                self.selectedGraphic.setSymbol(self.highlightedSymbol);
            }, false, false);

            this._addHandler('mouse-out', function () {
                _removeHighlight();
            }, false, false);

        }

    });
});