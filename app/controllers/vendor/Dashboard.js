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
    let userdata=(await User.findOne({_id: data.user._id})).toObject();
    userdata.mobile_verify=false

    try{
        return res.send({
            data: {
                open_proposals: 100,
                active_projects: 32,
                completed_project: 12,
                total_earning: 100,
                userdata: userdata

                
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

0
module.exports={index,transaction}
