const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType
} = require("graphql");
const { User, Product, Order } = require("./db/models");
const { resolver } = require("graphql-sequelize");

const orderType = new GraphQLObjectType({
  name: "Order",
  fields: {
    id: {
      type: GraphQLString
    },
    status: {
      type: new GraphQLEnumType({
        name: "status",
        values: {
          pending: { value: 0 },
          sold: { value: 1 }
        }
      })
    }
  }
});

const productType = new GraphQLObjectType({
  name: "Product",
  fields: {
    id: {
      type: GraphQLString
    },
    quantity: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    category: {
      type: GraphQLString
    }
  }
});

const userType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    orders: {
      type: new GraphQLList(orderType),
      resolve: resolver(User.Orders)
    }
  }
});

//we need to create a root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: userType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: resolver(User)
    },
    users: {
      type: new GraphQLList(userType),
      resolve: resolver(User)
    },
    products: {
      type: new GraphQLList(productType),
      resolve: resolver(Product)
    }
  }
});

// const mutation = new GraphQLObjectType({
//   name: "Mutation",
//   fields: {
//     addCustomer: {
//       type: userType,
//       args: {
//         firstName: { type: new GraphQLNonNull(GraphQLString) },
//         email: { type: new GraphQLNonNull(GraphQLString) },
//         lastName: { type: new GraphQLNonNull(GraphQLString) }
//       },
//       resolve(parentValue, args) {
//         // return (sqeulize stuff)
//       }
//     }
//   }
// });
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: userType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parentValue, args) => {
        try {
          const user = await User.create({ ...args });
          return user;
        } catch (error) {
          console.log(error);
        }
      }
    },
    deleteUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parentValue, args) => {
        try {
          const user = await User.findById(args.id);
          return user.destroy();
        } catch (error) {
          console.log(error);
        }
      }
    },
    updateUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString }
      },
      resolve: async (parentValue, args) => {
        try {
          const user = await User.findById(args.id);
          await user.update({ ...args });
          return user;
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation });
