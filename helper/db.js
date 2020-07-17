const mongoose = require("mongoose");

require("dotenv").config(); // create .env file and declarate PROD_DB_URI value

module.exports = () => {
  const uri = process.env.PROD_DB_URI;
  mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  mongoose.connection.on("open", () => {
    // console.log("MongoDB: Connected");
  });
  mongoose.connection.on("error", (err) => {
    console.log("MongoDB: Error", err);
  });

  mongoose.Promise = global.Promise;
};
