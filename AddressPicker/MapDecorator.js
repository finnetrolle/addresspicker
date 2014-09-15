/**
 * Created by syachin on 08.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/on',
    'leaflets/leaflet',
//    'leaflets/esri-leaflet',
//    'AddressPicker/esri-leaflet-geocoder-mk2',
    'AddressPicker/AbstractServiceAdapter',
    'AddressPicker/GoogleServiceAdapter',
    'AddressPicker/YandexServiceAdapter',
    'AddressPicker/GeocodedObject',
    'AddressPicker/AddressPickerSettings',
    'AddressPicker/CadasterService',
    'dojo/domReady!'
], function(declare
            ,dom
            ,on
            ,leaflet
            ,esri_leaflet
//            ,esri_leaflet_geocoder_mk2
//            ,AbstractServiceAdapter
            ,GoogleServiceAdapter
            ,YandexServiceAdapter
            ,GeocodedObject
            ,AddressPickerSettings
            ,CadasterService
    ){

    // This returned object becomes the defined value of this module
    return declare(null, {

        searchControl: null,
        resultsLayerGroup: null,

        settings: new AddressPickerSettings(),

        map: null,
        layer: null,
        basemaps: null,
        geocoders: null,
        geocodedObject: null,
        defaultBasemapLayer: null,

//        initMap: function (defaultLayerLink) {
        initMap: function () {
//            this.settings = new AddressPickerSettings();
            var o = this.settings.centerPoint;
            this.map = leaflet.map('map').setView([o.latitude, o.longitude], o.zoom);
            var self = this;


            require(['leaflets/esri-leaflet'], function(){
                require(['AddressPicker/esri-leaflet-geocoder-mk2'], function(){
                    self.layer = L.esri.tiledMapLayer(self.defaultBasemapLayer);
                    self.map.addLayer(self.layer);
//                    var clayer = L.esri.tiledMapLayer('http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreOriginal/MapServer');
//                    self.map.addLayer(clayer);

                    self.initBasemapLayerCombobox();
                    self.initGeocodingServiceCombobox();

                    self.map.on('click', function(e){
                        dom.byId("alertWindow").style.visibility = 'hidden';
                        self.searchControl._service.reverse(e.latlng, {}, function(error, result, response){
                            console.log("results coming after reverse geocoding");
                            self.resultsLayerGroup.clearLayers();
//                            uncomment this block to see difference between geocoded point and pressed
                            var A = e.latlng;
                            var B = result.latlng;
                            var poly = L.polygon([[A.lat, A.lng],[B.lat, B.lng]]);
                            self.resultsLayerGroup.addLayer(poly);

                            var marker = L.marker(e.latlng);//
                            self.resultsLayerGroup.addLayer(marker);
                            marker.bindPopup(result.text).openPopup();
                            self.geocodedObject = result;
                            if (self.geocodedObject) {
                                self.fillInfo(self.geocodedObject);
                                if (!self.geocodedObject.isSuccessfullyGeocoded()) {
                                    dom.byId("alertWindow").style.visibility = 'visible';
                                    self.setSaveButtonEnabled(true);
                                }
                            }
                        }, this);
                    });

                    self.cadasterService = new CadasterService();
                    self.cadasterService.initialize();
//                    var r = self.cadasterService.getCadasterNumber();
//                    console.log(r);

                    var button = dom.byId('ibutton');
                    button.onclick = function(){
                        if (self.geocodedObject) {
                            self.cadasterService.service.getCadasterNumber(self.geocodedObject.latlng, {}, function (error, result, response) {
                                //console.log(result);
                                self.geocodedObject.setCadasterNumber(result);
                                alert(self.geocodedObject.resultToString(self.geocodedObject.getResult()));
                            }, this);

                        }
                    };
                })
            })
        },

        fillInfo: function(o) {
//            dom.byId("icountry").value = o.country;
//            dom.byId("iregion").value = o.region;
//            dom.byId("isubregion").value = o.subregion;
//            dom.byId("icity").value = o.city;
//            dom.byId("iaddress").value = o.address;
//            dom.byId("igeocodeLevel").value = o.geocodeLevel;
//            dom.byId("ilatlng").value = o.latlng;
//            dom.byId("itext").value = o.text;
            this.setSaveButtonEnabled(o.isSuccessfullyGeocoded());
//            dom.byId("ibutton").disabled = !o.isSuccessfullyGeocoded();
        },

        setSaveButtonEnabled: function(value) {
            if (value) {
                dom.byId("savebutton").style.backgroundColor = "#44FF44";
                dom.byId("ibutton").disabled = false;
            } else {
                dom.byId("savebutton").style.backgroundColor = "#FF4444";
                dom.byId("ibutton").disabled = true;
            }
        },

//        initBasemapsList: function (baseMapsId) {
//            this.basemaps = dom.byId(baseMapsId);
//            var self = this;
//            on(this.basemaps, 'change', function() {
//                if (self.layer) {
//                    self.map.removeLayer(self.layer);
//                }
//                self.layer = L.esri.tiledMapLayer(self.basemaps.value);
//                self.map.addLayer(self.layer);
//            })
//        },

        createBasemapCombobox: function(mapDivId) {
            dom.byId(mapDivId).appendChild(makeBasemapWrapperDiv(this.settings.basemapLayers));
            this.defaultBasemapLayer = this.settings.basemapLayers[0].link;

            function makeBasemapWrapperDiv(array) {
                var ediv = document.createElement('div');
                ediv.id = 'basemaps-wrapper';
                ediv.className = 'leaflet-bar';
                var eselect = document.createElement('select');
                eselect.id = 'basemaps';
                eselect.name = 'basemaps';
                for (var i = 0; i < array.length; ++i) {
                    var eoption = document.createElement('option');
                    eoption.value = array[i].link;
                    eoption.innerHTML = array[i].name;
                    eselect.appendChild(eoption);
                }
                ediv.appendChild(eselect);
                return ediv;
            }
        },

        initBasemapLayerCombobox: function() {
            this.basemaps = this.createLinkAndNameCombobox('basemaps-wrapper', 'basemaps', 'map',
                this.settings.basemapLayers);
            var self = this;
            on(this.basemaps, 'change', function() {
                if (self.layer) {
                    self.map.removeLayer(self.layer);
                }
                self.layer = L.esri.tiledMapLayer(self.basemaps.value);
                self.map.addLayer(self.layer);
            })
        },

        initGeocodingServiceCombobox: function() {
            this.searchControl = new L.esri.Controls.Geosearch().addTo(this.map);
            this.resultsLayerGroup = new L.LayerGroup().addTo(this.map);
            var self = this;
            this.searchControl.on('results', function(data) {
                dom.byId('alertWindow').style.visibility = 'hidden';
                self.geocodedObject = data.results[0];
                self.resultsLayerGroup.clearLayers();
                if (self.geocodedObject) {
                    self.fillInfo(self.geocodedObject);
                    if (self.geocodedObject.isSuccessfullyGeocoded()) {
                        self.resultsLayerGroup.addLayer(L.marker(data.results[0].latlng).bindPopup(self.geocodedObject.text).openPopup());
                    }
                }
            });
            this.geocoders = this.createLinkAndNameCombobox('geocoders-wrapper', 'geocoders', 'map',
                this.settings.geocodingServices);
            on(this.geocoders, 'change', function() {
                self.searchControl._service.getAdapter().initService(self.geocoders.value);
                self.searchControl._service.initialize();
            });
        },

        createLinkAndNameCombobox: function(divId, selectId, mapId, array) {
            var eDiv = document.createElement('div');
                eDiv.id = divId;
                eDiv.className = 'leaflet-bar';
            var eSelect = document.createElement('select');
                eSelect.id = selectId;
            for (var i = 0; i < array.length; ++i) {
                var eOption = document.createElement('option');
                    eOption.value = array[i].link;
                    eOption.innerHTML = array[i].name;
                eSelect.appendChild(eOption);
            }
            eDiv.appendChild(eSelect);
            var map = dom.byId(mapId);
            if (map) {
                map.appendChild(eDiv);
            }
            return eSelect;
        }

    });
});