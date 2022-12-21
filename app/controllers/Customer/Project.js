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

async function update(req,res,next){

    try {
        const data= req.body;
        let saveData = {
          title: data.title
        };
        const result = await Project.findOneAndUpdate({_id: data.project_id}, saveData);
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



async function add(req,res,next){

    const data= req.body;
    try {
        let saveData = new Project({
          title: data.title,
          category: data.category,
          sub_category: data.sub_category,
          location: data.location,
          latlong: {lat: data.lat, long: data.long},
          description: data.description,
          budget: data.budget,
          created_by: data.user._id
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
