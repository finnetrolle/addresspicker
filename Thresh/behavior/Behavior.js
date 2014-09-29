/**
 * Created by syachin on 26.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/behavior/Handler"
], function(declare, Handler) {

    return declare(null, {

        constructor: function (servicableObject) {
            this.servicableObject = servicableObject;
            this.triggers = {};
        },

        setDebugMode: function () {
            this.debugMode = true;
        },

        isDebugModeOn: function () {
            if (this.debugMode)
                return true;
            return false;
        },

        _addHandler: function (trigger, functor, propagationStopper, terminator) {
            var handler = new Handler(functor);
            if (propagationStopper)
                handler.setPropagationStopper();
            if (terminator)
                handler.setTerminator();
            this.triggers[trigger] = handler;
        },

        getTriggersList: function() {
            return this.triggers;
        },

        getHandler: function(trigger) {
            if (this.triggers.hasOwnProperty(trigger)) {
                return this.triggers[trigger];
            }
            return null;
        }



    });
});