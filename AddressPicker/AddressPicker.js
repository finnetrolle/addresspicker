/**
 * Created by syachin on 19.09.2014.
 */
require([
    'AddressPicker/MapDecorator'
], function (MapDecorator) {
    var mapDecorator = new MapDecorator();
    mapDecorator.initMap(); // init default values
    //ff

//    mapDecorator.initMap(30.00, 61.00); // init with position and default zoom
//    mapDecorator.initMap(30.00, 61.00, 12); // init with position and zoom
    /*
    default values
     centerPoint: {
     longitude: 30.3279556,
     latitude: 59.935885,
     zoom: 10
     }
    * */
});