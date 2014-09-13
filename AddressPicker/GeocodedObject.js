/**
 * Created by syachin on 12.09.2014.
 */
define([
    'dojo/_base/declare',
    'leaflets/leaflet',
    'dojo/domReady!'
], function(declare, leaflet){

    // This returned object becomes the defined value of this module
    return declare(null, {
        text: null,
        bounds: null,
        latlng: null,
        name: null,
        match: null,
        country: null,      // level 1
        region: null,       // level 2
        subregion: null,    // level 3
        city: null,         // level 4
        route: null,        // level 5 - GOOGLE field
        street_number: null,// level 6 - GOOGLE field
        address: null,      // level 5 or 6 - ARCGIS field

        geocodeLevel: 0,
        SUCCESSFULL_GEOCODE_LEVEL: 6,

        setBounds: function(northeast, southwest) {
            this.bounds = new L.LatLngBounds();
            this.bounds.extend(northeast);
            this.bounds.extend(southwest);
        },

        setBoundsLatLng: function(lat1, lon1, lat2, lon2) {
            var A = new L.LatLng(lat1, lon1);
            var B = new L.LatLng(lat2, lon2);
            this.setBounds(A, B);
        },

        setLatLng: function(latitude, longitude) {
            this.latlng = new L.LatLng(latitude, longitude);
        },

        setText: function(text) {
            this.text = text;
        },

        setAddress: function(country, region, subregion, city, route, street_number) {
            this.geocodeLevel = 0;
            if (country) {
                this.country = country;
                this.geocodeLevel = 1;
                if (region) {
                    this.region = region;
                    this.geocodeLevel = 2;
                    if (subregion) {
                        this.subregion = subregion;
                        this.geocodeLevel = 3;
                        if (city) {
                            this.city = city;
                            this.geocodeLevel = 4;
                            if (route) {
                                this.route = route;
                                this.geocodeLevel = 5;
                                this.address = route;
                                if (street_number) {
                                    this.street_number = street_number;
                                    this.geocodeLevel = 6;
                                    this.address += ", " + street_number;
                                }
                            }
                        }
                    }
                }
            }
        },

        getExpectingAddressFields: function() {
            var a = [];
            if (this.country) a.push('Country');
            if (this.region) a.push('Region');
            if (this.subregion) a.push('Subregion');
            if (this.city) a.push('City');
            if (this.route) a.push('Route');
            if (this.street_number) a.push('Street number');
            return a;
        },


        isValid: function() {
            if (this.latlng !== null)
                return true;
            return false;
        },

        isPartiallyGeocoded: function() {
            if (this.isValid()) {
                if (this.geocodeLevel > 0) {
                    return true;
                }
            }
            return false;
        },

        isSuccessfullyGeocoded: function() {
            if (this.isPartiallyGeocoded() && this.geocodeLevel == this.SUCCESSFULL_GEOCODE_LEVEL) {
                return true;
            }
            return false;
        }
    });
})
