const Project = require("./../../../models/Project_model");
const User = require("./../../../models/User_model");
const Media = require("./../../../models/Media_model");
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

        let project = await Project.findOne({_id: data.project_id,created_by: data.user._id}).populate({
            path: "images",
          }).then(doc =>{
                doc.images?.map((value,key) =>{
                    value.file=process.env.root_url+'/uploads/'+value.file;
                    return value
                })
                return doc;
          });

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
        let requested_images=[];

        if(data.image_ids && data.image_ids!=''){
            requested_images=data.image_ids.split(',');
        }

        //delete old images
        // let current_images = project.images?.map(a => a._id)
        // var intersection = await current_images.filter(function(n) {
        //     console.log(requested_images.indexOf(n),'index')
        //     return requested_images.indexOf(n),'index' == -1;
        // });


        if(req?.files?.images){
            if(Array.isArray(req.files.images)){
                await Promise.all( req.files.images.map(async (value,key)=>{
                    console.log(value,key)
                    req.files.uploadFile=req.files.images[key];
                    requested_images.push((await customupload(req.files)))
                }))
            } else{
                req.files.uploadFile=req.files.images;
                requested_images.push((await customupload(req.files)))
            }

        }

        accepted_inputs.images=requested_images; 
        const result = await Project.findOneAndUpdate({_id: data.project_id}, accepted_inputs,{new: true});

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
let customupload= async function (req) {
  
  console.log(req)

  // When a file has been uploaded
  if (req && Object.keys(req).length !== 0) {
        
    // Uploaded path
    const uploadedFile = req.uploadFile;
  
    // Logging uploading file
    console.log(uploadedFile,'jony');
  
    let now=new Date().toString();
    // Upload path
    const uploadPath = '/home/geegr_v2'
        + "/uploads/" +now+uploadedFile.name;
  
    // To save the file using mv() function
    try{
        await uploadedFile.mv(uploadPath);
        let saveImage = new Media({file: now+uploadedFile.name});
        saveImage.save();
        return saveImage._id
    } catch(e){
        return false
    }


  } else return false
}
async function add(req,res,next){
    const data= req.body;

    data.latlong={lat: data.lat, long: data.long}
    const accepted_inputs=helper.accepted_inputs(["title","description","budget","street_name","unit","city","state","zipcode","max_radius","is_shareable","is_immediate","location","latlong","category","sub_category"],data)
    
    accepted_inputs.created_by= data.user._id
   
    try {

        let letimageresult=[];
            
        if(req?.files?.images){

            if(Array.isArray(req.files.images)){
                await Promise.all( req.files.images.map(async (value,key)=>{
                    console.log(value,key)
                    req.files.uploadFile=req.files.images[key];
                    letimageresult[key]=await customupload(req.files)
                }))
            } else{
                req.files.uploadFile=req.files.images;
                letimageresult[0]=await customupload(req.files)
            }
            console.log(letimageresult,'letimageresult')
           
        }

        accepted_inputs.images=letimageresult;    
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
