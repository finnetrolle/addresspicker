/**
 * Created by syachin on 01.10.2014.
 */
define([
    "dojo/_base/declare",
    "dojo/on",
    "dojo/behavior/rules/Rule"
], function(declare, on, Rule) {

    return declare(null, {

        constructor: function (targetObject) {
            this.targetObject = targetObject;
            this.ruleChain = {};
        },

        addRule: function (trigger, rule) {
            var self = this;
            if (!this.ruleChain.hasOwnProperty(trigger)) {
                this.ruleChain[trigger] = [];
                on(this.targetObject, trigger, function(event) {
                    var result = {
                        rulesPassed: true,
                        resultArray: []
                    };
                    if (self.ruleChain.hasOwnProperty(trigger)) {
                        var chain = self.ruleChain[trigger];
                        for (var i = 0; i < chain.length; ++i) {
                            var r = chain[i].check();
                            result.resultArray.push(r);
                            if (r.isFailed())
                                result.rulesPassed = false;
                        }
                    }
                    return result;
                });
            }
            this.ruleChain[trigger].push(rule);
        }





    });
});