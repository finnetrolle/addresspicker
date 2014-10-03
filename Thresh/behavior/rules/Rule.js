/**
 * Created by syachin on 01.10.2014.
 */
define([
    "dojo/_base/declare",
    "dojo/Evented",
    "Thresh/behavior/rules/CheckResult"
], function(declare, Evented, CheckResult) {

    return declare(Evented, {

        constructor: function () {

        },

        check: function() {
            // this method must be overriden
            return new CheckResult("Rule check method is not implemented");
        }

    });
});