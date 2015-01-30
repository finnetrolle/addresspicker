/**
 * Created by Travin on 30.01.2015.
 */
define([
    'dojo/_base/declare',
    'dojo/domReady!'
], function(declare){

    return declare(null, {

        getRightCadasterNumber: function(cadasterNumber, length){
            cadasterNumber = cadasterNumber.split('');
            switch (length){
                case 9:
                    cadasterNumber.splice(2,0,':');
                    break
                case 11:
                    cadasterNumber.splice(2,0,':');
                    cadasterNumber.splice(5,0,':');
                    break
                case 14:
                    cadasterNumber.splice(2,0,':');
                    cadasterNumber.splice(10,0,':');
                    break
                case 16:
                    cadasterNumber.splice(2,0,':');
                    cadasterNumber.splice(5,0,':');
                    cadasterNumber.splice(13,0,':');
                    break
                case 18:
                    cadasterNumber.splice(2,0,':');
                    cadasterNumber.splice(10,0,':');
                    cadasterNumber.splice(16, 0, ':');
                    break
                case 20:
                    cadasterNumber.splice(2,0,':');
                    cadasterNumber.splice(5,0,':');
                    cadasterNumber.splice(13,0,':');
                    cadasterNumber.splice(19,0,':');
                    break
                case 21:
                    cadasterNumber.splice(2,0,':');
                    cadasterNumber.splice(10,0,':');
                    cadasterNumber.splice(16, 0, ':');
                    cadasterNumber.splice(21,0,':');
                    break
                case 23:
                    cadasterNumber.splice(2,0,':');
                    cadasterNumber.splice(5,0,':');
                    cadasterNumber.splice(13,0,':');
                    cadasterNumber.splice(19,0,':');
                    cadasterNumber.splice(24,0,':');
                    break
                default:
                    return []
            }
            return cadasterNumber.join('');
        }

    });
});