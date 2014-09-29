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
    "Thresh/behavior/CreatePolygonBehavior",

    "esri/geometry/Polygon",
    "esri/Color",
    "esri/geometry/Geometry",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",

    "dojo/domReady!"
], function(declare, dom, on,
            Map, FeatureLayer,
            Point, SimpleMarkerSymbol, Graphic,
            BehaviorModel, HighlightBehavior, MoveBehavior, EFALBehavior, CreatePolygonBehavior,
            Polygon, Color, Geometry, SimpleFillSymbol, SimpleLineSymbol
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
//            this.editLayerHighlightBehavior = new HighlightBehavior(this.editLayer);
//            this.editLayerBehaviorModel.addBehavior(this.editLayerHighlightBehavior);

            // Создаем объект поведения перетаскивания и добавляем его к модели поведения объекта
//            this.editLayerMoveBehavior = new MoveBehavior(this.editLayer);
//            this.editLayerBehaviorModel.addBehavior(this.editLayerMoveBehavior);

            this.mapBM = new BehaviorModel(this.map);
            this.cpb = new CreatePolygonBehavior(this.map, this.editLayer);
            this.mapBM.addBehavior(this.cpb);

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

//            on(this.map, 'click', function(event) {
////                self.editLayer.add(new Graphic(new Point(event.mapPoint), new SimpleMarkerSymbol()));
//                var myPolygon = {
//                    "geometry":{
//                        "rings":[
//                            [
//                                [-115.3125,37.96875],
//                                [-111.4453125,37.96875],
//                                [-99.84375,36.2109375],
//                                [-99.84375,23.90625],
//                                [-116.015625,24.609375],
//                                [-115.3125,37.96875]
//                            ]
//                        ],
//                            "spatialReference":{"wkid":4326}
//                        },
//                    "symbol":{
//                        "color":[0,0,0,64],
//                        "outline":{
//                            "color":[0,0,0,255],
//                            "width":1,
//                            "type":"esriSLS",
//                            "style":"esriSLSSolid"
//                        },
//                        "type":"esriSFS",
//                        "style":"esriSFSSolid"
//                    }
//                };
//                var gra = new Graphic(myPolygon);
//
//                var g = new Graphic(
//                    new Polygon([
////                        [1265389, 7201992],
////                        [3261313, 8415201],
////                        [2537301, 9784952]
//                        [-115.3125,37.96875],
//                        [-111.4453125,37.96875],
//                        [-99.84375,36.2109375],
//                        [-99.84375,23.90625],
//                        [-116.015625,24.609375],
//                        [-115.3125,37.96875]
//                    ]),
//                    new SimpleFillSymbol((
//                        SimpleFillSymbol.STYLE_SOLID,
//                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
//                                new Color([255,0,0]), 2
//                            ),
//                            new Color([255,255,0,0.25]))
//                    )
//                );
//                console.log(g);
//                self.editLayer.add(gra);
//            });


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