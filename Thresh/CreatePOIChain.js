/**
 * Created by syachin on 25.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/ListenersChain",
    "esri/layers/FeatureLayer",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/graphic"
], function(declare, ListenersChain, FeatureLayer, Point, SimpleMarkerSymbol, Graphic) {

    return declare(ListenersChain, {

        constructor: function (targetObject, featureLayer) {
            var self = this;
            this.featureLayer = featureLayer;

            this.addListener('click', function(event) {
                if (self.featureLayer.isInstanceOf(FeatureLayer))
                    self.featureLayer.add(new Graphic(new Point(event.mapPoint), new SimpleMarkerSymbol()));
                else
                    console.log('error');
            });
        }

    });
});