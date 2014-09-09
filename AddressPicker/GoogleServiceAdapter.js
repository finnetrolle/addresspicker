/**
 * Created by syachin on 09.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/on',
    'leaflets/leaflet',
    'dojo/domReady!'
], function(declare, dom, on, leaflet){

    return declare(null, {

        defaults: {
            url: "http://maps.googleapis.com/maps/api/geocode/",
            params: {
                sensor: false,
                language: 'ru',
                bounds: '58,27|62,36'
            }
        },

        getUrl: function() {
            return this.defaults.url;
        },

        getParams: function(addressText) {
            return {
                sensor: this.defaults.params.sensor,
                language: this.defaults.params.language,
                bounds: this.defaults.params.bounds,
                address: addressText
            }
        },

        getParamsReverse: function(latlng) {
            return {
                sensor: this.defaults.params.sensor,
                language: this.defaults.params.language,
                bounds: this.defaults.params.bounds,
                latlng: latlng.lat + "," + latlng.lng
            }
        },

        convertToEsriAddressObject: function(address) {

            function createEsriBounds(googleBounds, googleLatLng) {
                var bounds = new L.LatLngBounds();
                if (googleBounds) {
                    bounds.extend(googleBounds.northeast);
                    bounds.extend(googleBounds.southwest);
                    return bounds;
                }
                bounds.extend(googleLatLng);
                return bounds;
            };

            return {
                text: address.text,
                bounds: createEsriBounds(address.bounds, address.latlng),
                latlng: new L.LatLng(address.latlng.lat, address.latlng.lng),
                name: '[Name]',
                match: '[Match]',
                country: ("country" in address) ? address.country : "" ,
                region: ("administrative_area_level_1" in address) ? address.administrative_area_level_1 : "",
                subregion: ("administrative_area_level_2" in address) ? address.administrative_area_level_2 : "",
                city: ("locality" in address) ? address.locality : "",
                address: ("routeAndBuilding" in address) ? address.routeAndBuilding : ''
            };
        },

        parseResult: function(result) {
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
            };




        }

    })
})



