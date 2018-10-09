const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
//all requests go through here
app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

const dbSyncListen = async () => {
  try {
    await db.sync({ force: true });
    app.listen(4000, () => {
      console.log('server running on port 4000');
    });
  } catch (err) {
    console.log(err);
  }
};

dbSyncListen();
