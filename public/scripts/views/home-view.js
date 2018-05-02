var app = app || {};

(module => {

  const homeView = {};

  homeView.init = () => {
    $('#home-view').show();
    $('#login').show();
  };


  module.homeView = homeView;

})(app);


