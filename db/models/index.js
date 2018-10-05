const User = require('./users');
const Product = require('./products');
const Order = require('/orders');

Order.Products = Order.belongsToMany(Product, { through: 'Item' });
Product.Orders = Product.belongsToMany(Order, { through: 'Item' });

User.hasMany(Order);

module.exports = { User, Order, Product };
