(function(module) {
  var aboutController = {};

  aboutController.index = function() {
    $('#about').show().siblings().hide();
    // DONE: Call a function to load (AKA 'request') our repo data.
    // Pass in a view function as a callback, so our repos will render after the data is loaded.
    repos.requestRepos(repoView.index);

  };

  module.aboutController = aboutController;
})(window);
