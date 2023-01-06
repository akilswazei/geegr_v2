const Project = require("./../../models/Project_model");

const is_valid = async function (req,next){
	try{
		return req
	} 
	catch(err){
		next({statusCode: 400, error: err.message});
		return
	}	
}


module.exports={is_valid}