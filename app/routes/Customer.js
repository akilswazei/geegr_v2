const jwt=require('jsonwebtoken')
const express = require("express")
const Project = require('./../controllers/Customer/Project');
const Proposal = require('./../controllers/Customer/Proposal');
const Profile = require('./../controllers/Customer/Profile');
const Chat = require('./../controllers/Customer/Chat');
const Home = require('./../controllers/front/Home');
const validation = require("./../../helper/validation/validation")
const dashboard = require("./../controllers/Customer/Dashboard");

const Wallet = require("./../controllers/wallet/Wallet");
const Notification = require("./../controllers/notification/Notification");

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


customer_router.post('/dashboard', dashboard.index);
customer_router.post('/transaction', dashboard.transaction);

customer_router.post('/profile', Profile.index);
customer_router.post('/profile/update', Profile.update);
customer_router.post('/profile/changePassword', Profile.changePassword);
customer_router.post('/profile/address/add', Profile.add_address);
customer_router.post('/profile/address/update', Profile.update_address);
customer_router.post('/profile/address/delete', Profile.delete_address);
customer_router.post('/profile/address', Profile.address_index);
customer_router.post('/profile/address/detail', Profile.address_detail);

customer_router.post('/profile/settings', Profile.settings);
customer_router.post('/profile/settings/update', Profile.update_settings);

customer_router.post('/project/add', Project.add);
customer_router.post('/project/categories', Project.categories);
customer_router.post('/project/update', Project.update);
customer_router.post('/projects', Project.index);
customer_router.post('/project/remove', Project.remove);
customer_router.post('/project/details', Project.details);
customer_router.post('/Chat/send_files', Chat.send_files);
customer_router.post('/Chat/send_message', Chat.message);
customer_router.post('/Chat/messagelist', Chat.messagelist);
customer_router.post('/Chat/messagelistbyid', Chat.messagelistbyId);
customer_router.post('/proposal/update-request', Proposal.update_request);
customer_router.post('/proposal/details', Proposal.details);
customer_router.post('/proposal/to-do-line-items', Proposal.to_do_line_items);

customer_router.post('/proposal/release_partial_payment', Proposal.release_partial_payment);

customer_router.post('/proposal/raise_dispute', Proposal.raise_dispute);
customer_router.post('/proposal/request', Proposal.proposal_request);
customer_router.post('/proposal/complete_project', Proposal.complete_project);
customer_router.post('/proposal/accept_proposal', Proposal.accept_proposal);
customer_router.post('/proposal/accept_line_items', Proposal.accept_line_items);
customer_router.post('/proposal/change_line_item_status', Proposal.change_line_item_status);
customer_router.post('/proposal/get_checkout_info', Proposal.get_checkout_info);
customer_router.post('/proposal/pay', Proposal.pay);
customer_router.post('/proposal/create_source', Proposal.create_source);
customer_router.post('/proposal/get_user_profile', Proposal.get_user_profile);
customer_router.post('/proposal', Proposal.index);


customer_router.post('/wallet/balance', Wallet.index);
customer_router.post('/wallet/add', Wallet.add);

customer_router.post('/notification/list', Notification.index);

module.exports=customer_router
