var app = app || {};

(module => {

  const landingView = {};

  landingView.init = () => {
    $('#landing-view').show();
    $('#login').show();
  };


  module.landingView = landingView;

})(app);


