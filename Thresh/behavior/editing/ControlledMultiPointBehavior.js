/**
 * Created by syachin on 01.10.2014.
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
            this.pointArray = [];
            this.map = map;
            this.createLastPointInFirst = false;
            this.resultGraphic = null;
            var self = this;

            this._addHandler('mouse-up', function (event) {
                if (self.pointArray.length == 0) {
                    self._action_createFirstPoint(event);
                }
                self._action_createNextPoint(event);
                self._action_redraw();
            }, false, false);

            this._addHandler('mouse-up', function (event) {
                if (self.pointArray.length == 0) {
                    self.pointArray.push(WebMercatorUtils.xyToLngLat(event.mapPoint.x, event.mapPoint.y));
                    self._startEdit();
                }
                self.pointArray.push(WebMercatorUtils.xyToLngLat(event.mapPoint.x, event.mapPoint.y));
                self._redraw();
            }, false, false);

            this._addHandler('mouse-move', function (event) {
                if (self.pointArray.length > 0) {
                    self.pointArray[self.pointArray.length-1] =
                        WebMercatorUtils.xyToLngLat(event.mapPoint.x, event.mapPoint.y);
                    self._redraw();
                }
            }, true, false);

            this._addHandler('dbl-click', function (event) {
                if (self.pointArray.length > 0) {
                    self.pointArray[self.pointArray.length-1] =
                        WebMercatorUtils.xyToLngLat(event.mapPoint.x, event.mapPoint.y);
                    if (self.createLastPointInFirst) {
                        self.pointArray.push(self.pointArray[0]);
                    }
                    self._redraw();
                    self._save();
                    self.emit("editComplete");
                    self.pointArray = [];
                }
            }, true, false);
        }

    });
});