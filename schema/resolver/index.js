const { User } = require('../../db/models');

const addUser = async (parentValue, args) => {
  try {
    const user = await User.create({ ...args });
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addUser };
