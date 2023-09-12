const Project = require("./../../models/Project_model");

const is_valid = async function (req,next){
	try{
		const data = req.body;
		const project=await Project.findOne({_id: data.project_id,'created_by' :data.user._id })
		console.log(project)
		console.log(data.user._id)
		if(project===null){
			throw {message: "you donot have access for this project"}
		}


		return req

	} 
	catch(err){
		next({statusCode: 400, error: err.message});
		return
	}	
}


module.exports={is_valid}