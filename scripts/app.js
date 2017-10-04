// define globals
var weekly_quakes_endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

$(document).ready(function() {
  console.log("Let's get coding!");

  // CODE IN HERE!
  $.ajax({
    method: 'GET',
    url: weekly_quakes_endpoint,
    dataType: 'json',
    success: onSuccess,
    error: onError,
  })

  initMap()

});

var map;
function initMap(lat,long) {
     var city = {lat: lat, lng: };
     map = new google.maps.Map(document.getElementById('map'), {
       zoom: 1,
       center: city
     });
     var marker = new google.maps.Marker({
       position: city,
       map: map
     });
   }



function mapSuccess(json){
  $("#map").on("load")
}

function onSuccess(data){
  var currentTime = new Date();
  currentTime = currentTime.getTime();

  data.features.forEach(function(x){
    var hoursFromEarthQuake = Math.round((((currentTime - x.properties.time)/1000)/60)/60);
    var hourOrDay;
    if(hoursFromEarthQuake===24){
      var days = Math.floor(hoursFromEarthQuake/24);
      var leftHours = hoursFromEarthQuake %24
      hourOrDay=`${days} day and ${leftHours} hours ago`
    }else if(hoursFromEarthQuake>24){
      var days = Math.floor(hoursFromEarthQuake/24);
      var leftHours = hoursFromEarthQuake %24
      hourOrDay=`${days} days and ${leftHours} hours ago`
    }else {
      hourOrDay=`${hoursFromEarthQuake} hours`
    }
    var coordinates = x.geometry.coordinates[0] +"," + x.geometry.coordinates[1]
    $("ul").append($(`<li>${x.properties.title} / ${hourOrDay} </li>`))
  })
}

function onError(x,y,z){
  alert("We have run into an Error, please be patience while we fix the matter");
  console.log("Error " + y);
  console.log("Error " + z);
  console.dir(x);
}
