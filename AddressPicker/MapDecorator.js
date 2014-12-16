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
    var settings = {
        defaults: new AddressPickerSettings(),
        searchControl: null,
        resultsLayerGroup: null,
        map: null,
        layer: null,
        cadasterService: null,
        resService: null,
        geocodedObject: null,
        geocodersDiv: null,
        geocoders: null
    };

    function searchControlServiceReverseCallBack(error, result, self, region, e){
        setAlertWinState(settings.defaults.strings.unfilledGeocodingResult, error && !result);

        settings.resultsLayerGroup.clearLayers();

        if (settings.defaults.showLineToGeocodingResultPoint) {
            var A, B;
            A = B = e.latlng;
            if (result && result.latlng) {
                B = result.latlng;
            } else {
                // this is part for null address from KGIS geocoder
                var geocodedObject = new GeocodedObject();
                geocodedObject.setText('Россия, ' + region.Region + ', ' + region.Province);
                geocodedObject.setPostalCode('');
                geocodedObject.setLatLng(e.latlng.lat, e.latlng.lng); // Todo
                geocodedObject.setBounds(e.latlng, e.latlng); // Todo
                geocodedObject.setAddress("Россия", region.Region, region.Province, null, null, null);
                result = geocodedObject;
            }
            var poly = L.polygon([
                [A.lat, A.lng],
                [B.lat, B.lng]
            ]);
            settings.resultsLayerGroup.addLayer(poly);
        }

        var marker = L.marker(e.latlng);
        settings.resultsLayerGroup.addLayer(marker);
        var popup = marker.bindPopup(result.text);

        popup.openPopup();

        settings.geocodedObject = result;
        self.emit('objectSelected');
        if (settings.geocodedObject && !settings.geocodedObject.isSuccessfullyGeocoded()) {
            setAlertWinState('', true);
        }
    };

    function getResultAfterClickOnMapCallBack(result, self, e){
        if(result != '') {
            var region = result;
            settings.searchControl._service.reverse(e.latlng, {}, function(error, result){
                searchControlServiceReverseCallBack(error, result, self, region,  e);
            }, this);
        } else {
            settings.resultsLayerGroup.clearLayers();
            setAlertWinState(settings.defaults.strings.outOfRegions, true);
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
        var alertWindow = createElement('div',{id: 'alertWindow', class: 'igit-leaflet-wrapper-class',
            title: settings.defaults.strings.tooltips.alert, style: 'visibility:hidden;'});

        createElement('p', {id: 'alertText', innerHTML: settings.defaults.strings.unfilledGeocodingResult,
            title: settings.defaults.strings.tooltips.alert}, alertWindow);
    };

    function fillSelectControl(control, array) {
        for (var i = 0; i < array.length; ++i) {
            createElement('option', {value: array[i].link, innerHTML: array[i].name}, control);
        }
        return control;
    };

    function createBasemapCombobox() {
        var array = settings.defaults.basemapLayers;

        var basemapsDiv = createElement('div', {id: 'basemaps-wrapper', title: settings.defaults.strings.tooltips.basemaps});
        var basemaps = createElement('select', {id: 'basemaps', title: settings.defaults.strings.tooltips.basemaps}, basemapsDiv);

        fillSelectControl(basemaps, array);

        on(basemaps, 'change', function () {
            if (settings.layer) {
                settings.map.removeLayer(settings.layer);
            }
            settings.layer = L.esri.tiledMapLayer(basemaps.value, {maxZoom: settings.defaults.maxZoom});
            settings.map.addLayer(settings.layer);
        });
    };

    function createCadasterCheckbox() {
        var cadasterCheckboxDiv = createElement('div', {id: 'cadaster-wrapper', innerHTML: settings.defaults.strings.cadaster, title: settings.defaults.strings.tooltips.cadaster});

        var cadasterCheckbox = createElement('input', {id: 'cadasterCheckBox', type: 'checkbox', title: settings.defaults.strings.tooltips.cadaster}, cadasterCheckboxDiv);

        var cadasterLayer = L.esri.dynamicMapLayer(settings.defaults.additionalLayers.cadasterLayer.link,{
            opacity: settings.defaults.additionalLayers.cadasterLayer.opacity
        });

        /* This block of code required to dodge error #12
         Server gives layer data after some time
         If user clears checkbox while response is not arrived, layer will be rendered
         To dodge this shit we catch event "onload" for this layer
         And if checkbox is off - remove this layer from map with
         hacking refreshing - add layer (removed by checkbox event) and remove it once again
         * */
        on(cadasterLayer, 'load', function() {
            if (!cadasterCheckbox.checked) {
                settings.map.addLayer(cadasterLayer);
                settings.map.removeLayer(cadasterLayer);
            }
        });

        on(cadasterCheckbox, 'change', function() {
            if (cadasterCheckbox.checked) {
                settings.map.addLayer(cadasterLayer);
            } else {
                settings.map.removeLayer(cadasterLayer);
            }
        });
    };

    function initGeocodingService(self) {
        settings.searchControl = new L.esri.Controls.Geosearch().addTo(settings.map);
        settings.searchControl.initService(new IGITGeocoding());
        settings.resultsLayerGroup = new L.LayerGroup().addTo(settings.map);

        on(settings.searchControl, 'results', function(data) {
            setAlertWinState('', false);
            settings.geocodedObject = data.results[0];
            settings.resultsLayerGroup.clearLayers();

            if (settings.geocodedObject) {
                if (settings.geocodedObject.isSuccessfullyGeocoded()) {
                    var marker = L.marker(data.results[0].latlng);
                    var popup = marker.bindPopup(settings.geocodedObject.text);
                    settings.resultsLayerGroup.addLayer(marker);
                    popup.openPopup();

                    self.emit('objectSelected');

                    if(!settings.geocodedObject.isSuccessfullyToSave()) {
                        setAlertWinState('', true);
                    }

                } else {
                    alert(settings.defaults.strings.geocodingNoPosition);
                }
            } else {
                alert(settings.defaults.strings.geocodingNoResults);
            }
        });
    };

    function getVersion() {
        var v = settings.defaults.appinfo;
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

    // This returned object becomes the defined value of this module
    return declare([Evented], {
        // methods for creating controls
        getResultObject: function() {
            return settings.geocodedObject;
        },

        queryCadasterService: function() {
            var self = this;
            if (settings.geocodedObject) {
                console.log(new Date().getTime() + " " + "querying cadaster service");
                settings.cadasterService.service.getResult(settings.geocodedObject.latlng, {}, function (error, result) {
                    if ((result) && (result.hasOwnProperty(settings.defaults.field.cadasterFieldName))) {
                        settings.geocodedObject.setCadasterNumber(result[settings.defaults.field.cadasterFieldName]);
                    }
                    self.emit("cadasterResponse", {});
                });
            }
        },

        queryResService: function() {
            if (settings.geocodedObject) {
                console.log(new Date().getTime() + " " + "querying res service");
                settings.resService.service.getResult(settings.geocodedObject.latlng, {}, function (error, result) {
                    if ((result) && (result.hasOwnProperty(settings.defaults.field.resFieldName))) {
                        settings.geocodedObject.setRes(result[settings.defaults.field.resFieldName]);
                    }
                });
                this.emit("resResponse", {});
            }
        },

        initMap: function (longitude, latitude, zoom) {

            var o = settings.defaults.centerPoint;
            // this block used to set initial center point and zoom (astrosoft asked for this)
            if ((longitude != undefined) && (latitude != undefined)) {
                o.longitude = longitude;
                o.latitude = latitude;
                if (zoom != undefined) {
                    if ((zoom >= 1) && (zoom <= settings.defaults.maxZoom)) {
                        o.zoom = zoom;
                    }
                }
            }

            settings.map = leaflet.map('map').setView([o.latitude, o.longitude], o.zoom);
            var self = this;

            require(['leaflets/esri-leaflet'], function(){
                require(['AddressPicker/esri-leaflet-geocoder-mk2'], function(){
                    // loading basemap
                    settings.layer = L.esri.tiledMapLayer(settings.defaults.basemapLayers[0].link, {maxZoom: settings.defaults.maxZoom});
                    settings.map.addLayer(settings.layer);
                    settings.map.attributionControl.addAttribution(["<a href=" + settings.defaults.appinfo.developerWebsite + ">" + settings.defaults.appinfo.developer + "</a>", getVersion()]);
                    settings.cadasterService = new Service();
                    settings.cadasterService.initialize({url: "http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreOriginal/MapServer/0/"});
                    settings.resService = new Service();
                    settings.resService.initialize(
                        {
                            url: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/CORE/Company/MapServer/0/",
                            where: "CompanyCategoryId=2",
                            outFields: "Name"
                        }
                    );
                    // Hack to solve bug #22 without adding localization
                    // Todo - add localization
                    var zoomin = query('.leaflet-control-zoom-in')[0];
                    zoomin.title = settings.defaults.strings.tooltips.zoomin;
                    var zoomout = query('.leaflet-control-zoom-out')[0];
                    zoomout.title = settings.defaults.strings.tooltips.zoomout;

                    createAlertWindow();
                    createBasemapCombobox();
                    initGeocodingService(self);
                    createCadasterCheckbox();

                    var regionsService = new Service();
                    regionsService.initialize({url: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/GeoAddress/Address/MapServer/4/"});

                    on(settings.map, 'click', function (e) {
                        setAlertWinState('', false);
                        regionsService.service.getResult(e.latlng, {}, function (error, result) {
                            getResultAfterClickOnMapCallBack(result, self, e);
                        }, this);
                    });//
                })
            })
        }
    });
});