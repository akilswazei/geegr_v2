const jwt=require('jsonwebtoken')
const User = require("./../../../models/User_model");
// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){
    return res.send({
        data: req.body,
        status: true,
        error:{}
    });
}
module.exports={index}
