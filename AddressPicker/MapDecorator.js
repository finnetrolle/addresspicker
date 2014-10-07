/**
 * Created by syachin on 08.09.2014.
 */
define([
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/on',
    'leaflets/leaflet',
    'AddressPicker/AbstractServiceAdapter',
    'AddressPicker/GoogleServiceAdapter',
    'AddressPicker/YandexServiceAdapter',
    'AddressPicker/ArcGISServiceAdapter',
    'AddressPicker/GeocodedObject',
    'AddressPicker/AddressPickerSettings',
    'AddressPicker/CadasterService',
    'dojo/domReady!'
], function(declare
            ,dom
            ,on
            ,leaflet
            ,AbstractServiceAdapter
            ,GoogleServiceAdapter
            ,YandexServiceAdapter
            ,ArcGISServiceAdapter
            ,GeocodedObject
            ,AddressPickerSettings
            ,CadasterService
    ){

    // This returned object becomes the defined value of this module
    return declare(null, {

        // inside services
        searchControl: null,
        resultsLayerGroup: null,

        // settings
        settings: new AddressPickerSettings(),
        defaultBasemapLayer: null,

        // wrappers (DIVs)
        mapDiv: null,
        basemapsDiv: null,
        geocodersDiv: null,
        saveButtonDiv: null,
        cadasterCheckboxDiv: null,

        // controls
        map: null,
        basemaps: null,
        geocoders: null,
        saveButton: null,
        cadasterCheckbox: null,
        alertWindow: null,
        alertText: null,
        saveSpinner: null,
        saveSpinnerIsOn: false,

        // special (for map)
        layer: null,
        cadasterLayer: null,
        geocodedObject: null,

        // methods for creating controls

        createDiv: function(divId) {
            var div = document.createElement('div');
            div.className = 'igit-leaflet-wrapper-class';
            div.id = divId;
//            this.mapDiv.appendChild(div);
            document.body.appendChild(div);
            return div;
        },

        createAlertWindow: function() {
            this.alertWindow = this.createDiv('alertWindow');
            this.alertWindow.hidden = '';
            this.alertWindow.style.visibility = 'hidden';
            this.alertText = document.createElement('p');
            this.alertText.id = 'alertText';
            this.alertText.innerHTML = this.settings.strings.unfilledGeocodingResult;
            this.alertWindow.appendChild(this.alertText);
//            this.mapDiv.appendChild(this.alertWindow);

            this.alertText.title = this.settings.strings.tooltips.alert;
            this.alertWindow.title = this.settings.strings.tooltips.alert;
        },

        createBasemapCombobox: function() {
            var array = this.settings.basemapLayers;

            this.basemapsDiv = this.createDiv('basemaps-wrapper');
            this.basemaps = document.createElement('select');
            this.basemaps.id = 'basemaps';

            this.fillSelectControl(this.basemaps, array);
            this.basemapsDiv.appendChild(this.basemaps);

            //this.mapDiv.appendChild(this.basemapsDiv);

            var self = this;
            on(this.basemaps, 'change', function (event) {
                if (self.layer) {
                    self.map.removeLayer(self.layer);
                }
                self.layer = L.esri.tiledMapLayer(self.basemaps.value);
                self.map.addLayer(self.layer);
            });

            this.basemaps.title = this.settings.strings.tooltips.basemaps;
            this.basemapsDiv.title = this.settings.strings.tooltips.basemaps;
        },

        createCadasterCheckbox: function() {
            this.cadasterCheckboxDiv = this.createDiv('cadaster-wrapper');
            this.cadasterCheckboxDiv.innerHTML = this.settings.strings.cadaster;
            this.cadasterCheckbox = document.createElement('input');
            this.cadasterCheckbox.type = 'checkbox';
            this.cadasterCheckbox.id = 'cadasterCheckBox';
            this.cadasterCheckboxDiv.appendChild(this.cadasterCheckbox);
//            this.mapDiv.appendChild(this.cadasterCheckboxDiv);

            var self = this;
            self.cadasterLayer = L.esri.dynamicMapLayer(self.settings.additionalLayers.cadasterLayer.link,{
                opacity: self.settings.additionalLayers.cadasterLayer.opacity
            });

            /* This block of code required to dodge error #12
                Server gives layer data after some time
                If user clears checkbox while response is not arrived, layer will be rendered
                To dodge this shit we catch event "onload" for this layer
                And if checkbox is off - remove this layer from map with
                hacking refreshing - add layer (removed by checkbox event) and remove it once again
            * */
            on(this.cadasterLayer, 'load', function() {
                if (!self.cadasterCheckbox.checked) {
                    self.map.addLayer(self.cadasterLayer);
                    self.map.removeLayer(self.cadasterLayer);
                }
            });

            on(this.cadasterCheckbox, 'change', function(e) {
                if (self.cadasterCheckbox.checked) {
                    self.map.addLayer(self.cadasterLayer);
                } else {
                    self.map.removeLayer(self.cadasterLayer);

                }
            });

            this.cadasterCheckbox.title = this.settings.strings.tooltips.cadaster;
            this.cadasterCheckboxDiv.title = this.settings.strings.tooltips.cadaster;
        },

        createSaveButtonControl: function() {
            this.saveButtonDiv = this.createDiv('savebutton-wrapper');
            this.saveButton = document.createElement('input');
            this.saveButton.type = 'button';
            this.saveButton.id = 'saveButton';
            this.saveButton.value = this.settings.strings.saveButton;
            this.saveButton.disabled = true;
            this.saveButtonDiv.appendChild(this.saveButton);
//            this.mapDiv.appendChild(this.saveButtonDiv);

            var self = this;
            on(this.saveButton, 'click', function(){
                if (self.geocodedObject) {
                    self.saveButtonDiv.appendChild(self.saveSpinner);
                    self.saveSpinnerIsOn = true;
                    self.saveButton.disabled = true;
                    self.cadasterService.service.getCadasterNumber(self.geocodedObject.latlng, {}, function (error, result, response) {
                        self.geocodedObject.setCadasterNumber(result);
                        if (self.saveSpinnerIsOn) {
                            self.saveButtonDiv.removeChild(self.saveSpinner);
                            self.saveSpinnerIsOn = false;
                            self.saveButton.disabled = false;
                        }
                        alert(self.geocodedObject.resultToString(self.geocodedObject.getResult()));
                    }, this);
                }
            });

            this.saveButton.title = this.settings.strings.tooltips.save;
            this.saveButtonDiv.title = this.settings.strings.tooltips.save;

            this.saveSpinner = document.createElement('img');
            this.saveSpinner.src = 'leaflets/img/loading.gif';
//            this.saveButtonDiv.appendChild(this.saveSpinner);
        },

        createGeocodingControl: function() {
            this.initGeocodingService();
            var self = this;
            var array = this.settings.geocodingServices;

            this.geocodersDiv = this.createDiv('geocoders-wrapper');
            this.geocoders = document.createElement('select');
            this.geocoders.id = 'geocoders';

            this.fillSelectControl(this.geocoders, array);

            this.geocodersDiv.appendChild(this.geocoders);
//            this.mapDiv.appendChild(this.geocodersDiv);

            on(this.geocoders, 'change', function() {
                self.searchControl._service.getAdapter().initService(self.geocoders.value);
                self.searchControl._service.initialize();
                self.resultsLayerGroup.clearLayers();
                self.geocodedObject = null;
                self.setSaveButtonEnabled(false);
                dom.byId("alertWindow").style.visibility = 'hidden';
            });

            this.geocoders.title = this.settings.strings.tooltips.geocoder;
            this.geocodersDiv.title = this.settings.strings.tooltips.geocoder;
        },

        initGeocodingService: function() {
            this.searchControl = new L.esri.Controls.Geosearch().addTo(this.map);
            this.searchControl.initService(new IGITGeocoding());
            this.resultsLayerGroup = new L.LayerGroup().addTo(this.map);
            var self = this;
            on(this.searchControl, 'results', function(data) {
                self.alertWindow.style.visibility = 'hidden';
                self.geocodedObject = data.results[0];
                self.resultsLayerGroup.clearLayers();
                if (self.geocodedObject) {
                    self.fillInfo(self.geocodedObject);
                    if (self.geocodedObject.isSuccessfullyGeocoded()) {
                        var marker = L.marker(data.results[0].latlng);
                        var popup = marker.bindPopup(self.geocodedObject.text);
                        self.resultsLayerGroup.addLayer(marker);
                        popup.openPopup();

                    } else {
                        alert(self.settings.strings.geocodingNoPosition);
                    }
                } else {
                    alert(self.settings.strings.geocodingNoResults);
                }
            });
        },

        getVersion: function() {
            var v = this.settings.appinfo;
            var s = "";
            if (v.demo)
                s += 'Demo version ';
            else
                s += 'v. ';
            s += v.major + '.';
            s += v.minor + '.';
            s += v.build;
            if (v.beta)
                s += " " + 'beta';
            return s;
        },

        // initialization (overriden)

        initMap: function () {
            this.settings = new AddressPickerSettings();
            var o = this.settings.centerPoint;
            this.mapDiv = dom.byId('map');
            this.map = leaflet.map('map').setView([o.latitude, o.longitude], o.zoom);
            var self = this;

//            alert(window.location.query);


            require(['leaflets/esri-leaflet'], function(){
                require(['AddressPicker/esri-leaflet-geocoder-mk2'], function(){
                    // loading basemap
                    self.layer = L.esri.tiledMapLayer(self.settings.basemapLayers[0].link);
                    self.map.addLayer(self.layer);

                    self.map.attributionControl.addAttribution(self.getVersion());

                    self.createAlertWindow();
                    self.createBasemapCombobox();
//                    self.initGeocodingServiceCombobox();
                    self.createGeocodingControl();
                    self.createSaveButtonControl();
                    self.createCadasterCheckbox();

                    on(self.map, 'click', function (e) {
//                        var src = e.originalEvent.srcElement;
                        var src = e.originalEvent.target;
//                        switch (src) {
//                            case  self.basemaps: return;
//                            case  self.geocoders: return;
//                            case  self.cadasterCheckbox: return;
//                            case  self.saveButton: return;
//                            case  self.saveButtonDiv: return;
//                            case  self.cadasterCheckboxDiv: return;
//                            case  self.geocodersDiv: return;
//                            case  self.basemapsDiv: return;
//                            case  self.alertWindow: return;
//                            case  self.alertText: return;
//                        }
                        if (src == self.basemaps) return;
                        if (src == self.geocoders) return;
                        if (src == self.cadasterCheckbox) return;
                        if (src == self.saveButton) return;
                        if (src == self.saveButtonDiv) return;
                        if (src == self.cadasterCheckboxDiv) return;
                        if (src == self.geocodersDiv) return;
                        if (src == self.basemapsDiv) return;
                        if (src == self.alertWindow) return;
                        if (src == self.alertText) return;

                        dom.byId("alertWindow").style.visibility = 'hidden';
                        self.searchControl._service.reverse(e.latlng, {}, function(error, result, response){
                            self.resultsLayerGroup.clearLayers();

                            if (self.settings.showLineToGeocodingResultPoint) {
                                var A = e.latlng;
                                var B = A;
                                if (result) {
                                    if (result.hasOwnProperty('latlng'))
                                        var B = result.latlng;
                                }
                                else {
                                    // this is part for null address from KGIS geocoder
                                    var geocodedObject = new GeocodedObject();
                                    geocodedObject.setText('Россия');
                                    geocodedObject.setPostalCode('');
                                    geocodedObject.setLatLng(e.latlng.lat, e.latlng.lng); // Todo
                                    geocodedObject.setBounds(e.latlng, e.latlng); // Todo
                                    geocodedObject.setAddress(
                                        "Россия", null, null, null, null, null);
                                    result = geocodedObject;
                                }
                                var poly = L.polygon([
                                    [A.lat, A.lng],
                                    [B.lat, B.lng]
                                ]);
                                self.resultsLayerGroup.addLayer(poly);
                            }

                            var marker = L.marker(e.latlng);
                            self.resultsLayerGroup.addLayer(marker);
                            marker.bindPopup(result.text).openPopup();
                            self.geocodedObject = result;
                            if (self.geocodedObject) {
                                self.fillInfo(self.geocodedObject);
                                if (!self.geocodedObject.isSuccessfullyGeocoded()) {
                                    dom.byId("alertWindow").style.visibility = 'visible';
                                    self.setSaveButtonEnabled(true);
                                }
                            }
                        }, this);
                    });

                    self.cadasterService = new CadasterService();
                    self.cadasterService.initialize();
                })
            })
        },


        fillInfo: function(o) {
            this.setSaveButtonEnabled(o.isSuccessfullyGeocoded());
        },

        setSaveButtonEnabled: function(value) {
            if (value) {
                this.saveButtonDiv.style.backgroundColor = this.settings.colors.enabledColor;
                this.saveButton.disabled = false;
            } else {
                this.saveButtonDiv.style.backgroundColor = this.settings.colors.disabledColor;
                this.saveButton.disabled = true;
            }
        },



//        initGeocodingServiceCombobox: function() {
//            this.searchControl = new L.esri.Controls.Geosearch().addTo(this.map);
//            this.searchControl.initService(new IGITGeocoding());
//            this.resultsLayerGroup = new L.LayerGroup().addTo(this.map);
//            var self = this;
//            this.searchControl.on('results', function(data) {
//                dom.byId('alertWindow').style.visibility = 'hidden';
//                self.geocodedObject = data.results[0];
//                self.resultsLayerGroup.clearLayers();
//                if (self.geocodedObject) {
//                    self.fillInfo(self.geocodedObject);
//                    if (self.geocodedObject.isSuccessfullyGeocoded()) {
//                        var marker = L.marker(data.results[0].latlng);
//                        var popup = marker.bindPopup(self.geocodedObject.text);
//                        self.resultsLayerGroup.addLayer(marker);
//                        popup.openPopup();
//
//                    }
//                }
//            });
//            this.geocoders = this.createLinkAndNameCombobox('geocoders-wrapper', 'geocoders', 'map',
//                this.settings.geocodingServices);
//            on(this.geocoders, 'change', function() {
//                self.searchControl._service.getAdapter().initService(self.geocoders.value);
//                self.searchControl._service.initialize();
//            });
//        },

        fillSelectControl: function(control, array) {
            for (var i = 0; i < array.length; ++i) {
                var eOption = document.createElement('option');
                eOption.value = array[i].link;
                eOption.innerHTML = array[i].name;
                control.appendChild(eOption);
            }
            return control;
        }

//        createLinkAndNameCombobox: function(divId, selectId, mapId, array) {
//            var eDiv = document.createElement('div');
//                eDiv.id = divId;
//                eDiv.className = 'igit-leaflet-wrapper-class';
//            var eSelect = document.createElement('select');
//                eSelect.id = selectId;
//            for (var i = 0; i < array.length; ++i) {
//                var eOption = document.createElement('option');
//                    eOption.value = array[i].link;
//                    eOption.innerHTML = array[i].name;
//                eSelect.appendChild(eOption);
//            }
//            eDiv.appendChild(eSelect);
//            var map = dom.byId(mapId);
//            if (map) {
//                map.appendChild(eDiv);
//            }
//            return eSelect;
//        }

    });
});