/**
 * Created by syachin on 30.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/behavior/editing/MultiPointCreationBehavior",
    "esri/graphic",
    "esri/symbols/SimpleLineSymbol",
    "esri/geometry/Polyline"
], function(declare, MultiPointCreationBehavior, Graphic, SimpleLineSymbol, Polyline) {

    return declare(MultiPointCreationBehavior, {

        _startEdit: function() {
            this.graphic = new Graphic(new Polyline(), this.drawingSymbol);
            this.editLayer.add(this.graphic);
        },

        _redraw: function() {
            this.graphic.setGeometry(new Polyline(this.pointArray));
        },

        _save: function() {
            this.editLayer.remove(this.graphic);
            this.resultGraphic = this.graphic;
        },

        constructor: function (map, editLayer, drawingSymbol) {
            this.editLayer = editLayer;
            if (drawingSymbol) {
                this.drawingSymbol = drawingSymbol;
            } else {
                this.drawingSymbol = new SimpleLineSymbol();
            }
        }

    });
});