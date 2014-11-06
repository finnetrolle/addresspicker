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

        initialize: function (params) {

            var self = this;
            require(['leaflets/esri-leaflet'], function () {
                Service = L.esri.Services.Service.extend({

                    initialize: function () {
                        this.url = params.url;
                        this.query = 'query';

                        if(params.where == undefined) {
                            params.where = '1=1';
                        }

                        if(params.outFields == undefined) {
                            params.outFields = '*';
                        }
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
                            where: params.where,
                            text: '',
                            objectIds: '',
                            time: '',
                            geometryType:'esriGeometryPoint',
                            inSR: '',
                            spatialRel: 'esriSpatialRelWithin',
                            relationParam: '',
                            outFields: params.outFields,
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

                    getResult: function (latlng, opts, callback, context) {
                        var par = this.getParams(latlng);
//                        console.log(par);
                        this.get(this.query, par, function (error, response) {
                            if (error) {
                                callback.call(context, error);
                            } else {
//                                console.log(response);
                                var result = '';
                                if (response.features.length > 0)
                                    result = response.features[0].attributes;
                                callback.call(context, error, result, response);
                            }
                        }, this);
                    }
                });
            });

            this.service = new Service();
        }
    });
});

