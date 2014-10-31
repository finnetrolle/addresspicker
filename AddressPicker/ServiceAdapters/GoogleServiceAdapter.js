/**
 * Created by syachin on 09.09.2014.
 */
define([
    'dojo/_base/declare',
    'leaflets/leaflet',
    'AddressPicker/GeocodedObject'
], function(declare, leaflet, GeocodedObject){

    return declare(null, {

        geocoderName: 'Google',

        query: "json",
        reverseQuery: 'json',
        suggestionQuery: "json",

        url: "http://maps.googleapis.com/maps/api/geocode/",
        params: {
            sensor: false,
            language: 'ru'
        },

        forwardParameter: 'address',
        reverseParameter: 'latlng',
        suggestParameter: 'address',

        convertResponseToResults: function(response) {
            var results = [];
//            console.log(response);
            if (response) {
                var resp = response.results;
                for (var i = 0; i < resp.length; ++i) {
                    results.push(createEsriAddressObject(parseResult(resp[i])));
                }
            }
            return results;


             function createEsriAddressObject(address) {
                this.obj = null;
                var geocodedObject = new GeocodedObject();
                geocodedObject.setText(address.text);
                geocodedObject.setPostalCode(address.postal_code);
                geocodedObject.setLatLng(address.latlng.lat, address.latlng.lng);
                (address.bounds)
                    ? geocodedObject.setBounds(address.bounds.northeast, address.bounds.southwest)
                    : geocodedObject.setBounds(address.latlng, address.latlng);
                geocodedObject.setAddress(
                    (address.country) ? address.country.toString() : null,
                    (address.administrative_area_level_1) ? address.administrative_area_level_1.toString() : null,
                    (address.administrative_area_level_2) ? address.administrative_area_level_2.toString() : null,
                    (address.locality) ? address.locality.toString() : null,
                    (address.route) ? address.route.toString() : null,
                    (address.street_number) ? address.street_number.toString() : null);
                return geocodedObject;
            }

            function parseResult(result) {
                var addressComponents = result.address_components;
                var address = {};
                for (var i = 0; i < addressComponents.length; ++i) {
                    var acomp = parseGoogleAddressComponent(addressComponents[i]);
                    address[acomp.type] = acomp;
                }
                address.latlng = result.geometry.location;
                address.text = result.formatted_address;
                if ("bounds" in result.geometry)
                    address.bounds = result.geometry.bounds;

                if ("route" in address) {
                    address.routeAndBuilding = address.route;
                    if ("street number" in address)
                        address.routeAndBuilding += " " + address.street_number;
                }

                return address;

                function parseGoogleAddressComponent(addressComponent) {
                    return {
                        type: addressComponent.types[0],
                        long: addressComponent.long_name,
                        short: addressComponent.short_name,

                        toString: function () {
                            return this.long;
                        }
                    };
                }
            }
        },

        adaptLatLng: function(latlng) {
            return latlng;
        }

    })
});



