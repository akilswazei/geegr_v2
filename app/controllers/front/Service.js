const jwt=require('jsonwebtoken')
const User = require("./../../../models/User_model");
const Service = require("./../../../models/Service_model");
const Proposal = require("./../../../models/Proposal_model");
const Category = require("./../../../models/ServiceCategory_model");
// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){

    let services = await Service.find({});
    services = await Promise.all( services.map(async function(service, index){

        service = service.toObject();
        service.category=await Category.findOne({_id: service.category })
        service.sub_category=await Category.findOne({_id: service.sub_category })
    
        const jobs=await Proposal.find({service_id: service._id, status: "completed"})
        service.jobs=jobs.length
        service.rating = (jobs.reduce((accumulator, object) => {
                  return accumulator + object.review_from_customer.rating;
                }, 0))/jobs.length;
        return service;
    }))

    return res.send({
        data: services,
        status: true,
        error:{}
    });
}
async function details(req,res,next){

    try{
        const data=req.body;
        const query={_id: data.service_id, approval_status: "approved"};
        let result = (await Service.findOne(query)).toObject();
        if(result.created_by){
            result.vendor=await User.findOne({_id: result.created_by})
        }  
        if(result.category){
            result.category=await Category.findOne({_id: result.category})
        }
        if(result._id){                
            result.jobs=await Proposal.find({service_id: result._id, status: "completed"})
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
        }
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
async function makeoffer(req,res,next){
    // const data= req.body;
    // console.log("vendor service");
    // try {
    //     let saveData = new Project();
    //     let saveData = new ();
    //     const result = await saveData.save();    
    //     return res.send({
    //         data: result,
    //         status: true,
    //         error:{}
    //     });
    // }
    // catch (err) {
    //     console.log(err.message);
    //     next(createError.InternalServerError());
    // }
}
module.exports={index,details}
