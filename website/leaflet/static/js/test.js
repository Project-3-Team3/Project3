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
            // // NESTED AJAX
            // $.ajax({
            //     type: "GET",
            //     url: boroughs_url,
            //     contentType: "application/json",
            //     dataType: "json",
            //     success: function(bor_data) {
            //         makeMap(data, bor_data);

            //     },
            //     error: function(data) {
            //         console.log("YOU BROKE IT!!");
            //     },
            //     complete: function(data) {
            //         console.log("Request finished");
            //     }
            // });

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

    /* var color_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        accessToken: API_KEY
    });
*/
}

// Create a baseMaps object to contain the streetmap and the darkmap.
var baseMaps = {
    "Dark": dark_layer,
    "Light": light_layer,
    // "Colors": color_layer
};

let date_st = baseURL.date;
console.log(date_st);

// DO WORK AND CREATE THE OVERLAY LAYERS
// Define arrays to hold the created  markers.
var shootingMarkers = L.markerClusterGroup();
var heatArray = [];
for (var i = 0; i < data.length; i++) {
    var location = data[i].geolocation;

    if (location) {
        let lats = parseFloat(location.latitude);
        if (lats) {
            let marker = L.marker([parseFloat(location.latitude), parseFloat(location.longitude)]);
            marker.bindPopup("<h1>" + data[i].suspect_s +
                "</h1> <hr> <h2>" + data[i].date + ", " + data[i].location +
                "</h2> <hr> <h2>" + data[i].suspect_deceased_injured_or_shoot_and_miss +
                "</h2> <hr> <h3>" + "Shot by: Officer(s) " + data[i].officer_s) + "</h3>";
            shootingMarkers.addLayer(marker);

            // add heat map data
            heatArray.push([parseFloat(location.latitude), parseFloat(location.longitude)]);
        }
    }
}

var custom_layer = {
    shoot_and_miss: new L.LayerGroup(),
    injured: new L.LayerGroup(),
    deceased: new L.LayerGroup()
};

var custom_overlay = {
    "Shoot and Miss": layers.shoot_and_miss,
    "Injured": layers.injured,
    "Deceased": layers.deceased
};

// Create layer groups for markers
var heatLayer = L.heatLayer(heatArray, {
    radius: 50,
    blur: 10
});


// Create an overlayMaps object to contain the "State Population" and "City Population" layers
var overlayMaps = {
    "Shootings Markers": shootingMarkers,
    "Heat Map": heatLayer
};

// Initialize an object that contains icons for each layer group.
/*var icons = {
    shoot_and_miss: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "green",
        shape: "star"
    }),
    injured: L.ExtraMarkers.icon({
        icon: "ion-android-bicycle",
        iconColor: "white",
        markerColor: "yellow",
        shape: "circle"
    }),
    deceased: L.ExtraMarkers.icon({
        icon: "ion-minus-circled",
        iconColor: "white",
        markerColor: "red",
        shape: "penta"
    })
};

d3.json("https://www.dallasopendata.com/resource/4gmt-jyx2.json").then(function(suspect) {
            var suspect_death = suspects.data.suspect_deceased_injured_or_shoot_and_miss;

            var death_count = {
                shoot_and_miss: 0,
                injured: 0,
                deceased: 0
            };

            // Initialize stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for the layer group.
            var suspectCode;

            // Loop through the stations (they're the same size and have partially matching data).
            for (var i = 0; i < suspect_death.length; i++) {

                // Create a new station object with properties of both station objects.
                var deaths = Object.assign({}, suspect_death[i]);
                // If a station is listed but not installed, it's coming soon.
                if (suspect_death = "Shoot and Miss") {
                    suspectCode = "Shoot and Miss";
                }
                // If a station has no available bikes, it's empty.
                else if (suspect_death = "Injured") {
                    suspectCode = "Injured";
                }
                // Otherwise, the station is normal.
                else {
                    suspectCode = "Deceased";
                }

                // Update the station count.
                death_count[suspectCode]++;
                // Create a new marker with the appropriate icon and coordinates.
                var newMarker = L.marker([deaths.lat, deaths.lon], {
                    icon: icons[suspectCode]
                });


                // Add the new marker to the appropriate layer.
                newMarker.addTo(layers[suspectCode]);





*/



// Modify the map so that it has the streetmap, states, and cities layers
var myMap = L.map("map", {
    center: [32.7767, -96.7970],
    zoom: 13,
    layers: [dark_layer, shootingMarkers, custom_layer]
});

// Create a layer control that contains our baseMaps and overlayMaps, and add them to the map.
L.control.layers(baseMaps, overlayMaps, custom_overlay).addTo(myMap);


// HELPER FUNCTION

// // The function that will determine the color of a neighborhood based on the borough that it belongs to
// function chooseColor(borough) {
//     let rtnColor = "";

//     if (borough == "Brooklyn") {
//         rtnColor = "yellow";
//     } else if (borough == "Bronx") {
//         rtnColor = "red";
//     } else if (borough == "Manhattan") {
//         rtnColor = "orange";
//     } else if (borough == "Queens") {
//         rtnColor = "green";
//     } else if (borough == "Staten Island") {
//         rtnColor = "purple";
//     } else {
//         rtnColor = "black";
//     }

//     return rtnColor;
// };