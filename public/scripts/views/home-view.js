var app = app || {};

(module => {

  let homeView = {};

  homeView.init = () => $('#home-view').show();

  module.homeView = homeView;

})(app);

