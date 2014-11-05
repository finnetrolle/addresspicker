/**
 * Created by syachin on 12.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/domReady!'
], function(declare){

    // This returned object becomes the defined value of this module
    return declare(null, {
        text: null,
        bounds: null,
        latlng: null,
        name: null,
        match: null,
        postal: null,   // Todo - postal field must be filled
        country: null,      // level 1
        region: null,       // level 2
        subregion: null,    // level 3
        city: null,         // level 4
        route: null,        // level 5 - GOOGLE field
        street_number: null,// level 6 - GOOGLE field
        address: null,      // level 5 or 6 - ARCGIS field
        cadasterNumber: null,
        dataType: null, // тип данных
        geometryType: null, // тип геометрии
        houseCorp: null,
        liter: null,
        res: null,

        geocodeLevel: 0,
        SUCCESSFULL_GEOCODE_LEVEL: 6,
        SUCCESSFULL_TO_SAVE_GEOCODE_LEVEL: 5,

        setLiter: function(liter) {
            this.liter = liter;
        },

        setHouseCorpus: function(corpus) {
            this.houseCorp = corpus;
        },

        setRes: function(res) {
            this.res = res;
        },

        setGeometryType: function(geoType) {
            this.geometryType = geoType;
        },

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

        setCadasterNumber: function(cadasterNumber) {
            this.cadasterNumber = cadasterNumber;
        },

        setLatLng: function(latitude, longitude) {
            this.latlng = new L.LatLng(latitude, longitude);
        },

        setPostalCode: function(postal_code) {
            this.postal = postal_code;
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

        isValid: function() {
            return this.latlng !== null;
        },

        isPartiallyGeocoded: function(lvl) {
            if (this.isValid()) {
                if (this.geocodeLevel > lvl) {
                    return true;
                }
            }
            return false;
        },

        isSuccessfullyGeocoded: function() {
            return !!this.isPartiallyGeocoded(0);

        },

        isSuccessfullyToSave: function() {
            return !!this.isPartiallyGeocoded(this.SUCCESSFULL_TO_SAVE_GEOCODE_LEVEL);
        },

        getResult: function() {
            return {
                type: '_object',
                info: null, // Todo - insert info ???
                geometry: {
                    x: this.latlng.lng,
                    y: this.latlng.lat
                },
                elements: {
                    cadasternumber: this.cadasterNumber,
                    country: this.country,
                    district1: this.region,
                    district2: this.subregion,
                    index: this.postal,
                    locality: this.city,
                    toponim: this.route,
                    housenumber: this.street_number
//                    housebld: '',
//                    houseliter: '',
//                    RES: null // Todo - insert RES ??? WTF is res?
                }
            };
        },

        resultToString: function(result) {
            var s = "Result object:\n";
//            s += "type: " + result.type + '\n';
//            s += "info: " + result.info + '\n';
            s += "geometry: " + result.geometry.x + ',' + result.geometry.y + '\n';
            s += "elements: \n";
            for (var key in result.elements) {
                s += '    ' + String(key) + ': ' + String(result.elements[key] + '\n');
            }
            return s;
        },

        getHtmlForSideWindow: function() {
            var html =
                "<p>[" + new Date().toLocaleTimeString() + "]</p>" +
                "<p>Тип данных: " + (this.dataType || "<нет данных>") + "</p>" +
                "<p>Данные: " + (this.text || "<нет данных>") + "</p>" +
                "<p>Тип геометрии: " + (this.geometryType || "<нет данных>") + "</p>" +
                "<p>Индекс: " + (this.postal || "<нет данных>") + "</p>" +
                "<p>Страна: " + (this.country || "<нет данных>") + "</p>" +
                "<p>Регион: " + (this.region || "<нет данных>") + "</p>" +
                "<p>Административный район: " + (this.subregion || "<нет данных>") + "</p>" +
                "<p>Муниципалитет: " + (this.city || "<нет данных>") + "</p>" +
                "<p>Топоним: " + (this.route || "<нет данных>") + "</p>" +
                "<p>Номер дома: " + (this.street_number || "<нет данных>") + "</p>" +
                "<p>Корпус дома: " + (this.houseCorp || "<нет данных>") + "</p>" +
                "<p>Литер дома: " + (this.liter || "<нет данных>") + "</p>" +
                "<p>Кадастровый номер: " + (this.cadasterNumber || "<нет данных>") + "</p>" +
                "<p>РЭС: " + (this.res || "<нет данных>") + "</p>" +
                "</br>";
            return html;
        }
    });
});
