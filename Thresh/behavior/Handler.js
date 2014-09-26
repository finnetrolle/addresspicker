/**
 * Created by syachin on 26.09.2014.
 */
define([
    "dojo/_base/declare"
], function(declare) {

    return declare(null, {

        constructor: function (func) {
            this.func = func;
            this.terminator = false;
            this.propagationStopper = false;
        },

        execute: function(event) {
            this.func(event);
        },

        isTerminator: function() {
            return this.terminator;
        },

        isPropagationStopper: function() {
            return this.propagationStopper;
        },

        setPropagationStopper: function() {
            this.propagationStopper = true;
        },

        setTerminator: function() {
            this.terminator = true;
        }

    });
});