const express = require("express")
// cors = require("cors")
const http = require('http');
const jwt= require('jsonwebtoken')
const auth= require('./app/controllers/Auth')
const app = express();
app.use(express.json()); //Json body parser
app.use(express.urlencoded({ extended: true })); //Form-data body parser


app.use(function (req, res, next) {

    console.log("test4");

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);

    next();
});

app.post('/auth', auth.index);
app.post('/auth/signup', auth.signup);

app.use(`/front`,require(`./app/routes/Front.js`));
app.use(`/vendor`,require(`./app/routes/Vendor.js`));
app.use(`/customer`,require(`./app/routes/Customer.js`));
app.use(`/admin`,require(`./app/routes/Admin.js`));
app.use(function(err,req,res,next){
    console.log("akil")
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