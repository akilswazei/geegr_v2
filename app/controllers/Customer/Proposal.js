const jwt=require('jsonwebtoken')
const proposal = require("./../../../models/Proposal_model");
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
async function complete_project(req,res,next){
    const allheaders=req.headers;
    let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');
    console.log(decoded);

    try {
        let saveData = {
            status: "completed",
            completed_at: Date(),
            review_from_customer: {      
              recommendation: true,
              on_time: true,
              on_budget: true,
              rating: 4,
              comment: "test"
            }
        }
        const result= await proposal.findOneAndUpdate({_id: data.proposal_id}, saveData)    
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
module.exports={complete_project,index,accept_proposal}
