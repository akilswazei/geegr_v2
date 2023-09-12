const jwt=require('jsonwebtoken')
const Service = require("./../../../models/Service_model");
// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){
    let data=req.body;

    try{
        const result = await Service.find({created_by: data.user._id,deleted:false});
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
    }
}

async function remove(req,res,next){
    let data=req.body;

    try{
        const result = await Service.findOneAndUpdate({_id: data.service_id,deleted:false},{deleted:true},{new: true});
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
    }
}
async function detail(req,res,next){
    let data=req.body;
     try{
        const result = await Service.findOne({_id:data.service_id,created_by: data.user._id,deleted:false});
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
    }
}
async function add(req,res,next){

    let returnJson = { success: false };
    const allheaders=req.headers;
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
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');
    try {
        let saveData = new Service({
            title: data.title,
            description: data.description,
            category:data.category,
            sub_category:data.sub_category,
            service_charge: data.service_charge,
            skills:data.skills,
            display_image: data.display_image,
            created_by: decoded.user._id,
            external_url: data.extrnal_url,
            location: data.location
        });
        const result = await saveData.save();    
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        next({statusCode: 400, error: err.message});
        return
    }

}

async function update(req,res,next){

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
        let saveData = {
            "title": data.title,
            "description": data.description,
            "category":data.category,
            "sub_category":data.sub_category,
            "service_charge": data.service_charge,
            "skills":data.skills,
            "display_image": data.display_image,
            "location": data.location
        };
        const result = await Service.findOneAndUpdate({_id: data.service_id}, saveData);    
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        next({statusCode: 400, error: err.message});
        return
    }

}

module.exports={index,add,update,remove,detail}
