const express = require("express")
const service = require('./../controllers/front/Service');
const project = require('./../controllers/front/Project');
const Home = require('./../controllers/front/Home');

front_router = express.Router()


// front_router.use('/',async function (req, res, next) {
// 	try{
// 		if(data=await is_login(req)){
// 			req.body.user=data.user
// 		} 	
// 		next()
		
// 	} catch(err){
// 		next({statusCode: 400, error: err.message});
// 		return
// 	}	
	
// });



async function is_login(req){
	const allheaders=req.headers;
	let returnJson = { success: false };
    const data= req.body;
    const decoded = await jwt.verify(allheaders['token'],'shhhhh');    
	if(decoded && decoded.user.type.includes('customer')!==false){
    	return decoded;	
    }	 	
    return decoded
}


front_router.get('/', Home.index);
front_router.post('/category_search', Home.category_search);

front_router.post('/services', service.index);
front_router.post('/service/details', service.details);

front_router.post('/projects', project.index);
front_router.post('/project/details', project.details);

module.exports=front_router
