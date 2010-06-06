// Start position for the map (hardcoded here for simplicity,
// but maybe you want to get from URL params)
var lat=-23.564617;
var lon=-46.62735;
var zoom=12;

var map; //complex object of type OpenLayers.Map

//Initialise the 'map' object
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
		addMarkers (locais[i]['lat'], locais[i]['lon'], centro);
	}
	map.addLayer(centro);

	var ancorasaopaulo = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());



	
	map.setCenter (ancorasaopaulo, zoom);
	
}

function addMarkers (lat,lon, layer) {
	var size = new OpenLayers.Size(21,25);
	var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
	var icon = new OpenLayers.Icon('http://www.openstreetmap.org/openlayers/img/marker.png',size,offset);
	var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
	var marker = new OpenLayers.Marker(lonLat,icon);
	layer.addMarker(marker);
		marker.events.register("mousedown", marker, function(){
		var ancorasaopaulo = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());

		popup = new OpenLayers.Popup("popup",
			    ancorasaopaulo,
			    null,
			    "<form id=\"seguir\"><input type=\"hidden\" id=\"id\" value=\""+this.id+"\" /><label>Numero do Celular:</label><input type=\"text\" id=\"name\" /><button type=\"submit\">Seguir</button></form>",
			     true);
		map.addPopup(popup);
		
	});

}

function mousedown(evt) {
	
			alert(evt.relatedTarget);
	
		
	             // check to see if the popup was hidden by the close box
	             // if so, then destroy it before continuing
	            if (popup != null) {
	                if (!popup.visible()) {
	                    marker.map.removePopup(popup);
	                    popup.destroy();
	                    popup = null;
	                }
	            }
	            if (popup == null) {
	                popup = feature.createPopup(true);
	                popup.setContentHTML("<a href='http://www.somethingconstructive.net' target='_blank'>click me</a>");
	                popup.setBackgroundColor("yellow");
	                popup.setOpacity(0.7);
	                marker.map.addPopup(popup);
	            } else {
	                marker.map.removePopup(popup);
	                popup.destroy();
	                popup = null;
	            }
	            OpenLayers.Event.stop(evt);
	        }