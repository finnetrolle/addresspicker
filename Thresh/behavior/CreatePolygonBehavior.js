/**
 * Created by syachin on 29.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/behavior/Behavior",
    "esri/map",
    "esri/geometry/Polygon",
    "esri/graphic",
    "esri/Color",
    "esri/geometry/Geometry",
    "esri/geometry/Point",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/layers/FeatureLayer",
    "esri/geometry/webMercatorUtils"
], function(declare, Behavior, Map, Polygon, Graphic, Color, Geometry, Point, SimpleFillSymbol, SimpleLineSymbol, FeatureLayer, WebMercatorUtils) {

    return declare(Behavior, {

        constructor: function (map, editLayer) {
            this.layer = editLayer;
            this.map = map;
            this.graphic = null;
            this.pointArray = [];

            var self = this;

            this._addHandler('mouse-up', function (event) {
                if (self.graphic == null) {
                    self.pointArray = [];
                    self._createAndAddGraphic();
                    self.pointArray.push(WebMercatorUtils.xyToLngLat(event.mapPoint.x, event.mapPoint.y));
                }
                self.pointArray.push(WebMercatorUtils.xyToLngLat(event.mapPoint.x, event.mapPoint.y));
                self._redrawEditableElement();
            }, false, false);

            this._addHandler('mouse-move', function (event) {
                if (self.graphic) {
                    self.pointArray[self.pointArray.length-1] =
                        WebMercatorUtils.xyToLngLat(event.mapPoint.x, event.mapPoint.y);
                    self._redrawEditableElement();
                }
            }, true, false);

            this._addHandler('dbl-click', function (event) {
                if (self.graphic) {
                    self.pointArray[self.pointArray.length-1] =
                        WebMercatorUtils.xyToLngLat(event.mapPoint.x, event.mapPoint.y);
                    self.pointArray.push(self.pointArray[0]);
                    self._redrawEditableElement();
                    self.graphic = null;
                }
            }, true, false);
        },

        _createAndAddGraphic: function() {
            this.graphic = new Graphic(new Polygon(), new SimpleFillSymbol());
            this.layer.add(this.graphic);
        },

        _redrawEditableElement: function() {
            this.graphic.setGeometry(new Polygon(this.pointArray));
        }

    });
});