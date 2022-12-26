const jwt=require('jsonwebtoken')
const proposal = require("./../../../models/Proposal_model");
const Project = require("./../../../models/Project_model");
const Service = require("./../../../models/Service_model");
const Transaction = require("./../../../models/Transaction_model");
// const {insert_user} = require("./../../functions/core")



async function index(req,res,next){
    let data=req.body;
    const result = await proposal.find({project: data.project_id});
    return res.send({
        data: result,
        status: true,
        error:{}
    });
}
async function accept_proposal(req,res,next){

    const allheaders=req.headers;
    let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');
    console.log(decoded);
    try {
        let saveData = {
            status: "approved",
            accepted_at: Date()
        }
        
        const result= await proposal.findOneAndUpdate({_id: data.proposal_id}, saveData)

        const service= await Service.findOne({_id: result.service}) 

         console.log(service);

        let tData = new Transaction({
          type: "project_payment",
          description: "Paid for project",
          debit:  result.budget,
          ref:  data.proposal_id,
          user_id: decoded.user._id,
          amount: result.budget
        });
        await tData.save();  

        let tData2 = new Transaction({
          type: "project_payment",
          description: "paid for project",
          credit:  result.budget,
          ref:  data.proposal_id,
          amount: result.budget
        });
        await tData2.save();  

        saveData={
            total_paid: result.budget,
            final_approved_price: result.budget,
            status: "assigned"
        }
        const project= await Project.findOneAndUpdate({_id: result.project}, saveData) 


        return res.send({
            data: result,
            status: true,
            error:{}
        });
    } catch (err) {
        console.log("I am error");
        console.log(err.message);
        next(err.message);
        return
    }

}

async function release_partial_payment(req,res,next){

       const allheaders=req.headers;
    let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');
    console.log(decoded);

    try {

        const proposal_result= await proposal.findOne({_id: data.proposal_id}) 

        const service= await Service.findOne({_id: proposal_result.service}) 

        const paid  =  proposal_result.payment_released?proposal_result.payment_released:0
       
        const saveData={
            payment_released: paid+data.amount  
        }
        const new_proposal=await proposal.findOneAndUpdate({_id: data.proposal_id}, saveData) 

        let tData = new Transaction({
          type: "release_payment",
          description: "Paid to vendor",
          debit:  data.amount,
          ref:  data.proposal_id,
        });
        await tData.save();  



        let tData2 = new Transaction({
          type: "release_payment",
          description: "Paid to vendor",
          credit:  data.amount,
          ref:  data.proposal_id,
          user_id: service.created_by
        });
        await tData2.save(); 


        return res.send({
            data: new_proposal,
            status: true,
            error:{}
        }); 
    }
    catch (err) {
        console.log("I am error");
        console.log(err.message);
        next(err.message);
        return
    }

}
async function complete_project(req,res,next){
    const allheaders=req.headers;
    let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');
    console.log(decoded);

    try {

        const proposal_result= await proposal.findOne({_id: data.proposal_id})   
        const project_result= await Project.findOne({_id: proposal_result.project})
        const service_result= await Service.findOne({_id: proposal_result.service})     

        const amount_to_release=project_result.total_paid-proposal_result.payment_released   


        let saveData = {
            status: "completed",
            completed_at: Date(),
            payment_released: project_result.total_paid,
            review_from_customer: {      
              recommendation: true,
              on_time: true,
              on_budget: true,
              rating: 4,
              comment: "test"
            }
        }
        const result= await proposal.findOneAndUpdate({_id: data.proposal_id}, saveData)   

        let tData = new Transaction({
          type: "release_payment",
          description: "Paid to vendor",
          debit:  amount_to_release,
          ref:  data.proposal_id,
        });
        await tData.save();  



        let tData2 = new Transaction({
          type: "release_payment",
          description: "Paid to vendor",
          credit:  amount_to_release,
          ref:  data.proposal_id,
         user_id: service_result.created_by
        });
        await tData2.save();  

        saveData={
            status: "completed"
        }
        const project= await Project.findOneAndUpdate({_id: proposal_result.project}, saveData) 



 
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        console.log("I am error");
        console.log(err.message);
        next(err.message);
        return
    }

}
module.exports={complete_project,index,accept_proposal,release_partial_payment}
