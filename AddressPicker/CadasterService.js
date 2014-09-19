/**
 * Created by syachin on 15.09.2014.
 */
define([
    'dojo/_base/declare',
    'leaflets/leaflet',
    'esri/geometry/webMercatorUtils',
    'dojo/domReady!'
    ], function (
        declare
        ,leaflet
        ,WebMercatorUtils
    ) {



    return declare(null, {

        initialize: function () {
            var self = this;
            require(['leaflets/esri-leaflet'], function () {
                CadService = L.esri.Services.Service.extend({

                    initialize: function () {
                        this.url = 'http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreOriginal/MapServer/0/';
                        this.query = 'query';
                    },

                    getParams: function(latlng) {
//                        var point = WebMercatorUtils.geographicToWebMercator(
//                            {
//                                "x": latlng.lng,
//                                "y": latlng.lat
//                            });
                        var point = WebMercatorUtils.lngLatToXY(latlng.lng, latlng.lat, true);
                        return {
                            geometry: point[0] + ',' + point[1],
                            where: '1=1',
                            text: '',
                            objectIds: '',
                            time: '',
                            geometryType:'esriGeometryPoint',
                            inSR: '',
                            spatialRel: 'esriSpatialRelWithin',
                            relationParam: '',
                            outFields: 'PARCEL_ID',
                            returnGeometry: false,
                            maxAllowableOffset: '',
                            geometryPrecision: '',
                            outSR: '',
                            returnIdsOnly: false,
                            returnCountOnly: false,
                            orderByFields: '',
                            groupByFieldsForStatistics: '',
                            outStatistics: '',
                            returnZ: false,
                            returnM: false,
                            gdbVersion: '',
                            returnDistinctValues: false,
                            f: 'pjson'
                        }
                    },

                    getCadasterNumber: function (latlng, opts, callback, context) {
                        var par = this.getParams(latlng);
//                        console.log(par);
                        this.get(this.query, par, function (error, response) {
                            if (error) {
                                callback.call(context, error);
                            } else {
//                                console.log(response);
                                var result = response.features[0].attributes.PARCEL_ID;
                                callback.call(context, error, result, response);
                            }
                        }, this);
                    }
                });
            });

            this.service = new CadService();
        }
    });
})

