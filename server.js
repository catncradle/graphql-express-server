const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema.js');
const db = require('./db');

const app = express();

//all requests go through here
app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

db.sync();

app.listen(4000, () => {
  console.log('server running on port 4000');
});
