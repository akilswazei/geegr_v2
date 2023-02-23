const express = require("express")
const jwt=require('jsonwebtoken')
const service = require('./../controllers/vendor/Service');
const proposal = require('./../controllers/vendor/Proposal');
const project = require('./../controllers/front/Project');
const Home = require('./../controllers/front/Home');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

vendot_router = express.Router()


vendot_router.use('/',async function (req, res, next) {
	try{
		if(data=await is_vendor(req)){
			req.body.user=data.user
		} else{
			next({statusCode: 400, error: "user not valid"});
			return
		}
		next()
		
	} catch(err){
		next({statusCode: 400, error: err.message});
		return
	}	
	
});



async function is_vendor(req){
	const allheaders=req.headers;
	let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');    
	 
	if(decoded && decoded.user.type=='user'){
    	return decoded;	
    }	 	
    return decoded
}




vendot_router.post('/service/add', service.add);
vendot_router.post('/service/update', service.update);

vendot_router.post('/Chat/send_files', Chat.send_files);
vendot_router.post('/Chat/send_message', Chat.message);
vendot_router.post('/Chat/messagelist', Chat.messagelist);

vendot_router.post('/proposal/add', proposal.add);
vendot_router.post('/proposal/add_review', proposal.add_review);

//vendot_router.get('/service/details', service.details);

// vendot_router.get('/projects', project.index);
// vendot_router.get('/project/details', project.details);

module.exports=vendot_router
