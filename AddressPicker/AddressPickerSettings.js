/**
 * Created by syachin on 12.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/domReady!'
], function(declare){
    return declare(null, {

        // strings for localization
        strings: {
            saveButton: 'Save',
            cadaster: 'Show cadaster layer',
            unfilledGeocodingResult: 'Position can be accepted, but the geocoding is not satisfied',
            geocodingNoResults: 'Geocoding returns zero results',
            geocodingNoPosition: 'Geocoding can not set position',
            tooltips: {
                search: 'Search',
                basemaps: 'Select basemap',
                geocoder: 'Select geocoder',
                cadaster: 'Show cadaster layer',
                save: 'Save results',
                alert: 'Alert!'
            }
        },

        // basemap layers
        basemapLayers: [
            {
                link: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/BaseMaps/OSMapBase/MapServer",
                name: "Open Street Map"
            },
            {
                link: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                name: "Satellite"
            },
            {
                link: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
                name: "Some other map"
            },
            {
                link: "http://maps.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer",
                name: "Rosreestr"
            }
        ],

        // geocoding services (adapters)
        geocodingServices: [
            {
                link: "AddressPicker/GoogleServiceAdapter",
                name: "Google"
            },
            {
                link: "AddressPicker/YandexServiceAdapter",
                name: "Yandex"
            },
            {
                link: "AddressPicker/ArcGISServiceAdapter",
                name: "IGIT"
            }
        ],

        // additional layers
        additionalLayers: {
            cadasterLayer:
            {
                link: 'http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreOriginal/MapServer',
                opacity: 0.5
            }
        },

        serviceAdapter: 'AddressPicker/YandexServiceAdapter',
        showLineToGeocodingResultPoint: true,
        minimumLetters: 3,
        maximumSuggestResults: 10,

        colors: {
            enabledColor: '#44FF44',
            disabledColor: '#FF4444'
        },

        centerPoint: {
            longitude: 30.3279556,
            latitude: 59.935885,
            zoom: 10
        }

    });
});