const jwt=require('jsonwebtoken')
const Service = require("./../../../models/ServiceCategory_model");
const {domain} = require("./../../../config/constant");
// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){
    const result = await Service.find({});
    const data={};
    const categories=result.map(function(cat, index){
        cat=cat.toObject();
        cat.display_image=process.env.root_url+"/uploads/"+cat.display_image
        console.log(cat.display_image)
        return cat;
    });
    console.log("jone")
    data.categories=categories;
    return res.send({
        data: data,
        status: true,
        error:{}
    });
}
module.exports={index}
