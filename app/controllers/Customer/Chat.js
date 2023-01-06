const {send_message} = require("./../../../helper/helper");


async function  message(req,res,next){

  try {
        const data=req.body
        const result=await send_message(data.proposal_id,"message","customer",data.message,{})
        console.log(result)
        
        if(result.status===false) throw(result.message)
 
        return res.send({
            data: result.message,
            status: true,
            error:{}
        }); 
    }
    catch (err) {
        next({statusCode: 400, error: err.message});
        return
    }
}

async function  send_files(req,res,next){

  try {
        const data=req.body
        const result=await send_message(data.proposal_id,"file","customer",data.message,{file: data.file, file_type: data.file_type})
    	console.log(result)
        
        if(result.status===false) throw(result.message)
 
    	return res.send({
            data: result.message,
            status: true,
            error:{}
        }); 
    }
    catch (err) {
        next({statusCode: 400, error: err.message});
        return
    }
}
module.exports={send_files,message}
