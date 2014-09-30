/**
 * Created by syachin on 29.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/behavior/editing/MultiPointCreationBehavior",
    "esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/geometry/Polygon"
], function(declare, MultiPointCreationBehavior, Graphic, SimpleFillSymbol, Polygon) {

    return declare(MultiPointCreationBehavior, {

        _startEdit: function() {
            this.graphic = new Graphic(new Polygon(), this.drawingSymbol);
            this.editLayer.add(this.graphic);
        },

        _redraw: function() {
            this.graphic.setGeometry(new Polygon(this.pointArray));
        },

        _save: function() {
            this.editLayer.remove(this.graphic);
            this.resultGraphic = this.graphic;
        },

        constructor: function (map, editLayer, drawingSymbol) {
            this.createLastPointInFirst = true;
            this.editLayer = editLayer;
            if (drawingSymbol) {
                this.drawingSymbol = drawingSymbol;
            } else {
                this.drawingSymbol = new SimpleFillSymbol();
            }
        }

    });
});
