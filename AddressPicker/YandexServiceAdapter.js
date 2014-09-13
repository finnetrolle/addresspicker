/**
 * Created by syachin on 13.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/on',
    'leaflets/leaflet',
    'AddressPicker/GeocodedObject',
    'dojo/domReady!'
], function(declare, dom, on, leaflet, GeocodedObject){

    return declare(null, {

        defaults: {
            geocoderName: 'Yandex',
            query: "1.x/",
            url: "http://geocode-maps.yandex.ru/",
            params: {
                format: 'json'
            }
        },
        forwardParameter: 'geocode',
        reverseParameter: 'geocode',

        adaptLatLng: function(latlng) {
            return {lat: latlng.lng, lng: latlng.lat};
        },

        convertResponseToResults: function(response) {
            var results = [];
            if (response) {
                var resp = response.response.GeoObjectCollection.featureMember;
                for (var i = 0; i < resp.length; ++i) {
                    results.push(this.createEsriAddressObject(resp[i]));
                }
            }
            return results;
        },

        createEsriAddressObject: function(address) {
            this.obj = null;
            var geocodedObject = new GeocodedObject();
            var o = address.GeoObject;
            console.log(o);

            var latlng = o.Point.pos.split(' ');
            geocodedObject.setLatLng(latlng[1],latlng[0]); // lng first because yandex is retarded.

            if (o.boundedBy && o.boundedBy.Envelope) {
                var arr1 = o.boundedBy.Envelope.lowerCorner.split(' ');
                var arr2 = o.boundedBy.Envelope.upperCorner.split(' ');
                geocodedObject.setBoundsLatLng(arr1[1], arr1[0], arr2[1], arr2[0]);
            } else {
                geocodedObject.setBoundsLatLng(latlng[1], latlng[0], latlng[1], latlng[0]);
            }

            geocodedObject.setText(o.metaDataProperty.GeocoderMetaData.text);

            var aDetails = o.metaDataProperty.GeocoderMetaData.AddressDetails;
            var country = null;
            var aarea = null;
            var saarea = null;
            var locality = null;
            var route = null;
            var street_number = null;
            if (aDetails.Country) {
                country = aDetails.Country.CountryName;
                if (aDetails.Country.AdministrativeArea) {
                    aarea = aDetails.Country.AdministrativeArea.AdministrativeAreaName;
                    if (aDetails.Country.AdministrativeArea.SubAdministrativeArea) {
                        saarea = aDetails.Country.AdministrativeArea.SubAdministrativeArea.SubAdministrativeAreaName;
                        if (aDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality) {
                            locality = aDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName;
                            if (aDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.Thoroughfare) {
                                route = aDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.Thoroughfare.ThoroughfareName;
                                if (aDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.Thoroughfare.Premise) {
                                    street_number = aDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.Thoroughfare.Premise.PremiseNumber;
                                }
                            }
                        }
                    }
                }
            }
            geocodedObject.setAddress(country, aarea, saarea, locality, route, street_number);
            return geocodedObject;
        }
    })
})
