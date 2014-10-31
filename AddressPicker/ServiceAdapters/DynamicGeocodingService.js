/**
 * Created by syachin on 13.09.2014.
 */
define([
    'dojo/_base/declare'
], function(declare){

    return declare(null, {

        generate: function(geocoderName, query, reverseQuery, suggestionQuery, url, params,
            forwardParamater, reverseParameter, suggestParameter, adaptLatLng, convertResponseToResults) {
            this.geocoderName = geocoderName;
            this.query = query;
            this.reverseQuery = reverseQuery;
            this.suggestionQuery = suggestionQuery;
            this.url = url;
            this.params = params;
            this.forwardParameter = forwardParamater;
            this.reverseParameter = reverseParameter;
            this.suggestParameter = suggestParameter;
            this.adaptLatLng = adaptLatLng;
            this.convertResponseToResults = convertResponseToResults;
        }
    })
});
