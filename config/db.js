const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1", {
    dbName: "mydb",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose: connected to db!");
  })
  .catch((err) => {
    console.log(`Mongoose: db connection failed! ${err.message}`);
  });

// mongoose.connection.on("connected", () => {
//   console.log("Mongoose: connected to db!");
// });

// mongoose.connection.on("error", (err) => {
//   console.log(`Mongoose: db connection failed! \n${err.message}`);
// });

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose: db connection is disconnected!");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});