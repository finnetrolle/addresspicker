/**
 * Created by syachin on 13.09.2014.
 */
define([
    'dojo/_base/declare',
    'leaflets/leaflet',
    'dojo/domReady!'
], function(declare, leaflet){

    var concreteServiceAdapter = null;

    return declare(null, {
        defaults: {
            url: '',
            query: '',
            geocoderName: 'Abstract',
            params: {}
        },
        forwardParameter: null,
        reverseParameter: null,

        getUrl: function() {
            return this.defaults.url;
        },

        getGeocoderServiceName: function() {
            return this.defaults.geocoderName;
        },

        getQuery: function() {
            return this.defaults.query;
        },

        getParams: function(value) {
            var a = {};
            for (var key in this.defaults.params) {
                a[key] = this.defaults.params[key];
            }
            a[this.forwardParameter] = value;
            return a;
        },

        getReverseParams: function(latlng) {
            var a = {};
            for (var key in this.defaults.params) {
                a[key] = this.defaults.params[key];
            }
            var point = concreteServiceAdapter.adaptLatLng(latlng);
            a[this.reverseParameter] = point.lat + "," + point.lng;
            return a;
        },

        convertResults: function(response) {
            return concreteServiceAdapter.convertResponseToResults(response);
        },

        initService: function(concreteServiceAdapterName) {
            var self = this;
            require([concreteServiceAdapterName], function(ConcreteServiceAdapter){
                concreteServiceAdapter = new ConcreteServiceAdapter();
                self.defaults.url = concreteServiceAdapter.defaults.url;
                self.defaults.query = concreteServiceAdapter.defaults.query;
                self.defaults.geocoderName = concreteServiceAdapter.defaults.geocoderName;
                self.defaults.params = concreteServiceAdapter.defaults.params;
                self.forwardParameter = concreteServiceAdapter.forwardParameter;
                self.reverseParameter = concreteServiceAdapter.reverseParameter;
//                self._convertResults = concreteServiceAdapter.convertResponseToResults;
//                self.adaptLatLng = concreteServiceAdapter.adaptLatLng;
            });
        }
    });

});