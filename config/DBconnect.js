const mongoose = require("mongoose");
const connect = async () => {
  return await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("connected to the database"))
    .catch((error) => {
      throw error;
    });
};

module.exports = connect;
