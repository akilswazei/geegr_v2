const {send_message} = require("./../../../helper/helper");
const Proposal = require("./../../../models/Proposal_model");
const Project = require("./../../../models/Project_model");
const Service = require("./../../../models/Service_model");
const User = require("./../../../models/User_model");
const Dispute = require("./../../../models/Dispute_model");
const Transaction = require("./../../../models/Transaction_model");
const ProposalRequest = require("./../../../models/ProposalRequest_model");
const Chat=require("./../../../models/Chat_model");
async function index(req,res,next){
    let data=req.body;

    try{
        return res.send({
            data: {

                active_projects: 32,
                completed_project: 12,
                geegr_credit: 100,
                customer_reviews: 100
                
            },
            status: true,
            error:{}
        });
    }
    catch (err) {
        next({statusCode: 400, error: err.message});
        return
    }
}
async function transaction(req,res,next){

    const data=req.body
    try {
        const result= await Transaction.find({})
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


module.exports={index,transaction}
