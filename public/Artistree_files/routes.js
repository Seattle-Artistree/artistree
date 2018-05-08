'use strict';
// all route changes should hide page containers
page('/*', (ctx, next) => {
  $('.page').hide();
  next();
});

// page('/', () => console.log('hola'));

page('/', () => app.homeView.init());
page('/discover', () => app.discoverView.init());
page('/about', () => app.aboutView.init());

page.start();