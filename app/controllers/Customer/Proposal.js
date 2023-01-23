const jwt=require('jsonwebtoken')
const proposal = require("./../../../models/Proposal_model");
const Project = require("./../../../models/Project_model");
const Service = require("./../../../models/Service_model");
const Transaction = require("./../../../models/Transaction_model");
const ProposalRequest = require("./../../../models/ProposalRequest_model");

// const {insert_user} = require("./../../functions/core")



async function index(req,res,next){
    let data=req.body;

    try{
        const proposals = await proposal.find({project: data.project_id});
        const project_details=await Project.findOne({project_id: data.project })

        const props=await Promise.all( proposals.map(async function(propo, index){
            propo.service=await Service.findOne({service_id: propo.service })
            
            return propo;
        })
        )
     
        return res.send({
            data: {project: project_details,proposals: props},
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
        // emit
        // chat start for proposal for vendor
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



async function proposal_request(req,res,next){

    const data=req.body
    try {
        let saveData = new ProposalRequest({
          project: data.project_id,
          service: data.service_id,
          created_by: data.user._id,
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
         next({statusCode: 400, error: err.message});
    }

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
         // emit
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
            final_approved_proposal: data.proposal_id,
            final_approved_service: service._id,
            final_approved_user: service.user_id,
            status: "assigned",

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

        // emit
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

        // emit
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
module.exports={complete_project,index,accept_proposal,release_partial_payment,proposal_request}
