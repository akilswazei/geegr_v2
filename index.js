const express = require("express")
cors = require("cors")
const http = require('http');
const jwt= require('jsonwebtoken')
const auth= require('./app/controllers/Auth')
const app = express();
const validation = require("./helper/validation/validation")
const fs = require("fs");
const fileUpload = require('express-fileupload');

app.use(fileUpload({ safeFileNames: true, preserveExtension: true }))

const path = require("path");
require('dotenv').config();
const { Server } = require("socket.io");

app.use(cors({
    origin: '*'
}));


const httpServer = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();
}).listen(2000);
io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", async (socket) => {
    console.log("New client connected");
    socketInstance = socket;

    // socket.on("joinUser", socket.join);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });



//app.use(express.urlencoded({ extended: true })); //Form-data body parser
app.use(express.json()); //Json body parser
app.use('/uploads',express.static(path.join(__dirname, 'uploads')))


  
// To handle the download file request
app.get("/download", function (req, res) {
  
  // The res.download() talking file path to be downloaded
  res.download(__dirname + "/download_gfg.txt", function (err) {
    if (err) {
      console.log(err);
    }
  });
});

app.use(async function (req, res, next) {

    try{

      console.log("test4");

      // Website you wish to allow to connect
      res.header('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,token');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.header('Access-Control-Allow-Credentials', true);
    



      next();  
    } catch(err){
      next({statusCode: 400, error: err.message});
      return
    } 

        

});




app.post('/auth', auth.index);
app.post('/auth/signup', auth.signup);
app.post('/auth/signup_google', auth.signup_google);
app.post('/auth/login_google', auth.login_google);
//app.use(`/fileupload`,require(`./helper/fileupload.js`));

app.use(`/front`,require(`./app/routes/Front.js`));
app.use(`/vendor`,require(`./app/routes/Vendor.js`));
app.use(`/customer`,require(`./app/routes/Customer.js`));
app.use(`/admin`,require(`./app/routes/Admin.js`));
app.use(function(err,req,res,next){
    res.status(err.statusCode).json({
      data: {},
      status: false,
      error:err.error
    });
});


// app.use(`/api`,require(`./app/index.js`));


// app.use(adminlogin.validate)
// app.use(`/api/admin`,require(`./admin/routes/admin.js`));
// app.use(function(req,res,next){
//     res.status(404).json({
//       data: {},
//       status: false,
//       error:"page not found"
//     });
// });




app.listen(3010,() => {
  require("./config/db");
});