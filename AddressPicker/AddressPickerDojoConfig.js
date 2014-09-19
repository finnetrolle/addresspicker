/**
 * Created by syachin on 19.09.2014.
 */
var dojoConfig = {
    async: true,
    packages: [
        {
            name: "esri-leaflet",
            location: location.pathname.replace(/\/[^/]*$/, '') + ''
        },
        {
            name: "MapDecorator",
            location: location.pathname.replace(/\/[^/]*$/, '') + '/AddressPicker'
        }
    ]
};