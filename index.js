const express = require("express")
 cors = require("cors")
const http = require('http');
const jwt= require('jsonwebtoken')
const auth= require('./app/controllers/Auth')
const app = express();
const validation = require("./helper/validation/validation")
const fs = require("fs");
const path = require("path");
require('dotenv').config();

app.use(cors({
    origin: '*'
}));

app.use(express.json()); //Json body parser
app.use(express.urlencoded({ extended: true })); //Form-data body parser

app.use('/uploads',express.static(path.join(__dirname, 'uploads')))

app.use(async function (req, res, next) {

    try{

    
      // Website you wish to allow to connect
      res.header('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.header('Access-Control-Allow-Headers', 'token');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.header('Access-Control-Allow-Credentials', true);
    
      if((await validation.validate(req))==false){
        next({statusCode: 400, error: "fields are missing"});
        return
      }
      next();  
    } catch(err){
      next({statusCode: 400, error: err.message});
      return
    } 

        

});

app.post('/auth', auth.index);
app.post('/auth/signup', auth.signup);
app.use(`/fileupload`,require(`./helper/fileupload.js`));

app.use(`/front`,require(`./app/routes/Front.js`));
app.use(`/vendor`,require(`./app/routes/Vendor.js`));
app.use(`/customer`,require(`./app/routes/Customer.js`));
app.use(`/admin`,require(`./app/routes/Admin.js`));
app.use(function(err,req,res,next){
    console.log(err.statusCode)
    return res.status(422).json({
      data: {},
      status: false,
      error:err.error
    }).send();
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