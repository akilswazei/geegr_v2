const jwt=require('jsonwebtoken')
const proposal = require("./../../../models/Proposal_model");
const Project = require("./../../../models/Project_model");
const Service = require("./../../../models/Service_model");
const Dispute = require("./../../../models/Dispute_model");
const Chat=require("./../../../models/Chat_model");

const User = require("./../../../models/User_model");
const Transaction = require("./../../../models/Transaction_model");
const ProposalRequest = require("./../../../models/ProposalRequest_model");
const {update_message,accepted_inputs,update_line_item_message} = require("./../../../helper/helper");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 

// const {insert_user} = require("./../../functions/core")



async function index(req,res,next){
    let data=req.body;

    try{
        const proposals = await proposal.find({project: data.project_id});
        const project_details=await Project.findOne({_id: data.project_id })
        
        const props=await Promise.all( proposals.map(async function(propo, index){
            propo=propo.toObject();
            propo.service=(await Service.findOne({_id: propo.service })).toObject()

            propo.service.display_image=process.env.root_url+"/uploads/"+propo.service.display_image
            
            const jobs=await proposal.find({service_id: propo.service._id, status: "completed"})
            const job_count=jobs.length
            propo.service.rating = (jobs.reduce((accumulator, object) => {
                      return accumulator + object.review_from_customer.rating;
                    }, 0))/job_count;

            console.log(propo.service);
            propo.service.vendor=await User.findOne({_id: propo.service.created_by })
            return propo;
        })
        )
     
        return res.send({
            data: {project: project_details,proposals: props},
            status: true,
            error:{}
        });        
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
    }

}


async function details(req,res,next){
    let data=req.body;
    try{
        // emit
        // chat start for proposal for vendor
        const proposalData = await proposal.findOne({_id: data.proposal_id});
       // proposalData.service=await Service.findOne({service_id: proposalData.service })
       // proposalData.project=await Project.findOne({project_id: proposalData.project })

     
        return res.send({
            data: proposalData,
            status: true,
            error:{}
        });        
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
    }
}


async function to_do_line_items(req,res,next){
    let data=req.body;
    try{
        // emit
        // chat start for proposal for vendor
        let proposalData = await proposal.findOne({_id: data.proposal_id});
        proposalData=accepted_inputs(['_id','todo'],proposalData);
       // proposalData.service=await Service.findOne({service_id: proposalData.service })
       // proposalData.project=await Project.findOne({project_id: proposalData.project })
       
     
        return res.send({
            data: proposalData,
            status: true,
            error:{}
        });        
    } catch(err){
        next({statusCode: 400, error: err.message});
        return
    }
}
async function get_user_profile(req,res,next){
    const data=req.body
    try{
        const result=await User.findOne({_id: data.user._id})
        return res.send({
            data: result,
            status: true,
            error:{}
        });
     
    } catch (err) {
        console.log(err.message);
         next({statusCode: 400, error: err.message});
         return
    }
}

async function create_source(req,res,next){
    const data=req.body
    try {
        let result= await stripe.customers.createSource(
          'cus_NA3KWTXeJgslum',
          {source: data.token}
        );
        let payment_method={
            payment_id:result.id,
            type:result.brand,
            card_last_digits:result.last4 ,
            exp_month: result.exp_month,
            exp_year:result.exp_year
        } 
            console.log(data.user._id)
        result=await User.findOne({_id: data.user._id}).then((doc) =>{
            doc.payment_methods.push(payment_method)
            doc.save();
            return doc;
        })
          return res.send({
                data: result,
                status: true,
                error:{}
            });
     
    } catch (err) {
        console.log(err.message);
         next({statusCode: 400, error: err.message});
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
        // let tdata;      
        // switch(data.reqest_for){
        //     case 'accept_project':
        //         tData = new Transaction({
        //           type: "project_deposit",
        //           description: "Add Amount for proposal",
        //           transacton_type:  'credit',
        //           ref:  data.proposal_id,
        //           transaction_in:  'proposal',
        //           user_id: data.user._id,
        //           amount: amount
        //         });
        //     break;
        //     case 'add_line_items':
        //         tData = new Transaction({
        //           type: "new_line_item_deposit",
        //           description: "Add Amount for new line items",
        //           transacton_type:  'credit',
        //           transaction_in:  'proposal',
        //           ref:  data.proposal_id,
        //           user_id: data.user._id,
        //           amount: amount
        //         });
        //     break;
        //     default:
        //     break;
        // }
        // await tData.save();  

        // await stripe.charges.create({
        //     amount: 2*100, // amount in cents, again
        //     currency: "usd",
        //     source: data.payment_method,
        //     description: "payinguser@example.com",
        //     customer: "cus_NA3KWTXeJgslum"
        // })
       
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
async function get_checkout_info(req,res,next){
    const data=req.body
    try {

        let  user_details = await User.findOne({_id: data.user._id})
        user_details=user_details.toObject();
        let total_price=0;
        let grant_total=0;
        let  line_items = await proposal.findOne({_id: data.proposal_id}).then((doc) =>{
            const items=[];
            doc.line_items.map((value) =>{
                if(value.status==''){
                    items.push(value)
                    total_price=value.budget+total_price
                } 
            })
            grant_total=total_price+.02*total_price;
            return items
        });
        result={
            line_items: line_items,
            methods:user_details.payment_methods,
            charges: "20",
            total_price: total_price,
            grant_total: grant_total
        }
        console.log(data.user);
        return res.send({
            data: result,
            status: true,
            error:{}
        });
     
    } catch (err) {
        console.log(err.message);
         next({statusCode: 400, error: err.message});
    }

}

async function update_request(req,res,next){

    const data=req.body
    try {

        let saveData =  {
          line_items: data.line_items
        };

        let  result = await proposal.findOneAndUpdate({_id: data.proposal_id},saveData,{new: true});  
        result =result.toObject();
        result=accepted_inputs(['description','budget','status','line_items','proposal_id'],result)  
        result.is_update=true;
        await update_message(data.proposal_id,saveData)
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


async function proposal_request(req,res,next){

    const data=req.body
    try {
        let saveData = new ProposalRequest({
          project: data.project_id,
          service: data.service_id,
          created_by: data.user._id,
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
         next({statusCode: 400, error: err.message});
    }

}

async function accept_line_items(req,res,next){

    const data=req.body
    try {
        let saveData = {
            status: "approved",
            accepted_at: Date()
        }
        data.status=data.status == 'approved'?"approved":data.status;
            
        const chatcontent= await Chat.findOne({_id: data.message_id})
        console.log(chatcontent);
        const result= await proposal.findOne({_id: data.proposal_id}).then(doc =>{
           // console.log(doc)
            var total_budget=0;
            chatcontent.data.line_items.map((value,index)=>{
                item = doc.line_items.id(value.line_item_id);
                item['status']= data.status
                item['accepted_at']= Date()
                if(data.status=='approved'){
                    doc.todo.push({
                        title: item.title,
                        description: item.description,
                        budget: item.budget,
                        status:  ""  
                    })
                }
            }) 

            doc.save();
            return doc;  
        })
        await update_line_item_message(data.proposal_id,data.message_id,{})
 

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
async function accept_proposal(req,res,next){

    const data=req.body
    try {
        let saveData = {
            status: "customer_accept",
            accepted_at: Date()
        }
        
        const result= await proposal.findOne({_id: data.proposal_id}).then(doc =>{
           // console.log(doc)
            if(data.line_items){
                var total_budget=0;
                data.line_items.map((value,index)=>{
                    item = doc.line_items.id(value._id);
                    item['status']= value.status
                    item['accepted_at']= Date()
                    if(item['status']=='approved'){
                        total_budget+=value.budget
                    }
                })  
                if(doc.min_budget && total_budget<doc.min_budget){
                    throw new Error("Total budget is less than min budget");
                }             
            } else{
                doc.line_items=doc.line_items.map((value,index)=>{
                    value.status='  ';
                    return value;  
                })
            }
            // doc.todo=[];
            // doc.line_items.map((value,index) =>{
            //     if(value.status=='approved'){
            //         doc.todo.push({
            //             title: value.title,
            //             description: value.description,
            //             budget: value.budget,
            //             status:  ""  
            //         })
                    
            //     }
            // })

            doc.status="customer_accept";
            doc.save();
            return doc;
        })

        //result.is_update=true;
        //await update_message(data.proposal_id,{line_items: result.line_items})

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


async function release_partial_payment(req,res,next){

       const allheaders=req.headers;
    let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');
    console.log(decoded);

    try {

        const proposal_result= await proposal.findOne({_id: data.proposal_id}) 

        const service= await Service.findOne({_id: proposal_result.service}) 

        const paid  =  proposal_result.payment_released?proposal_result.payment_released:0
       
        const saveData={
            payment_released: paid+data.amount  
        }
        const new_proposal=await proposal.findOneAndUpdate({_id: data.proposal_id}, saveData) 

        // emit


        return res.send({
            data: new_proposal,
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
async function complete_project(req,res,next){
    const allheaders=req.headers;
    let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');
    
    try {

        const proposal_result= await proposal.findOne({_id: data.proposal_id})   
        const project_result= await Project.findOne({_id: proposal_result.project})
        //const service_result= await Service.findOne({_id: proposal_result.service})     

        const amount_to_release=project_result.total_paid-proposal_result.payment_released   
        // emit
        let saveData = {
            status: "completed",
            completed_at: Date(),
            review_from_customer: {      
              recommendation: data.recommendation,
              on_time: data.on_time,
              on_budget: true,
              rating: data.rating,
              comment: data.comment
            }
        }
        const result= await proposal.findOneAndUpdate({_id: data.proposal_id}, saveData,{new: true})   

        // let tData = new Transaction({
        //   type: "release_payment",
        //   description: "Paid to vendor",
        //   debit:  amount_to_release,
        //   ref:  data.proposal_id,
          
        // });
        // await tData.save();  



        // let tData2 = new Transaction({
        //   type: "release_payment",
        //   description: "Paid to vendor",
        //   credit:  amount_to_release,
        //   ref:  data.proposal_id,
        //  user_id: service_result.created_by
        // });
        // await tData2.save();  

        saveData={
            status: "completed"
        }
        const project= await Project.findOneAndUpdate({_id: proposal_result.project}, saveData) 



 
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

async function raise_dispute(req,res,next){
    const allheaders=req.headers;
    let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');
    try {
        let saveData = new Dispute({
          proposal_id: data.proposal_id,
          type: data.type,
          description: data.description,
          from: 'customer',
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

module.exports={to_do_line_items,details,complete_project,index,accept_proposal,release_partial_payment,proposal_request,update_request,accept_line_items,change_line_item_status,get_checkout_info,pay,create_source,get_user_profile,raise_dispute  }
