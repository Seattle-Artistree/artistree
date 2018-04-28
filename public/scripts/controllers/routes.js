
// all route changes should hide page containers
page('/*', (ctx, next) => {
  $('.page').hide();
  next();
});

// page('/', () => console.log('hola'));

page('/', app.bookView.initIndexPage);

page('/create', app.createBookView.initCreatePage);

page('/:book_id', (ctx) => {

  app.Book.fetchOne(ctx.params.book_id)
    .then((singleBook) => {
      app.singleBookView.initSinglePage(singleBook);
    });
});




// page('*', app.bookView.initIndexPage);
// page('/books/new', app.createPage.init);

page.start();