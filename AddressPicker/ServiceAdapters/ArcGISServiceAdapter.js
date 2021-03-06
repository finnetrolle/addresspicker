/**
 * Created by syachin on 16.09.2014.
 */
define([
    'dojo/_base/declare',
    'leaflets/leaflet',
    'AddressPicker/GeocodedObject',
    'esri/geometry/webMercatorUtils'
], function(declare, leaflet, GeocodedObject, WebMercatorUtils){

    return declare(null, {

        geocoderName: 'ArcGIS',

        query: "findAddressCandidates",
        suggestionQuery: "findAddressCandidates",
        reverseQuery: 'reverseGeocode',

        url: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/GeoAddress/AddressComposite/GeocodeServer/",

        params: {
            outFields: '*',
            f: "pjson"
        },

        forwardParameter: 'SingleLine',
        reverseParameter: 'location',
        suggestParameter: 'SingleLine',

        convertResponseToResults: function(response) {
//            console.log(response);

            console.log(response);

            var results = [];

            if (response) {
                if ('address' in response) {

                    // this is reverse geocoding
                    // dirty hack to add location into results
                    response.address.X = response.location.x;
                    response.address.Y = response.location.y;
                    response.address.Match_addr =
                            response.address.Region + ', ' +
                            response.address.Province + ', ' +
                            response.address.City + ', ' +
                            response.address.Address;
                    var slist = response.address.Address.split(' ');
                    if (slist.length > 0) {
                        response.address.StreetName = '';
                        if (slist.length > 1) {
                            for (var i = 0; i < slist.length - 2; ++i) {
                                response.address.StreetName += slist[i] + ' ';
                            }
                            response.address.StreetName += slist[slist.length-2];
                            response.address.House = slist[slist.length-1];
                        } else {
                            response.address.StreetName = slist[0];
                        }
                    }
                    results.push(createEsriAddressObject(response.address));
                } else
                {
                    // this is forward geocoding (address suggestion)
                    var resp = response.candidates;
                    for (var i = 0; i < resp.length; ++i) {
                        results.push(createEsriAddressObject(resp[i].attributes));
                    }
                }
            }
            return results;


            function createEsriAddressObject(address) {
                this.obj = null;
//                var geocodedObject = new GeocodedObject();
                geocodedObject.setText(address.Match_addr);
                geocodedObject.setPostalCode(address.Postal);
//                geocodedObject.setLatLng(address.latlng.lat, address.latlng.lng); // Todo

                var point = WebMercatorUtils.xyToLngLat(address.X, address.Y);
                var lnglat = new L.LatLng(point[1], point[0]);

                geocodedObject.setLatLng(lnglat.lat, lnglat.lng); // Todo
                geocodedObject.setBounds(lnglat, lnglat); // Todo
                geocodedObject.setAddress(
                    "Россия",
                    (address.Region) ? address.Region : null,
                    (address.Province) ? address.Province : null,
                    (address.City) ? address.City : null,
                    (address.StreetName) ? address.StreetName : null,
                    (address.House) ? address.House : null);
                console.log(geocodedObject);
                return geocodedObject;
            }
        },

        adaptLatLng: function(latlng) {

            var point = WebMercatorUtils.lngLatToXY(latlng.lng, latlng.lat, true);

            return {lat: point[0], lng: point[1]};
        }

    })
});



