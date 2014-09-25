/**
 * Created by syachin on 25.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/ListenersChain"
], function(declare, ListenersChain) {

    return declare(ListenersChain, {

        constructor: function () {
            this.addListener('click', function(e) {e.stopPropagation();});
            this.addListener('dbl-click', function(e) {e.stopPropagation();});
            this.addListener('mouse-over', function(e) {e.stopPropagation();});
            this.addListener('mouse-out', function(e) {e.stopPropagation();});
            this.addListener('mouse-move', function(e) {e.stopPropagation();});
            this.addListener('mouse-down', function(e) {e.stopPropagation();});
            this.addListener('mouse-up', function(e) {e.stopPropagation();});
            this.addListener('mouse-drag', function(e) {e.stopPropagation();});
        }

    });
});