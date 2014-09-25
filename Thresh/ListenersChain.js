/**
 * Created by syachin on 25.09.2014.
 */
define([
    "dojo/_base/declare",
    "dojo/on"
], function(declare, on){

    return declare(null, {

        constructor: function(targetObject) {
            this.listeners = {};
            this.targetObject = targetObject;
        },

        addListener: function(trigger, method, stopPropagation) {
            var self = this;
            var handler = on(this.targetObject, trigger, function(event) {
                if (!self._isFinished(event)){
                    method(event);
                    if (stopPropagation)
                        event.stopPropagation();
                }
            });
            this._addHandler(trigger, handler);
            return handler;
        },

        addStoppingListener: function(trigger, method, stopPropagation) {
            var self = this;
            var handler = on(this.targetObject, trigger, function(event) {
                if (!self._isFinished(event)) {
                    method(event);
                    self._setFinished(event);
                    if (stopPropagation)
                        event.stopPropagation();
                }
            });
            this._addHandler(trigger, handler);
            return handler;
        },

        removeListener: function(handler) {
            if (this.targetObject) {
                if (handler) {
                    this._removeHandler(handler.trigger);
                    handler.remove();
                }
            }
        },

        destroyChain: function() {
            for (key in this.listeners) {
                if (this.listeners.hasOwnProperty(key)) {
                    this.listeners[key].remove();
                }
            }
        },

        _removeHandler: function(listenerTrigger) {
            if (listenerTrigger in this.listeners) {
                if (this.listeners.hawOwnProperty(listenerTrigger)) {
                    delete this.listeners[listenerTrigger];
                }
            }
        },

        _addHandler: function(listenerTrigger, handler) {
            this._removeHandler(listenerTrigger);
            this.listeners[listenerTrigger] = handler;
            handler.trigger = listenerTrigger;
        },

        _setFinished: function(event) {
              event._finished = true;
        },

        _isFinished: function(event) {
            if (event.hasOwnProperty('_finished'))
                if (event._finished)
                    return true;
            return false;
        }

    });

});