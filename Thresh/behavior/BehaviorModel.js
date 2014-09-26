/**
 * Created by syachin on 26.09.2014.
 */
define([
    "dojo/_base/declare",
    "dojo/on",
    "Thresh/behavior/Behavior"
], function(declare, on, Behavior) {

    return declare(null, {

        servicableObject: null,

        constructor: function (servicableObject) {
            this.servicableObject = servicableObject;
            this.chains = {}; // hash is listener's trigger e.g. "onClick"
            this.behaviors = [];
        },

        addBehavior: function (behavior) {
            if (behavior instanceof Behavior) {
                this.behaviors.push(behavior); // add behavior to array
                var triggers = behavior.getTriggersList();
                for (key in triggers) {
                    if (triggers.hasOwnProperty(key)) {
                        if (!this.chains.hasOwnProperty(key)) {
                            this._addChain(key);
                        }
                    }
                }
            }
        },

        _addChain: function(trigger) {
            var self = this;
            this.chains[trigger] = on(this.servicableObject, trigger, function(event) {
                for (var i = 0; i < self.behaviors.length; ++i) {
                    var behavior = self.behaviors[i];
                    var handler = behavior.getHandler(trigger);
                    if (handler) {
                        handler.execute(event);
                        if (handler.isPropagationStopper())
                            event.stopPropagation();
                        if (handler.isTerminator())
                            return;
                    }
                }
            });
        },

        removeBehavior: function (behavior) {
            for (var i = 0; i < this.behaviors.length; ++i) {
                if (this.behavior[i] === behavior) {
                    return this.behaviors.splice(i, 1);
                }
            }
            return null;
        }

    });
});