
$(document).ready(function(){
	
	App = {
		
		init: function(){
			
			this.initMap();
			
			this.loadJson();
			
		},
		
		initMap: function(){
			this.map = L.map('map').setView([41,13], 6);
			
			var tl = L.tileLayer('http://{s}.tiles.mapbox.com/v4/tepgeohazards.l6md4p2l/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGVwZ2VvaGF6YXJkcyIsImEiOiJJRFF6S1R3In0.2ioAJ-Ydsx8A_iUF0RHnNw', {});
			
			this.layersControl = new L.Control.Layers(null, null).addTo(this.map);
			this.layersControl.addBaseLayer(tl, 'test');
			tl.addTo(this.map);
			
		},
		
		loadJson: function(){
			var self = this;
			
			NProgress.start();
			$.getJSON('model/myjsonfile.json').then(function(json){
				self.showHeatmap(json, 'ciccio', 'blue');
				
				$.getJSON('model/myjsonfile1.json').then(function(json){
					self.showHeatmap(json, 'blasco', 'red');
				});
				
				NProgress.done();

			});
		},
		
		showHeatmap(json, name, color){
			
			var heat = L.heatLayer(json, {radius: 10});
			
			var map = this.map;
			var races = L.featureGroup();
			var lastLatLng;
			var currentRacePoints = [];
			var count = 0;
			
			// each point
			$.each(json, function(i, p){
				var latLng = L.latLng(p); // get latLng
				
				if (lastLatLng && map.distance(latLng, lastLatLng)>100){
					// distance > 100 meters: new race
					L.polyline(currentRacePoints, {	weight: 1, opacity: 0.4, color: color }).addTo(races);
					currentRacePoints = [];
					
					count++;
				} else
					currentRacePoints.push(p);

				lastLatLng = latLng;
			});
			
			L.polyline(currentRacePoints, {	weight: 1, opacity: 0.4, color: color }).addTo(races); // last race
			
			this.layersControl.addOverlay(races, 'Races '+name);
			this.layersControl.addOverlay(heat, 'Heatmap '+name);
			
			//bootbox.alert(count + ' races found for ' + name);
			
		}
		
	};
	
	App.init();
	
	
});

