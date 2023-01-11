const jwt=require('jsonwebtoken')
const express = require("express")
const Project = require('./../controllers/Customer/Project');
const Proposal = require('./../controllers/Customer/Proposal');
const Chat = require('./../controllers/Customer/Chat');
const Home = require('./../controllers/front/Home');
const validation = require("./../../helper/validation/validation")

customer_router = express.Router()


customer_router.use('/',async function (req, res, next) {
	try{
		if(data=await is_customer(req)){
			req.body.user=data.user
		} else{
			next({statusCode: 400, error: "user not valid"});
			return
		}
		req=await validation.validate(req,next)
		next()
		
	} catch(err){
		next({statusCode: 400, error: err.message});
		return
	}	
	
});




async function is_customer(req){
	const allheaders=req.headers;
	let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');    
	if(decoded && decoded.user.type.includes('customer')!==false){
    	return decoded;	
    }	 	
    return decoded
}





customer_router.post('/project/add', Project.add);
customer_router.post('/project/update', Project.update);
customer_router.post('/projects', Project.index);
customer_router.post('/project/details', Project.details);
customer_router.post('/Chat/send_files', Chat.send_files);
customer_router.post('/Chat/send_message', Chat.message);

customer_router.post('/proposal/release_partial_payment', Proposal.release_partial_payment);
customer_router.post('/proposal/complete_project', Proposal.complete_project);
customer_router.post('/proposal/accept_proposal', Proposal.accept_proposal);
customer_router.post('/proposal', Proposal.index);
//vendot_router.get('/service/details', service.details);

// vendot_router.get('/projects', project.index);
// vendot_router.get('/project/details', project.details);

module.exports=customer_router
