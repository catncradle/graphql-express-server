"use strict";

const db = require("../db");
const { User, Order, Product } = require("../db/models");
const mockData = require("./ProductData.json");
const mockUsers = require("./UserData.json");

async function seed() {
  await db.sync({ force: true });
  console.log("db synced!");
  // Whoa! Because we `await` the promise that db.sync returns, the next line will not be
  // executed until that promise resolves!

  //generate 20 random users
  const users = [];
  for (let i = 0; i < mockUsers.length; i++) {
    users.push(User.create(mockUsers[i]));
  }
  await Promise.all(users);

  //generate products
  const products = [];

  for (let i = 0; i < mockData.length; i++) {
    let product = Product.create(mockData[i]);
    products.push(product);
  }
  await Promise.all(products);

  // const resolvedReviews = await Promise.all(reviews)

  // Wowzers! We can even `await` on the right-hand side of the assignment operator
  // and store the result that the promise resolves to in a variable! This is nice!
  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
(async function() {
  if (module === require.main) {
    try {
      console.log("seeding");
      await seed();
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
      // .catch(err => {
      //   console.error(err);
      //   process.exitCode = 1;
      // })
    } finally {
      console.log("closing db");
      db.close();
      console.log("db closed");
    }

    console.log("seeding...");
  }
})();
// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
