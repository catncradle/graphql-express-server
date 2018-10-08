const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql');
const { User, Product, Order } = require('../db/models');
const { resolver } = require('graphql-sequelize');
const { addUser } = require('./resolver');

const orderType = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: {
      type: GraphQLString,
    },
    status: {
      type: new GraphQLEnumType({
        name: 'status',
        values: {
          pending: { value: 'pending' },
          sold: { value: 'sold' },
        },
      }),
    },
  },
});

const productType = new GraphQLObjectType({
  name: 'Product',
  fields: {
    id: {
      type: GraphQLString,
    },
    quantity: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    category: {
      type: GraphQLString,
    },
  },
});

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLString,
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
        id: { type: GraphQLString },
      },
      resolve: resolver(User),
    },
    users: {
      type: new GraphQLList(userType),
      resolve: resolver(User),
    },
    product: {
      type: productType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: resolver(Product),
    },
    products: {
      type: new GraphQLList(productType),
      resolve: resolver(Product),
    },
    orders: {
      type: new GraphQLList(orderType),
      resolve: resolver(Order),
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: userType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: addUser,
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation });
