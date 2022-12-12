const jwt=require('jsonwebtoken')
const Service = require("./../../../models/ServiceCategory_model");
// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){
    return res.send({
        data: req.body,
        status: true,
        error:{}
    });
}
async function details(req,res,next){
    return res.send({
        data: req.body,
        status: true,
        error:{}
    });
}


async function update(req,res,next){
  try {
         const data= req.body;
        let saveData = {
          display_image: data.imagefile,
        };
        const result = await Service.findOneAndUpdate({_id: data.cat_id},saveData);    
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        console.log(err.message);
        next(createError.InternalServerError());
    }

}
async function add(req,res,next){

    let returnJson = { success: false };

    // //Permission Check
    // const permissionResult = await checkPermission(req.user);
    // if (permissionResult.success === false) {
    //   returnJson.error = { message: permissionResult.message };
    //   return res.send(returnJson);
    // }

    // //Validation Check
    // const validationResult = await validateForm("create", req);
    // if (validationResult.success === false) {
    //   returnJson.error = { message: validationResult.message };
    //   return res.send(returnJson);
    // }
    const data= req.body;
    console.log("vendor service");
    try {
        let saveData = new Service({
          title: data.title,
          description: data.description,
          type: "parent",
        });
        const result = await saveData.save();    
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        console.log(err.message);
        next(createError.InternalServerError());
    }

}


module.exports={index,details,add,update}
