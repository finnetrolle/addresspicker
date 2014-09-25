/**
 * Created by syachin on 25.09.2014.
 */
define([
    "dojo/_base/declare",
    "Thresh/ListenersChain"
], function(declare, ListenersChain) {

    return declare(ListenersChain, {

        counter: 0,
        eventLogging: false,

        constructor: function () {
            var self = this;

            this.addListener('click', function(event) {
                console.log('Event ' + self.counter + ' fired: click');
                if (self.eventLogging) console.log(event);
                self.counter ++;
            });
            this.addListener('dbl-click', function(event) {
                console.log('Event ' + self.counter + ' fired: double click');
                if (self.eventLogging) console.log(event);
                self.counter ++;
            });
            this.addListener('mouse-over', function(event) {
                console.log('Event ' + self.counter + ' fired: mouse over');
                if (self.eventLogging) console.log(event);
                self.counter ++;
            });
            this.addListener('mouse-out', function(event) {
                console.log('Event ' + self.counter + ' fired: mouse out');
                if (self.eventLogging) console.log(event);
                self.counter ++;
            });
            this.addListener('mouse-move', function(event) {
                console.log('Event ' + self.counter + ' fired: mouse move');
                if (self.eventLogging) console.log(event);
                self.counter ++;
            });
            this.addListener('mouse-down', function(event) {
                console.log('Event ' + self.counter + ' fired: mouse down');
                if (self.eventLogging) console.log(event);
                self.counter ++;
            });
            this.addListener('mouse-up', function(event) {
                console.log('Event ' + self.counter + ' fired: mouse up');
                if (self.eventLogging) console.log(event);
                self.counter ++;
            });
            this.addListener('mouse-drag', function(event) {
                console.log('Event ' + self.counter + ' fired: mouse dragging');
                if (self.eventLogging) console.log(event);
                self.counter ++;
            });
        },

        enableEventLogging: function() {
            this.eventLogging = true;
        },

        disableEventLogging: function() {
            this.eventLogging = false;
        }

    });

});