/**
 * Created by syachin on 26.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/behavior/Behavior",
    "esri/map",
    "esri/geometry/Point",
    "esri/geometry/webMercatorUtils"
], function(declare, Behavior, Map, Point, WebMercatorUtils) {

    return declare(Behavior, {

        constructor: function (editLayer) {
            this.layer = editLayer;
            this.x = null;
            this.y = null;
            this.selectedObject = null;
            var self = this;

            this._addHandler('mouse-down', function (event) {
                self.selectedObject = event.graphic;
                self.x = event.mapPoint.x;
                self.y = event.mapPoint.y;
            }, false, false);

            this._addHandler('mouse-up', function (event) {
                self.selectedObject = null;
                self.x = null;
                self.y = null;
            }, false, false);

            this._addHandler('mouse-drag', function(event) {
                if (self.selectedObject) {
                    console.log('dragging');
                    var x = event.mapPoint.x;
                    var y = event.mapPoint.y;
                    var dx = x - self.x;
                    var dy = y - self.y;
                    self.x = x;
                    self.y = y;
                    var geo = self.selectedObject.geometry;
                    self._moveGeometry(geo, dx, dy);
                    self.selectedObject.setGeometry(geo);
                }
            }, true, false);

            this._addHandler('mouse-out', function(event) {
                self.selectedObject = null;
                self.x = null;
                self.y = null;
            });
        },

        _getMovedPoint: function(point, dx, dy) {
            var xy = WebMercatorUtils.lngLatToXY(point.x, point.y);
            xy[0] += dx;
            xy[1] += dy;
            return new Point(WebMercatorUtils.xyToLngLat(xy[0], xy[1]));
        },

        _movePoint: function(pointGeometry, dx, dy) { // not tested
            var p = this._getMovedPoint(pointGeometry, dx, dy);
            pointGeometry.setX(p.x);
            pointGeometry.setY(p.y);
        },

        _movePolylineGeometry: function(polylineGeometry, dx, dy) { // not tested
            var paths = polylineGeometry.paths;
            for (var i = 0; i < paths.length; ++i) {
                var points = paths[i];
                for (var j = 0; j < points.length; ++j) {
                    var point = polylineGeometry.getPoint(i, j);
                    var p = this._getMovedPoint(point, dx, dy);
                    polylineGeometry.setPoint(i, j, p);
                }
            }
        },

        _movePolygonGeometry: function(polygonGeometry, dx, dy) {
            var rings = polygonGeometry.rings;
            for (var i = 0; i < rings.length; ++i) {
                var points = rings[i];
                for (var j = 0; j < points.length; ++j) {
                    var point = polygonGeometry.getPoint(i, j);
                    var p = this._getMovedPoint(point, dx, dy);
                    polygonGeometry.setPoint(i, j, p);
                }
            }
        },

        _moveGeometry: function(geometry, dx, dy) {
            switch (geometry.type) {
                case 'point': this._movePoint(geometry, dx, dy); break;
                case 'polyline': this._movePolylineGeometry(geometry, dx, dy); break;
                case 'polygon': this._movePolygonGeometry(geometry, dx, dy); break;
            }
        }

    });
});