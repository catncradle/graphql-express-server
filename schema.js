const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

//hard coded data
const customers = [
  { id: "1", name: "John Doe", email: "jdoe@gmail.com", age: 12 },
  { id: "2", name: "Jawn Doe", email: "jdoe@gmail.com", age: 33 },
  { id: "3", name: "John Dole", email: "jdoe@gmail.com", age: 31 },
  { id: "4", name: "Vohn Doe", email: "jdoe@gmail.com", age: 32 }
];

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    }
  })
});

//we need to create a root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        for (let i = 0; i < customers.length; i++) {
          if (customers[i].id === args.id) {
            return customers[i];
          }
        }
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return customers;
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery });
