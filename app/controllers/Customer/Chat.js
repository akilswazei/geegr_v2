const {send_message} = require("./../../../helper/helper");
const Proposal = require("./../../../models/Proposal_model");
const Project = require("./../../../models/Project_model");
const Service = require("./../../../models/Service_model");
const User = require("./../../../models/User_model");
const Dispute = require("./../../../models/Dispute_model");
const Transaction = require("./../../../models/Transaction_model");
const ProposalRequest = require("./../../../models/ProposalRequest_model");
const Chat=require("./../../../models/Chat_model");
const {fileupload,customupload}= require("./../../../helper/fileupload");

async function messagelist(req,res,next){
    let data=req.body;

    try{

        const projects = await Project.find({created_by: data.user._id});

        let projects_ids = projects.map(({ _id }) => _id)
        const proposals = await Proposal.find({project : { $in : projects_ids}});
        const props=await Promise.all( proposals.map(async function(propo, index){
            propo=propo.toObject();
            propo.service=(await Service.findOne({_id: propo.service })).toObject()
            propo.dispute=(await Dispute.findOne({proposal_id: propo._id }))
            propo.transaction=(await Transaction.find({ref: propo._id,transaction_in:'proposal' }))
            propo.service.vendor=await User.findOne({_id: propo.service.created_by })
            
            propo.messagelist=await Chat.find({proposal_id: propo._id })
            return propo
        }))
        console.log(props)
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

async function messagelistbyId(req,res,next){
    let data=req.body;

    try{

        const propo= await Proposal.findOne({_id:data.proposal_id}).then(async (propo) =>{
            console.log(propo)
            propo=propo.toObject();
            propo.service=(await Service.findOne({_id: propo.service })).toObject()
            propo.dispute=(await Dispute.findOne({proposal_id: propo._id }))
            propo.transaction=(await Transaction.find({ref: propo._id,transaction_in:'proposal' }))
            propo.service.vendor=await User.findOne({_id: propo.service.created_by })
            
            propo.messagelist=await Chat.find({proposal_id: propo._id })
            return propo
        })
        return res.send({
            data: propo,
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
        const result=await send_message(data.proposal_id,"message","customer",data.message,{})
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

        let letimageresult=[];
            
        if(req?.files?.file){

            if(Array.isArray(req.files.file)){
                await Promise.all( req.files.file.map(async (value,key)=>{
                    console.log(value,key)
                    req.files.uploadFile=req.files.file[key];
                    letimageresult[key]=await customupload(req.files)
                }))
            } else{
                req.files.uploadFile=req.files.file;
                letimageresult[0]=await customupload(req.files)
            }
            console.log(letimageresult,'letimageresult')
           
        }

        const result=await send_message(data.proposal_id,"file","customer",data.message,{file: letimageresult, file_type: data.file_type})
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
module.exports={send_files,message,messagelist,messagelistbyId}
