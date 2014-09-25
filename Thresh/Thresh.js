/**
 * Created by syachin on 25.09.2014.
 */
define([
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/on",
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/graphic",
    "dojo/mouse",
    "Thresh/ListenersChain",
    "Thresh/SimpleLoggingChain",
    "Thresh/DummyChain",
    "Thresh/EventTerminatorChain",
    "Thresh/CreatePOIChain",
    "Thresh/DragPOIChain",
    "Thresh/HighlighterChain",
    "dojo/domReady!"
], function(declare, dom, on, Map, FeatureLayer, Point, SimpleMarkerSymbol, Graphic, Mouse, Chain, SimpleLoggingChain, DummyChain, EventTerminatorChain, CreatePOIChain, DragPOIChain, HighlighterChain){
    return declare(null, {

        map: null,

        constructor: function(mapId) {
            this.map = new Map("map", {
                center: [30, 59],
                zoom: 3,
                basemap: "satellite"
            });

            this.editLayer = this.createEditLayer();
            this.map.addLayer(this.editLayer);
            var self = this;

//            on(this.editLayer, 'mouse-move', function(event) {
//                console.log('move: ' + event.mapPoint);
//            });

//            var logChain = new SimpleLoggingChain(this.editLayer);
//            logChain.enableEventLogging();

            var highlishtChain = new HighlighterChain(this.editLayer);
            var dragChain = new DragPOIChain(this.editLayer);

            var eventTerminator = new EventTerminatorChain(this.editLayer);
//            var createPOIChain = new CreatePOIChain(this.map, this.editLayer);

//            var logChain = new SimpleLoggingChain(this.map);

            on(this.map, 'click', function(event) {
                self.editLayer.add(new Graphic(new Point(event.mapPoint), new SimpleMarkerSymbol()));
            });

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

//            layer.onClickHandler = layer.on('click', function(event) {
//                console.log(event);
//                event.stopPropagation();
//            });
//            layer.onOverHandler = layer.on('mouse-over', function(event) {
//                console.log(event);
//            });
//            layer.onOutHandler = layer.on('mouse-out', function(event) {
//                console.log(event);
//            });

            return layer;
        }

    });
});