/**
 * Created by syachin on 26.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/behavior/Behavior"
], function(declare, Behavior) {

    return declare(Behavior, {

        constructor: function (eventsArray, logEventObjects) {
            var logE = logEventObjects;
            var eArray = eventsArray;
            for (var i = 0; i < eArray.length; ++i) {
                var trigger = eArray[i];
                this._addHandler(trigger, function (event) {
                    console.log('#LOG: ' + event);
                    if (logE)
                        console.log(event);
                }, false, false);
            }

        }

    });
});