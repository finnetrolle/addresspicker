/**
 * Created by syachin on 25.09.2014.
 */
define([
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/on",

    "esri/map",
    "esri/layers/FeatureLayer",

//    "esri/geometry/Point",
//    "esri/symbols/SimpleMarkerSymbol",
//    "esri/graphic",

    "Thresh/behavior/BehaviorModel",
    "Thresh/behavior/HighlightBehavior",
    "Thresh/behavior/MoveBehavior",
    "Thresh/behavior/EventsFromArrayLogBehavior",
    "Thresh/behavior/editing/CreatePolygonBehavior",
    "Thresh/behavior/editing/CreatePolylineBehavior",
    "Thresh/behavior/editing/CreatePOIBehavior",

//    "esri/geometry/Polygon",
//    "esri/Color",
//    "esri/geometry/Geometry",
//    "esri/symbols/SimpleFillSymbol",
//    "esri/symbols/SimpleLineSymbol",

    "dojo/domReady!"
], function(declare, dom, on,
            Map, FeatureLayer,
//            Point, SimpleMarkerSymbol, Graphic,
            BehaviorModel, HighlightBehavior, MoveBehavior, EFALBehavior,
            CreatePolygonBehavior, CreatePolylineBehavior,
            CreatePOIBehavior
//            Polygon, Color, Geometry, SimpleFillSymbol, SimpleLineSymbol
    ){
    return declare(null, {

        map: null,

        constructor: function(mapId) {
            this.map = new Map("map", {
                center: [30, 59],
                zoom: 3,
                basemap: "satellite"
            });

            // create layer for drawing new objects with no handlers
            this.editLayer = this.createEditLayer();
            // create layer for saving drawed objects in
            this.saveLayer = this.createEditLayer();

            this.map.addLayer(this.saveLayer);
            this.map.addLayer(this.editLayer);

            var self = this;

            // add behavior model and behaviors for saveLayer
            this.saveLayerBehaviorModel = new BehaviorModel(this.saveLayer);
            this.saveLayerHighlightBehavior = new HighlightBehavior(this.saveLayer);
            this.saveLayerBehaviorModel.addBehavior(this.saveLayerHighlightBehavior);

            // add behavior model for map
            this.mapBehaviorModel = new BehaviorModel(this.map);

            // create behaviors for map
            this.createPOIBehavior = new CreatePOIBehavior(this.map, this.editLayer);
            on(this.createPOIBehavior, 'editComplete', function() {
                self.saveLayer.add(self.createPOIBehavior.getResultGraphic());
            });

            this.createPolygonBehavior = new CreatePolygonBehavior(this.map, this.editLayer);
            on(this.createPolygonBehavior, 'editComplete', function() {
                self.saveLayer.add(self.createPolygonBehavior.getResultGraphic());
            });

            this.createPolylineBehavior = new CreatePolylineBehavior(this.map, this.editLayer);
            on(this.createPolylineBehavior, 'editComplete', function() {
                self.saveLayer.add(self.createPolylineBehavior.getResultGraphic());
            });

            // tools connection
//            this.mapBehaviorModel.addBehavior(this.createPOIBehavior);
            this.mapBehaviorModel.addBehavior(this.createPolygonBehavior);
//            this.mapBehaviorModel.addBehavior(this.createPolylineBehavior);



//            this.efal = new EFALBehavior([
//                'mouse-move',
//                'mouse-over',
//                'mouse-out',
//                'mouse-drag',
//                'mouse-up',
//                'mouse-down',
//                'click',
//                'dbl-click'
//            ],false);
//            this.editLayerBehaviorModel.addBehavior(this.efal);

        },

        createEditLayer: function() {
            var layerDefinition = {
                "geometryType": "esriGeometryPolygon",
                "fields": [{
                    "name": "BUFF_DIST",
                    "type": "esriFieldTypeInteger",
                    "alias": "Buffer Distance"
                }]
            }
            var featureCollection = {
                layerDefinition: layerDefinition,
                featureSet: null
            };
            var layer = new FeatureLayer(featureCollection, {
                mode: FeatureLayer.MODE_SNAPSHOT
            });

            return layer;
        }

    });
});