/**
 * Created by syachin on 25.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/ListenersChain"
], function(declare, ListenersChain) {

    return declare(ListenersChain, {

        constructor: function () {
            this.addListener('click', function(event) {

            });
        }

    });
});