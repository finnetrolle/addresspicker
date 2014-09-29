/**
 * Created by syachin on 26.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/behavior/Behavior",
    "esri/map",
    "esri/geometry/Point",
    "esri/layers/FeatureLayer"
], function(declare, Behavior, Map, Point, FeatureLayer) {

    return declare(Behavior, {

        constructor: function (editLayer) {
            this.layer = editLayer;
            this.selectedObject = null;
            var self = this;

            this._addHandler('mouse-down', function (event) {
                self.selectedObject = event.graphic;
            }, true, false);

            this._addHandler('mouse-up', function () {
                self.selectedObject = null;
            }, true, false);

            this._addHandler('mouse-drag', function() {
                if (self.selectedObject) {

                    self.selectedObject.setGeometry(new Point(event.mapPoint));
                }
            }, true, false);

            this._addHandler('mouse-out', function() {
                self.selectedObject = null;
            });
        }

    });
});