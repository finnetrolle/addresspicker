/**
 * Created by syachin on 16.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/on',
    'leaflets/leaflet',
    'AddressPicker/GeocodedObject',
    'esri/geometry/webMercatorUtils',
    'dojo/domReady!'
], function(declare, dom, on, leaflet, GeocodedObject, WebMercatorUtils){

    return declare(null, {

        defaults: {
            geocoderName: 'ArcGIS',
            query: "findAddressCandidates",
            suggestionQuery: "findAddressCandidates",
            reverseQuery: 'query',
            url: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/GeoAddress/Address/MapServer/0/",
            params: {
//                Address: '',
//                Postal: '',
//                City: '',
//                Province: '',
//                Region: '',
                outFields: '*',
//                maxLocations: '',
//                outSR: '',
//                searchExtent: '',
                f: "pjson"
            }
        },
        forwardParameter: 'SingleLine',
        reverseParameter: 'location',
        suggestParameter: 'SingleLine',

        convertResponseToResults: function(response) {
            // Todo - define what type of response we have and what to do with
            console.log(response);

            var result = '';

            self.exists = [];

                if (response && response.features.length > 0 && response.features[0].attributes.Address) {
                    var obj = response.features[0].attributes;
                    result += obj.Street ? ' ' + obj.Street : '';
                    if(result && obj.Label){
                        result +=  obj.Label;
                    }
                }
            return result;
        }

    })
});