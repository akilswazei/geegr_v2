const express = require("express")
const jwt=require('jsonwebtoken')
const service = require('./../controllers/vendor/Service');
const Chat = require('./../controllers/vendor/Chat');
const proposal = require('./../controllers/vendor/Proposal');
const project = require('./../controllers/front/Project');
const Home = require('./../controllers/front/Home');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const Profile = require('./../controllers/vendor/Profile');
const dashboard = require("./../controllers/vendor/Dashboard")

vendor_router = express.Router()


vendor_router.use('/',async function (req, res, next) {
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

vendor_router.post('/dashboard', dashboard.index);
vendor_router.post('/transaction', dashboard.transaction);
vendor_router.post('/profile', Profile.index);
vendor_router.post('/profile/update', Profile.update);

vendor_router.post('/profile/address/add', Profile.add_address);
vendor_router.post('/profile/address/update', Profile.update_address);
vendor_router.post('/profile/address/delete', Profile.delete_address);
vendor_router.post('/profile/address', Profile.address_index);
vendor_router.post('/profile/address/detail', Profile.address_detail);

vendor_router.post('/profile/settings', Profile.settings);
vendor_router.post('/profile/settings/update', Profile.update_settings);



vendor_router.post('/services', service.index);
vendor_router.post('/service/detail', service.detail);
vendor_router.post('/service/add', service.add);
vendor_router.post('/service/update', service.update);
vendor_router.post('/service/delete', service.remove);

vendor_router.post('/Chat/send_files', Chat.send_files);
vendor_router.post('/Chat/send_message', Chat.message);
vendor_router.post('/Chat/messagelist', Chat.messagelist);

vendor_router.post('/proposals', proposal.index);

vendor_router.post('/proposal/add', proposal.add);
//vendor_router.post('/proposal/update', proposal.update);
vendor_router.post('/proposal/add_review', proposal.add_review);
vendor_router.post('/proposal/add_new_line_items', proposal.add_new_line_items);
vendor_router.post('/proposal/change_line_item_status', proposal.change_line_item_status);
vendor_router.post('/proposal/raise_dispute', proposal.raise_dispute);

//vendor_router.get('/service/details', service.details);

// vendor_router.get('/projects', project.index);
// vendor_router.get('/project/details', project.details);

module.exports=vendor_router
