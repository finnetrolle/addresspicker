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
    "Thresh/behavior/BehaviorModel",
    "Thresh/behavior/HighlightBehavior",
    "Thresh/behavior/MoveBehavior",
    "Thresh/behavior/EventsFromArrayLogBehavior",
    "dojo/domReady!"
], function(declare, dom, on,
            Map, FeatureLayer,
            Point, SimpleMarkerSymbol, Graphic,
            BehaviorModel, HighlightBehavior, MoveBehavior, EFALBehavior
    ){
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

////            var logChain = new SimpleLoggingChain(this.editLayer);
////            logChain.enableEventLogging();
//            var highlishtChain = new HighlighterChain(this.editLayer);
//            var dragChain = new DragPOIChain(this.editLayer);
//            var eventTerminator = new EventTerminatorChain(this.editLayer);
////            var createPOIChain = new CreatePOIChain(this.map, this.editLayer);
////            var logChain = new SimpleLoggingChain(this.map);

            // new features - Behavior;


            // для созданного объекта (в примере - FeatureLayer) создаем объект модели поведения
            this.editLayerBehaviorModel = new BehaviorModel(this.editLayer);

            // Создаем объект поведения подсветки и добавляем его к модели поведения объекта
            this.editLayerHighlightBehavior = new HighlightBehavior(this.editLayer);
            this.editLayerBehaviorModel.addBehavior(this.editLayerHighlightBehavior);

            // Создаем объект поведения перетаскивания и добавляем его к модели поведения объекта
            this.editLayerMoveBehavior = new MoveBehavior(this.editLayer);
            this.editLayerBehaviorModel.addBehavior(this.editLayerMoveBehavior);

            this.efal = new EFALBehavior([
                'mouse-move',
                'mouse-over',
                'mouse-out',
                'mouse-drag',
                'mouse-up',
                'mouse-down',
                'click',
                'dbl-click'
            ],false);
            this.editLayerBehaviorModel.addBehavior(this.efal);

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