const jwt=require('jsonwebtoken')
const Project = require("./../../../models/Project_model");

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
async function add(req,res,next){

    const allheaders=req.headers;
         
    let returnJson = { success: false };




        const decoded = await jwt.verify(allheaders['token'],'shhhhh');
        console.log(decoded);
       // console.log(allheaders['token']);
       //  next({statusCode: 401, error: decoded});

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
        let saveData = new Project({
          title: data.title,
          category: data.category,
          sub_category: data.sub_category,
          location: data.location,
          latlong: {lat: data.lat, long: data.long},
          description: data.description,
          budget: data.budget,
          created_by: decoded.user_id
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
module.exports={index,details,add}
