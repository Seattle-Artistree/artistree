var app = app || {};

((module) => {

  let homeView = {};

  homeView.init = () => $('#home-view').show();
  

  // $('#home-view').on('click', () => {
  //   homeView.init();
  // });

  module.homeView = homeView;

})(app);

