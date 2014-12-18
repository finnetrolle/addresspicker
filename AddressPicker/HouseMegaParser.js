/**
 * Created by syachin on 18.12.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/domReady!'
], function(declare){

    return declare(null, {

        _createFraction: function(dest) {
            var o = {};
            if (!dest.hasOwnProperty('fractions')) {
                dest.fractions = [];
            }
            dest.fractions.push(o)
            return o;
        },

        _addToField: function(name, dest, value) {
            if (!dest.hasOwnProperty(name)) {
                dest[name] = value;
            } else {
                dest[name] += value;
            }
        },

        _smartAddToField: function(name, value, dest) {
            if (isNaN(value)) {
                this._addToField('letter', dest, value);
            }  else {
                this._addToField(name, dest, value);
            }
        },

        parse: function(house) {
            var result = {};

            var destObj = result;
            var destFieldName = 'number';

            for (var i = 0; i < house.length; ++i) {
                if (house[i] == " ") continue;
                switch (house[i]) {
                    case 'к': destFieldName = 'housing'; break;
                    case 'с': destFieldName = 'building'; break;
                    case '/': ;
                    case '-': destObj = this._createFraction(result); destFieldName = 'number'; break;
                    default: this._smartAddToField(destFieldName, house[i], destObj);
                };
            }
            return result;
        }
    });
});