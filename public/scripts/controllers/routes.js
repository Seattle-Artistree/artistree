
'use strict';
// all route changes should hide page containers
page('/*', (ctx, next) => {
  $('.page').hide();
  next();
});

// page('/', () => console.log('hola'));

page('/', () => app.landingView.init());
page('/home', () => app.homeView.init());
page('/about', () => app.aboutView.init());

page.start();