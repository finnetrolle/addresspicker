/**
 * Created by syachin on 18.09.2014.
 */
define([
    'dojo/_base/declare',
    'leaflets/leaflet',
    'AddressPicker/AbstractServiceAdapter',
    'AddressPicker/GoogleServiceAdapter',
    'AddressPicker/YandexServiceAdapter',
    'AddressPicker/ArcGISServiceAdapter',
    'AddressPicker/GeocodedObject',
    'dojo/domReady!'
], function(
     declare
    ,leaflet
    ,AbstractServiceAdapter
    ,GoogleServiceAdapter
    ,YandexServiceAdapter
    ,ArcGISServiceAdapter
    ,GeocodedObject
    ){

    var adapter = null;
    var settings = null;

    require([
        'AddressPicker/AbstractServiceAdapter',
        'AddressPicker/AddressPickerSettings'
    ], function (ServiceAdapter, AddressPickerSettings) {
        adapter = new ServiceAdapter();
        settings = new AddressPickerSettings();
        adapter.initService(settings.serviceAdapter);
    });



    return IgitGeoService = L.esri.Services.Service.extend({

        previousSuggestResults: null,

        initialize: function () {
            this.url = adapter.getUrl();
        },

        getAdapter: function () {
            return adapter;
        },

        geocode: function (text, opts, callback, context) {
            this.filterResult = null;
            if (this.previousSuggestResults !== null) {
                for (var i = 0; i < this.previousSuggestResults.length; ++i) {
                    if (this.previousSuggestResults[i].text === text) {
                        this.filterResult = this.previousSuggestResults[i];
                    }
                }
            }

            this.get(adapter.getQuery(), adapter.getParams(text), function (error, response) {
                if (error) {
                    callback.call(context, error);
                } else {
                    var results = [];
                    var preResults = adapter.convertResults(response);
                    if (this.filterResult) {
                        for (var i = preResults.length - 1; i >= 0; i--) {
                            var result = preResults[i];
                            if (result.text === this.filterResult.text) {
                                results.push(result);
                            }
                        }
                    } else {
                        for (var i = preResults.length - 1; i >= 0; i--) {
                            var result = preResults[i];
                            results.push(result);
                        }
                    }

                    callback.call(context, error, results, response);
                }
            }, this);
        },

        reverse: function (latlng, opts, callback, context) {
            this.get(adapter.getReverseQuery(), adapter.getReverseParams(latlng), function (error, response) {
                if (error) {
                    callback.call(context, error);
                } else {
                    var error = null;
                    var results = adapter.convertResults(response);
                    // get only first result (this result is best)
                    if (results.length > 0) {
                        var result = results[0];
                        callback.call(context, error, result, response);
                    }
                }
            }, this);
        },

        suggest: function (text, opts, callback, context) {
            this.get(adapter.getSuggestionQuery(), adapter.getSuggestParams(text), callback, context);
        }
    });


});