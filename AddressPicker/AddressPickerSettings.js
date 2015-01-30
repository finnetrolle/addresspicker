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
            minor: 5,   // first were prototype
            build: 4,  // number of commit
            beta: true, // beta version
            demo: true, // demonstartion version
            developer: 'ООО ИГИТ',
            developerWebsite: 'http://www.atr-sz.ru/rus/igit/'
        },

        // field names
        field: {
            cadasterFieldName: 'PARCEL_ID',
            resFieldName: 'Name'
        },

        serviceUrls:{
            cadasterServiceUrl: "http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreOriginal/MapServer/0/",
            addressServiceUrl: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/GeoAddress/Address/MapServer/0/",
            regionServiceUrl: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/GeoAddress/Address/MapServer/4/",
            resServiceUrl: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/CORE/Company/MapServer/0/"
        },

        //stringPatterns
        patterns:{
            cadasterNumberRegexpPattern : /^(47:[a-zA-Zа-яА-Я0-9:]{0,})|78:((\d{7})|(\d{2}:\d{7})|(\d{7}:\d{5})|(\d{2}:\d{7}:\d{5})|(\d{7}:\d{5}:\d{4})|(\d{2}:\d{7}:\d{5}:\d{4})|(\d{7}:\d{5}:\d{4}:\d{3})|(\d{2}:\d{7}:\d{5}:\d{4}:\d{3}))$/,
            cadasterPkkIdPattern: /^(\d{9}|\d{11}|\d{14}|\d{16}|\d{18}|\d{20}|\d{21}|\d{23})$/
        },

        // strings for localization
        strings: {

            saveButton: 'Сохранить',
            saveCoordinatesButton: 'Сохранить координаты',
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
                name: "Базовая подложка ИГИТ"
            },
            {
                link: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                name: "Спутниковая карта"
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
        minZoom: 1,

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