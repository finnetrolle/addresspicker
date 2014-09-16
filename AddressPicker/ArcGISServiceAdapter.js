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
            query: "json",
            suggestionQuery: "findAddressCandidates",
            url: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/GeoAddress/AddressComposite/GeocodeServer/",
            params: {
                Address: '',
                Postal: '',
                City: '',
                Province: '',
                Region: '',
                outFields: '*',
                maxLocations: '',
                outSR: '',
                searchExtent: '',
                f: "pjson"
            }
        },
        forwardParameter: 'address',
        reverseParameter: 'latlng',
        suggestParameter: 'SingleLine',

        convertResponseToResults: function(response) {
            console.log(response);

            // Todo - define what type of response we have and what to do with

            var results = [];

            if (response) {
                var resp = response.candidates;
                for (var i = 0; i < resp.length; ++i) {
                    results.push(createEsriAddressObject(resp[i].attributes));
//                    results.push(createEsriAddressObject(parseResult(resp[i])));
                }
            }
            return results;


            function createEsriAddressObject(address) {
                this.obj = null;
                var geocodedObject = new GeocodedObject();
                geocodedObject.setText(address.Match_addr);
                geocodedObject.setPostalCode(address.Postal);
//                geocodedObject.setLatLng(address.latlng.lat, address.latlng.lng); // Todo

                var point = WebMercatorUtils.xyToLngLat(address.X, address.Y);
                var lnglat = new L.LatLng(point[1], point[0]);

                geocodedObject.setLatLng(lnglat.lat, lnglat.lng); // Todo
                geocodedObject.setBounds(lnglat, lnglat); // Todo
                geocodedObject.setAddress(
                    (address.Country) ? address.Country : null,
                    (address.Region) ? address.Region : null,
                    (address.Province) ? address.Province : null,
                    (address.City) ? address.City : null,
                    (address.StreetName) ? address.StreetName : null,
                    (address.House) ? address.House : null);
                return geocodedObject;
            };


        },

        adaptLatLng: function(latlng) {
            return latlng;
        }

    })
})



