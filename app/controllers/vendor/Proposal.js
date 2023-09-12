const {send_message,accepted_inputs} = require("./../../../helper/helper");
const Proposal = require("./../../../models/Proposal_model");
const Dispute = require("./../../../models/Dispute_model");

// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){

    const data=req.body
    try {
        if(!data.limit){
            data.limit=20;
        }
        const result= await Proposal.find({created_by: data.user._id}).populate('project').populate('service').limit(data.limit)
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

async function add(req,res,next){

    const data=req.body
    try {

        let saveData = new Proposal({
          project: data.project_id,
          service: data.service_id,
          budget: data.budget,
          description: data.description,
          created_by: data.user._id,
          line_items: data.line_items,
        });
        let result = await saveData.save();
        
        result=result.toObject();    

        result.line_items=result.line_items.map((value,index)=>{
            
            value.line_item_id=value._id
            return value
        })
                console.log(result.line_items,'lineitemtest')

        await send_message(result._id,"proposal_update","vendor","New proposal",result)
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
          description: data.description,
          line_items: data.line_items
        };

        let  result = await Proposal.findOneAndUpdate({_id: data.proposal_id},saveData,{new: true});  
        result =result.toObject();
        result=accepted_inputs(['description','budget','status','line_items'],result)  
       
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

async function change_line_item_status(req,res,next){
    const data=req.body
    try {
        const result= await proposal.findOne({_id: data.proposal_id}).then(doc =>{
            item = doc.todo.id(data.line_item_id);
            item['status']= data.status
            doc.save();
            return doc;  
        })
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        console.log("I am error");
        console.log(err.message);
        next({statusCode: 400, error: err.message});
        return
    }
}
async function add_new_line_items(req,res,next){



    const data=req.body
    try {
        let saveData={ $push: { line_items: data.line_items } }
        const result= await Proposal.findOneAndUpdate({_id: data.proposal_id},saveData,{new: true}) 
         
        let items_added_count=0-data.line_items.length;
        const new_line_items=result.line_items.slice(items_added_count).map((value,index)=>{
            value=value.toObject();
            value.line_item_id=value._id
            return value
        })
        console.log(new_line_items);

        await send_message(data.proposal_id,"add_line_items","vendor","Add Line Items",{ line_items: new_line_items })

        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
         next({statusCode: 400, error: err.message});
        return
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
async function raise_dispute(req,res,next){
    const allheaders=req.headers;
    let returnJson = { success: false };
    const data= req.body;
    try {
        let saveData = new Dispute({
          proposal_id: data.proposal_id,
          type: data.type,
          description: data.description,
          from: 'vendor',
          created_by: data.user._id
        });
        const result = await saveData.save(); 
        return res.send({
            data: result,
            status: true,
            error:{}
        });   
    }
    catch (err) {
        console.log("I am error");
        console.log(err.message);
        next({statusCode: 400, error: err.message});
        return
    }
}
module.exports={add,add_review,update,add_new_line_items,change_line_item_status,index,raise_dispute}
