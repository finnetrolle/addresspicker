/**
 * Created by syachin on 08.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/on',
    'leaflets/leaflet',
    'AddressPicker/AbstractServiceAdapter',
    'AddressPicker/GoogleServiceAdapter',
    'AddressPicker/YandexServiceAdapter',
    'AddressPicker/GeocodedObject',
    'AddressPicker/AddressPickerSettings',
    'dojo/domReady!'
], function(declare
            ,dom
            ,on
            ,leaflet
            ,AbstractServiceAdapter
            ,GoogleServiceAdapter
            ,YandexServiceAdapter
            ,GeocodedObject
            ,AddressPickerSettings
    ){

    // This returned object becomes the defined value of this module
    return declare(null, {

        settings: new AddressPickerSettings(),

        map: null,
        layer: null,
        basemaps: null,
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

                    var searchControl = new L.esri.Controls.Geosearch({url:'http://www.ru'}).addTo(self.map);
                    var results = new L.LayerGroup().addTo(self.map);
                    searchControl.on('results', function(data){
                        dom.byId("alertWindow").style.visibility = 'hidden';
                        self.geocodedObject = data.results[0];
                        results.clearLayers();
                        if (self.geocodedObject) {
                            self.fillInfo(self.geocodedObject);
                            if (self.geocodedObject.isSuccessfullyGeocoded()) {
                                var marker = L.marker(data.results[0].latlng);
                                results.addLayer(marker);
                                marker.bindPopup(self.geocodedObject.text).openPopup();
                            }
                        }
                    });

                    self.map.on('click', function(e){
                        dom.byId("alertWindow").style.visibility = 'hidden';
                        searchControl._service.reverse(e.latlng, {}, function(error, result, response){
                            console.log("results coming after reverse geocoding");
                            results.clearLayers();
//                            uncomment this block to see difference between geocoded point and pressed
                            var A = e.latlng;
                            var B = result.latlng;
                            var poly = L.polygon([[A.lat, A.lng],[B.lat, B.lng]]);
                            results.addLayer(poly);

                            var marker = L.marker(e.latlng);//
                            results.addLayer(marker);
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
                })
            })
        },

        fillInfo: function(o) {
            dom.byId("icountry").value = o.country;
            dom.byId("iregion").value = o.region;
            dom.byId("isubregion").value = o.subregion;
            dom.byId("icity").value = o.city;
            dom.byId("iaddress").value = o.address;
            dom.byId("igeocodeLevel").value = o.geocodeLevel;
            dom.byId("ilatlng").value = o.latlng;
            dom.byId("itext").value = o.text;
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

        initBasemapsList: function (baseMapsId) {
            this.basemaps = dom.byId(baseMapsId);
            var self = this;
            on(this.basemaps, 'change', function() {
                if (self.layer) {
                    self.map.removeLayer(self.layer);
                }
                self.layer = L.esri.tiledMapLayer(self.basemaps.value);
                self.map.addLayer(self.layer);
            })
        },

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
        }

    });
});