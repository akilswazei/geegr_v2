const Project = require("./../../../models/Project_model");
const User = require("./../../../models/User_model");
const Category = require("./../../../models/ServiceCategory_model");

const helper = require("./../../../helper/helper");
const {fileupload}= require("./../../../helper/fileupload");


// const {insert_user} = require("./../../functions/core")

function compress(string) {
//    console.log(string)
  return  String(string).substring(0, 5)
}


async function index(req,res,next){

    try{
        const data=req.body

        let query={created_by: data.user._id,deleted: false};

        if(data.status=='inactive'){
            query.$or=[{'status': "inactive"},{'status': "completed"}]
            } else{
            query.status='active'
        }
        const projects = await Project.find(query).sort({created_at:'desc'});

        const result = await Promise.all( projects.map(async function(project, index){
            project = project.toObject();
            project.short_id=compress(project._id);
            if(project.assigned==false){
                project.assigned='Not Assigned'
            } else{
                const user = await User.findOne({_id: project.final_approved_user});
                project.assigned=user?user.first_name:""
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

async function categories(req,res,next){

    try{
        const result = await Category.find({});
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
     catch(err){
        next({statusCode: 400, error: err.message});
        return
    }
}



async function details(req,res,next){
    const data=req.body
    try {

        let project = await Project.findOne({_id: data.project_id,created_by: data.user._id});
        const category=await Category.findOne({_id: project.category })
        const sub_category=await Category.findOne({_id: project.sub_category })
  
        project = project.toObject();
        project.category_name=category.title
        project.sub_category_name=sub_category.title


        if(project==null){
            throw {message: "not found"}
        }
        return res.send({
            data: project,
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
    const accepted_inputs=helper.accepted_inputs(["title","description","budget","street_name","unit","city","state","zipcode","max_radius","is_shareable","is_immediate","location","latlong","category","sub_category"],data)

    try {
        let project = await Project.findOne({_id: data.project_id});
        project = project.toObject();
        let newimages=[];
        if(project.images && project.images.length==0){
            project.images=[];
        }

        if(data['removeimages'] && data['removeimages'].length!=0){
            data['removeimages'].map(function(img,index){
                console.log("delete")
                let deleteindex=project.images.indexOf(img.trim());
                console.log(deleteindex)
                if(deleteindex > -1){
                    console.log("deleted")
                    
                    project.images.splice(deleteindex, 1)
                }
            })
        }
        if(data['newimages'] && data['newimages'].length!=0){
            newimages=data['newimages'].map(function(img,index){
                return fileupload(img,"project-")
            })
           
        }
         accepted_inputs.images=project.images.concat(newimages)
         accepted_inputs.updated_at=Date()

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

async function remove(req,res,next){
    const data= req.body;
    try {
        const result = await Project.findOneAndUpdate({_id: data.project_id}, {deleted: true, deleted_by: data.user._id});
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

async function add(req,res,next){
    const data= req.body;

    data.latlong={lat: data.lat, long: data.long}
    const accepted_inputs=helper.accepted_inputs(["title","description","budget","street_name","unit","city","state","zipcode","max_radius","is_shareable","is_immediate","location","latlong","category","sub_category"],data)
    
    accepted_inputs.created_by= data.user._id
   
    try {
        
        if(data['images'].length!=0){
            accepted_inputs.images=data['images'].map(function(img,index){
                return fileupload(img,"project-")
            })
        }

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
module.exports={index,details,add,update,remove,categories}
