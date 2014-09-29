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

        constructor: function () {
            this._addHandler('click', function(event) {
                console.log(event.graphic);
            }, true, true);
        }

    });
});