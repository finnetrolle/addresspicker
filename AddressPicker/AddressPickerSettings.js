/**
 * Created by syachin on 12.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/domReady!'
], function(declare){
    return declare(null, {
//        serviceAdapter: 'AddressPicker/YandexServiceAdapter',
        serviceAdapter: 'AddressPicker/GoogleServiceAdapter',
        minimumLetters: 3,
        basemapLayers: [
            {
                link: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/BaseMaps/OSMapBase/MapServer",
                name: "Open Street Map"},
            {
                link: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
                name: "Some other map"}
        ],
        centerPoint: {
            longitude: 30.3279556,
            latitude: 59.935885,
            zoom: 10
        }
    });
});