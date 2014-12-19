/**
 * Created by syachin on 08.09.2014.
 */
(function(L){

    var adapter = null;
    var settings = null;

    require([
        'AddressPicker/AbstractServiceAdapter',
        'AddressPicker/AddressPickerSettings'
    ], function (ServiceAdapter, AddressPickerSettings) {
        adapter = new ServiceAdapter();
        settings = new AddressPickerSettings();
        adapter.initService(settings.serviceAdapter);
    });



    IGITGeocoding = L.esri.Services.Service.extend({

        previousSuggestResults: null,

        initialize: function () {
            this.url = adapter.getUrl();
        },

        getAdapter: function() {
            return adapter;
        },

        geocode: function(text, opts, callback, context) {
            this.filterResult = null;
            if (this.previousSuggestResults !== null) {
                for (var i = 0; i < this.previousSuggestResults.length; ++i) {
                    if (this.previousSuggestResults[i].text === text) {
                        this.filterResult = this.previousSuggestResults[i];
                    }
                }
            }

            this.get(adapter.getQuery(), adapter.getParams(text), function(error, response){
                if(error) {
                    callback.call(context, error);
                } else {
                    var results = [];

                    var preResults = adapter.convertResults(response);
                    if (this.filterResult) {
                        for (var i = preResults.length -1; i >= 0; i--) {
                            var result = preResults[i];
                            if (result.text === this.filterResult.text) {
                                results.push(result);
                            }
                        }
                    } else {
                        for (var i = preResults.length - 1; i >= 0; i--) {
                            var result = preResults[i];
                            results.push(result);
                        }
                    }

                    callback.call(context, error, results, response);
                }
            }, this);
        },

        reverse: function(latlng, opts, callback, context) {
            this.get(adapter.getReverseQuery(), adapter.getReverseParams(latlng), function(error, response){

                if(error) {
                    callback.call(context, error);
                } else {
                    var error = null;
                    var results = adapter.convertResults(response);
                    // get only first result (this result is best)
                    if (results.length > 0) {
                        var result = results[0];
                        callback.call(context, error, result, response);
                    }
                }
            }, this);
        },

        suggest: function(text, opts, callback, context) {
            this.get(adapter.getSuggestionQuery(), adapter.getSuggestParams(text), callback, context);
        }
    });

    L.esri.Controls.Geosearch = L.Control.extend({
        includes: L.Mixin.Events,

        initialize: function (options) {
            L.Util.setOptions(this, options);
        },

        initService: function (service) {
            this._service = service;
            this._service.on('authenticationrequired requeststart requestend requesterror requestsuccess', function (e) {
                e = L.extend({
                    target: this
                }, e);
                this.fire(e.type, e);
            }, this);
        },

        _geocode: function(text, key){
//            console.log('---> ' + text);
            var options = {};

            if(key){
                options.magicKey = key;
            } else {
                options.maxLocations = this.options.maxResults;
                if(this.options.useMapBounds === true || (this.options.useMapBounds <= this._map.getZoom())){
                    var mapBounds = this._map.getBounds();
                    var center = mapBounds.getCenter();
                    var ne = mapBounds.getNorthWest();
                    options.bbox = mapBounds.toBBoxString();
                    options.location = center.lng + "," + center.lat;
                    options.distance = Math.min(Math.max(center.distanceTo(ne), 2000), 50000);
                }
            }

            if(this.options.forStorage){
                options.forStorage = true;
            }

            L.DomUtil.addClass(this._input, "geocoder-control-loading");

            //this.fire('loading');

            this._service.geocode(text, options, function(error, results, response){

                var resFromStore = this.searchComboBox.store.data;

                for (var i = 0; i < resFromStore.length; ++i) {
                    if(resFromStore[i].name == text) {

                        if(results == undefined) {
                            var results = [];
                        }

                        results[0] = resFromStore[i].results;
                    }
                }

                if(results && results.length) {
                    var bounds = new L.LatLngBounds();
                    var i;

                    for (i = results.length - 1; i >= 0; i--) {
                        bounds.extend(results[i].bounds);
                    }

                    this.fire('results', {
                        results: results,
                        bounds: bounds,
                        latlng: bounds.getCenter()
                    });

                    this._map.fitBounds(bounds);
                } else {
                    this.fire('results', {
                        results: [],
                        bounds: null,
                        latlng: null,
                        text: text
                    });
                }

                L.DomUtil.removeClass(this._input, "geocoder-control-loading");

                this.fire('load');

                //this.clear();

                this._input.blur();

            }, this);
        },

        _suggest: function(text){
            L.DomUtil.addClass(this._input, "geocoder-control-loading");

            var options = {};

            this._service.suggest(text, options, function(error, response){
                if(this._input.value){
                    var results = adapter.convertResults(response);
                    var count = results.length;

                    var cb = dijit.byId('searchComboBox');
                    cb.get('store').data = [];

                    for (var i = 0; i < count; ++i) {
                        cb.get('store').add({ name: results[i].text, results: results[i] });
                    }

                    cb.loadDropDown();
                }
            }, this);
        },

        onAdd: function (map) {
            this._map = map;

            this._container = L.DomUtil.create('div', "geocoder-control" + ((this.options.expanded) ? " " + "geocoder-control-expanded"  : ""));

            this.searchComboBoxInput = document.createElement('input');
            this.searchComboBoxInput.id = 'searchComboBox';
            var mapWrapperNode = document.getElementById('map_wrapper');

            mapWrapperNode.appendChild(this.searchComboBoxInput);

            this.searchComboBox = new dijit.form.ComboBox({
                id: "searchComboBox",
                name: "state",
                value: "",
                searchAttr: "name",
                // highlightMatch: "All",
                // queryExpr: "*${0}*",
                queryExpr: "*",
                autoComplete: false,
                hasDownArrow: true,
                highlightMatch: "all"
            }, 'searchComboBox');

            this.searchComboBox.startup();
            this.searchComboBox.loadDropDown();
            this.searchComboBox.openDropDown();
            this.searchComboBox.closeDropDown();

            this._input = document.getElementById('searchComboBox');

            L.DomEvent.addListener(this._input, "change", function(e){
                if(this.searchComboBox.dropDown.selected != null) {
                    this._geocode(this.searchComboBox.dropDown.selected.innerText);
                }
            }, this);

            this._dropdown = document.getElementById('widget_searchComboBox_dropdown');

            L.DomEvent.addListener(this._dropdown, "click", function(e){
                this._geocode(this.searchComboBox.dropDown.selected.innerText);
            }, this);

            L.DomEvent.addListener(this._input, "blur", function(e){
                //this.clear();
                //var cb = dijit.byId('searchComboBox');
                //cb.get('store').data = [];
            }, this);


            L.DomEvent.addListener(this._input, "keyup", function(e){

                var key = e.which || e.keyCode;
                var text = (e.target || e.srcElement).value;

                // require at least [settings.minimumLetters] characters for suggestions
                if(text.length < settings.minimumLetters) {
                    return;
                }

                // if this is NOT the up/down arrows or enter make a suggestion
                if(key !== 13 && key !== 38 && key !== 40){
                    this._suggest(text);
                }

                if(key === 13) {
                    this._geocode(this._input.value);
                }
            }, this);

            //    L.DomEvent.disableClickPropagation(this._container);

            return this._container;
        },

        onRemove: function (map) {
//            map.attributionControl.removeAttribution('Geocoding by ' + adapter.getGeocoderServiceName());
        }
    });

    L.esri.Controls.geosearch = function(url, options){
        return new L.esri.Controls.Geosearch(url, options);
    };

})(L);