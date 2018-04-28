var app = app || {};

(module => {

  const landingView = {};

  landingView.init = () => $('#landing-view').show();


  module.landingView = landingView;

})(app);

// $(document).ready(() => {
//   app.landingView.init();
// });

