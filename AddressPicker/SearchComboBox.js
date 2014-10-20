/**
 * Created by syachin on 13.10.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/on',
    'AddressPicker/GeocodedObject',
    'dijit/form/ComboBox',
    'dojo/store/Memory',
    'dojo/domReady!'
], function(declare, dom, on, GeocodedObject, ComboBox, Memory) {

    return declare(ComboBox, {

        constructor: function(inputId, name, value, searchAttr) {
            this.id = inputId;
            this.name = name;
            this.value = value;
            this.searchAttr = searchAttr;
            this.storage = null;
        },

        loadSuggestions: function(objectsArray) {
            this.storage = new Memory({
                data: []
            });
            for (var i = 0; i < objectsArray.length; ++i) {
                this.storage.data.push({name: objectsArray[i].text});
            }
        }

    });

});