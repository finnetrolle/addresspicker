/**
 * Created by syachin on 08.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/on',
    'leaflets/leaflet',
    'AddressPicker/GoogleServiceAdapter',
    'AddressPicker/GeocodedObject',
    'dojo/domReady!'
], function(declare, dom, on, leaflet, GeocodedObject){

    // This returned object becomes the defined value of this module
    return declare(null, {
        centerPoint: {
            longitude: 30.3279556,
            latitude: 59.935885,
            zoom: 10
        },

        map: null,
        layer: null,
        basemaps: null,
        geocodedObject: null,

        initMap: function (defaultLayerLink) {
            var o = this.centerPoint;
            this.map = leaflet.map('map').setView([o.latitude, o.longitude], o.zoom);
            var self = this;
            require(['leaflets/esri-leaflet'], function(){
                require(['AddressPicker/esri-leaflet-geocoder-mk2'], function(){
//                require(['L.Geosearch/src/js/l.control.geosearch'], function () {
//                    require(['L.Geosearch/src/js/l.geosearch.provider.google'], function() {
                        self.layer = L.esri.tiledMapLayer(defaultLayerLink);
                        self.map.addLayer(self.layer);

                        var searchControl = new L.esri.Controls.Geosearch({url:'http://www.ru'}).addTo(self.map);
                        var results = new L.LayerGroup().addTo(self.map);
                        searchControl.on('results', function(data){
                            results.clearLayers();
                            for (var i = data.results.length - 1; i >= 0; i--) {
                                results.addLayer(L.marker(data.results[i].latlng));
                            }
                            this.geocodedObject = data.results[0];
                            if (self.geocodedObject)
                                self.fillInfo(self.geocodedObject);
                        });

                        self.map.on('click', function(e){
                            searchControl._service.reverse(e.latlng, {}, function(error, result, response){
                                var A = e.latlng;
                                var B = result.latlng;
                                var poly = L.polygon([[A.lat, A.lng],[B.lat, B.lng]]).addTo(self.map);
                                poly.bindPopup("azaza");
                                L.marker(e.latlng).addTo(self.map).bindPopup(result.text).openPopup();
                                self.geocodedObject = result;
                                if (self.geocodedObject)
                                    self.fillInfo(self.geocodedObject);
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
            dom.byId("ibutton").disabled = !o.isSuccessfullyGeocoded();
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
        }

    });
});