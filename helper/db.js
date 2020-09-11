const mongoose = require("mongoose");
//require("dotenv").config();
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
