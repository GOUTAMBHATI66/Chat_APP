const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected : ${(await connect).connection.host}`);
  } catch (error) {
    console.log("Error : ", error.message);
    process.exit();
  }
};

module.exports = connectDB;
