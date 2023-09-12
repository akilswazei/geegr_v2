const {send_message} = require("./../../../helper/helper");
const Proposal = require("./../../../models/Proposal_model");
const Project = require("./../../../models/Project_model");
const Service = require("./../../../models/Service_model");
const User = require("./../../../models/User_model");
const Transaction = require("./../../../models/Transaction_model");
const Dispute = require("./../../../models/Dispute_model");
const ProposalRequest = require("./../../../models/ProposalRequest_model");
const Chat=require("./../../../models/Chat_model");

async function messagelist(req,res,next){

    const data=req.body
    try {
        const result= await Proposal.findOne({_id:data.proposal_id,created_by: data.user._id}).populate('project').then(async (doc) =>{
            doc=doc.toObject();
            doc.messagelist=await Chat.find({proposal_id: doc._id }) 
            doc.dispute=(await Dispute.findOne({proposal_id: doc._id }))
            doc.transaction=(await Transaction.find({ref: doc._id,transaction_in:'proposal' }))
            return doc;
        })
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
async function  message(req,res,next){

  try {
        const data=req.body
        const result=await send_message(data.proposal_id,"message","vendor",data.message,{})
        console.log(result)
        
        if(result.status===false) throw(result.message)
 
        return res.send({
            data: result.message,
            status: true,
            error:{}
        }); 
    }
    catch (err) {
        next({statusCode: 400, error: err.message});
        return
    }
}

async function  send_files(req,res,next){

  try {
        const data=req.body
        const result=await send_message(data.proposal_id,"file","customer",data.message,{file: data.file, file_type: data.file_type})
    	console.log(result)
        
        if(result.status===false) throw(result.message)
 
    	return res.send({
            data: result.message,
            status: true,
            error:{}
        }); 
    }
    catch (err) {
        next({statusCode: 400, error: err.message});
        return
    }
}
module.exports={send_files,message,messagelist}
