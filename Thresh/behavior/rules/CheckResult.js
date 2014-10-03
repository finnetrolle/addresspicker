/**
 * Created by syachin on 01.10.2014.
 */
define([
    "dojo/_base/declare"
], function(declare) {

    return declare(null, {

        constructor: function (error) {
            if (error) {
                this.result = false;
                this.error = error;
            } else {
                this.result = true;
                this.error = null;
            }
        },

        isSuccessed: function() {
            if (this.result) return true;
        },

        isFailed: function() {
            if (!this.result) return false;
        }

    });
});