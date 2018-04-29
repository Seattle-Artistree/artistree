var app = app || {};

(module => {

  const landingView = {};

  landingView.init = () => {
    $('#landing-view').show();
    $('#login').show();
    $('svg').hide();
  };


  module.landingView = landingView;

})(app);


