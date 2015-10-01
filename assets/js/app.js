var map, featureList, boroughSearch = [], schoolSearch = [];

$(window).resize(function() {
	sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
	$(document).off("mouseout", ".feature-row", clearHighlight);
	sidebarClick(parseInt($(this).attr("id"), 10));
});

$(document).on(
		"mouseover",
		".feature-row",
		function(e) {
			highlight.clearLayers().addLayer(
					L.circleMarker(
							[ $(this).attr("lat"), $(this).attr("lng") ],
							highlightStyle));
		});

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
	$("#aboutModal").modal("show");
	$(".navbar-collapse.in").collapse("hide");
	return false;
});

$("#full-extent-btn").click(function() {
	map.fitBounds(boroughs.getBounds());
	$(".navbar-collapse.in").collapse("hide");
	return false;
});

$("#legend-btn").click(function() {
	$("#legendModal").modal("show");
	$(".navbar-collapse.in").collapse("hide");
	return false;
});

$("#login-btn").click(function() {
	$("#loginModal").modal("show");
	$(".navbar-collapse.in").collapse("hide");
	return false;
});

$("#list-btn").click(function() {
	$('#sidebar').toggle();
	map.invalidateSize();
	return false;
});

$("#nav-btn").click(function() {
	$(".navbar-collapse").collapse("toggle");
	return false;
});

$("#sidebar-toggle-btn").click(function() {
	$("#sidebar").toggle();
	map.invalidateSize();
	return false;
});

$("#sidebar-hide-btn").click(function() {
	$('#sidebar').hide();
	map.invalidateSize();
});

function sizeLayerControl() {
	$(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
	highlight.clearLayers();
}

function sidebarClick(id) {
	var layer = markerClusters.getLayer(id);
	map.setView([ layer.getLatLng().lat, layer.getLatLng().lng ], 17);
	layer.fire("click");
	/* Hide sidebar and go to the map on small screens */
	if (document.body.clientWidth <= 767) {
		$("#sidebar").hide();
		map.invalidateSize();
	}
}

/* Basemap Layers */
// icon: http://www.flaticon.com/free-icon/text-book-opened-from-top-view_42943
var attr = '<div><a href=\'http://www.offenedaten-koeln.de/\' target=\'_blank\'>Offene Daten K&ouml;ln</a></div>'
	+ '<div><a href=\'https://github.com/bmcbride/bootleaf\' target=\'_blank\'>Bootleaf</a> by <a href=\'http://bryanmcbride.com\'>bryanmcbride.com</a></div>'	+ '<div>Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.</div>'
	+ '<div>Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA</div>'
	+ '<div><a href=\'http://getbootstrap.com/\' target=\'_blank\'>Bootstrap 3</a>, <a href=\'http://leafletjs.com/\' target=\'_blank\'>Leaflet</a>, '
	+ '<a href="https://github.com/Leaflet/Leaflet.markercluster" target="_blank">leaflet marker cluster plugin</a>, '
	+ '<a href="http://twitter.github.io/typeahead.js/" target="_blank">typeahead.js</a></div>'
	+ '<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></div>';
var mapquestOSM = L.tileLayer(
		"http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
			maxZoom : 19,
			subdomains : [ "otile1", "otile2", "otile3", "otile4" ],
			attribution : attr
		});

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
	stroke : false,
	fillColor : "#00FFFF",
	fillOpacity : 0.7,
	radius : 10
};

var boroughs = L.geoJson(null, {
	style : function(feature) {
		return {
			fillColor : '#000000',
			fillOpacity : 0.2,
			color : '#ffffff',
			dashArray : '3',
			fill : true,
			opacity : 1,
			clickable : false,
			weight : 3
		};
	},
	onEachFeature : function(feature, layer) {
		boroughSearch.push({
			name : layer.feature.properties.name,
			source : "Stadtteile",
			id : L.stamp(layer),
			bounds : layer.getBounds()
		});
	}
});
$.getJSON("data/stadtteile_100.json", function(data) {
	boroughs.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
	spiderfyOnMaxZoom : true,
	showCoverageOnHover : false,
	zoomToBoundsOnClick : true,
	disableClusteringAtZoom : 16
});

/**
 * 
 * @param feature
 * @param latlng
 * @returns
 */
function pointToLayer(feature, latlng) {
	return L.marker(latlng, {
		icon : L.icon({
			iconUrl : "assets/img/text87.svg",
			iconSize : [ 24, 28 ],
			iconAnchor : [ 12, 28 ],
			popupAnchor : [ 0, -25 ]
		}),
		title : feature.properties.schulname,
		riseOnHover : true
	})
}

/**
 * 
 * @param feature
 * @param layer
 */
function onEachFeature(feature, layer) {
	if (feature.properties) {
		var content = "<table class='table table-striped table-bordered table-condensed'>"
				+ "<tr><th>Name</th><td>"
				+ feature.properties.schulname
				+ "</td></tr>"
				+ "<tr><th>Schultyp/ Schulart</th><td>"
				+ feature.properties.schultyp
				+ "/ "
				+ feature.properties.schulart
				+ "</td></tr>"
				+ "<tr><th>Stadtteil</th><td>"
				+ feature.properties.stadtteil
				+ "</td></tr>"
				+ "<tr><th>Adresse</th><td>"
				+ feature.properties.adresse
				+ "</br>"
				+ feature.properties.postzustellbezirk
				+ " K&ouml;ln</td></tr>"
				+ "<table>";
		layer.on({
			click : function(e) {
				$("#feature-title").html(feature.properties.schulname);
				$("#feature-info").html(content);
				$("#featureModal").modal("show");
				highlight.clearLayers().addLayer(
						L.circleMarker([ feature.geometry.coordinates[1],
								feature.geometry.coordinates[0] ],
								highlightStyle));
			}
		});
		var featureListTbody = '<tr class="feature-row" id="'
				+ L.stamp(layer)
				+ '" lat="'
				+ layer.getLatLng().lat
				+ '" lng="'
				+ layer.getLatLng().lng
				+ '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/text87.png"></td><td class="feature-name">'
				+ layer.feature.properties.schulname
				+ '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>';

		$("#feature-list tbody").append(featureListTbody);
		schoolSearch.push({
			name : layer.feature.properties.schulname,
			adresse : layer.feature.properties.adresse,
			source : "Schulen",
			id : L.stamp(layer),
			lat : layer.getLatLng().lat,
			lng : layer.getLatLng().lng
		});
	}
}

/*
 * Empty layer placeholder to add to layer control for listening when to
 * add/remove schools to markerClusters layer
 */
// Gymnasium, Realschule, Förderschule, Berufskolleg, Hauptschule, Freie
// Waldorfschule
// Gesamtschule, 2. Bildungsweg
var schoolLayer = L.geoJson(null);
var grundschulLayer = L.geoJson(null);
var realschulLayer = L.geoJson(null);
var foerderschulLayer = L.geoJson(null);
var berufskollegLayer = L.geoJson(null);
var hauptschulLayer = L.geoJson(null);
var waldorfschulLayer = L.geoJson(null);
var gesamtschulLayer = L.geoJson(null);
var zweiterbildungswegLayer = L.geoJson(null);
var gymnasiumLayer = L.geoJson(null);

var schools = L.geoJson(null, {
	pointToLayer : pointToLayer,
	onEachFeature : onEachFeature,
	filter : function(feature) {
		return feature.properties.schulart === 'Grundschule';
	}
});
var grundschulen = L.geoJson(null, {
	pointToLayer : pointToLayer,
	onEachFeature : onEachFeature,
	filter : function(feature) {
		return feature.properties.schulart === 'Grundschule';
	}
});
var realschulen = L.geoJson(null, {
	pointToLayer : pointToLayer,
	onEachFeature : onEachFeature,
	filter : function(feature) {
		return feature.properties.schulart === 'Realschule';
	}
});
var foerderschulen = L.geoJson(null, {
	pointToLayer : pointToLayer,
	onEachFeature : onEachFeature,
	filter : function(feature) {
		return feature.properties.schulart === 'Förderschule';
	}
});
var berufskolleg = L.geoJson(null, {
	pointToLayer : pointToLayer,
	onEachFeature : onEachFeature,
	filter : function(feature) {
		return feature.properties.schulart === 'Berufskolleg';
	}
});
var hauptschulen = L.geoJson(null, {
	pointToLayer : pointToLayer,
	onEachFeature : onEachFeature,
	filter : function(feature) {
		return feature.properties.schulart === 'Hauptschule';
	}
});
var waldorfschulen = L.geoJson(null, {
	pointToLayer : pointToLayer,
	onEachFeature : onEachFeature,
	filter : function(feature) {
		return feature.properties.schulart === 'Freie Waldorfschule';
	}
});
var gesamtschulen = L.geoJson(null, {
	pointToLayer : pointToLayer,
	onEachFeature : onEachFeature,
	filter : function(feature) {
		return feature.properties.schulart === 'Gesamtschule';
	}
});
var zweiterbildungsweg = L.geoJson(null, {
	pointToLayer : pointToLayer,
	onEachFeature : onEachFeature,
	filter : function(feature) {
		return feature.properties.schulart === '2. Bildungsweg';
	}
});
var gymnasien = L.geoJson(null, {
	pointToLayer : pointToLayer,
	onEachFeature : onEachFeature,
	filter : function(feature) {
		return feature.properties.schulart === 'Gymnasium';
	}
});

$.getJSON("data/schulen.json", function(data) {

	grundschulen.addData(data);
	realschulen.addData(data);
	foerderschulen.addData(data);
	berufskolleg.addData(data);
	hauptschulen.addData(data);
	waldorfschulen.addData(data);
	gesamtschulen.addData(data);
	zweiterbildungsweg.addData(data);
	gymnasien.addData(data);
	
	map.addLayer(grundschulLayer);
	map.addLayer(realschulLayer);
	map.addLayer(foerderschulLayer);
	map.addLayer(berufskollegLayer);
	map.addLayer(hauptschulLayer);
	map.addLayer(waldorfschulLayer);
	map.addLayer(gesamtschulLayer);
	map.addLayer(zweiterbildungswegLayer);
	map.addLayer(gymnasiumLayer);
});

map = L.map("map", {
	zoom : 10,
	center : [ 50.94135, 6.95819 ],
	layers : [ mapquestOSM, boroughs, markerClusters, highlight ],
	zoomControl : false,
	attributionControl : false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
	if (e.layer === grundschulLayer) {
		markerClusters.addLayer(grundschulen);
	}
	if (e.layer === realschulLayer) {
		markerClusters.addLayer(realschulen);
	}
	if (e.layer === foerderschulLayer) {
		markerClusters.addLayer(foerderschulen);
	}
	if (e.layer === berufskollegLayer) {
		markerClusters.addLayer(berufskolleg);
	}
	if (e.layer === hauptschulLayer) {
		markerClusters.addLayer(hauptschulen);
	}
	if (e.layer === waldorfschulLayer) {
		markerClusters.addLayer(waldorfschulen);
	}
	if (e.layer === zweiterbildungswegLayer) {
		markerClusters.addLayer(zweiterbildungsweg);
	}
	if (e.layer === gymnasiumLayer) {
		markerClusters.addLayer(gymnasien);
	}
});

map.on("overlayremove", function(e) {
	if (e.layer === grundschulLayer) {
		markerClusters.removeLayer(grundschulen);
	}
	if (e.layer === realschulLayer) {
		markerClusters.removeLayer(realschulen);
	}
	if (e.layer === foerderschulLayer) {
		markerClusters.removeLayer(foerderschulen);
	}
	if (e.layer === berufskollegLayer) {
		markerClusters.removeLayer(berufskolleg);
	}
	if (e.layer === hauptschulLayer) {
		markerClusters.removeLayer(hauptschulen);
	}
	if (e.layer === waldorfschulLayer) {
		markerClusters.removeLayer(waldorfschulen);
	}
	if (e.layer === zweiterbildungswegLayer) {
		markerClusters.removeLayer(zweiterbildungsweg);
	}
	if (e.layer === gymnasiumLayer) {
		markerClusters.removeLayer(gymnasien);
	}

});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function(e) {
	// syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
	highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
	$.each(map._layers, function(index, layer) {
		if (layer.getAttribution) {
			$("#attribution").html((layer.getAttribution()));
		}
	});
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
	position : "bottomright"
});
attributionControl.onAdd = function(map) {
	var div = L.DomUtil.create("div", "leaflet-control-attribution");
	div.innerHTML = "<span class='hidden-xs'>Developed by <a href='https://github.com/schuleninkoeln/schuleninkoeln.github.io'>Wolfram Eberius</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
	return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
	position : "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control
		.locate(
				{
					position : "bottomright",
					drawCircle : true,
					follow : true,
					setView : true,
					keepCurrentZoomLevel : true,
					markerStyle : {
						weight : 1,
						opacity : 0.8,
						fillOpacity : 0.8
					},
					circleStyle : {
						weight : 1,
						clickable : false
					},
					icon : "fa fa-location-arrow",
					metric : false,
					strings : {
						title : "My location",
						popup : "You are within {distance} {unit} from this point",
						outsideMapBoundsMsg : "You seem located outside the boundaries of the map"
					},
					locateOptions : {
						maxZoom : 18,
						watch : true,
						enableHighAccuracy : true,
						maximumAge : 10000,
						timeout : 10000
					}
				}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
	var isCollapsed = true;
} else {
	var isCollapsed = false;
}

var baseLayers = {
};

var groupedOverlays = {
	"Schulen" : {
		"<img src='assets/img/text87.svg' width='24' height='28'>&nbsp;2. Bildungsweg" : zweiterbildungswegLayer,
		"<img src='assets/img/text87.svg' width='24' height='28'>&nbsp;Berufsschulen" : berufskollegLayer,
		"<img src='assets/img/text87.svg' width='24' height='28'>&nbsp;Förderschulen" : foerderschulLayer,
		"<img src='assets/img/text87.svg' width='24' height='28'>&nbsp;Gesamtschulen" : gesamtschulLayer,
		"<img src='assets/img/text87.svg' width='24' height='28'>&nbsp;Grundschulen" : grundschulLayer,
		"<img src='assets/img/text87.svg' width='24' height='28'>&nbsp;Gymnasien" : gymnasiumLayer,
		"<img src='assets/img/text87.svg' width='24' height='28'>&nbsp;Hauptschulen" : hauptschulLayer,
		"<img src='assets/img/text87.svg' width='24' height='28'>&nbsp;Realschulen" : realschulLayer,
		"<img src='assets/img/text87.svg' width='24' height='28'>&nbsp;Waldorfschulen" : waldorfschulLayer
	},
	"Stadtteile" : {
		"Stadtteile" : boroughs
	}
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
	collapsed : isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function() {
	$(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function(e) {
	if (e.which == 13) {
		e.preventDefault();
	}
});

$("#featureModal").on("hidden.bs.modal", function(e) {
	$(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document)
		.one(
				"ajaxStop",
				function() {
					$("#loading").hide();
					sizeLayerControl();
					/* Fit map to boroughs bounds */
					map.fitBounds(boroughs.getBounds());
					featureList = new List("features", {
						valueNames : [ "feature-name" ]
					});
					// featureList.sort("feature-name", {order:"asc"});

					var boroughsBH = new Bloodhound({
						name : "Stadtteile",
						datumTokenizer : function(d) {
							return Bloodhound.tokenizers.whitespace(d.name);
						},
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						local : boroughSearch,
						limit : 10
					});

					var schoolsBH = new Bloodhound({
						name : "Schulen",
						datumTokenizer : function(d) {
							return Bloodhound.tokenizers.whitespace(d.name);
						},
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						local : schoolSearch,
						limit : 10
					});

					boroughsBH.initialize();
					schoolsBH.initialize();

					/* instantiate the typeahead UI */
					$("#searchbox")
							.typeahead(
									{
										minLength : 3,
										highlight : true,
										hint : false
									},
									{
										name : "Stadtteile",
										displayKey : "name",
										source : boroughsBH.ttAdapter(),
										templates : {
											header : "<h4 class='typeahead-header'>Stadtteile</h4>"
										}
									},
									{
										name : "Schulen",
										displayKey : "name",
										source : schoolsBH.ttAdapter(),
										templates : {
											header : "<h4 class='typeahead-header'><img src='assets/img/text87.svg' width='24' height='28'>&nbsp;Schulen</h4>",
											suggestion : Handlebars
													.compile([ "{{name}}<br>&nbsp;<small>{{adresse}}</small>" ]
															.join(""))
										}
									})
							.on("typeahead:selected", function(obj, datum) {
								if (datum.source === "Stadtteile") {
									map.fitBounds(datum.bounds);
								}
								if (datum.source === "Schulen") {
									if (!map.hasLayer(schoolLayer)) {
										map.addLayer(schoolLayer);
									}
									map.setView([ datum.lat, datum.lng ], 17);
									if (map._layers[datum.id]) {
										map._layers[datum.id].fire("click");
									}
								}
								if ($(".navbar-collapse").height() > 50) {
									$(".navbar-collapse").collapse("hide");
								}
							}).on(
									"typeahead:opened",
									function() {
										$(".navbar-collapse.in").css(
												"max-height",
												$(document).height()
														- $(".navbar-header")
																.height());
										$(".navbar-collapse.in").css(
												"height",
												$(document).height()
														- $(".navbar-header")
																.height());
									}).on("typeahead:closed", function() {
								$(".navbar-collapse.in").css("max-height", "");
								$(".navbar-collapse.in").css("height", "");
							});
					$(".twitter-typeahead").css("position", "static");
					$(".twitter-typeahead").css("display", "block");
				});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
	L.DomEvent.disableClickPropagation(container).disableScrollPropagation(
			container);
} else {
	L.DomEvent.disableClickPropagation(container);
}
