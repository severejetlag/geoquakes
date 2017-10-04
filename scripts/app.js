// define globals
var weekly_quakes_endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
$(document).ready(function() {
    console.log("Let's get coding!");
    // CODE IN HERE!
    $.ajax({
        method: 'GET',
        url: weekly_quakes_endpoint,
        success: onGeoSuccess,
        error: onGeoError
    })
});
var map;
var locations = []
function initMap() {
    var city = { lat: 37.78, lng: -122.44};
    var map = new google.maps.Map(document.getElementById('map'), {
        center:city,
        zoom: 1
    });
    var markers = locations.map(function(object, i) {
        return new google.maps.Marker({
            position: object,
            map: map
        });
    });
}
function onGeoSuccess(json){
    $('#info h1').append(json.metadata.count);
    let date  = new Date();
    let $earthQakeList = $('ul#earthquake-list');
    json.features.forEach(function(earthQuake){
        let hourAmount = Math.floor((((date.getTime() - earthQuake.properties.time)/1000)/60)/60);
        let timeSinceEqString;
        if(hourAmount >= 24){
            let days = Math.floor(hourAmount/24);
            let hours = hourAmount % 24;
            timeSinceEqString = `${days} days and ${hours} hours ago`;
        }else{
            timeSinceEqString = `${hourAmount} hours ago`;
        }
        let listItem = `<li>${earthQuake.properties.title} (${timeSinceEqString})</li>`;
        $earthQakeList.append(listItem);
        // console.log(earthQuake.geometry.coordinates[0]);
        // markMap();
        locations.push({lat:earthQuake.geometry.coordinates[0], lng:earthQuake.geometry.coordinates[1]})
    })
    initMap();
}
function onGeoError(){
    console.log("sad day");
}
