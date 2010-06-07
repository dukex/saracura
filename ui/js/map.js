var lat=-23.564617;
var lon=-46.62735;
var zoom=12;

var map; 

function init() {
	
	map = new OpenLayers.Map ("map", {
		controls:[
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.PanZoomBar(),
			//new OpenLayers.Control.LayerSwitcher(),
			new OpenLayers.Control.Attribution()],
		maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
					maxResolution: 156543.0399,
		numZoomLevels: 19,
		units: 'm',
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326")
	} );

	layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
	map.addLayer(layerMapnik);


	centro = new OpenLayers.Layer.Markers("Markers");
	var locais = new Array();
	locais[0] = new Array();
	locais[1] = new Array();
	locais[2] = new Array();
	locais[3] = new Array();
	
	 locais[0]['lat'] = -23.562617;
	 locais[0]['lon'] = -46.62235;
	 locais[1]['lat'] = -23.569617;
	 locais[1]['lon'] = -46.62935;
	 locais[2]['lat'] = -23.567617;
	 locais[2]['lon'] = -46.62235;
	 locais[3]['lat'] = -23.567817;
	 locais[3]['lon'] = -46.62245;
	
	for(i=0;i<locais.length;i++){
		locais[i].id = i;
		setMarker(locais[i]['lat'], locais[i]['lon'], centro);
	}
	map.addLayer(centro);

	var ancorasaopaulo = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());



	
	map.setCenter (ancorasaopaulo, zoom);
	
}
function setMarker(lon, lat, layer){
	var size = new OpenLayers.Size(21,25);
    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
	var feature = new OpenLayers.Feature(layer, lonLat);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
	feature.closeBox = true;
    feature.popupClass = OpenLayers.Class(OpenLayers.Popup.AnchoredBubble, {minSize: new OpenLayers.Size(300, 180) } );
    feature.data.popupContentHTML = 'Hello World';
    feature.data.overflow = "hidden";

    //var marker = new OpenLayers.Marker(lonLatMarker, icon);
	var icon = new OpenLayers.Icon('http://www.openstreetmap.org/openlayers/img/marker.png',size,offset);
	var marker = new OpenLayers.Marker(lonLat,icon);
	
    marker.feature = feature;

    var markerClick = function(evt) {
        if (this.popup == null) {
            this.popup = this.createPopup(this.closeBox);
            map.addPopup(this.popup);
            this.popup.show();
        } else {
            this.popup.toggle();
        }
        OpenLayers.Event.stop(evt);
    };
    marker.events.register("mousedown", feature, markerClick);

    layer.addMarker(marker);
}

function addMarkers (lat,lon, layer) {
	
	
		layer.addMarker(marker);
	
	var popupId = "popup";
	var popup = new OpenLayers.Popup.AnchoredBubble(popupId, lonLat,
	                                 new OpenLayers.Size(200,20),
	                                 "Hello World ... "+popupId,
	                                 null, true,closePopUp);
	//popup.closeOnMove = true;
	layer.addPopup(popup);
	popup.hide();
	layer.events.register('click', lonLat, function(){popup.show();});
}
function closePopUp(){
    this.hide();
}