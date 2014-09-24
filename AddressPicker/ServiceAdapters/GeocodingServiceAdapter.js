/**
 * Created by syachin on 24.09.2014.
 */
define([
    '../../dojo/_base/declare',
    'leaflets/leaflet',
    'dojo/domReady!'
], function(declare, leaflet) {

    var concreteServiceAdapter = null;

    return declare(null, {

        getUrl: function() {
            return concreteServiceAdapter.url;
        },

        getGeocoderServiceName: function() {
            return concreteServiceAdapter.geocoderName;
        },

        getQuery: function() {
            return concreteServiceAdapter.query;
        },

        getReverseQuery: function() {
            return concreteServiceAdapter.reverseQuery;
        },

        getSuggestionQuery: function() {
            return concreteServiceAdapter.suggestionQuery;
        },

        getParams: function(value) {
            var a = this.cloneParams();
            a[concreteServiceAdapter.forwardParameter] = value;
            return a;
        },

        getReverseParams: function(latlng) {
            var a = this.cloneParams();
            var point = concreteServiceAdapter.adaptLatLng(latlng);
            a[concreteServiceAdapter.reverseParameter] = point.lat + "," + point.lng;
            return a;
        },

        cloneParams: function() {
            var a = {};
            for (var key in concreteServiceAdapter.params) {
                a[key] = concreteServiceAdapter.params[key];
            }
            return a;
        },

        getSuggestParams: function(value) {
            var a = this.cloneParams();
            a[concreteServiceAdapter.suggestParameter] = value;
            return a;
        },

        convertResults: function(response) {
            return concreteServiceAdapter.convertResponseToResults(response);
        },

        initService: function(concreteServiceAdapterName) {
            require([concreteServiceAdapterName], function(ConcreteServiceAdapter){
                concreteServiceAdapter = new ConcreteServiceAdapter();
            });
        }

    });

});