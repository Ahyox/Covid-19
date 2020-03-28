$(document).ready(function () {
  $('#loading').show();
  loadStates();
});

function loadStates() {
  firebase.database().ref('states/').once('value', function (snapshot) {
    $('#loading').hide();  
    snapshot.forEach(function (childSnapshot) {
          var id = childSnapshot.key;
          var state = childSnapshot.val();
          $('#state').append($('<option>', {
              value: id,
              text: state
          }));
      });
  });
}

$('#state').change(function(){
  var state = $('#state option:selected').html();
  loadAffectedLocation(state);
});

function loadAffectedLocation(state) {
  console.log("state", state);
  $('#loading').show();
  $('#contentTable tbody tr').remove();
		var tbody = $('#contentTable tbody');
    var $tr = '';
    var counter = 0;
  firebase.database().ref('report/'+state).once('value', function (snapshot) {
    $('#loading').hide();
    
    var array = snapshot.val();
    console.log(array);
    for (key in array) {
      ++counter;
      var lga = key.replace("_", " ");
      $tr += '<tr style="color: #fff;">' +
          '<td>' + counter + '</td>' +
          '<td width="30%">' + state + '</td>' +
          '<td>' + lga + '</td>' +
          '</tr>';
    }

    tbody.append($tr);
});
}


function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: {lat: 9.0820, lng: 8.6753}
        });


        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.
        var markers = locations.map(function(location, i) {
          return new google.maps.Marker({
            position: location,
            label: 'V'
          });
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
      }
      var locations = [
        {lat: 9.0820, lng: 8.6753},
        {lat: 9.0830, lng: 8.6753},
        {lat: 9.0840, lng: 8.6553},
        {lat: 9.0820, lng: 8.6553},
        {lat: 9.0850, lng: 8.6453},
        {lat: 9.0860, lng: 8.6453},
        {lat: 9.0820, lng: 8.6353},
        {lat: 9.080, lng: 8.6713},
        {lat: 9.0870, lng: 8.953},
        {lat: 9.0880, lng: 8.6053},
        {lat: 9.0820, lng: 8.6753},
        {lat: 9.0840, lng: 8.6253},
        {lat: 9.0820, lng: 8.6353},
        {lat: 9.0860, lng: 8.6353},

        
      ]