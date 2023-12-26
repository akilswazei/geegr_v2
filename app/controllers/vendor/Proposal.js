const {send_message,accepted_inputs,update_message} = require("./../../../helper/helper");
const Proposal = require("./../../../models/Proposal_model");
const Dispute = require("./../../../models/Dispute_model");
const {fileupload,customupload}= require("./../../../helper/fileupload");

// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){

    const data=req.body
    try {
        if(!data.limit){
            data.limit=1;
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

        let letimageresult=[];
            
        if(req?.files?.images){

            if(Array.isArray(req.files.images)){
                await Promise.all( req.files.images.map(async (value,key)=>{
                    console.log(value,key)
                    req.files.uploadFile=req.files.images[key];
                    letimageresult[key]=await customupload(req.files)
                }))
            } else{
                req.files.uploadFile=req.files.images;
                letimageresult[0]=await customupload(req.files)
            }
            console.log(letimageresult,'letimageresult')
           
        }
        console.log("************")
        console.log(data.line_items,'lineitems')

        let lineItemsArray;

        if (typeof data.line_items === 'string') {
            // If data.line_items is a string, parse it as JSON
            try {
                lineItemsArray = JSON.parse(data.line_items);
            } catch (error) {
                console.error('Error parsing JSON for line_items:', error);
                // Handle the error as needed, maybe setting lineItemsArray to an empty array
                lineItemsArray = [];
            }
        } else if (Array.isArray(data.line_items)) {
            // If data.line_items is already an array, use it directly
            lineItemsArray = data.line_items;
        } else {
            // Handle other cases if necessary, e.g., setting lineItemsArray to an empty array
            lineItemsArray = [];
        }


        let saveData = new Proposal({
          project: data.project_id,
          service: data.service_id,
          budget: data.budget,
          description: data.description,
          created_by: data.user._id,
          line_items: lineItemsArray,
          images: letimageresult
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

async function pay(req,res,next){
    const data=req.body
    try {

        let  amount = await proposal.findOne({_id: data.proposal_id}).then((doc) =>{
            let amount=0;
            doc.line_items.map((value) =>{
                if(value.status==''){
                    amount+=value.budget
                } 
            })
            amount=amount+0.2*amount;
            return amount

        });
        let tdata;      
        switch(data.reqest_for){
            case 'accept_project':
                tData = new Transaction({
                  type: "project_deposit",
                  description: "Add Amount for proposal",
                  transacton_type:  'credit',
                  ref:  data.proposal_id,
                  transaction_in:  'proposal',
                  user_id: data.user._id,
                  amount: amount
                });
            break;
            case 'add_line_items':
                tData = new Transaction({
                  type: "new_line_item_deposit",
                  description: "Add Amount for new line items",
                  transacton_type:  'credit',
                  transaction_in:  'proposal',
                  ref:  data.proposal_id,
                  user_id: data.user._id,
                  amount: amount
                });
            break;
            default:
            break;
        }
        await tData.save();  

        await stripe.charges.create({
            amount: amount*100, // amount in cents, again
            currency: "usd",
            source: data.payment_method,
            description: "payinguser@example.com",
            customer: "cus_NA3KWTXeJgslum"
        })
       
        return res.send({
            data: data,
            status: true,
            error:{}
        });
     
    } catch (err) {
        console.log(err.message);
         next({statusCode: 400, error: err.message});
    }
}

async function accept_proposal(req,res,next){

    const data=req.body
    try {
        let saveData = {
            status: "approved",
            accepted_at: Date()
        }
        
        const result= await Proposal.findOne({_id: data.proposal_id}).then(doc =>{
           // console.log(doc)
           
            doc.todo=[];
            doc.line_items.map((value,index) =>{
                if(value.status=='approved'){
                    doc.todo.push({
                        title: value.title,
                        description: value.description,
                        budget: value.budget,
                        status:  ""  
                    })
                    
                }
            })

            doc.status="approved";
            doc.save();
            return doc;
        })

        result.is_update=true;
        await update_message(data.proposal_id,{line_items: result.line_items})

        return res.send({
            data: result,
            status: true,
            error:{}
        });

        const service= await Service.findOne({_id: result.service}) 

         console.log(service);
         // emit
        saveData={
            total_paid: result.budget,
            final_approved_price: result.budget,
            final_approved_proposal: data.proposal_id,
            final_approved_service: service._id,
            final_approved_user: service.user_id,
            assigned: true,
            assigned_at: Date()

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
        next({statusCode: 400, error: err.message});
        return
    }

}

module.exports={add,add_review,update,add_new_line_items,change_line_item_status,index,raise_dispute,accept_proposal,pay}
