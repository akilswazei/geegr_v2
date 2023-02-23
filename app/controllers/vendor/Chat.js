const {send_message} = require("./../../../helper/helper");
const Proposal = require("./../../../models/Proposal_model");
const Project = require("./../../../models/Project_model");
const Service = require("./../../../models/Service_model");
const User = require("./../../../models/User_model");
const Transaction = require("./../../../models/Transaction_model");
const ProposalRequest = require("./../../../models/ProposalRequest_model");


async function messagelist(req,res,next){
    let data=req.body;

    try{

        const projects = await Project.find({created_by: data.user._id});

        let projects_ids = projects.map(({ _id }) => _id)
        const proposals = await Proposal.find({project : { $in : projects_ids}});
        const props=await Promise.all( proposals.map(async function(propo, index){
            propo=propo.toObject();
            propo.service=(await Service.findOne({_id: propo.service })).toObject()
            propo.service.vendor=await User.findOne({_id: propo.service.created_by })
            return propo
        }))
        return res.send({
            data: {vendors: props},
            status: true,
            error:{}
        });        
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
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
