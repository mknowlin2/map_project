// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
  var self = this;
  self.locations = locations;
  self.filter = ko.observable("");

  // filtered location list
  self.filteredLocations = ko.computed(function() {
    var filter = this.filter().toLowerCase();

    if(!self.filter()) {
      return this.locations;
    } else {
      return ko.utils.arrayFilter(this.locations, function(location) {
        if (location.title
                    .toLowerCase()
                    .indexOf(self.filter().toLowerCase()) > -1) {
            return location;
        }
      });
    }
  }, this);
};
