/**
 * Created by syachin on 30.09.2014.
 */
define([
    "dojo/_base/declare",
    "../Behavior",
    "esri/geometry/webMercatorUtils"
], function(declare, Behavior, WebMercatorUtils) {

    return declare(Behavior, {

        _startEdit: function() {
            // empty in abstract class
        },

        _redraw: function() {
            // empty in abstract class
        },

        _save: function() {
            // empty in abstract class
        },

        getResultGraphic: function() {
            return this.resultGraphic;
        },

        constructor: function (map) {
            this.singlePoint = null;
            this.map = map;
            this.resultGraphic = null;
            var self = this;

            this._addHandler('mouse-up', function (event) {
                self._startEdit();
                self.singlePoint = WebMercatorUtils.xyToLngLat(event.mapPoint.x, event.mapPoint.y);
                self._redraw();
                self._save();
                self.emit("editComplete");
            }, false, false);
        }

    });
});