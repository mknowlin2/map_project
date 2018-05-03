// Foursquare variables
var foursquare_client_id = "H4G45SFPNZNFHOY33IGFMWOT0C5DONIZBJPCJCLVKIDXQ0P1";
var foursquare_client_secret = "H244FFMKQKHSFI0BT4FZ3NLDZ3ZIX35UZIG4WKL01GS11FRS";
var urlBase = "https://api.foursquare.com/v2/venues/search?";

// Initial marker location array
var locations = [
  new MarkLocation("Jungle Jim's", {lat: 39.335078, lng: -84.5242466}),
  new MarkLocation("Aris Beauty Bar", {lat: 39.362649, lng: -84.505173}),
  new MarkLocation("Out The Way", {lat: 39.340242, lng: -84.459319}),
  new MarkLocation("Banefield Pet Hospital", {lat: 39.386467, lng: -84.499703}),
  new MarkLocation("Kroger", {lat: 39.352639, lng: -84.459846}),
  new MarkLocation("New China", {lat: 39.361502, lng: -84.461743}),
  new MarkLocation("Starbucks", {lat: 39.323212, lng: -84.429819})
];

// Class to represent a row in the location object
function MarkLocation(title, location) {
  var self = this;
  self.title = title;
  self.latLng = location;

  self.showMarker = function() {
    showMarker(title);
  };

  self.findCoffee = function() {
    var venueNames = [];
    // Build URL for foursquare request
    var params = {'client_id': foursquare_client_id,
                  'client_secret': foursquare_client_secret,
                  'v': '20130815',
                  'll': self.latLng.lat + ',' + self.latLng.lng,
                  'query' : "coffee",
                  'limit' : 5};

    var urlParams = jQuery.param( params );
    var fourSquareUrl = urlBase + urlParams;

    $.getJSON(fourSquareUrl, function(data) {
      var venues = data.response.venues;

      for(var i = 0; i < venues.length; i++) {
        venueNames.push(venues[i].name);
      }
    }).fail(function(e){
      console.log(e);
      alert("The coffee shop data could not be loaded.");
    });

    return venueNames;
  }
}
