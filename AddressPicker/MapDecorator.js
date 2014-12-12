/**
 * Created by syachin on 08.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/dom',
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
], function(declare
    ,dom
    ,domConstruct
    ,on
    ,leaflet
    ,WMSLayer
    ,AbstractServiceAdapter
    ,GoogleServiceAdapter
    ,YandexServiceAdapter
    ,ArcGISServiceAdapter
    ,GeocodedObject
    ,AddressPickerSettings
    ,Service
    ,ComboBox
    ,Memory
    ,Evented
    ){

    // This returned object becomes the defined value of this module
    return declare([Evented], {

        // inside services
        searchControl: null,
        regionsCheck: null,
        resultsLayerGroup: null,

        // settings
        settings: new AddressPickerSettings(),
        defaultBasemapLayer: null,

        // wrappers (DIVs)
        mapDiv: null,
        basemapsDiv: null,
        geocodersDiv: null,
        saveButtonDiv: null,
        cadasterCheckboxDiv: null,

        // controls
        map: null,
        basemaps: null,
        geocoders: null,
        saveButton: null,
        saveCoordinatesButton: null,
        cadasterCheckbox: null,
        alertWindow: null,
        alertText: null,
        saveSpinner: null,
        saveSpinnerIsOn: false,
        searchComboBox: null,

        // special (for map)
        layer: null,
        cadasterLayer: null,
        geocodedObject: null,

        lastSavedObj: null,

        // methods for creating controls

        createElement: function(tagType, attributes, container) {
            return domConstruct.create(tagType, attributes, container || dom.byId('map_wrapper'));
        },

        _loadSuggestions: function(objectsArray) {
            var storage = new Memory({data:[]});
            for (var i = 0; i < objectsArray.length; ++i) {
                storage.data.push({name: objectsArray[i].text});
            }
            this.searchComboBox.storage = storage;
        },

        createAlertWindow: function() {
            this.alertWindow = this.createElement('div',{id: 'alertWindow', class: 'igit-leaflet-wrapper-class',
                title: this.settings.strings.tooltips.alert, style: 'visibility:hidden;'});

            this.alertText = this.createElement('p', {id: 'alertText', innerHTML: this.settings.strings.unfilledGeocodingResult,
                title: this.settings.strings.tooltips.alert}, this.alertWindow);
        },

        createBasemapCombobox: function() {
            var array = this.settings.basemapLayers;

            this.basemapsDiv = this.createElement('div', {id: 'basemaps-wrapper', title: this.settings.strings.tooltips.basemaps});
            this.basemaps = this.createElement('select', {id: 'basemaps', title: this.settings.strings.tooltips.basemaps}, this.basemapsDiv);

            this.fillSelectControl(this.basemaps, array);

            var self = this;
            on(this.basemaps, 'change', function (event) {
                if (self.layer) {
                    self.map.removeLayer(self.layer);
                }
                self.layer = L.esri.tiledMapLayer(self.basemaps.value, {maxZoom: self.settings.maxZoom});
                self.map.addLayer(self.layer);
            });
        },

        createCadasterCheckbox: function() {
            this.cadasterCheckboxDiv = this.createElement('div', {id: 'cadaster-wrapper', innerHTML: this.settings.strings.cadaster, title: this.settings.strings.tooltips.cadaster});

            this.cadasterCheckbox = this.createElement('input', {id: 'cadasterCheckBox', type: 'checkbox', title: this.settings.strings.tooltips.cadaster}, this.cadasterCheckboxDiv);

            var self = this;
            self.cadasterLayer = L.esri.dynamicMapLayer(self.settings.additionalLayers.cadasterLayer.link,{
                opacity: self.settings.additionalLayers.cadasterLayer.opacity
            });

            /* This block of code required to dodge error #12
             Server gives layer data after some time
             If user clears checkbox while response is not arrived, layer will be rendered
             To dodge this shit we catch event "onload" for this layer
             And if checkbox is off - remove this layer from map with
             hacking refreshing - add layer (removed by checkbox event) and remove it once again
             * */
            on(this.cadasterLayer, 'load', function() {
                if (!self.cadasterCheckbox.checked) {
                    self.map.addLayer(self.cadasterLayer);
                    self.map.removeLayer(self.cadasterLayer);
                }
            });

            on(this.cadasterCheckbox, 'change', function(e) {
                if (self.cadasterCheckbox.checked) {
                    self.map.addLayer(self.cadasterLayer);
                } else {//
                    self.map.removeLayer(self.cadasterLayer);
                }
            });
        },

        getResultObject: function() {
            return this.geocodedObject;
        },

        queryCadasterService: function() {
            var self = this;
            if (this.geocodedObject) {
                console.log(new Date().getTime() + " " + "querying cadaster service");
                this.cadasterService.service.getResult(this.geocodedObject.latlng, {}, function (error, result, response) {
                    if ((result) && (result.hasOwnProperty(self.settings.field.cadasterFieldName))) {
                        self.geocodedObject.setCadasterNumber(result[self.settings.field.cadasterFieldName]);
                    }
                    self.emit("cadasterResponse", {});
                });
            }
        },

        queryResService: function() {
            var self = this;
            if (this.geocodedObject) {
                console.log(new Date().getTime() + " " + "querying res service");
                this.resService.service.getResult(self.geocodedObject.latlng, {}, function (error, result, response) {
                    if ((result) && (result.hasOwnProperty(self.settings.field.resFieldName))) {
                        self.geocodedObject.setRes(result[self.settings.field.resFieldName]);
                    }
                });
                self.emit("resResponse", {});
            }
        },

        createGeocodingControl: function() {
            var self = this;
            var array = this.settings.geocodingServices;

            this.geocodersDiv = this.createElement('div',{id: 'geocoders-wrapper', title: this.settings.strings.tooltips.geocoder});
            this.geocoders = this.createElement('select',{id: 'geocoders', title: this.settings.strings.tooltips.geocoder}, this.geocodersDiv);

            this.fillSelectControl(this.geocoders, array);

            on(this.geocoders, 'change', function() {
                self.searchControl._service.initialize();
                self.resultsLayerGroup.clearLayers();
                self.geocodedObject = null;
                dom.byId("alertWindow").style.visibility = 'hidden';
            });
        },

        initGeocodingService: function() {
            this.searchControl = new L.esri.Controls.Geosearch().addTo(this.map);
            this.searchControl.initService(new IGITGeocoding());
            this.resultsLayerGroup = new L.LayerGroup().addTo(this.map);
            var self = this;

            on(this.searchControl, 'results', function(data) {
                self.alertWindow.style.visibility = 'hidden';
                self.geocodedObject = data.results[0];
                self.resultsLayerGroup.clearLayers();

                if (self.geocodedObject) {
                    if (self.geocodedObject.isSuccessfullyGeocoded()) {
                        var marker = L.marker(data.results[0].latlng);
                        var popup = marker.bindPopup(self.geocodedObject.text);
                        self.resultsLayerGroup.addLayer(marker);
                        popup.openPopup();

                        self.emit('objectSelected');


                        if(!self.geocodedObject.isSuccessfullyToSave()) {
                            self.alertWindow.style.visibility = 'visible';
                        }

                    } else {
                        alert(self.settings.strings.geocodingNoPosition);
                    }
                } else {
                    alert(self.settings.strings.geocodingNoResults);
                }
            });
        },

        getVersion: function() {
            var v = this.settings.appinfo;
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
        },

        // initialization (overriden)
        resizeMap: function() {
            this.map.resize();
        },

        find: function(params, callback) {
            return callback(this.lastSavedObj);
        },

        initMap: function (longitude, latitude, zoom) {

            this.settings = new AddressPickerSettings();
            var o = this.settings.centerPoint;
            // this block used to set initial center point and zoom (astrosoft asked for this)
            if ((longitude != undefined) && (latitude != undefined)) {
                o.longitude = longitude;
                o.latitude = latitude;
                if (zoom != undefined) {
                    if ((zoom >= 1) && (zoom <= this.settings.maxZoom)) {
                        o.zoom = zoom;
                    }
                }
            }

            this.mapDiv = dom.byId('map');
            this.map = leaflet.map('map').setView([o.latitude, o.longitude], o.zoom);
            var self = this;

            // Hack to solve bug #22 without adding localization
            // Todo - add localization
            var zoomin = document.querySelectorAll('.leaflet-control-zoom-in')[0];
            var zoomin = document.querySelectorAll('.leaflet-control-zoom-in')[0];
            var zoomin = document.querySelectorAll('.leaflet-control-zoom-in')[0];
            zoomin.title = this.settings.strings.tooltips.zoomin;
//            var zoomout = document.getElementsByClassName('leaflet-control-zoom-out')[0];
            var zoomout = document.querySelectorAll('.leaflet-control-zoom-out')[0];
            zoomout.title = this.settings.strings.tooltips.zoomout;

            require(['leaflets/esri-leaflet'], function(){
                require(['AddressPicker/esri-leaflet-geocoder-mk2'], function(){
                    // loading basemap
                    self.layer = L.esri.tiledMapLayer(self.settings.basemapLayers[0].link, {maxZoom: self.settings.maxZoom});
                    self.map.addLayer(self.layer);

                    self.map.attributionControl.addAttribution(self.getVersion());
                    self.map.attributionControl.addAttribution(
                        "<a href=" +
                            self.settings.appinfo.developerWebsite +
                            ">" +
                            self.settings.appinfo.developer +
                            "</a>");

                    self.createAlertWindow();
                    self.createBasemapCombobox();
                    self.initGeocodingService();
                    self.createCadasterCheckbox();

                    on(self.map, 'click', function (e) {

                        dom.byId("alertWindow").style.visibility = 'hidden';

                        var alertWin = dom.byId("alertWindow");

                        self.regionsService.service.getResult(e.latlng, {}, function (error, result, response) {

                            if(result != '') {
                                var region = result;

                                self.searchControl._service.reverse(e.latlng, {}, function(error, result, response){
                                    alertWin.innerHTML = self.settings.strings.unfilledGeocodingResult;

                                    self.resultsLayerGroup.clearLayers();

                                    var _DEBUG_BUG_GEOCODING = true; // Todo - remove after adding polys for city and region

                                    if (self.settings.showLineToGeocodingResultPoint) {
                                        var A = e.latlng;
                                        var B = A;
                                        if (result) {
                                            if (result.hasOwnProperty('latlng'))
                                                var B = result.latlng;
                                        }
                                        else
                                        {
                                            _DEBUG_BUG_GEOCODING = false; // Todo - remove after adding polys for city and region
                                            // this is part for null address from KGIS geocoder
                                            var geocodedObject = new GeocodedObject();
                                            geocodedObject.setText('Россия, ' + region.Region + ', ' + region.Province);
                                            geocodedObject.setPostalCode('');
                                            geocodedObject.setLatLng(e.latlng.lat, e.latlng.lng); // Todo
                                            geocodedObject.setBounds(e.latlng, e.latlng); // Todo
                                            geocodedObject.setAddress(
                                                "Россия", region.Region, region.Province, null, null, null);
                                            result = geocodedObject;

                                            dom.byId("alertWindow").style.visibility = 'visible';
                                        }
                                        var poly = L.polygon([
                                            [A.lat, A.lng],
                                            [B.lat, B.lng]
                                        ]);
                                        self.resultsLayerGroup.addLayer(poly);
                                    }


                                    var marker = L.marker(e.latlng);
                                    self.resultsLayerGroup.addLayer(marker);
                                    var popup = marker.bindPopup(result.text);

                                    //if (_DEBUG_BUG_GEOCODING) // Todo - remove after adding polys for city and region
                                    popup.openPopup();


                                    self.geocodedObject = result;
                                    self.emit('objectSelected');
                                    if (self.geocodedObject && !self.geocodedObject.isSuccessfullyGeocoded()) {
                                        dom.byId("alertWindow").style.visibility = 'visible';
                                    }
                                }, this);
                            } else {
                                self.resultsLayerGroup.clearLayers();

                                alertWin.innerHTML = self.settings.strings.outOfRegions;
                                alertWin.style.visibility = 'visible';
                            }

                        }, this);

                    });

                    self.cadasterService = new Service();
                    self.cadasterService.initialize({url: "http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreOriginal/MapServer/0/"});

                    self.regionsService = new Service();
                    self.regionsService.initialize({url: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/GeoAddress/Address/MapServer/4/"});

                    self.resService = new Service();
                    self.resService.initialize(
                        {
                            url: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/CORE/Company/MapServer/0/",
                            where: "CompanyCategoryId=2",
                            outFields: "Name"
                        }
                    );
                })
            })
        },

        fillSelectControl: function(control, array) {
            for (var i = 0; i < array.length; ++i) {
                this.createElement('option', {value: array[i].link, innerHTML: array[i].name}, control);
            }
            return control;
        }
    });
});