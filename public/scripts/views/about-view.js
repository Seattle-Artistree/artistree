var app = app || {};

(module => {

  const aboutView = {};

  aboutView.init = () => $('#about-view').show();

  //store feedback ??
  app.Feedback.prototype.init = () => {
    $('#row').off().on('submit', 'form', (event) => {
      event.preventDefault();
      const selection = $('#radio-inline').val('');
      const user_id = $('').val('');
      const comment = $('#comments').val('');
      app.Feedback.create({ selection }, { user_id }, { comment });

      console.log('posted');
    });


  module.aboutView = aboutView;

})(app);


  const createFeedback= {};

