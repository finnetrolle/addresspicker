/**
 * Created by syachin on 12.09.2014.
 */
define([
    'dojo/_base/declare',
    'AddressPicker/HouseParser',
    'AddressPicker/HouseMegaParser',
    'dojo/domReady!'
], function(declare, HouseParser, HouseMegaParser){

    //region AdressObjectFunctions
    function getAdressObject(inputStr){
        if(inputStr){
            return {
                number: getHouseNumber(inputStr),
                housing: getHousing(inputStr),
                letter: getLetter(inputStr),
                building: getBuilding(inputStr),
                fraction: getForeignAdress(inputStr)
            }
        }
        return null;
    };

    function getHouseNumber(inputStr){
        return (/^\d+/.exec(inputStr))[0];
    };

    function getHousing(inputStr){
        var housingPattern = /[к]\d+/;
        var housing =  (/\d+/.exec(housingPattern.exec(inputStr)));
        return housing ? housing[0] : null;
    };

    function getForeignAdress(inputStr){
        var foreignAdressPattern = /[\/|-]\d+\s{0,}[А-Яа-я]{0,1}/;
        var foreignAdress = foreignAdressPattern.exec(inputStr);
        if(foreignAdress) {
            var number = /\d+/.exec(foreignAdress[0]);
            return {
                numb: number ? number[0] : null,
                letter: getLetter(foreignAdress[0].replace(/[\/|-]/, ''))
            }
        }
        return null;
    };

    function getLetter(inputStr){
        var singleAdressPattern = /^\d+\s{0,}([к]\d+){0,1}\s{0,}([(с|С)]\d+){0,1}\s{0,}[А-Яа-я]($|\/|-|\s)/;
        var singleAdress = (singleAdressPattern.exec(inputStr));
        if(singleAdress){
            var letter = /[А-Яа-я]$/.exec(singleAdress[0].replace(/[\/|-]/,''));
            return letter ? letter[0] : null;
        }
        return null;
    };

    function getBuilding(inputStr){
        var buildingPattern = /[(с|С)]\d+/;
        var building =  (/\d+/.exec(buildingPattern.exec(inputStr)));
        return building ? building[0] : null;
    };
    //endregion

    // This returned object becomes the defined value of this module
    return declare(null, {
        text: null,
        res: null,
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
        parsedHouse: null,

        parser: null,

        geocodeLevel: 0,
        SUCCESSFULL_GEOCODE_LEVEL: 6,
        SUCCESSFULL_TO_SAVE_GEOCODE_LEVEL: 5,

        constructor: function() {
            this.parser = new HouseMegaParser();
        },

        parseHouseString: function() {
            if (!this.street_number) {return;}
            this.parsedHouse = this.parser.parse(this.street_number);
//          testers
//            console.log(HouseParser("38 A / 12 к 23 Б"));
//
//            console.log("3 A - 74 Y / 12 к 23 Б");
//            console.log(HouseMegaParser().parse("3 A - 74 Y / 12 к 23 Б"));
//            console.log(HouseMegaParser().parse("12к34с56 А / 7 к 8 с 90 Б"));
//            console.log(HouseMegaParser().parse("1А"));
//            console.log(HouseMegaParser().parse("1 А"));
//            console.log(HouseMegaParser().parse("17-18 Б"));
        },

        setLiter: function(liter) {
            this.liter = liter;
        },

        setHouseCorpus: function(corpus) {
            this.houseCorp = corpus;
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
            if(cadasterNumber != undefined) {
                this.cadasterNumber = cadasterNumber;
            }
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

        setRes: function(res) {
            this.res = res;
        },

        setAddress: function(country, region, subregion, city, route, street_number) {
            this.geocodeLevel = 0;
//            this.country = null;
//            this.region = null;
//            this.subregion = null;
//            this.city = null;
//            this.route = null;
//            this.street_number = null;
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
                                    this.parseHouseString();
                                    this.geocodeLevel = 6;
                                    this.address += ", " + street_number;
                                }
                            }
                        }
                    }
                }
            }
            // last chance
            if (this.geocodeLevel <= 2) {
                var splitter = this.text.split(', ');
                this.country = (this.country) ? this.country : splitter[0];
                this.region = (this.region) ? this.region : splitter[1];
                this.subregion = (this.subregion) ? this.subregion : splitter[2];
                this.route = (this.route) ? this.route : splitter[3];
            }

//            if (!this.country) this.country = country;
//            if (!this.region) this.region = region;
//            if (!this.subregion) this.subregion = subregion;
//            if (!this.city) this.city = city;
//            if (!this.route) this.route = route;
//            if (!this.street_number) this.street_number = street_number;

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

        createInfo:  function() {
            var info = '';

            if(this.route != null && this.route.length > 0) {
                info += this.route;
            }

            if(this.street_number != null && this.street_number.length > 0) {
                info += ' ' + this.street_number;
            }

            if(this.subregion != null && this.subregion.length > 0) {
                info += ', ' + this.subregion;
            }

            if(this.region != null && this.region.length > 0) {
                info += ', ' + this.region;
            }

            info += ', Россия';

            if(this.postal != null && this.postal.length > 0) {
                info += ', ' + this.postal;
            }

            return info;
        },

        getResult: function() {
            return {
                type: '_object',
                info: this.createInfo(),
                geometry: {
                    x: this.latlng.lng,
                    y: this.latlng.lat
                },
                elements: {
                    cadasternumber: this.cadasterNumber,
                    country: {fullName: this.country, shortName: 'RU' },
                    district1: {fullName: this.region, shortName: '' },
                    district2: {fullName: this.subregion, shortName: '' },
                    index: {fullName: this.postal, shortName: '' },
                    locality: {fullName: this.city, shortName: '' },
                    toponim: this.route,
                    housenumber: {fullName: this.street_number, shortName: '' },
                    housebld: '',
                    houseliter: '',
                    RES: this.res
                }
            };
        },

        resultToString: function(result) {

            var info = '';

            if(this.route != null && this.route.length > 0) {
                info += this.route;
            }

            if(this.street_number != null && this.street_number.length > 0) {
                info += ' ' + this.street_number;
            }

            if(this.subregion != null && this.subregion.length > 0) {
                info += ', <br>' + this.subregion;
            }

            if(this.region != null && this.region.length > 0) {
                info += ', <br>' + this.region;
            }

            info += ', <br>Россия';

            if(this.postal != null && this.postal.length > 0) {
                info += ', <br>' + this.postal;
            }

            if(this.cadasterNumber != null && this.cadasterNumber.length > 0) {
                info += ', <br> Кад. номер: ' + this.cadasterNumber;
            }

            if(this.res != null && this.res.length > 0) {
                info += ', <br>' + this.res;
            }

            return info;
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
