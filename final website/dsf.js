// Store the API query variables.
var baseURL = "https://www.dallasopendata.com/resource/4gmt-jyx2.json";

$(document).ready(function() {
    // AJAX
    $.ajax({
        type: "GET",
        url: baseURL,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            makeMap(data);
        },
        error: function(data) {
            console.log("YOU BROKE IT!!");
        },
        complete: function(data) {
            console.log("Request finished");
        }
    });
});

function makeMap(data) {
    // Create the base layers.
    var dark_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/dark-v10',
        accessToken: API_KEY
    });

    var light_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v10',
        accessToken: API_KEY
    });

    // Create a baseMaps object to contain the streetmap and the darkmap.
    var baseMaps = {
        "Dark": dark_layer,
        "Light": light_layer
    };

    //let date_st = (data.date);
    //date_st.substring(0, 9);
    // console.log(date_st);

    // DO WORK AND CREATE THE OVERLAY LAYERS
    // Define arrays to hold the created  markers.
    var shootingMarkers = L.markerClusterGroup();
    var heatArray = [];
    for (var i = 0; i < data.length; i++) {
        var location = data[i].geolocation;

        if (location) {
            let lats = parseFloat(location.latitude);
            if (lats) {
                var CustomColour = "#3274A3";
                var iconColour = ""
                if (data[i].suspect_deceased_injured_or_shoot_and_miss == "Shoot and Miss")
                    customColour = "#31882A";

                else if (data[i].suspect_deceased_injured_or_shoot_and_miss == "Injured")
                    customColour = "#988F2E";
                else
                    customColour = "#982E40";

                //Create custom icon
                var customMarker = L.AwesomeMarkers.icon({
                    markerColor: customColour
                });

                // Format date 
                let date_st = (data[i].date);
                new_date = date_st.substring(0, 10);

                let marker = L.marker([parseFloat(location.latitude), parseFloat(location.longitude)], { icon: customMarker });
                marker.bindPopup("<h1>" + data[i].suspect_s +
                    "</h1> <hr> <h2>" + "Occured at " + data[i].location + " on " + new_date +
                    "</h2> <hr> <h2>" + data[i].suspect_deceased_injured_or_shoot_and_miss +
                    "</h2> <hr> <h3>" + "Shot by: Officer(s) " + data[i].officer_s) + "</h3>";
                shootingMarkers.addLayer(marker);

                // add heat map data
                heatArray.push([parseFloat(location.latitude), parseFloat(location.longitude)]);
            }

        }

    }

    // Create layer groups for markers
    var heatLayer = L.heatLayer(heatArray, {
        radius: 50,
        blur: 10
    });

    // Create an overlayMaps object to contain the "State Population" and "City Population" layers
    var overlayMaps = {
        "Shootings Markers": shootingMarkers,
        "Heat Map": heatLayer
            // "Boroughs": geoLayer
    };

    // Modify the map so that it has the streetmap, states, and cities layers
    var myMap = L.map("map", {
        center: [32.7767, -96.7970],
        zoom: 13,
        layers: [dark_layer, shootingMarkers]
    });

    // Create a layer control that contains our baseMaps and overlayMaps, and add them to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
} 