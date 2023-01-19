const Project = require("./../../../models/Project_model");
const User = require("./../../../models/User_model");
const helper = require("./../../../helper/helper");

// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){

    try{
        const data=req.body
        const projects = await Project.find({created_by: data.user._id});
        const result = await Promise.all( projects.map(async function(project, index){
            project = project.toObject();
            project.assigned=project.status=='active'?"Not Assigned":"";
            if(project.status=='active'){
                project.assigned='Not Assigned'
            } else{
                console.log(project)
                const user = await User.findOne({_id: project.final_approved_user});
                project.assigned=user.first_name
            }
            return project;
        })
        )
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

async function details(req,res,next){
    let data=req.body;
    try{
        const proposalData = await proposal.findOne({_id: data.proposal_id});
        proposalData.service=await Service.findOne({service_id: proposalData.service })
        proposalData.project=await Project.findOne({project_id: proposalData.project })
     
        return res.send({
            data: proposalData,
            status: true,
            error:{}
        });        
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
    }
}


async function details(req,res,next){
    const data=req.body
    try {
        const result = await Project.findOne({_id: data.project_id,created_by: data.user._id});
        if(result==null){
            throw {message: "not found"}
        }
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
    const data= req.body;

    data.latlong={lat: data.lat, long: data.long}
    const accepted_inputs=helper.accepted_inputs(["title","description","budget","location","latlong"],data)

    try {
        const result = await Project.findOneAndUpdate({_id: data.project_id}, accepted_inputs);
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

    data.latlong={lat: data.lat, long: data.long}
    const accepted_inputs=helper.accepted_inputs(["title","description","budget","location","latlong","category","sub_category"],data)
    accepted_inputs.created_by= data.user._id
   
    try {
        let saveData = new Project(accepted_inputs);
        const result = await saveData.save();    
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        next({statusCode: 400, error: err.message});
    }

}
module.exports={index,details,add,update}
