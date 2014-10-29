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
                RegionsService = L.esri.Services.Service.extend({

                    initialize: function () {
                        this.url = 'http://gis-node-1.atr-sz.ru/arcgis/rest/services/GeoAddress/Address/MapServer/4/';
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
                            outFields: 'Region',
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

                    checkRegion: function (latlng, opts, callback, context) {
                        var par = this.getParams(latlng);
//                        console.log(par);
                        this.get(this.query, par, function (error, response) {
                            if (error) {
                                callback.call(context, error);
                            } else {
//                                console.log(response);
                                var result = '';
                                if (response.features.length > 0)
                                    result = response.features[0].attributes.Region;
                                callback.call(context, error, result, response);
                            }
                        }, this);

                        console.log('---');
                    }
                });
            });

            this.service = new RegionsService();
        }
    });
})

