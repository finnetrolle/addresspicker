/**
 * Created by syachin on 18.12.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/domReady!'
], function(declare){

    return declare(null, {

        number: "",
        housing: "",
        numberLetter: "",
        building: "",
        fraction: "",
        fractionLetter: "",

        constructor: function (house) {
//            console.log("[Parser Started]");
//            console.log("House string >>>");
//            console.log(house);

            var dest = 'number';
            var letterDest = 'number';

            for (var i = 0; i < house.length; ++i) {
                if (house[i] == " ") {
                    continue;
                }
                var additionFlag = false;
                switch (house[i]) {
                    case 'к': dest = 'housing'; break;
                    case 'с': dest = 'building'; break;
                    case '/': dest = 'fraction'; letterDest = 'fraction'; break;
                    case '-': dest = 'fraction'; letterDest = 'fraction'; break;
                    default: additionFlag = true;
                }
                if (additionFlag) {
                    if (isNaN(house[i])) {
                        this[letterDest+'Letter'] += house[i];
                    } else {
                        this[dest] += house[i];
                    }

                }
            }
        }

    });
});