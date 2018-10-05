const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql');
const { User, Product, Order } = require('./db');
const { resolver } = require('graphql-sequelize');

//hard coded data
const customers = [
  { id: '1', name: 'John Doe', email: 'jdoe@gmail.com', age: 12 },
  { id: '2', name: 'Jawn Doe', email: 'jdoe@gmail.com', age: 33 },
  { id: '3', name: 'John Dole', email: 'jdoe@gmail.com', age: 31 },
  { id: '4', name: 'Vohn Doe', email: 'jdoe@gmail.com', age: 32 },
];

const orderType = new GraphQLObjectType({
  name: 'order',
  fields: {
    id: {
      type: GraphQLInt,
    },
    status: {
      type: new GraphQLEnumType({
        name: 'status',
        values: {
          pending: { value: 0 },
          sold: { value: 1 },
        },
      }),
    },
  },
});

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLInt,
    },
    firstName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    orders: {
      type: new GraphQLList(orderType),
      resolve: resolver(User.Orders),
    },
  },
});

//we need to create a root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: userType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        // for (let i = 0; i < customers.length; i++) {
        //   if (customers[i].id === args.id) {
        //     return customers[i];
        //   }
        // }
      },
    },
    customers: {
      type: new GraphQLList(userType),
      resolve(parentValue, args) {
        // return customers;
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: userType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        // return (sqeulize stuff)
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });
