const Project = require("./../../models/Project_model");

const is_valid = async function (req){
	
	console.log(req);
	const user=await get_current_user(req);
	console.log(user._id);
	const data = req.body;
	const project=await Project.findOne({_id: data.project_id,'created_by' :user._id })

	console.log(project.toObject())
	 return false;


	if(project){
		return true
	} else{
		return false
	}
}

async function get_current_user(req){
	
	try{
		const allheaders=req.headers;
		let returnJson = { success: false };
	    const data= req.body;
	    const decoded = await jwt.verify(allheaders['token'],'shhhhh');    
		return decoded	 		
	} catch(err){
		return false
	}

}

module.exports={is_valid}