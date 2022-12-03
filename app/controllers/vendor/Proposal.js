const jwt=require('jsonwebtoken')
const Proposal = require("./../../../models/Proposal_model");
// const {insert_user} = require("./../../functions/core")


async function add(req,res,next){
    const allheaders=req.headers;
    let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');
    console.log(decoded);

    try {
        let saveData = new Proposal({
          project: data.project_id,
          service: data.service_id,
          budget: data.budget,
          created_by: decoded.user_id,
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
        next(createError.InternalServerError());
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
module.exports={add,add_review}
