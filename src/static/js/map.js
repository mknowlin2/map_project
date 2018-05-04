// Create a map object for Google map.
var map;
// Create a new blank array for all the listing markers.
var markers = [];

/**
* @description This function takes in a COLOR, and then creates a new marker
*              icon of that color. The icon will be 21 px wide by 34 high,
*              have an origin of 0, 0 and be anchored at 10, 34).
* @param {string} markerColor
* @returns {google.maps.MarkerImage} markerImage
*/
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

/**
* @description This function toggles the google.maps.Animation.BOUNCE.
* @param {google.maps.Marker} marker
*/
function toggleBounce(marker) {
    for (var i = 0; i < markers.length; i++) {
      if(markers[i] == marker) {
        markers[i].setAnimation(google.maps.Animation.BOUNCE);
      } else {
        markers[i].setAnimation(null);
      }
    }
}

/**
* @description This function will show the selected marker based on title.
* @param {string} title
*/
function showMarker(title) {
  var bounds = new google.maps.LatLngBounds();

  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    if(markers[i].title == title) {
      markers[i].setMap(map);
      google.maps.event.trigger(markers[i], 'click');
      toggleBounce(markers[i]);
    }
  }
}

/**
* @description This function hides markers which do not match filter when
*              filter changes
*/
function filterMarkers() {
  var bounds = new google.maps.LatLngBounds();
  var filter = $('#filter')[0].value;

  for (var i = 0; i < markers.length; i++) {
    if(markers[i].title.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
      markers[i].setMap(map);
      markers[i].setAnimation(google.maps.Animation.DROP);
      bounds.extend(markers[i].position);
      map.fitBounds(bounds);
    } else {
      markers[i].setMap(null);
    }
  }
}

/**
* @description This function populates the infowindow with a list of names
*              from the venuesNames array when the marker is clicked.
* @param {google.maps.Marker} marker
* @param {google.maps.InfoWindow} infowindow
* @param {array} venueNames
*/
function populateInfoWindow(marker, infowindow, venueNames) {

  toggleBounce(marker);
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      marker.setAnimation(null);
    });

    var infoStr = '<div><h3>' + marker.title + '</h3></div>';
    infoStr = infoStr.concat('<div><h4>Nearby Coffee Shops</h4><ul>');

    for(var i = 0; i < venueNames.length; i++) {
      infoStr = infoStr.concat('<li>' + venueNames[i] + '</li>');
    }

    infoStr = infoStr.concat('</ul></div>');

    infowindow.setContent(infoStr);

    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

/**
* @description Init Google map 
*/
function initMap() {
  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');
  // Info window variable
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.3564879, lng: -84.471914},
    zoom: 13,
    mapTypeControl: false
  });

  // The following group uses the location array to create an array of
  // markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].latLng;
    var title = locations[i].title;
    var venueNames = locations[i].findCoffee();

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });

    // Push the marker to our array of markers.
    markers.push(marker);

    // Extend the boundaries of the map
    bounds.extend(marker.position);
    map.fitBounds(bounds);

    // Create an onclick event to open the large infowindow at each
    // marker.
    marker.addListener('click', (function(venueNamesCopy) {
      return function() {
        populateInfoWindow(this, largeInfowindow, venueNamesCopy);
      };
    })(venueNames));
  }
}
