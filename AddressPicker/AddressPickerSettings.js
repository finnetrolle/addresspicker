/**
 * Created by syachin on 12.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/domReady!'
], function(declare){
    return declare(null, {

        appinfo: {
            major: 0,   // application version
            minor: 3,   // first were prototype
            build: 6,  // number of commit
            beta: true, // beta version
            demo: true  // demonstartion version
        },

        // strings for localization
        strings: {
            saveButton: 'Сохранить',
            cadaster: 'Кадастровая карта',
            unfilledGeocodingResult: 'Координаты могут быть сохранены, но адрес геокодирован не полностью',
            outOfRegions: 'Адрес за пределами территории Санкт-Петербурга и Ленинградской области не может быть сохранен. Выберите адрес в указанных пределах',
            geocodingNoResults: 'Нет результатов геокодинга',
            geocodingNoPosition: 'Геокодинг не может установить позицию',
            tooltips: {
                search: 'Поиск',
                basemaps: 'Выбор подложки',
              //  geocoder: 'Выбор геокодера',
                cadaster: 'Показать кадастровый слой',
                save: 'Сохранить результаты',
                zoomin: 'Приблизить',
                zoomout: 'Отдалить',
                alert: ''
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
            }
//            ,
//            {
//                link: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
//                name: "Some other map"
//            },
//            {
//                link: "http://maps.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer",
//                name: "Rosreestr"
//            }
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
                name: "КГИС"
            }
        ],

        // additional layers
        additionalLayers: {
            cadasterLayer:
            {
                link: 'http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreOriginal/MapServer',
                opacity: 0.6
            }
        },

        //serviceAdapter: 'AddressPicker/YandexServiceAdapter',
        serviceAdapter: 'AddressPicker/ArcGISServiceAdapter',
        showLineToGeocodingResultPoint: true,
        minimumLetters: 3,
        maximumSuggestResults: 25,
        maxZoom: 17,

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