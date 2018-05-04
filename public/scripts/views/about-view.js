var app = app || {};

(module => {

  const aboutView = {};

  aboutView.init = () => $('#about-view').show();


  module.aboutView = aboutView;

})(app);

$('#feedback').on('submit', function(event){
  console.log('test');
  event.preventDefault();

  let test = $('#comment').val();
  console.log(test);
  $.post('/feedback', {comment:test}).then(function(feedback){
    console.log(feedback);
  });
});

