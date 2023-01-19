const jwt=require('jsonwebtoken')
const Service = require("./../../../models/ServiceCategory_model");
const {domain} = require("./../../../config/constant");
// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){

    try{
        const result = await Service.find({});
        const data={};
        const categories=result.map(function(cat, index){
            cat=cat.toObject();
            cat.display_image=process.env.root_url+"/uploads/"+cat.display_image
          //  console.log(cat.display_image)
            return cat;
        });
       // console.log("jone")
        data.categories=categories;
        return res.send({
            data: data,
            status: true,
            error:{}
        });
    }
     catch(err){
        next({statusCode: 400, error: err.message});
        return
    }
}

async function category_search(req,res,next){
    try{
        const result = await Service.find({});
        const data={};
        const categories=result.map(function(cat, index){
            cat=cat.toObject();
            cat.display_image=process.env.root_url+"/uploads/"+cat.display_image
          //  console.log(cat.display_image)
            return cat;
        });
       // console.log("jone")
        data.categories=categories;
        return res.send({
            data: data,
            status: true,
            error:{}
        });
    }
    catch(err){
        next({statusCode: 400, error: err.message});
        return
    }
}
module.exports={index,category_search}
