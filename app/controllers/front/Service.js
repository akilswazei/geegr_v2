const jwt=require('jsonwebtoken')
const User = require("./../../../models/User_model");
const Service = require("./../../../models/Service_model");
const Proposal = require("./../../../models/Proposal_model");
const Project = require("./../../../models/Project_model");
const Category = require("./../../../models/ServiceCategory_model");
// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){

    try{
        let services = await Service.find({approval_status: "approved"});
        services = await Promise.all( services.map(async function(service, index){

            service = service.toObject();

            // work on search and geo location search

            service.display_image=process.env.root_url+"/uploads/"+service.display_image
            service.category=await Category.findOne({_id: service.category })
            service.sub_category=await Category.findOne({_id: service.sub_category })
        
            const jobs=await Proposal.find({service_id: service._id, status: "completed"})
            service.jobs=jobs.length
            service.rating = (jobs.reduce((accumulator, object) => {
                      return accumulator + object.review_from_customer.rating;
                    }, 0))/jobs.length;
            service.job_success=95
            return service;
        }))

        return res.send({
            data: services,
            status: true,
            error:{}
        });
    }
    catch (err) {
        console.log(err.message);
        next({statusCode: 400, error: err.message});
    }

}
async function details(req,res,next){

    try{
        const data=req.body;
        const query={_id: data.service_id, approval_status: "approved"};
        let result = (await Service.findOne(query)).toObject();

        result.display_image=process.env.root_url+"/uploads/"+result.display_image
        if(result.created_by){
            result.vendor=await User.findOne({_id: result.created_by})
        }  
        if(result.category){
            result.category=await Category.findOne({_id: result.category})
        }
        if(result._id){                
            result.jobs=await Proposal.find({service_id: result._id, status: "completed"})

            result.jobs=await Promise.all( result.jobs.map(async function(job, index){
                job=job.toObject();
                job.project=await Project.findOne({_id: job.project})
                job.project.customer=await User.findOne({_id: job.project.created_by})
                return job
            }))
            result.total_job_count=result.jobs.length
            result.recommendation = (result.jobs.filter(obj => {
                return obj.review_from_customer.recommendation
            }).length)*100/result.total_job_count;
            result.on_time = (result.jobs.filter(obj => {
                return obj.review_from_customer.on_time
            }).length)*100/result.total_job_count;
            result.on_budget = (result.jobs.filter(obj => {
                return obj.review_from_customer.on_budget
            }).length)*100/result.total_job_count;

            result.rating = (result.jobs.reduce((accumulator, object) => {
                  return accumulator + object.review_from_customer.rating;
                }, 0))/result.total_job_count;
            result.job_success=95
        }
        return res.send({
            data: result,
            status: true,
            error:{}
        });        
    } 
    catch (err) {
        console.log(err.message);
        next({statusCode: 400, error: err.message});
    }

}

module.exports={index,details}
