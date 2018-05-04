//Database About


app.post('/index', (request, response) => {
  client.query(
    'INSERT INTO feedback(feedback, "username") VALUES($1, $2) ON CONFLICT SET TO NULL'
      [request.body.feedback, request.body.username],
    function (err) {
      if (err) console.error(err);
      queryTwo();
    }
  );

  function queryTwo() {
    client.query(
      'SELECT user_id FROM feedback WHERE username=$1',
      [request.body.feedback],
      function (err, result) {
        if (err) console.error(err);
        queryThree(result.rows[0].user_id);
      }
    );
  }

  function queryThree(user_id) {
    client.query(
      `INSERT INTO
        feedback(user_id, comment, "publishedOn")
        VALUES ($1, $2, $3);`,
      [
        user_id,
        request.body.comment,
        request.body.publishedOn,
      ],
      function (err) {
        if (err) console.error(err);
        response.send('insert complete');
      }
    );
  }
});