// define globals
var weekly_quakes_endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
var map;
var locationsMajor = [];
var locationsMed = [];
var locationsMinor = [];

$(document).ready(function() {
    console.log("Let's get coding!");
    // CODE IN HERE!
    $.ajax({
        method: 'GET',
        url: weekly_quakes_endpoint,
        success: onGeoSuccess,
        error: onGeoError
    })

    $("#map").after('<button class="last30day">Last 30 Days</button>')
    $("#map").after('<button class="last7day">Last 7 Days</button>')
    $(".last30day").on('click',function(event){
      event.preventDefault();
      $.ajax({
          method: 'GET',
          url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson",
          success: onGeoSuccess,
          error: onGeoError
      })
      $("h1").text("Earthquakes from the past month:")
    })
    $(".last7day").on('click',function(event){
      event.preventDefault();
      $.ajax({
          method: 'GET',
          url: weekly_quakes_endpoint,
          success: onGeoSuccess,
          error: onGeoError
      })
      $("h1").text("Earthquakes from the past week:")
    })


});
function initMap() {
    var city = { lat: 0, lng: 0};
    var map = new google.maps.Map(document.getElementById('map'), {
        center:city,
        zoom: 1
    });
    var iconMajor = {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // url
        scaledSize: new google.maps.Size(20, 20), // scaled size // anchor
    };
    var iconMed = {
        url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png", // url
        scaledSize: new google.maps.Size(20, 20), // scaled size // anchor
    };
    var iconMinor = {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // url
        scaledSize: new google.maps.Size(20, 20), // scaled size // anchor
    };
    var markersMajor = locationsMajor.map(function(location, i) {
        return new google.maps.Marker({
            position: location,
            map: map,
            icon: iconMajor
        });
    });
    var markersMed = locationsMed.map(function(location, i) {
        return new google.maps.Marker({
            position: location,
            map: map,
            icon: iconMed
        });
    });
    var markersMinor = locationsMinor.map(function(location, i) {
        return new google.maps.Marker({
            position: location,
            map: map,
            icon: iconMinor
        });
    });
}
function onGeoSuccess(json){
    $('li').remove();
    locationsMajor=[];
    locationsMinor=[];
    locationsMed=[];
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
        let listItem = `<li>${earthQuake.properties.title.split(" of ")[1]} (${timeSinceEqString})</li>`;
        $earthQakeList.append(listItem);
        // console.log(earthQuake.geometry.coordinates[0]);
        // markMap();
        if(earthQuake.properties.mag >= 5){
            locationsMajor.push({lat:earthQuake.geometry.coordinates[1], lng:earthQuake.geometry.coordinates[0]})
        }else if(earthQuake.properties.mag >= 4.8 && earthQuake.properties.mag < 5){
            locationsMed.push({lat:earthQuake.geometry.coordinates[1], lng:earthQuake.geometry.coordinates[0]})
        }else{
            locationsMinor.push({lat:earthQuake.geometry.coordinates[1], lng:earthQuake.geometry.coordinates[0]})
        }
    })
    initMap();
}
function onGeoError(){
    console.log("sad day");
}
