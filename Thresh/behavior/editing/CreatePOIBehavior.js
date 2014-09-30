/**
 * Created by syachin on 30.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/behavior/editing/SinglePointCreationBehavior",
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/geometry/Point"
], function(declare, SinglePointCreationBehavior, Graphic, SimpleMarkerSymbol, Point) {

    return declare(SinglePointCreationBehavior, {

        _startEdit: function() {
            this.graphic = new Graphic(new Point(), this.drawingSymbol);
            this.editLayer.add(this.graphic);
        },

        _redraw: function() {
            this.graphic.setGeometry(new Point(this.singlePoint));
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
                console.log("own object");
                this.drawingSymbol = new SimpleMarkerSymbol();
            }
        }

    });
});