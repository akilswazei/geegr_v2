const {send_message} = require("./../../../helper/helper");
const Proposal = require("./../../../models/Proposal_model");
// const {insert_user} = require("./../../functions/core")


async function add(req,res,next){

    const data=req.body
    try {
        let saveData = new Proposal({
          project: data.project_id,
          service: data.service_id,
          budget: data.budget,
          created_by: data.user._id,
        });
        const result = await saveData.save();    
        await send_message(data.proposal_id,"proposal_request","vendor",data.message,result)
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
async function update(req,res,next){

    const data=req.body
    try {
        let saveData =  {
          budget: data.budget,
          description: data.description
        };
        const result = await Proposal.findOneAndUpdate({_id: data.proposal_id},saveData,{new: true});    
        await send_message(data.proposal_id,"proposal_update","vendor","proposal update message",result)
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
async function add_review(req,res,next){
    const allheaders=req.headers;
    let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');
    console.log(decoded);

    try {
        let saveData = {
            review_from_vendor: {      
              recommendation: true,
              on_time: true,
              on_budget: true,
              rating: 5,
              comment: "Awesome"
            }
        }
        const result= await Proposal.findOneAndUpdate({_id: data.proposal_id},saveData)    
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        next(err.message);
        return
    }

}
module.exports={add,add_review,update}
