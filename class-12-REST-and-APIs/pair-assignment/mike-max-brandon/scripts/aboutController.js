(function(module) {
  var aboutController = {};

  aboutController.index = function() {
    $('#about').show().siblings().hide();

    // TODO: Call a function to load (AKA 'request') our repo data.
    // Pass in a view function as a callback, so our repos will render after the data is loaded.

  };

  module.aboutController = aboutController;
})(window);
