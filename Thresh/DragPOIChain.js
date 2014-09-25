/**
 * Created by syachin on 25.09.2014.
 */
define([
    "dojo/_base/declare",
    "esri/geometry/Point",
    "esri/graphic",
    "Thresh/ListenersChain"
], function(declare, Point, Graphic, ListenersChain) {

    return declare(ListenersChain, {

        constructor: function () {
            this.selectedObject = null;
            var self = this;

            this.addListener('mouse-down', function(event) {
                self.selectedObject = event.graphic;
            });

            this.addListener('mouse-up', function(event) {
                self.selectedObject = null;
            });

            this.addListener('mouse-drag', function(event) {
                if (self.selectedObject) {
                    self.selectedObject.setGeometry(new Point(event.mapPoint));
//                    console.log("xy = [" + self.selectedObject.geometry.x + ';' + self.selectedObject.geometry.y + ']');
                }
            });

//            this.addListener('mouse-move', function(event) {
//                if (self.selectedObject) {
//                    self.selectedObject.setGeometry(new Point(event.mapPoint));
////                    console.log("xy = [" + self.selectedObject.geometry.x + ';' + self.selectedObject.geometry.y + ']');
//                }
//            });
        }

    });
});