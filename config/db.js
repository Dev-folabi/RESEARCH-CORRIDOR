const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async () => {
  const dbURI = process.env.MONGO_URI
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
