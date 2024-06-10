require('dotenv').config();
const mongoose = require('mongoose');

const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDbName = process.env.MONGO_DB_NAME;
const mongoAuthDbName = process.env.MONGO_AUTH_DB_NAME || mongoDbName


// Connection URI
let mongoUrl;
if (mongoHost == 'localhost') {
  console.log("HITTING LOCALHOST");
  mongoUrl = `mongodb://${mongoHost}/${mongoDbName}`;
} else{
  console.log("HITTING ELSE");
  mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoAuthDbName}?authSource=${mongoDbName}`;
}
console.log(mongoUrl)


// Database connection
exports.connectToDb = async (callback) => {
  await mongoose.connect(mongoUrl)
    .then(() => {
      console.log('Mongoose connection successful');
      if (callback) callback(null, mongoose.connection);
    })
    .catch((err) => {
      console.error('Mongoose connection error:', err);
      if (callback) callback(err);
    });
};

// Get database instance
exports.getDbReference = () => {
  return mongoose.connection;
};

// Close database connection
exports.closeDbConnection = function (callback) {
  mongoose.connection.close(() => {
    console.log('Mongoose connection closed');
    if (callback) callback();
  });
};
