const mongoose = require("mongoose");

mongoose
   .connect("mongodb://localhost:27017/?authSource=admin&readPreference=primary&ssl=false", {
    dbName: "mydb",
    useNewUrlParser: true,
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