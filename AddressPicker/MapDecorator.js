/**
 * Created by syachin on 08.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/query',
    'dojo/dom-construct',
    'dojo/on',
    'leaflets/leaflet',
    'esri/layers/WMSLayer',
    'AddressPicker/AbstractServiceAdapter',
    'AddressPicker/GoogleServiceAdapter',
    'AddressPicker/YandexServiceAdapter',
    'AddressPicker/ArcGISServiceAdapter',
    'AddressPicker/GeocodedObject',
    'AddressPicker/AddressPickerSettings',
    'AddressPicker/Service',
    'dijit/form/ComboBox',
    'dojo/store/Memory',
    'dojo/Evented',
    'dojo/domReady!'
], function(declare,
        dom,
        query,
        domConstruct,
        on,
        leaflet,
        WMSLayer,
        AbstractServiceAdapter,
        GoogleServiceAdapter,
        YandexServiceAdapter,
        ArcGISServiceAdapter,
        GeocodedObject,
        AddressPickerSettings,
        Service,
        ComboBox,
        Memory,
        Evented){

    //private region
    var defaults = new AddressPickerSettings();
    var regionService;
    var searchControl;
    var resultsLayerGroup;
    var map;
    var layer;
    var cadasterService;
    var resService;
    var geocodedObject;

    function searchControlServiceReverseCallBack(error, result, self, region, latLng){
        setAlertWinState(defaults.strings.unfilledGeocodingResult, error && !result);

        resultsLayerGroup.clearLayers();

        if (defaults.showLineToGeocodingResultPoint) {
            var A, B;
            A = B = latLng;
            // this is part for null address from KGIS geocoder
            var geocodedObject = new GeocodedObject();
            geocodedObject.setText('Россия, ' + region.Region + ', ' + region.Province);
            geocodedObject.setPostalCode('');
            geocodedObject.setLatLng(latLng.lat, latLng.lng); // Todo
            geocodedObject.setBounds(latLng, latLng); // Todo
            geocodedObject.setAddress("Россия", region.Region, region.Province, null, null, null);
            geocodedObject.text += '' +  result;
            var poly = L.polygon([
                [A.lat, A.lng],
                [B.lat, B.lng]
            ]);
        }

        var marker = L.marker(latLng);
        resultsLayerGroup.addLayer(marker);
        var popup = marker.bindPopup(geocodedObject.text);

        popup.openPopup();
        self.emit('objectSelected');
        if (geocodedObject && !geocodedObject.isSuccessfullyGeocoded()) {
            setAlertWinState('', true);
        }
    };

    function getResultAfterClickOnMapCallBack(result, self, latLng){
        if(result != '') {
            var region = result;
            searchControl._service.reverse(latLng, {}, function(error, result){
                searchControlServiceReverseCallBack(error, result, self, region,  latLng);
            }, this);
        } else {
            resultsLayerGroup.clearLayers();
            setAlertWinState(defaults.strings.outOfRegions, true);
        }
    };

    function setAlertWinState(message, isVisible){
        var alertWindow =   dom.byId("alertWindow");
        alertWindow.innerHTML = message != '' ? message : alertWindow.innerHTML;
        alertWindow.style.visibility = isVisible ? 'visible': 'hidden';
    };

    function createElement(tagType, attributes, container) {
        return domConstruct.create(tagType, attributes, container || dom.byId('map_wrapper'));
    };

    function createAlertWindow() {
        var alertWindow = createElement('div',{id: 'alertWindow', 'class': 'alert-window igit-leaflet-wrapper-class',
            title: defaults.strings.tooltips.alert, style: 'visibility:hidden;'});

        createElement('p', {id: 'alertText', 'class': 'alert-text', innerHTML: defaults.strings.unfilledGeocodingResult,
            title: defaults.strings.tooltips.alert}, alertWindow);
    };

    function fillSelectControl(control, array) {
        for (var i = 0; i < array.length; ++i) {
            createElement('option', {value: array[i].link, innerHTML: array[i].name}, control);
        }
        return control;
    };

    function createBasemapCombobox() {
        var array = defaults.basemapLayers;

        var basemapsDiv = createElement('div', {id: 'basemaps-wrapper', 'class':'base-maps-wrapper', title: defaults.strings.tooltips.basemaps});
        var basemaps = createElement('select', {id: 'basemaps', 'class': 'base-maps', title: defaults.strings.tooltips.basemaps}, basemapsDiv);

        fillSelectControl(basemaps, array);

        on(basemaps, 'change', function () {
            if (layer) {
                map.removeLayer(layer);
            }
            layer = L.esri.tiledMapLayer(basemaps.value, {maxZoom: defaults.maxZoom});
            map.addLayer(layer);
        });
    };

    function createCadasterCheckbox() {
        var cadasterCheckboxDiv = createElement('div', {id: 'cadaster-wrapper','class': 'cadaster-wrapper', innerHTML: defaults.strings.cadaster, title: defaults.strings.tooltips.cadaster});

        var cadasterCheckbox = createElement('input', {id: 'cadasterCheckBox', 'class': 'cadaster-checkbox', type: 'checkbox', title: defaults.strings.tooltips.cadaster}, cadasterCheckboxDiv);

        var cadasterLayer = L.esri.dynamicMapLayer(defaults.additionalLayers.cadasterLayer.link,{
            opacity: defaults.additionalLayers.cadasterLayer.opacity
        });

        /* This block of code required to dodge error #12
         Server gives layer data after some time
         If user clears checkbox while response is not arrived, layer will be rendered
         To dodge this shit we catch event "onload" for this layer
         And if checkbox is off - remove this layer from map with
         hacking refreshing - add layer (removed by checkbox event) and remove it once again
          */
        on(cadasterLayer, 'load', function() {
            if (!cadasterCheckbox.checked) {
                map.addLayer(cadasterLayer);
                map.removeLayer(cadasterLayer);
            }
        });

        on(cadasterCheckbox, 'change', function() {
            if (cadasterCheckbox.checked) {
                map.addLayer(cadasterLayer);
            } else {
                map.removeLayer(cadasterLayer);
            }
        });
    };

    function initGeocodingService(self) {
        searchControl = new L.esri.Controls.Geosearch().addTo(map);
        searchControl.initService(new IGITGeocoding());
        resultsLayerGroup = new L.LayerGroup().addTo(map);

        on(searchControl, 'results', function(data) {
            setAlertWinState('', false);
            geocodedObject = data.results[0];
            resultsLayerGroup.clearLayers();

            if (geocodedObject) {
                if (geocodedObject.isSuccessfullyGeocoded()) {
                    var marker = L.marker(data.results[0].latlng);
                    var popup = marker.bindPopup(geocodedObject.text);
                    resultsLayerGroup.addLayer(marker);
                    popup.openPopup();

                    self.emit('objectSelected');

                    if(!geocodedObject.isSuccessfullyToSave()) {
                        setAlertWinState('', true);
                    }

                } else {
                    alert(defaults.strings.geocodingNoPosition);
                }
            } else {
                alert(defaults.strings.geocodingNoResults);
            }
        });
    };

    function getVersion() {
        var v = defaults.appinfo;
        var s = "";
        if (v.demo)
            s += 'Demo version ';
        else
            s += 'v. ';
        s += v.major + '.';
        s += v.minor + '.';
        s += v.build;
        if (v.beta)
            s += " " + 'beta';
        return s;
    };

    function initRegionService(){
        regionService= new Service();
        regionService.initialize({url: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/GeoAddress/Address/MapServer/4/"});
    };

    function getResultByCoordinates(latLng, self){
        setAlertWinState('', false);
        if(!regionService){
            initRegionService();
        }
        regionService.service.getResult(latLng, {}, function (error, result) {
            getResultAfterClickOnMapCallBack(result, self, latLng);
        }, this);
    };
    // This returned object becomes the defined value of this module
    return declare([Evented], {
        // methods for creating controls
        getMaximalZoom: function(){
            return defaults.centerPoint.maxZoom;
        },

        getMinimalZoom: function(){
            return defaults.centerPoint.minZoom;
        },

        getCenter: function(){
            if(map) {
                return map.getCenter();
            }
        },

        getZoom: function(){
            if(map) {
                return map.getZoom();
            }
        },

        getResultObject: function() {
            return geocodedObject;
        },

        queryCadasterService: function() {
            var self = this;
            if (geocodedObject) {
                console.log(new Date().getTime() + " " + "querying cadaster service");
                cadasterService.service.getResult(geocodedObject.latlng, {}, function (error, result) {
                    if ((result) && (result.hasOwnProperty(defaults.field.cadasterFieldName))) {
                        geocodedObject.setCadasterNumber(result[defaults.field.cadasterFieldName]);
                    }
                    self.emit("cadasterResponse", {});
                });
            }
        },

        queryResService: function() {
            if (geocodedObject) {
                console.log(new Date().getTime() + " " + "querying res service");
                resService.service.getResult(geocodedObject.latlng, {}, function (error, result) {
                    if ((result) && (result.hasOwnProperty(defaults.field.resFieldName))) {
                        geocodedObject.setRes(result[defaults.field.resFieldName]);
                    }
                });
                this.emit("resResponse", {});
            }
        },

        setExtent: function(longitude, latitude, zoom) {
            if (map && longitude && latitude) {
                if (zoom) {
                    zoom = zoom > defaults.maxZoom ? defaults.maxZoom : zoom;
                    zoom = zoom < defaults.minZoom ? defaults.minZoom : zoom;
                }
                map.setView([latitude, longitude], zoom);
            }
        },

        highlightObjectByAddress: function(string_address){
            searchControl._geocode(string_address);
        },

        highlightObjectByPosition: function(latitude, longitude){
            var self = this;
            var latLng = {
                lng: longitude,
                lat: latitude
            }
            getResultByCoordinates(latLng, self);
        },

        initMap: function (longitude, latitude, zoom) {
            var self = this;
            // var 1 simple
            map = leaflet.map('map');
            var o = defaults.centerPoint;
            if (longitude && latitude) {
                o.longitude = longitude;
                o.latitude = latitude;
                if (zoom) {
                    o.zoom = zoom;
                }
            }
            self.setExtent(o.longitude, o.latitude, o.zoom);

            require(['leaflets/esri-leaflet'], function(){
                require(['AddressPicker/esri-leaflet-geocoder-mk2'], function(){
                    // loading basemap
                    layer = L.esri.tiledMapLayer(defaults.basemapLayers[0].link, {maxZoom: defaults.maxZoom});
                    map.addLayer(layer);
                    map.attributionControl.addAttribution(["<a href=" + defaults.appinfo.developerWebsite + ">" + defaults.appinfo.developer + "</a>", getVersion()]);
                    cadasterService = new Service();
                    cadasterService.initialize({url: "http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreOriginal/MapServer/0/"});
                    resService = new Service();
                    resService.initialize(
                        {
                            url: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/CORE/Company/MapServer/0/",
                            where: "CompanyCategoryId=2",
                            outFields: "Name"
                        }
                    );
                    // Hack to solve bug #22 without adding localization
                    // Todo - add localization
                    var zoomin = query('.leaflet-control-zoom-in')[0];
                    zoomin.title = defaults.strings.tooltips.zoomin;
                    var zoomout = query('.leaflet-control-zoom-out')[0];
                    zoomout.title = defaults.strings.tooltips.zoomout;

                    createAlertWindow();
                    createBasemapCombobox();
                    createCadasterCheckbox();
                    initGeocodingService(self);

                    on(map, 'click', function (e) {
                        getResultByCoordinates(e.latlng, self);
                    });
                })
            })
        }
    });
});