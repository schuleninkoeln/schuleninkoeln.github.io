L.Control.ViewCenter = L.Control.extend({
	options : {
		position : 'topleft',
		title : 'Zentriere auf Koeln',
		forceSeparateButton : false,
		vcLatLng : center,
		vcZoom : zoom
	},
	onAdd : function(map) {
		var className = 'leaflet-control-view-center';
		var container;
		if (map.zoomControl && !this.options.forceSeparateButton) {
			container = map.zoomControl._container;
		} else {
			container = L.DomUtil.create('div', className);
		}
		this._createButton(this.options, className, container,
				this.setCenterView, map);
		return container;
	},
	_createButton : function(opts, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.href = '#';
		link.title = opts.title;
		var zoom = opts.vcZoom || 6;
		L.DomEvent.addListener(link, 'click', L.DomEvent.stopPropagation)
				.addListener(link, 'click', L.DomEvent.preventDefault)
				.addListener(link, 'click', function() {
					context.setView(opts.vcLatLng, zoom);
				}, context);
		return link;
	}
});
