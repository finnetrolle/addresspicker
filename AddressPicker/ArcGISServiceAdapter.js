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
            reverseQuery: 'reverseGeocode',
            url: "http://gis-node-1.atr-sz.ru/arcgis/rest/services/GeoAddress/AddressComposite/GeocodeServer/",
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
//            console.log(response);

            var results = [];

            self.exists = [];

            if (response) {
                if ('address' in response) {
                    // this is reverse geocoding
                    // dirty hack to add location into results
                    response.address.X = response.location.x;
                    response.address.Y = response.location.y;
                    response.address.Match_addr =
                        response.address.Region + ', ' +
                        response.address.Province + ', ' +
                     //   response.address.City + ', ' +
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
                        var item = createEsriAddressObject(resp[i].attributes);
                        if (item) {
                            results.push(item);
                        }
                    }
                }
            }
            return results;

            function createEsriAddressObject(address) {
                var self = this;

                this.obj = null;
                var geocodedObject = new GeocodedObject();
                // geocodedObject.setText(address.Match_addr);

                geocodedObject.setPostalCode(address.Postal);
//                geocodedObject.setLatLng(address.latlng.lat, address.latlng.lng); // Todo

                var point = WebMercatorUtils.xyToLngLat(address.X, address.Y);
                var lnglat = new L.LatLng(point[1], point[0]);

                geocodedObject.setLatLng(lnglat.lat, lnglat.lng); // Todo

                geocodedObject.setBounds(lnglat, lnglat); // Todo

                if (address.HouseEnding) {
                    address.House += address.HouseEnding;
                }

                // if User_fld is exists and not empty
                if(address.User_fld != '' && address.User_fld != undefined) {
                    // we can add region and province fields from user field
                    // cause user_field is always filled with region and province for streets result
                    var spiltstr = address.User_fld.split(', ');
                    address.Region = spiltstr[0];
                    address.Province = spiltstr[1];
                    address.StreetName = address.Match_addr;
//                    console.log(spiltstr);

                    geocodedObject.setText("Россия, " + address.User_fld + ", " + address.Match_addr);

                    geocodedObject.setAddress(
                        "Россия",
                        address.User_fld
//                        address.Region,
//                        address.Province,
//                        address.City,
//                        address.StreetName,
//                        address.House
                    );

                } else {
                    geocodedObject.setText("Россия, " + address.Match_addr);

                    geocodedObject.setAddress(
                        "Россия",
                        (address.Region) ? address.Region : null,
                        (address.Province) ? address.Province : null,
                        (address.City) ? address.City : 'Санкт-Петербург',
                        (address.StreetName) ? address.StreetName : null,
                        (address.House) ? address.House : null
                    );
                }

                if(self.exists[address.User_fld + address.StreetName + address.House] == undefined && (address.User_fld != '' || geocodedObject.geocodeLevel >= 4)) {
                    self.exists[address.User_fld + address.StreetName + address.House] = true;
                    return geocodedObject;
                }

                return false;
            }
        },

        adaptLatLng: function(latlng) {

            var point = WebMercatorUtils.lngLatToXY(latlng.lng, latlng.lat, true);

            return {lat: point[0], lng: point[1]};
        }

    })
});